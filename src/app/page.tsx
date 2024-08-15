'use client';

import React, { useState, useEffect } from 'react';
import SideMenu from '@/components/sideMenu';
import { CustomOverlayMap, Map, MapMarker, useKakaoLoader, MarkerClusterer } from 'react-kakao-maps-sdk';
import { AddressData, ApartmentData } from '../api/types';
import { listData, ApartmentsData } from '../api/api';
import AreaToggleComponent from '@/components/areaToggleComponent';
import MarkerOverlay from '@/components/markerOverlay';
import Polygon from '@/components/setPolygon';
import ReactGA from 'react-ga4';
import SMOK_ICON from "../../public/smokMarker.png";
import NONSMOK_ICON from "../../public/nonSmokMarker.png";
import Image from "next/image";
import { Address } from '@/interface/AddressInterface';
import DrawingField from '@/components/drawingField';

// Import the Feedback components
import FeedbackButton from '@/components/feedbackButton';
import FeedbackModal from '@/components/feedbackModal';

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
    const [isOverlayClicked, setIsOverlayClicked] = useState(false);
    const [isMarkerClicked, setIsMarkerClicked] = useState(false);
    const [PolygonState, setPolygonState] = useState<string | null>(null);
    const [statute, setStatute] = useState<string | null>(null);
    const [zoomalbe, setZoomable] = useState(true);

    const [address, setAddress] = useState<Address[]>([]); // 콜백 패턴으로 받아온 주소 데이터들 state 변수
    const [activeFunc, setActiveFunc] = useState<string | null>(null); // Add Component 활성화 함수 state 변수
    const [position, setPosition] = useState<{ lat: number; lng: number }>({lat: 0, lng: 0}); // 마커 위치 state 변수
    const [mousePosition, setMousePosition] = useState({lat: 0, lng: 0}); // 마우스 위치 state 변수
    const [path, setPath] = useState<{lat : number, lng : number}[]>([]) // 영역 값 state 변수
    const [polygon, setPolygon] = useState<kakao.maps.Polygon>(); // Polygon 객체 state 변수
    const [isDrawing, setIsDrawing] = useState(false); // 영역 그리기 상태 변수

    // 위도 및 경도 값을 받아서 주소를 반환하는 함수
    const getPositionToAddress = (_map : kakao.maps.Map, mouseEvent : kakao.maps.event.MouseEvent) => {
        const latLng = mouseEvent.latLng;
        const geocoder = new kakao.maps.services.Geocoder();
        setPosition({lat: latLng.getLat(), lng: latLng.getLng()});
        geocoder.coord2Address(latLng.getLng(), latLng.getLat(), getPositionCallback);
    }

    // getPositionToAddress callback 함수
    const getPositionCallback = (result : any, status : string) => {
        if(status === kakao.maps.services.Status.OK) {
            setAddress(result);
        }
    }

    // AddComponent 영역 그리기 시작 클릭 이벤트
    const handleAddressPositionStartClick = (_map : kakao.maps.Map, mouseEvent : kakao.maps.event.MouseEvent) => {
        if(!isDrawing) {
            setPath([]);
        }
        setPath((prev) => [...prev, {lat: mouseEvent.latLng.getLat(), lng: mouseEvent.latLng.getLng()}]);
        setIsDrawing(true);
    }

    // AddComponent 영역 그리기 종료 클릭 이벤트
    const handleAddressPositionEndClick = (_map : kakao.maps.Map, mouseEvent : kakao.maps.event.MouseEvent) => {
        setActiveFunc(null);
        setIsDrawing(false);
    }

    // AddComponent 마우스 이동 이벤트
    const handleMouseMove = (_map : kakao.maps.Map, mouseEvent : kakao.maps.event.MouseEvent) => {
        setMousePosition({lat: mouseEvent.latLng.getLat(), lng: mouseEvent.latLng.getLng()});
    }

    // AddComponent 함수 활성화 토글 함수
    const togleAddFunc = (funcName : string | null) => {
        setActiveFunc(activeFunc === funcName ? null : funcName);
    }

    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

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

    const handleListClick = (item: AddressData) => {
        handlePolygonClick(item.address_latitude, item.address_longitude);
        setIsOverlayClicked(true);
        setPolygonState("address");
    };

    const toggleMenu = (menu: string | null) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

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

    const handleFeedbackButtonClick = () => {
        setIsFeedbackModalOpen(true);
    };

    const handleFeedbackModalClose = () => {
        setIsFeedbackModalOpen(false);
    };

    if (loading) {
        return <div>Loading Kakao Map</div>;
    }

    if (error) {
        return <div>Error loading Kakao Map: {error.message}</div>;
    }
    return (
        <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
            <SideMenu
                onListClick={handleListClick}
                activeMenu={activeMenu}
                setActiveMenu={toggleMenu}
                isData={isData}
                isApartmentsData={isApartmentsData}
                isLoading={isLoading}
                error={errorMsg}
                toggleAddFunc={togleAddFunc}
                addressData={address}
                position={position}
                path={path}
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
                style={{ width: "100%", height: "100%", zIndex: 0 }}
                minLevel={6}
                level={3}
                zoomable={zoomalbe}
                onClick={(_, mouseEvent) => {
                    if(activeFunc === "getAddress") {
                        getPositionToAddress(_, mouseEvent);
                    }
                    if(activeFunc === "drawPolygonStart") {
                        handleAddressPositionStartClick(_, mouseEvent);
                    }
                }}
                onDoubleClick={handleAddressPositionEndClick}
                onMouseMove={handleMouseMove}
            >
                {
                    activeMenu === "add" && (
                        <>
                            <MapMarker position={position ?? center} />
                            <DrawingField
                                activeFunc={activeFunc}
                                setPolygon={setPolygon}
                                path={path}
                                mousePosition={mousePosition}
                                polygon={polygon}
                            />
                        </>
                    )
                }
                <MarkerClusterer averageCenter={true} minLevel={8}>
                    {isNonSmoking && isData?.map((item, index) => (
                        <div key={index}>
                            <MapMarker
                                position={{
                                    lat: item.address_latitude,
                                    lng: item.address_longitude,
                                }}
                                image={{
                                    src: NONSMOK_ICON.src,
                                    size: {
                                        width: 35,
                                        height: 35,
                                    },
                                }}
                                onClick={() => handlePolygonClick(item.address_latitude, item.address_longitude)}
                            >
                            </MapMarker>
                            {markerPosition && markerPosition.lat === item.address_latitude && markerPosition.lng === item.address_longitude && isOverlayClicked && (
                                <CustomOverlayMap
                                    position={{
                                        lat: item.address_latitude,
                                        lng: item.address_longitude,
                                    }}
                                    yAnchor={1}
                                >
                                    <MarkerOverlay data={item} />
                                </CustomOverlayMap>
                            )}
                        </div>
                    ))}
                    {isSmoking && isApartmentsData?.map((item, index) => (
                        <div key={index}>
                            <MapMarker
                                position={{
                                    lat: item.apartment_latitude,
                                    lng: item.apartment_longitude,
                                }}
                                image={{
                                    src: SMOK_ICON.src,
                                    size: {
                                        width: 35,
                                        height: 35,
                                    },
                                }}
                                onClick={() => handlePolygonClick(item.apartment_latitude, item.apartment_longitude)}
                            >
                            </MapMarker>
                            {markerPosition && markerPosition.lat === item.apartment_latitude && markerPosition.lng === item.apartment_longitude && isMarkerClicked && (
                                <CustomOverlayMap
                                    position={{
                                        lat: item.apartment_latitude,
                                        lng: item.apartment_longitude,
                                    }}
                                    yAnchor={1}
                                >
                                    <MarkerOverlay data={item} />
                                </CustomOverlayMap>
                            )}
                        </div>
                    ))}
                </MarkerClusterer>
                <Polygon isNonSmoking={isNonSmoking} statute={statute} PolygonState={PolygonState} />
            </Map>

            <FeedbackButton onClick={handleFeedbackButtonClick} />
            <FeedbackModal isOpen={isFeedbackModalOpen} onClose={handleFeedbackModalClose} />
        </div>
    );
}
