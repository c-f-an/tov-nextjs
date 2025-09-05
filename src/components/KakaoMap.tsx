"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  markerTitle?: string;
  level?: number;
}

export default function KakaoMap({
  latitude,
  longitude,
  markerTitle = "우리 회사",
  level = 3,
}: KakaoMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 환경변수 확인
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
    if (!apiKey) {
      console.error("카카오맵 API 키가 설정되지 않았습니다.");
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;

    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (!mapContainer.current) return;

        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: level,
        };

        const map = new window.kakao.maps.Map(mapContainer.current, options);

        const markerPosition = new window.kakao.maps.LatLng(
          latitude,
          longitude
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });

        marker.setMap(map);

        const iwContent = `<div style="padding:5px;">${markerTitle}</div>`;
        const iwPosition = new window.kakao.maps.LatLng(latitude, longitude);

        const infowindow = new window.kakao.maps.InfoWindow({
          position: iwPosition,
          content: iwContent,
        });

        window.kakao.maps.event.addListener(marker, "click", function () {
          infowindow.open(map, marker);
        });

        window.kakao.maps.event.addListener(map, "click", function () {
          infowindow.close();
        });
      });
    };

    return () => {
      const scripts = document.head.querySelectorAll(
        'script[src*="dapi.kakao.com/v2/maps/sdk.js"]'
      );
      scripts.forEach((script) => script.remove());
    };
  }, [latitude, longitude, markerTitle, level]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
