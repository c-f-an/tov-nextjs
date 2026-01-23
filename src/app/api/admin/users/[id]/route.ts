import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, logAdminAction } from "@/lib/auth-admin";
import { MySQLUserRepository } from "@/infrastructure/repositories/MySQLUserRepository";
import { formatDate } from "@/lib/utils/date";

const userRepository = new MySQLUserRepository();

// GET /api/admin/users/[id] - Get single user details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const adminUser = await verifyAdminRequest(request);
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Fetch user details
    const user = await userRepository.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Log admin action
    await logAdminAction(
      adminUser.id,
      "VIEW_USER_DETAIL",
      "users",
      userId,
      { action: "view_user_detail", userId },
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
      request.headers.get("user-agent") || undefined
    );

    // Format user data for response
    const userData = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      phone: user.phone,
      churchName: user.churchName,
      position: user.position,
      denomination: user.denomination,
      status: user.status,
      role: user.role,
      userType: user.userType,
      loginType: user.loginType,
      adminNote: user.adminNote || "",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { error: "Failed to fetch user details" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users/[id] - Update user details
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const adminUser = await verifyAdminRequest(request);
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const body = await request.json();
    const {
      username,
      name,
      email,
      phone,
      churchName,
      position,
      status,
      role,
      userType,
      adminNote,
    } = body;

    // Fetch existing user
    const existingUser = await userRepository.findById(userId);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      username: username || existingUser.username,
      name: name || existingUser.name,
      email: email || existingUser.email,
      phone: phone || existingUser.phone,
      churchName: churchName || existingUser.churchName,
      position: position || existingUser.position,
      status: status || existingUser.status,
      role: role || existingUser.role,
      userType: userType !== undefined ? userType : existingUser.userType,
      adminNote: adminNote !== undefined ? adminNote : existingUser.adminNote,
      updatedAt: new Date(),
    };

    // Update user
    await userRepository.update(userId, updateData);

    // Log admin action with changes
    const changes: any = {};
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== existingUser[key as keyof typeof existingUser]) {
        changes[key] = {
          old: existingUser[key as keyof typeof existingUser],
          new: updateData[key],
        };
      }
    });

    await logAdminAction(
      adminUser.id,
      "UPDATE_USER",
      "users",
      userId,
      { action: "update_user", userId, changes },
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
      request.headers.get("user-agent") || undefined
    );

    // Fetch updated user
    const updatedUser = await userRepository.findById(userId);

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser!.id,
        username: updatedUser!.username,
        name: updatedUser!.name,
        email: updatedUser!.email,
        phone: updatedUser!.phone,
        churchName: updatedUser!.churchName,
        position: updatedUser!.position,
        denomination: updatedUser!.denomination,
        status: updatedUser!.status,
        role: updatedUser!.role,
        userType: updatedUser!.userType,
        loginType: updatedUser!.loginType,
        adminNote: updatedUser!.adminNote,
        createdAt: updatedUser!.createdAt,
        updatedAt: updatedUser!.updatedAt,
        lastLoginAt: updatedUser!.lastLoginAt,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user (soft delete by setting status to 'deleted')
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const adminUser = await verifyAdminRequest(request);
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Check if user exists
    const user = await userRepository.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Soft delete by updating status
    await userRepository.update(userId, {
      status: "deleted",
      updatedAt: new Date(),
    });

    // Log admin action
    await logAdminAction(
      adminUser.id,
      "DELETE_USER",
      "users",
      userId,
      { action: "delete_user", userId, userName: user.name || user.username },
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
      request.headers.get("user-agent") || undefined
    );

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}