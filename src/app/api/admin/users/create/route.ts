import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, logAdminAction } from "@/lib/auth-admin";
import { MySQLUserRepository } from "@/infrastructure/repositories/MySQLUserRepository";
import { User, UserRole, UserStatus, LoginType, UserType } from "@/core/domain/entities/User";
// SendGrid 서비스 (유료)
// import { emailService } from "@/lib/email/email-service";
// 무료 이메일 서비스 (Gmail, Naver, Outlook 등)
import { freeEmailService as emailService } from "@/lib/email/free-email-service";
import bcrypt from "bcryptjs";

const userRepository = MySQLUserRepository.getInstance();

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const adminUser = await verifyAdminRequest(request);
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      username,
      password,
      name,
      email,
      phone,
      role = "USER",
      status = "active",
      sendWelcomeEmail = false,
    } = body;

    // Validate required fields
    if (!password || !name || !email) {
      return NextResponse.json(
        { error: "Password, name, and email are required" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user entity and save
    const userEntity = User.create({
      username: username || null,
      password: hashedPassword,
      name,
      email,
      phone: phone || null,
      loginType: LoginType.email,
      avatarUrl: null,
    });

    const newUser = await userRepository.save(userEntity);

    // Send welcome email if requested
    if (sendWelcomeEmail && email) {
      await emailService.sendEmail({
        to: email,
        subject: "TOV 회원가입을 환영합니다!",
        template: "welcome",
        templateData: {
          name: name,
        },
      });
    }

    // Log admin action
    await logAdminAction(
      adminUser.id,
      "CREATE_USER",
      "users",
      newUser.id,
      {
        action: "create_user",
        newUserId: newUser.id,
        username,
        email,
        role,
        status,
        sendWelcomeEmail,
      },
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
      request.headers.get("user-agent") || undefined
    );

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        churchName: null,
        position: null,
        denomination: null,
        role: newUser.role,
        status: newUser.status,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}