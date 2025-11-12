import { NextRequest, NextResponse } from 'next/server';
import { ReportRepository } from '@/infrastructure/repositories/ReportRepository';

const reportRepository = new ReportRepository();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid ID format'
        },
        { status: 400 }
      );
    }

    const report = await reportRepository.findById(id);

    if (!report) {
      return NextResponse.json(
        {
          success: false,
          error: 'Report not found'
        },
        { status: 404 }
      );
    }

    // Increment view count
    await reportRepository.incrementViews(id);

    // Convert date to string format if it's a Date object
    if (report.date && typeof report.date !== 'string') {
      const dateObj = new Date(report.date);
      report.date = dateObj.toISOString().split('T')[0];
    }

    return NextResponse.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch report'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body = await request.json();

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid ID format'
        },
        { status: 400 }
      );
    }

    const report = await reportRepository.update(id, body);

    if (!report) {
      return NextResponse.json(
        {
          success: false,
          error: 'Report not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update report'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid ID format'
        },
        { status: 400 }
      );
    }

    const success = await reportRepository.delete(id);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Report not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete report'
      },
      { status: 500 }
    );
  }
}