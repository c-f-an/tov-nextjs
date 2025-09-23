import { NextRequest, NextResponse } from 'next/server';
import { ReportRepository } from '@/infrastructure/repositories/ReportRepository';

const reportRepository = new ReportRepository();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as 'business' | 'finance' | null;
    const year = searchParams.get('year');

    let reports;

    if (year) {
      reports = await reportRepository.findByYear(year, type || undefined);
    } else if (type) {
      reports = await reportRepository.findByType(type);
    } else {
      reports = await reportRepository.findAll();
    }

    return NextResponse.json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch reports'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.year || !body.date || !body.type) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: title, year, date, type'
        },
        { status: 400 }
      );
    }

    const report = await reportRepository.create(body);

    return NextResponse.json({
      success: true,
      data: report
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create report'
      },
      { status: 500 }
    );
  }
}