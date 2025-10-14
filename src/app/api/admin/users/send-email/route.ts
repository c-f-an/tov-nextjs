import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, logAdminAction } from "@/lib/auth-admin";
// SendGrid 서비스 (유료)
// import { emailService } from "@/lib/email/email-service";
// 무료 이메일 서비스 (Gmail, Naver, Outlook 등)
import { freeEmailService as emailService } from "@/lib/email/free-email-service";
import { MySQLUserRepository } from "@/infrastructure/repositories/MySQLUserRepository";

const userRepository = new MySQLUserRepository();

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const adminUser = await verifyAdminRequest(request);
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      userId,
      userIds, // For bulk email
      template = 'notification',
      subject,
      content,
      title,
    } = body;

    // Validate input
    if (!userId && !userIds) {
      return NextResponse.json(
        { error: "userId or userIds is required" },
        { status: 400 }
      );
    }

    if (!subject) {
      return NextResponse.json(
        { error: "Subject is required" },
        { status: 400 }
      );
    }

    if (!content && template === 'custom') {
      return NextResponse.json(
        { error: "Content is required for custom template" },
        { status: 400 }
      );
    }

    // Handle single or bulk email
    if (userId) {
      // Single email
      const user = await userRepository.findById(userId);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if (!user.email) {
        return NextResponse.json(
          { error: "User has no email address" },
          { status: 400 }
        );
      }

      const success = await emailService.sendEmail({
        to: user.email,
        subject,
        template: template as any,
        templateData: {
          name: user.name || user.username,
          title,
          content,
        },
        html: template === 'custom' ? content : undefined,
      });

      if (success) {
        // Log admin action
        await logAdminAction(
          adminUser.id,
          "SEND_EMAIL",
          "users",
          userId,
          {
            action: "send_email",
            userId,
            recipient: user.email,
            subject,
            template,
          },
          request
        );

        return NextResponse.json({
          success: true,
          message: "Email sent successfully",
        });
      } else {
        return NextResponse.json(
          { error: "Failed to send email" },
          { status: 500 }
        );
      }
    } else {
      // Bulk email
      const users = await Promise.all(
        userIds.map((id: number) => userRepository.findById(id))
      );

      const validUsers = users.filter(user => user && user.email);
      if (validUsers.length === 0) {
        return NextResponse.json(
          { error: "No valid email addresses found" },
          { status: 400 }
        );
      }

      const emails = validUsers.map(user => user!.email!);
      const success = await emailService.sendBulkEmails({
        to: emails,
        subject,
        template: template as any,
        templateData: {
          title,
          content,
        },
        html: template === 'custom' ? content : undefined,
      });

      if (success) {
        // Log admin action
        await logAdminAction(
          adminUser.id,
          "SEND_BULK_EMAIL",
          "users",
          null,
          {
            action: "send_bulk_email",
            userIds,
            recipientCount: emails.length,
            subject,
            template,
          },
          request
        );

        return NextResponse.json({
          success: true,
          message: `Email sent to ${emails.length} recipients`,
        });
      } else {
        return NextResponse.json(
          { error: "Failed to send bulk emails" },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("Error in send-email API:", error);
    return NextResponse.json(
      { error: "Failed to process email request" },
      { status: 500 }
    );
  }
}