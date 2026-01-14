"use client";

import { useEffect, useRef } from "react";

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
  latitude,
  longitude,
  markerTitle = "우리 회사",
  level = 3,
}: KakaoMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
    if (!apiKey) {
      console.error("카카오맵 API 키가 설정되지 않았습니다.");
      return;
    }

    const initMap = () => {
      if (!mapContainer.current) return;

      const createMapWithMarker = (coords: any) => {
        const map = new window.kakao.maps.Map(mapContainer.current, {
          center: coords,
          level: level,
        });

        const marker = new window.kakao.maps.Marker({
          map: map,
          position: coords,
        });

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;">${markerTitle}</div>`,
        });

        const openInfoWindow = () => infowindow.open(map, marker);
        const closeInfoWindow = () => infowindow.close();

        window.kakao.maps.event.addListener(marker, "click", openInfoWindow);
        window.kakao.maps.event.addListener(map, "click", closeInfoWindow);
      };

      window.kakao.maps.load(() => {
        if (address) {
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.addressSearch(address, (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const coords = new window.kakao.maps.LatLng(
                result[0].y,
                result[0].x
              );
              createMapWithMarker(coords);
            } else {
              console.error(
                "주소 검색에 실패했습니다. 위경도 좌표로 대체합니다."
              );
              if (latitude && longitude) {
                const coords = new window.kakao.maps.LatLng(
                  latitude,
                  longitude
                );
                createMapWithMarker(coords);
              }
            }
          });
        } else if (latitude && longitude) {
          const coords = new window.kakao.maps.LatLng(latitude, longitude);
          createMapWithMarker(coords);
        }
      });
    };

    // 스크립트가 이미 로드되었는지 확인하여 중복 로드를 방지합니다.
    if (window.kakao && window.kakao.maps) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    // 1. 프로토콜 명시 및 2. 리퍼러 정책 추가
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services`;
    script.referrerPolicy = "no-referrer-when-downgrade";
    script.onload = initMap;

    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거.
      // 참고: 여러 개의 지도 인스턴스가 페이지에 있을 경우 다른 인스턴스에 영향을 줄 수 있습니다.
      const scripts = document.head.querySelectorAll(
        'script[src*="dapi.kakao.com/v2/maps/sdk.js"]'
      );
      scripts.forEach((script) => script.remove());
    };
  }, [address, latitude, longitude, markerTitle, level]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
