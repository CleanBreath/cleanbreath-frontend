'use client';

import React, { useState, useEffect } from 'react';
import SideMenu from '@/components/sideMenu';
import { CustomOverlayMap, Map, MapMarker, Polygon, useKakaoLoader } from 'react-kakao-maps-sdk';
import { AddressData, listData } from '@/components/listData';
import CurrentLocation from '@/components/currentLocation';
import AreaToggleComponent from '@/components/areaToggleComponent';
import ReactGA from 'react-ga4';

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
  const [isOpen, setIsOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isData, setData] = useState<AddressData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isMarkerClicked, setIsMarkerClicked] = useState(false);

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

  const listToggle = () => {
    setIsListOpen(!isListOpen);
    setIsOpen(!isOpen);
    setIsAddOpen(false);
    setIsSettingOpen(false);
  };

  const addToggle = () => {
    setIsListOpen(false);
    setIsOpen(!isOpen);
    setIsAddOpen(!isAddOpen);
    setIsSettingOpen(false);
  };

  const settingToggle = () => {
    setIsListOpen(false);
    setIsOpen(!isOpen);
    setIsAddOpen(false);
    setIsSettingOpen(!isSettingOpen);
  };

  const nonSmokingToggle = () => {
    setIsNonSmoking(!isNonSmoking);
  };

  const smokingToggle = () => {
    setIsSmoking(!isSmoking);
  };

  const parsePathCoordinates = (path: { pathsLatitude: string[], pathsLongitude: string[] }) => {
    const latitudes = path.pathsLatitude.map(lat => parseFloat(lat.trim()));
    const longitudes = path.pathsLongitude.map(lng => parseFloat(lng.trim()));

    return latitudes.map((lat, i) => ({
      lat,
      lng: longitudes[i]
    }));
  };

  const setSpecialCategoryColor = (addressDivision: string) => {
    const specialCategories = [
      '유치원', '초등학교', '중학교', '고등학교'
    ];
    
    if (specialCategories.some(cat => addressDivision.includes(cat))) {
      return '#FFD700';
    }
    
    return null;
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
        isOpen={isOpen}
        isListOpen={isListOpen}
        isAddOpen={isAddOpen}
        isSettingOpen={isSettingOpen}
        isData={isData}
        isLoading={isLoading}
        error={errorMsg}
        listToggle={listToggle}
        addToggle={addToggle}
        settingToggle={settingToggle}
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
        level={3}
      >
        {markerPosition &&
          <MapMarker
            position={markerPosition} 
            /*onClick={() => { setIsMarkerClicked(!isMarkerClicked) }}*/
          >
            {isMarkerClicked && (
              <CustomOverlayMap position={markerPosition} clickable={true}>
              </CustomOverlayMap>
            )}  
          </MapMarker>
        }
        {userLocation && (
          <MapMarker position={userLocation}>
          </MapMarker>
        )}
        {isNonSmoking && isData.length > 0 && (
          <>
            {isData
              .filter(item => item.paths.some(path => path.divisionArea === 'NON_SMOKING_ZONE'))
              .map((item, index) => (
                item.paths
                  .filter(path => path.divisionArea === 'NON_SMOKING_ZONE')
                  .map((path, pathIndex) => (
                    <Polygon
                      key={`nonSmoking-${index}-${pathIndex}`}
                      path={parsePathCoordinates(path)}
                      strokeWeight={0}
                      strokeColor="#ffffff"
                      strokeOpacity={0.8}
                      strokeStyle="longdash"
                      fillColor={setSpecialCategoryColor(item.address_division) || '#7CFF89'}
                      fillOpacity={0.7}
                      zIndex={1}
                    />
                  ))
              ))
            }
          </>
        )}
        {isSmoking && isData.length > 0 && (
          <>
            {isData
              .filter(item => item.paths.some(path => path.divisionArea.startsWith('SMOKING_ZONE')))
              .map((item, index) => (
                item.paths
                  .filter(path => path.divisionArea.startsWith('SMOKING_ZONE'))
                  .map((path, pathIndex) => {
                    const coordinates = parsePathCoordinates(path);
                    return (
                      <Polygon
                        key={`smoking-${index}-${pathIndex}`}
                        path={coordinates}
                        strokeWeight={0}
                        strokeColor="#ffffff"
                        strokeOpacity={0.8}
                        strokeStyle="longdash"
                        fillColor={'#FF7C7C'}
                        fillOpacity={0.7}
                        zIndex={1}
                      />
                    );
                  })
              ))
            }
          </>
        )}
      </Map>
      <CurrentLocation setUserLocation={setUserLocation} />
    </div>
  );
}
