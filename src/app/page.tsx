"use client";

import SideMenu from "@/components/sideMenu";
import { useState } from "react";
import { useKakaoLoader } from "react-kakao-maps-sdk";
import { Map } from "react-kakao-maps-sdk";

export default function Home() {
  const APP_KEY = "6cf24fc76a6d5ae29260b2a99b27b49a"; // 카카오 지도 API Key
  const [loading, error] = useKakaoLoader({
    appkey: APP_KEY,
    libraries: ["services", "clusterer", "drawing"],
  }); // Kakao Maps API 로드

  const [center, setCenter] = useState({
    lat: 37.39432911172592,
    lng: 126.95693953605208,
  }); // 안양시청 중심 좌표


  return (
    <div style={{ display: "flex" }}>
      <SideMenu />
      <Map
        center={center}
        isPanto={true}
        style={{ width: "1920px", height: "1080px", zIndex: 0 }}
      ></Map>
    </div>
  );
}
