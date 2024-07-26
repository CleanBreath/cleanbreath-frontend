'use client';
import React from "react";
import { useState } from "react";
import SideMenu from "@/components/sideMenu";
import { useKakaoLoader } from "react-kakao-maps-sdk";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { AddressData } from "@/components/testData";

export default function Home() {
  const APP_KEY = "6cf24fc76a6d5ae29260b2a99b27b49a";
  const [loading, error] = useKakaoLoader({
    appkey: APP_KEY,
    libraries: ["services", "clusterer", "drawing"],
  }); 
  const [center, setCenter] = useState({
    lat: 37.39432911172592,
    lng: 126.95693953605208,
  }); 

  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);

  const handleListClick = (item: AddressData) => {
    setMarkerPosition({
      lat : item.address_latitude,
      lng : item.address_longitude,
    });

    setCenter({
      lat: item.address_latitude,
      lng: item.address_longitude,
    });
  };

  return (
    <div style={{ display: "flex" }}>
      <SideMenu onListClick={handleListClick} />
      <Map
        center={center}
        isPanto={true}
        style={{ width: "100vw", height: "100vh", zIndex: 0 }}
      >
        {markerPosition && (
          <MapMarker
            position={markerPosition}
          />
        )}
      </Map>
    </div>
  );
}
