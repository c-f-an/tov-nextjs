"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileText, Calendar, Eye } from "lucide-react";
import Link from "next/link";

export interface Report {
  id: number;
  title: string;
  date: string;
  year: string;
  type: 'business' | 'finance';
  summary: string;
  views: number;
}

interface ReportCardProps {
  report: Report;
}

export default function ReportCard({ report }: ReportCardProps) {
  const href = `/about/business/${report.type}/${report.id}`;
  
  return (
    <Link href={href}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-semibold text-gray-600">
                {report.year}년도
              </span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              report.type === 'business' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {report.type === 'business' ? '사업보고' : '재정보고'}
            </span>
          </div>
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-blue-600">
            {report.title}
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {report.summary}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{report.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{report.views.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}