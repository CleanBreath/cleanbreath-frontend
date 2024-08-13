//병합 page.tsx 지도에 클릭한 위치에 마커표시/현재위치는 x
'use client';
import React, { useState, useEffect } from 'react';
import SideMenu from '@/components/sideMenu';
import { CustomOverlayMap, Map, MapMarker, useKakaoLoader, MarkerClusterer } from 'react-kakao-maps-sdk';
import { AddressData, ApartmentData } from '../api/types';
import { listData, ApartmentsData } from '../api/api';
import CurrentLocation from '@/components/currentLocation';
import AreaToggleComponent from '@/components/areaToggleComponent';
import MarkerOverlay from '@/components/markerOverlay';
import Polygon from '@/components/setPolygon';
import ReactGA from 'react-ga4';
import AddComponent from '@/components/addComponent';
import SMOK_ICON from "../../public/smokMarker.png";
import NONSMOK_ICON from "../../public/nonSmokMarker.png"
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
  const [isApartmentsData, setApartmentsData] = useState<ApartmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [category, setCategory] = useState<{
    divisionArea?: string;
    pathLat?: string;
    pathLng?: string;
    implicitSmokingArea?: string;
  }>({});
  const [isDrawing, setIsDrawing] = useState(false);
  const [polygonPaths, setPolygonPaths] = useState<{ lat: number; lng: number }[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [smokingAreaType, setSmokingAreaType] = useState<string>(category.divisionArea || ''); 
  const [implicitSmoking, setImplicitSmoking] = useState<string>(category.implicitSmokingArea || ''); 

  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search });
  const [isOverlayClicked, setIsOverlayClicked] = useState(false);
  const [isMarkerClicked, setIsMarkerClicked] = useState(false);
  const [PolygonState, setPolygonState] = useState<string | null>(null);
  const [statute, setStatute] = useState<string | null>(null);
  const [zoomalbe, setZoomable] = useState(true);

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
        const apartmentsData = await ApartmentsData();
        setData(data);
        setApartmentsData(apartmentsData);
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

  useEffect(() => {
    setSmokingAreaType(category.divisionArea || '');
    setImplicitSmoking(category.implicitSmokingArea || '');
  }, [category]);

  const handleListClick = (item: AddressData) => {
    setMarkerPosition({ lat: item.address_latitude, lng: item.address_longitude });
    setCenter({ lat: item.address_latitude, lng: item.address_longitude });
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

  const geocodeLatLng = async (lat: number, lng: number) => {
    return new Promise<string>((resolve, reject) => {
      const geocoder = new window.kakao.maps.services.Geocoder();
      const coord = new window.kakao.maps.LatLng(lat, lng);
      geocoder.coord2Address(coord.getLng(), coord.getLat(), (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const address = result[0].address.address_name;
          resolve(address);
        } else {
          reject('주소를 찾을 수 없습니다.');
        }
      });
    });
  };

  const getBuildingNameFromAddress = async (address: string) => {
    return new Promise<string>((resolve, reject) => {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const buildingName = result[0].road_address?.building_name || '빌딩 이름 없음';
          resolve(buildingName);
        } else {
          reject('주소를 찾을 수 없습니다.');
        }
      });
    });
  };

  const handleMapClick = async (_map: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => {
    const lat = mouseEvent.latLng.getLat();
    const lng = mouseEvent.latLng.getLng();

    if (isDrawing) {
      setPolygonPaths(prevPaths => [...prevPaths, { lat, lng }]);
      setClickCount(prevCount => prevCount + 1);
    } else {
      try {
        const address = await geocodeLatLng(lat, lng);
        const buildingName = await getBuildingNameFromAddress(address);
        setMarkerPosition({ lat, lng });
        setCenter({ lat, lng });
        setAddress(address);
        setBuildingName(buildingName);
      } catch (error) {
        console.error(error);
        setAddress('주소를 가져오는 중 오류가 발생했습니다.');
        setBuildingName('빌딩 이름 없음');
      }
    }
  };

  const startDrawingPolygon = () => {
    setIsDrawing(true);
    setPolygonPaths([]);
    setClickCount(0);
  };

  const endDrawingPolygon = () => {
    if (polygonPaths.length > 2) {
      setIsDrawing(false);
      const latitudes = polygonPaths.map(p => p.lat).join(',');
      const longitudes = polygonPaths.map(p => p.lng).join(',');
      setCategory(prev => ({
        ...prev,
        divisionArea: smokingAreaType,
        pathLat: latitudes,
        pathLng: longitudes,
        implicitSmokingArea: implicitSmoking
      }));
    } else {
      alert('폴리곤을 완성하기 위해 최소 3개의 점이 필요합니다.');
    }
  const handleOverlayClick = () => {
    setIsOverlayClicked(false);
    setIsOverlayClicked(true);
  };

  const handlePolygonClick = (lat: number, lng: number) => {
    setMarkerPosition({ lat, lng });
    setCenter({ lat, lng });
  };

  if (loading) {
    return <div>Loading Kakao Map...</div>;
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
      <AddComponent 
        address={address} 
        buildingName={buildingName}
        category={category} 
        onCategoryChange={(newCategory) => {
          setCategory(prev => ({ ...prev, ...newCategory }));
        }} 
        onSaveLocation={() => {
          console.log(`주소: ${address} 빌딩 이름: ${buildingName} 저장되었습니다.`);
        }}
        onStartDrawingPolygon={startDrawingPolygon}
        onEndDrawingPolygon={endDrawingPolygon}
        onSmokingAreaTypeChange={setSmokingAreaType}
        onImplicitSmokingChange={setImplicitSmoking}
      />
      <Map
        center={center}
        isPanto={true}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
        onClick={handleMapClick}
      >
        {markerPosition && (
          <MapMarker position={markerPosition} />
        )}
        {polygonPaths.length > 0 && (
          <Polygon
            path={polygonPaths}
            strokeColor="#00a0e9"
            strokeOpacity={0.8}
            strokeWeight={2}
            fillColor="#00a0e9"
            fillOpacity={0.5}
          />
        )}
        style={{ width: '100%', height: '100%', zIndex: 0 }}
        minLevel={6}
        level={3}
        zoomable={zoomalbe}
      >
        {isOverlayClicked && markerPosition && (
          <MarkerOverlay
            markerPosition={markerPosition}
            isData={isData}
            isApartmentsData={isApartmentsData}
            PolygonState={PolygonState}
            setIsOverlayClicked={setIsOverlayClicked}
            statute={statute}
            setStatute={setStatute}
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
            isApartmentsData={isApartmentsData}
            isNonSmoking={isNonSmoking}
            isSmoking={isSmoking}
            handlePolygonClick={handlePolygonClick}
            handleOverlayClick={handleOverlayClick}
            isOverlayClicked={isOverlayClicked}
            setPolygonState={setPolygonState}
            setStatute={setStatute}
          />
        )}
      </Map>
      {/*<CurrentLocation setUserLocation={setUserLocation} />*/}
    </div>
  );
}
