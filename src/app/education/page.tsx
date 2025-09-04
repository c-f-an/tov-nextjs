'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";

interface Program {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  instructor: string;
  fee: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  category: 'basic' | 'advanced' | 'special';
}

export default function EducationPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const programs: Program[] = [
    {
      id: 1,
      title: '비영리 회계 기초과정',
      description: '비영리단체 회계의 기본 개념과 실무를 학습하는 입문 과정입니다.',
      date: '2024.12.15',
      time: '09:00 - 18:00',
      location: '토브협회 교육장',
      instructor: '김회계 세무사',
      fee: '100,000원',
      status: 'upcoming',
      category: 'basic'
    },
    {
      id: 2,
      title: '종교인 소득세 신고 실무',
      description: '종교인 소득세 신고를 위한 실무 중심의 교육 과정입니다.',
      date: '2024.12.20',
      time: '14:00 - 17:00',
      location: '온라인 (Zoom)',
      instructor: '이세무 세무사',
      fee: '50,000원',
      status: 'upcoming',
      category: 'advanced'
    },
    {
      id: 3,
      title: '비영리법인 결산 실무',
      description: '비영리법인의 결산 절차와 공시 방법을 학습합니다.',
      date: '2025.01.10',
      time: '09:00 - 18:00',
      location: '토브협회 교육장',
      instructor: '박결산 공인회계사',
      fee: '150,000원',
      status: 'upcoming',
      category: 'advanced'
    },
    {
      id: 4,
      title: '기부금 영수증 발급 실무',
      description: '기부금 영수증 발급 절차와 관련 법령을 학습합니다.',
      date: '2025.01.15',
      time: '14:00 - 17:00',
      location: '토브협회 교육장',
      instructor: '최기부 세무사',
      fee: '80,000원',
      status: 'upcoming',
      category: 'special'
    }
  ];

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'basic', label: '기초과정' },
    { value: 'advanced', label: '심화과정' },
    { value: 'special', label: '특별과정' }
  ];

  const filteredPrograms = selectedCategory === 'all' 
    ? programs 
    : programs.filter(program => program.category === selectedCategory);

  const getStatusBadge = (status: Program['status']) => {
    const styles = {
      upcoming: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      upcoming: '모집중',
      ongoing: '진행중',
      completed: '종료'
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb />
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">교육 프로그램</h1>
          <p className="text-gray-600">비영리 회계와 종교인 소득세 관련 전문 교육을 제공합니다.</p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {filteredPrograms.map((program) => (
            <div key={program.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{program.title}</h3>
                {getStatusBadge(program.status)}
              </div>
              
              <p className="text-gray-600 mb-4">{program.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {program.date} ({program.time})
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {program.location}
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  강사: {program.instructor}
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  수강료: {program.fee}
                </div>
              </div>
              
              <div className="mt-6">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  신청하기
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">교육 안내</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">신청 방법</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>원하는 교육 프로그램 선택</li>
                <li>신청하기 버튼 클릭</li>
                <li>신청서 작성 및 제출</li>
                <li>수강료 입금</li>
                <li>신청 완료 확인 메일 수신</li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">유의 사항</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>교육 3일 전까지 취소 가능 (전액 환불)</li>
                <li>교육 당일 취소 시 환불 불가</li>
                <li>최소 인원 미달 시 교육이 취소될 수 있음</li>
                <li>교육 수료증은 80% 이상 출석 시 발급</li>
                <li>온라인 교육은 실시간 참여 필수</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <p className="text-center text-gray-700">
              교육 관련 문의: <strong>02-1234-5678</strong> (평일 09:00 - 18:00) | 
              이메일: <strong>edu@tov.or.kr</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}