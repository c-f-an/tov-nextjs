import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, logAdminAction } from "@/lib/auth-admin";
import { MySQLUserRepository } from "@/infrastructure/repositories/MySQLUserRepository";
// SendGrid 서비스 (유료)
// import { emailService } from "@/lib/email/email-service";
// 무료 이메일 서비스 (Gmail, Naver, Outlook 등)
import { freeEmailService as emailService } from "@/lib/email/free-email-service";
import bcrypt from "bcrypt";

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
      username,
      password,
      name,
      email,
      phone,
      churchName,
      position,
      denomination,
      role = "USER",
      status = "active",
      sendWelcomeEmail = false,
    } = body;

    // Validate required fields
    if (!username || !password || !name || !email) {
      return NextResponse.json(
        { error: "Username, password, name, and email are required" },
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

    // Check if username already exists
    const existingUser = await userRepository.findByUsername(username);
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
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

    // Create user
    const newUser = await userRepository.create({
      username,
      password: hashedPassword,
      name,
      email,
      phone: phone || null,
      churchName: churchName || null,
      position: position || null,
      denomination: denomination || null,
      role,
      status,
      loginType: "email",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

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
      request
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
        churchName: newUser.churchName,
        position: newUser.position,
        denomination: newUser.denomination,
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