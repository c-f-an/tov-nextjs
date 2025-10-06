import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { getContainer } from '@/infrastructure/config/getContainer';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const jwtSecret = process.env.JWT_ACCESS_SECRET || 'default-access-secret';
    const tokenPayload = verifyAccessToken(accessToken, jwtSecret);

    if (!tokenPayload || tokenPayload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Fetch donations
    const container = getContainer();
    const getDonationsUseCase = container.getGetDonationsUseCase();

    const result = await getDonationsUseCase.execute({
      page: 1,
      limit: 10000, // Get all donations for export
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    });

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Prepare data for Excel
    const data = result.donations.map((donation: any) => ({
      '후원자명': donation.sponsor?.name || donation.sponsorName || '-',
      '전화번호': donation.sponsor?.phone || donation.sponsorPhone || '-',
      '이메일': donation.sponsor?.email || donation.sponsorEmail || '-',
      '후원유형': donation.donationType === 'regular' ? '정기후원' : '일시후원',
      '후원금액': donation.amount,
      '결제방법': getPaymentMethodLabel(donation.paymentMethod),
      '결제일': formatDate(donation.paymentDate),
      '영수증번호': donation.receiptNumber || '-',
      '후원목적': donation.purpose || '-',
      '등록일': formatDate(donation.createdAt)
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Set column widths
    const colWidths = [
      { wch: 15 }, // 후원자명
      { wch: 15 }, // 전화번호
      { wch: 25 }, // 이메일
      { wch: 10 }, // 후원유형
      { wch: 15 }, // 후원금액
      { wch: 10 }, // 결제방법
      { wch: 12 }, // 결제일
      { wch: 15 }, // 영수증번호
      { wch: 20 }, // 후원목적
      { wch: 12 }  // 등록일
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, '후원내역');

    // Create summary sheet
    const summaryData = [
      { '항목': '총 후원금액', '값': `${result.totalAmount.toLocaleString()}원` },
      { '항목': '총 후원건수', '값': `${result.total}건` },
      { '항목': '평균 후원금액', '값': `${Math.floor(result.totalAmount / result.total).toLocaleString()}원` },
      { '항목': '조회기간', '값': `${startDate || '전체'} ~ ${endDate || '전체'}` }
    ];

    const summaryWs = XLSX.utils.json_to_sheet(summaryData);
    summaryWs['!cols'] = [{ wch: 15 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, summaryWs, '요약');

    // Generate Excel buffer
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    // Return Excel file
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="donations_${new Date().toISOString().split('T')[0]}.xlsx"`
      }
    });
  } catch (error) {
    console.error('Error exporting donations:', error);
    return NextResponse.json(
      { error: 'Failed to export donations' },
      { status: 500 }
    );
  }
}

function formatDate(date: string | Date): string {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('ko-KR');
}

function getPaymentMethodLabel(method: string | null): string {
  if (!method) return '-';
  const labels: Record<string, string> = {
    'bank_transfer': '계좌이체',
    'credit_card': '신용카드',
    'cash': '현금'
  };
  return labels[method] || method;
}