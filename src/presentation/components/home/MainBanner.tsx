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
    <section className="relative h-[500px] overflow-hidden">
      {/* Fixed background image */}
      <img
        src="/main-banner-bg/main-banner-bg.webp"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />

      {displayBanners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >

          {/* Two-column content */}
          <div className="relative z-10 h-full flex items-center justify-center px-4">
            <div
              className="mx-auto flex items-center gap-12"
              style={{ width: '100%', maxWidth: '1000px' }}
            >

              {/* Left: Banner Image Poster Card */}
              <div
                className="flex items-center justify-center"
                style={{ width: '400px', height: '320px', flexShrink: 0 }}
              >
                {banner.imagePath ? (
                  <img
                    src={banner.imagePath}
                    alt={banner.title || ""}
                    className="max-w-full max-h-full object-contain rounded-lg border-4 border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                  />
                ) : (
                  <div className="w-full h-full rounded-lg bg-primary/50" />
                )}
              </div>

              {/* Right: Info Panel */}
              <div className="flex-1 flex flex-col text-white">
                <h3 className="text-2xl font-bold leading-snug mb-3">
                  {banner.title}
                </h3>
                {banner.description && (
                  <p className="text-white/70 text-base leading-relaxed mb-8">
                    {banner.description}
                  </p>
                )}
                <div>
                  <Link
                    href={banner.linkUrl}
                    className="inline-block bg-secondary text-white font-bold px-7 py-3 rounded-full text-sm hover:brightness-110 transition-all shadow-lg"
                  >
                    {banner.linkText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {displayBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/30"
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
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all z-30"
      >
        <svg
          className="w-5 h-5"
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
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all z-30"
      >
        <svg
          className="w-5 h-5"
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
