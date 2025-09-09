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
    // 환경변수 확인
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
    if (!apiKey) {
      console.error("카카오맵 API 키가 설정되지 않았습니다.");
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services`;

    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (!mapContainer.current) return;

        if (address) {
          // 주소로 좌표를 검색합니다
          const geocoder = new window.kakao.maps.services.Geocoder();
          
          geocoder.addressSearch(address, function(result: any, status: any) {
            // 정상적으로 검색이 완료됐으면
            if (status === window.kakao.maps.services.Status.OK) {
              const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
              
              const options = {
                center: coords,
                level: level,
              };

              const map = new window.kakao.maps.Map(mapContainer.current, options);

              // 결과값으로 받은 위치를 마커로 표시합니다
              const marker = new window.kakao.maps.Marker({
                map: map,
                position: coords
              });

              // 인포윈도우로 장소에 대한 설명을 표시합니다
              const iwContent = `<div style="padding:5px;">${markerTitle}</div>`;
              const infowindow = new window.kakao.maps.InfoWindow({
                content: iwContent
              });
              
              window.kakao.maps.event.addListener(marker, "click", function () {
                infowindow.open(map, marker);
              });

              window.kakao.maps.event.addListener(map, "click", function () {
                infowindow.close();
              });
            } else {
              console.error('주소 검색에 실패했습니다.');
              // 주소 검색 실패 시 위경도 사용
              if (latitude && longitude) {
                const options = {
                  center: new window.kakao.maps.LatLng(latitude, longitude),
                  level: level,
                };

                const map = new window.kakao.maps.Map(mapContainer.current, options);

                const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
                const marker = new window.kakao.maps.Marker({
                  position: markerPosition,
                });

                marker.setMap(map);

                const iwContent = `<div style="padding:5px;">${markerTitle}</div>`;
                const infowindow = new window.kakao.maps.InfoWindow({
                  position: markerPosition,
                  content: iwContent,
                });

                window.kakao.maps.event.addListener(marker, "click", function () {
                  infowindow.open(map, marker);
                });

                window.kakao.maps.event.addListener(map, "click", function () {
                  infowindow.close();
                });
              }
            }
          });
        } else if (latitude && longitude) {
          // 위경도가 제공된 경우
          const options = {
            center: new window.kakao.maps.LatLng(latitude, longitude),
            level: level,
          };

          const map = new window.kakao.maps.Map(mapContainer.current, options);

          const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
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
        }
      });
    };

    return () => {
      const scripts = document.head.querySelectorAll(
        'script[src*="dapi.kakao.com/v2/maps/sdk.js"]'
      );
      scripts.forEach((script) => script.remove());
    };
  }, [address, latitude, longitude, markerTitle, level]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
