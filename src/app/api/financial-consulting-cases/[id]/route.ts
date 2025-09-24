import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/infrastructure/database/mysql";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await pool.getConnection();

    // 조회수 증가
    await connection.execute(
      "UPDATE financial_consulting_cases SET view_count = view_count + 1 WHERE id = ?",
      [params.id]
    );

    // 데이터 조회
    const [rows] = await connection.execute(
      `
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
        created_at,
        updated_at
      FROM financial_consulting_cases
      WHERE id = ? AND is_active = 1
      `,
      [params.id]
    );

    connection.release();

    const cases = rows as any[];
    if (cases.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Case not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: cases[0],
    });
  } catch (error) {
    console.error("Failed to fetch financial consulting case:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch case",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      isActive,
      consultingDate,
    } = body;

    const connection = await pool.getConnection();

    const query = `
      UPDATE financial_consulting_cases
      SET
        title = ?,
        organization_name = ?,
        organization_type = ?,
        consulting_type = ?,
        consulting_period = ?,
        thumbnail_image = ?,
        challenge = ?,
        solution = ?,
        result = ?,
        client_feedback = ?,
        tags = ?,
        is_featured = ?,
        is_active = ?,
        consulting_date = ?,
        updated_at = NOW()
      WHERE id = ?
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
      isActive !== undefined ? isActive : true,
      consultingDate || null,
      params.id,
    ];

    const [result] = await connection.execute(query, params);

    connection.release();

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Failed to update financial consulting case:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update case",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await pool.getConnection();

    // Soft delete
    const [result] = await connection.execute(
      "UPDATE financial_consulting_cases SET is_active = 0 WHERE id = ?",
      [params.id]
    );

    connection.release();

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Failed to delete financial consulting case:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete case",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}