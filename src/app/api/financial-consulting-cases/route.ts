import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/infrastructure/database/mysql";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const organizationType = searchParams.get("organizationType");
  const consultingType = searchParams.get("consultingType");
  const featured = searchParams.get("featured");

  try {
    const connection = await pool.getConnection();

    let query = `
      SELECT
        id,
        title,
        organization_name,
        organization_type,
        consulting_type,
        consulting_period,
        thumbnail_image,
        challenge,
        solution,
        result,
        client_feedback,
        tags,
        is_featured,
        view_count,
        consulting_date,
        created_at
      FROM financial_consulting_cases
      WHERE is_active = 1
    `;

    const params: any[] = [];

    if (organizationType) {
      query += " AND organization_type = ?";
      params.push(organizationType);
    }

    if (consultingType) {
      query += " AND consulting_type = ?";
      params.push(consultingType);
    }

    if (featured === "true") {
      query += " AND is_featured = 1";
    }

    query += " ORDER BY is_featured DESC, display_order ASC, created_at DESC";

    const [rows] = await connection.execute(query, params);

    connection.release();

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Failed to fetch financial consulting cases:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch cases",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      organizationName,
      organizationType,
      consultingType,
      consultingPeriod,
      thumbnailImage,
      challenge,
      solution,
      result,
      clientFeedback,
      tags,
      isFeatured,
      consultingDate,
    } = body;

    const connection = await pool.getConnection();

    const query = `
      INSERT INTO financial_consulting_cases (
        title,
        organization_name,
        organization_type,
        consulting_type,
        consulting_period,
        thumbnail_image,
        challenge,
        solution,
        result,
        client_feedback,
        tags,
        is_featured,
        consulting_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      title,
      organizationName,
      organizationType,
      consultingType,
      consultingPeriod || null,
      thumbnailImage || null,
      challenge || null,
      solution || null,
      result || null,
      clientFeedback || null,
      tags || null,
      isFeatured || false,
      consultingDate || null,
    ];

    const [insertResult] = await connection.execute(query, params);

    connection.release();

    return NextResponse.json({
      success: true,
      data: insertResult,
    });
  } catch (error) {
    console.error("Failed to create financial consulting case:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create case",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}