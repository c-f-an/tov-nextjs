"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MainBanner as MainBannerEntity } from "@/core/domain/entities/MainBanner";

interface MainBannerProps {
  banners: MainBannerEntity[];
}

const defaultBanners = [
  {
    id: 1,
    title: "비영리 재정 투명성의 시작",
    subtitle: "토브협회가 함께합니다",
    description: "종교인 소득세, 비영리 회계 전문 상담",
    imagePath: "/images/banner1.jpg",
    imageOption: "",
    linkUrl: "/about",
    linkText: "협회 소개",
  },
  {
    id: 2,
    title: "전문가와 함께하는 재정 상담",
    subtitle: "맞춤형 솔루션 제공",
    description: "회계, 세무, 법률 전문가의 통합 상담",
    imagePath: "/images/banner2.jpg",
    imageOption: "",
    linkUrl: "/consultation/apply",
    linkText: "상담 신청",
  },
  {
    id: 3,
    title: "투명한 재정 운영 교육",
    subtitle: "실무자를 위한 전문 교육",
    description: "비영리 회계 실무 교육 프로그램",
    imagePath: "/images/banner3.jpg",
    imageOption: "",
    linkUrl: "/resources",
    linkText: "자료실 바로가기",
  },
];

// Helper function to generate link text from URL
function getLinkText(linkUrl?: string | null): string {
  if (!linkUrl) return "자세히 보기";

  const linkTextMap: Record<string, string> = {
    "/about": "협회 소개",
    "/consultation/apply": "상담 신청",
    "/resources": "자료실 바로가기",
    "/donation/apply": "후원하기",
    "/education": "교육 신청",
  };

  return linkTextMap[linkUrl] || "자세히 보기";
}

// Helper function to parse imageOption string to inline styles
function parseImageOption(imageOption?: string): React.CSSProperties {
  if (!imageOption) return {};

  const styles: React.CSSProperties = {};

  // Parse opacity
  const opacityMatch = imageOption.match(/opacity-(\d+)/);
  if (opacityMatch) {
    styles.opacity = parseInt(opacityMatch[1]) / 100;
  }

  // Parse gradient
  if (imageOption.includes("bg-gradient-to-b")) {
    const fromMatch = imageOption.match(/from-\[([^\]]+)\]/);
    const toMatch = imageOption.match(/to-\[([^\]]+)\]/);
    if (fromMatch && toMatch) {
      styles.background = `linear-gradient(to bottom, ${fromMatch[1]}, ${toMatch[1]})`;
    }
  }

  // Parse background color (fallback)
  const bgMatch = imageOption.match(/bg-\[([^\]]+)\]/);
  if (bgMatch && !styles.background) {
    styles.backgroundColor = bgMatch[1];
  }

  return styles;
}

export function MainBanner({ banners }: MainBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Use DB banners if available, otherwise use default banners
  const displayBanners =
    banners.length > 0
      ? banners.map((banner) => ({
          id: banner.id!,
          title: banner.title,
          subtitle: banner.subtitle || "",
          description: banner.description || "",
          imagePath: banner.imagePath,
          imageOption: banner.imageOption || "",
          linkUrl: banner.linkUrl || "#",
          linkText: getLinkText(banner.linkUrl),
        }))
      : defaultBanners;

  useEffect(() => {
    if (displayBanners.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % displayBanners.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [displayBanners.length]);

  return (
    <section className="relative h-[500px] bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {displayBanners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image */}
          {banner.imagePath && (
            <img
              src={banner.imagePath}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-contain"
              style={parseImageOption(banner.imageOption)}
            />
          )}

          {/* Overlay gradients - only show if no custom imageOption */}
          {!banner.imageOption && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/40 z-10" />
              <div className="absolute inset-0 bg-black-100/30 z-10" />
            </>
          )}

          {/* Banner Content */}
          <div className="relative z-20 h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl text-gray-800">
                <h2 className="text-5xl font-bold mb-4 animate-fadeInUp">
                  {banner.title}
                </h2>
                <h3 className="text-2xl mb-4 animate-fadeInUp animation-delay-200">
                  {banner.subtitle}
                </h3>
                <p className="text-lg mb-8 animate-fadeInUp animation-delay-400">
                  {banner.description}
                </p>
                <Link
                  href={banner.linkUrl}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md shadow-lg transition-all hover:shadow-xl animate-fadeInUp animation-delay-600"
                >
                  {banner.linkText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {displayBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-blue-600" : "bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() =>
          setCurrentSlide(
            (prev) => (prev - 1 + displayBanners.length) % displayBanners.length
          )
        }
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 text-gray-800 p-3 rounded-full shadow-lg transition-all hover:shadow-xl z-30"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev + 1) % displayBanners.length)
        }
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 text-gray-800 p-3 rounded-full shadow-lg transition-all hover:shadow-xl z-30"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </section>
  );
}
