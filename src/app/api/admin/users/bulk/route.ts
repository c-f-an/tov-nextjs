import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, logAdminAction } from "@/lib/auth-admin";
import { MySQLUserRepository } from "@/infrastructure/repositories/MySQLUserRepository";
import { User } from "@/core/domain/entities/User";

const userRepository = MySQLUserRepository.getInstance();

export async function PATCH(request: NextRequest) {
  try {
    // Verify admin authentication
    const adminUser = await verifyAdminRequest(request);
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      userIds,
      action,
      status,
      role,
    } = body;

    // Validate input
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "userIds is required and must be a non-empty array" },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Process each user
    for (const userId of userIds) {
      try {
        const user = await userRepository.findById(userId);
        if (!user) {
          results.failed++;
          results.errors.push(`User ${userId} not found`);
          continue;
        }

        let updatedUser: User | null = null;

        switch (action) {
          case "UPDATE_STATUS":
            if (!status) {
              results.failed++;
              results.errors.push(`Status is required for user ${userId}`);
              continue;
            }
            updatedUser = new User(
              user.id, user.email, user.name, user.role, status,
              user.loginType, user.userType, user.username, user.password,
              user.phone, user.emailVerifiedAt, user.rememberToken,
              user.avatarUrl, user.lastLoginAt, user.lastLoginIp,
              user.createdAt, new Date()
            );
            break;

          case "UPDATE_ROLE":
            if (!role) {
              results.failed++;
              results.errors.push(`Role is required for user ${userId}`);
              continue;
            }
            updatedUser = new User(
              user.id, user.email, user.name, role, user.status,
              user.loginType, user.userType, user.username, user.password,
              user.phone, user.emailVerifiedAt, user.rememberToken,
              user.avatarUrl, user.lastLoginAt, user.lastLoginIp,
              user.createdAt, new Date()
            );
            break;

          case "DELETE":
            updatedUser = new User(
              user.id, user.email, user.name, user.role, "deleted" as any,
              user.loginType, user.userType, user.username, user.password,
              user.phone, user.emailVerifiedAt, user.rememberToken,
              user.avatarUrl, user.lastLoginAt, user.lastLoginIp,
              user.createdAt, new Date()
            );
            break;

          default:
            results.failed++;
            results.errors.push(`Unknown action for user ${userId}`);
            continue;
        }

        if (updatedUser) {
          await userRepository.update(updatedUser);
          results.success++;
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to update user ${userId}`);
        console.error(`Error updating user ${userId}:`, error);
      }
    }

    // Log admin action
    await logAdminAction(
      adminUser.id,
      `BULK_${action}`,
      "users",
      null,
      {
        action: `bulk_${action.toLowerCase()}`,
        userIds,
        successCount: results.success,
        failedCount: results.failed,
        status,
        role,
      },
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
      request.headers.get("user-agent") || undefined
    );

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${results.success} users`,
      results,
    });
  } catch (error) {
    console.error("Error in bulk update:", error);
    return NextResponse.json(
      { error: "Failed to perform bulk update" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const adminUser = await verifyAdminRequest(request);
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userIds } = body;

    // Validate input
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "userIds is required and must be a non-empty array" },
        { status: 400 }
      );
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Process each user
    for (const userId of userIds) {
      try {
        const user = await userRepository.findById(userId);
        if (!user) {
          results.failed++;
          results.errors.push(`User ${userId} not found`);
          continue;
        }

        // Soft delete by updating status
        const deletedUser = new User(
          user.id, user.email, user.name, user.role, "deleted" as any,
          user.loginType, user.userType, user.username, user.password,
          user.phone, user.emailVerifiedAt, user.rememberToken,
          user.avatarUrl, user.lastLoginAt, user.lastLoginIp,
          user.createdAt, new Date()
        );
        await userRepository.update(deletedUser);

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to delete user ${userId}`);
        console.error(`Error deleting user ${userId}:`, error);
      }
    }

    // Log admin action
    await logAdminAction(
      adminUser.id,
      "BULK_DELETE",
      "users",
      null,
      {
        action: "bulk_delete",
        userIds,
        successCount: results.success,
        failedCount: results.failed,
      },
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
      request.headers.get("user-agent") || undefined
    );

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${results.success} users`,
      results,
    });
  } catch (error) {
    console.error("Error in bulk delete:", error);
    return NextResponse.json(
      { error: "Failed to perform bulk delete" },
      { status: 500 }
    );
  }
}
