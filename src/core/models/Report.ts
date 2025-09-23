export interface Report {
  id: number;
  title: string;
  year: string;
  date: Date | string;
  type: 'business' | 'finance';
  summary?: string | null;
  content?: string | null;
  file_url?: string | null;
  views: number;
  is_active?: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface CreateReportDto {
  title: string;
  year: string;
  date: Date | string;
  type: 'business' | 'finance';
  summary?: string;
  content?: string;
  file_url?: string;
  is_active?: boolean;
}

export interface UpdateReportDto {
  title?: string;
  year?: string;
  date?: Date | string;
  type?: 'business' | 'finance';
  summary?: string;
  content?: string;
  file_url?: string;
  is_active?: boolean;
}