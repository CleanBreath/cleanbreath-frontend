'use client';

import React, { useState, useEffect } from 'react';
import SideMenu from '@/components/sideMenu';
import { CustomOverlayMap, Map, MapMarker, useKakaoLoader, MarkerClusterer } from 'react-kakao-maps-sdk';
import { AddressData } from '../api/types';
import { listData } from '../api/api';
import CurrentLocation from '@/components/currentLocation';
import AreaToggleComponent from '@/components/areaToggleComponent';
import MarkerOverlay from '@/components/markerOverlay';
import Polygon from '@/components/setPolygon';
import ReactGA from 'react-ga4';
import SMOK_ICON from "../../public/smokMarker.png";
import NONSMOK_ICON from "../../public/nonSmokMarker.png"
import SmokModal from '@/components/smokModal';
import Image from "next/image";

const APP_KEY = '6cf24fc76a6d5ae29260b2a99b27b49a';
const TRACKING_ID = "G-YPYE7W46DT";

export default function Home() {
  const [loading, error] = useKakaoLoader({
    appkey: APP_KEY,
    libraries: ['services', 'clusterer', 'drawing'],
  });

  const [center, setCenter] = useState({ lat: 37.394329, lng: 126.956939 });
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [isNonSmoking, setIsNonSmoking] = useState(true);
  const [isSmoking, setIsSmoking] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isData, setData] = useState<AddressData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isOverlayClicked, setIsOverlayClicked] = useState(false);
  const [isMarkerClicked, setIsMarkerClicked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
    ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await listData();
        setData(data);
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (userLocation) {
      setCenter(userLocation);
    }
  }, [userLocation]);


  const handleListClick = (item: AddressData) => {
    setMarkerPosition({
      lat: item.address_latitude,
      lng: item.address_longitude,
    });

    setCenter({
      lat: item.address_latitude,
      lng: item.address_longitude,
    });
  };

  const toggleMenu = (menu : string | null) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  }

  const nonSmokingToggle = () => {
    setIsNonSmoking(!isNonSmoking);
  };

  const smokingToggle = () => {
    setIsSmoking(!isSmoking);
  };

  const handleOverlayClick = () => {
    setIsOverlayClicked(false);
    setIsOverlayClicked(true);
  };

  const handlePolygonClick = (lat: number, lng: number) => {
    setMarkerPosition({ lat, lng });
    setCenter({ lat, lng });
  };

  if (loading) {
    return <div>Loading Kakao Map</div>;
  }

  if (error) {
    return <div>Error loading Kakao Map: {error.message}</div>;
  }

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <SideMenu
        onListClick={handleListClick}
        activeMenu={activeMenu}
        setActiveMenu={toggleMenu}
        isData={isData}
        isLoading={isLoading}
        error={errorMsg}
      />
      <AreaToggleComponent 
        isNonSmoking={isNonSmoking}
        isSmoking={isSmoking}
        nonSmokingToggle={nonSmokingToggle}
        smokingToggle={smokingToggle}
      />
      <Map
        center={center}
        isPanto={true}
        style={{ width: '100%', height: '100%', zIndex: 0 }}
        minLevel={6}
        level={3}
      >
        {isOverlayClicked && markerPosition && (
          <MarkerOverlay
            markerPosition={markerPosition}
            isData={isData}
            handleOverlay={handleOverlayClick} 
          />
        )}

        {userLocation && (
          <MapMarker position={userLocation}>
          </MapMarker>
        )}
        {isSmoking && isData.length > 0 && (
            <MarkerClusterer averageCenter={true} minLevel={3}>
              {isData.flatMap((item) =>
                item.paths
                  .filter(path => path.divisionArea.startsWith('SMOKING_ZONE'))
                  .map((pathIndex) => (
                    <CustomOverlayMap
                      key={`${item.address_idx}-${pathIndex.divisionArea}`}
                      position={{
                        lat: item.address_latitude,
                        lng: item.address_longitude
                      }}
                      yAnchor={1}
                    >
                      <Image src={SMOK_ICON} alt={"Smok"} width={40} height={60} onClick={() => {
                        setIsOverlayClicked(true);
                        handlePolygonClick(item.address_latitude, item.address_longitude);
                      }}/>
                    </CustomOverlayMap>
                  ))
              )}
            </MarkerClusterer>
        )}

        {isData.length > 0 && (
          <Polygon 
            isData={isData}
            isNonSmoking={isNonSmoking}
            isSmoking={isSmoking}
            handlePolygonClick={handlePolygonClick}
            handleOverlayClick={handleOverlayClick}
            isOverlayClicked={isOverlayClicked}
          />
        )}
      </Map>
      {/*<CurrentLocation setUserLocation={setUserLocation} />*/}
    </div>
  );
}
