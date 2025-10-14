import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, logAdminAction } from "@/lib/auth-admin";
import { MySQLUserRepository } from "@/infrastructure/repositories/MySQLUserRepository";

const userRepository = new MySQLUserRepository();

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
      adminNote,
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

        let updateData: any = {};
        let actionType = "";

        switch (action) {
          case "UPDATE_STATUS":
            if (!status) {
              results.failed++;
              results.errors.push(`Status is required for user ${userId}`);
              continue;
            }
            updateData.status = status;
            actionType = "BULK_UPDATE_STATUS";
            break;

          case "UPDATE_ROLE":
            if (!role) {
              results.failed++;
              results.errors.push(`Role is required for user ${userId}`);
              continue;
            }
            updateData.role = role;
            actionType = "BULK_UPDATE_ROLE";
            break;

          case "UPDATE_ADMIN_NOTE":
            updateData.adminNote = adminNote || "";
            actionType = "BULK_UPDATE_ADMIN_NOTE";
            break;

          case "DELETE":
            updateData.status = "deleted";
            actionType = "BULK_DELETE";
            break;

          default:
            results.failed++;
            results.errors.push(`Unknown action for user ${userId}`);
            continue;
        }

        updateData.updatedAt = new Date();
        await userRepository.update(userId, updateData);
        results.success++;
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
      request
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
        await userRepository.update(userId, {
          status: "deleted",
          updatedAt: new Date(),
        });

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
      request
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