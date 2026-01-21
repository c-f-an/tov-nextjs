"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  address?: string;
  latitude?: number;
  longitude?: number;
  markerTitle?: string;
  level?: number;
}

export default function KakaoMap({
  address,
  latitude = 37.5665, // 기본값: 서울 시청
  longitude = 126.978,
  markerTitle = "위치",
  level = 3,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 지도 초기화 함수
  const initMap = () => {
    if (!mapRef.current || !window.kakao) return;

    window.kakao.maps.load(() => {
      const container = mapRef.current;

      // 1. 중심 좌표 설정 (주소 우선, 없으면 위경도)
      const displayMap = (coords: any) => {
        const options = {
          center: coords,
          level: level,
        };
        const map = new window.kakao.maps.Map(container, options);

        const marker = new window.kakao.maps.Marker({
          position: coords,
          map: map,
        });

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;font-size:12px;">${markerTitle}</div>`,
        });

        window.kakao.maps.event.addListener(marker, "click", () => {
          infowindow.open(map, marker);
        });
      };

      // 2. 주소 검색 혹은 좌표 설정 로직
      if (address) {
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
            displayMap(coords);
          }
        });
      } else {
        const coords = new window.kakao.maps.LatLng(latitude, longitude);
        displayMap(coords);
      }
    });
  };

  useEffect(() => {
    if (isLoaded) {
      initMap();
    }
  }, [isLoaded, address, latitude, longitude]);

  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`}
        strategy="beforeInteractive"
      />
      <div
        ref={mapRef}
        style={{ width: "100%", height: "100%", minHeight: "400px" }}
      />
    </>
  );
}