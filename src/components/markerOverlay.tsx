import React, { useState } from 'react';
import { CustomOverlayMap } from 'react-kakao-maps-sdk';
import { AddressData, ApartmentData } from '@/api/types';
import PARK_ICON from "../../public/park.png";
import SCHOOL_ICON from "../../public/school.png";
import CLOSE_ICON from "../../public/close.svg";
import GOVERNMENT_ICON from "../../public/government.png";
import BANK_ICON from "../../public/bank.png";
import BUILDING_ICON from "../../public/building.png";
import APART_ICON from "../../public/apart.png"
import MEDICAL_ICON from "../../public/medical.png"
import GAS_ICON from "../../public/gas.png"
import HOUSE_ICON from "../../public/house.png"
import SUBWAY_ICON from "../../public/subway.png"
import HELP_ICON from "../../public/help.svg";
import styles from "../../styles/markerOverlay.module.css";
import Statute from './statuteComponent';

interface MarkerOverlayProps {
    markerPosition: { lat: number; lng: number };
    isData: AddressData[];
    isApartmentsData: ApartmentData[];
    PolygonState: string | null;
    setIsOverlayClicked: (isOverlayClicked: boolean) => void;
}

const changeText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? text.slice(0, maxLength) + ".." : text;
};

const TITLE_CHAR_LIMIT = 9;

export default function MarkerOverlay({ markerPosition, isData, isApartmentsData, PolygonState, setIsOverlayClicked }: MarkerOverlayProps) {
    const [tooltip, setTooltip] = useState<string | null>(null);
    const [statute, setStatute] = useState<string | null>(null);

    const showTooltip = (text: string) => setTooltip(text);
    const hideTooltip = () => setTooltip(null);

    const handleStatute = (category: string) => {
      setStatute(
        category.includes('학교') || category.includes('유치원') ? '학교' :
        category.includes('공원') ? '기타' :
        category.includes('지방청사') ? '지방청사' :
        category.includes('금융기관') ? '기타' :
        (category.includes('복합상가건물') || category.includes('회사')) ? '기타' :
        category.includes('아파트') ? '기타' :
        category.includes('의료기관') ? '의료기관' :
        category.includes('주유소') ? '기타' :
        category.includes('주택') ? '기타' :
        category.includes('지하철') ? '기타' : null
      );
    };

    const renderAddressOverlay = () => (
        <CustomOverlayMap position={markerPosition} yAnchor={1} xAnchor={0.5} zIndex={3}>
            <div className={styles.container}>
                {isData.map((item) => {
                    const cat = item.address_category;
                    if (item.address_latitude === markerPosition.lat && item.address_longitude === markerPosition.lng) {
                        return (
                            <div key={item.address_idx} className={styles.markerWrapper}>
                                <div
                                    className={styles.title}
                                    onMouseEnter={() => showTooltip(item.address_buildingName)}
                                    onMouseLeave={hideTooltip}
                                >
                                    <p>{changeText(item.address_buildingName, TITLE_CHAR_LIMIT)}</p>
                                    <div className={styles.icon} onClick={() => {
                                      
                                    }}>
                                      {(cat.includes('학교') || cat.includes('유치원'))? (
                                          <img src={SCHOOL_ICON.src} alt="학교" />
                                      ) :  cat.includes('공원') ? (
                                          <img src={PARK_ICON.src} alt="공원" />
                                      ) : cat.includes('지방청사') ? (
                                          <img src={GOVERNMENT_ICON.src} alt="지방청사" />
                                      ) : cat.includes('금융기관') ? (
                                          <img src={BANK_ICON.src} alt="금융기관" />
                                      ) : (cat.includes('복합상가건물') || cat.includes('회사')) ? (
                                          <img src={BUILDING_ICON.src} alt="건물" />
                                      ) : cat.includes('아파트') ? (
                                          <img src={APART_ICON.src} alt="아파트" />
                                      ) : cat.includes('의료기관') ? (
                                          <img src={MEDICAL_ICON.src} alt="의료기관" />
                                      ) : cat.includes('주유소') ? (
                                          <img src={GAS_ICON.src} alt="주유소" />
                                      ) : cat.includes('주택') ? (
                                          <img src={HOUSE_ICON.src} alt="주택" />
                                      ) : cat.includes('지하철') ? (
                                        <img src={SUBWAY_ICON.src} alt="지하철" />
                                      ) : null
                                      }
                                    </div>
                                    
                                    {tooltip && (
                                        <div className={styles.tooltip}>
                                            {tooltip}
                                        </div>
                                    )}
                                </div>
                                <p className={styles.subTitle}>{item.address_name}</p>
                            </div>
                        );
                    }
                    return null;
                })}
                <div className={styles.close} onClick={() => { setIsOverlayClicked(false) }}>
                    <CLOSE_ICON />
                </div>
                <div className={styles.help} onClick={() => {
                  isData.map((item) => {
                    if (item.address_latitude === markerPosition.lat && item.address_longitude === markerPosition.lng) {
                      handleStatute(item.address_category);
                    }
                  });
                }}>
                    <HELP_ICON />
                </div>
                {/*statute !== null && <div className={styles.statute}>
                  <Statute 
                    statute={statute}
                    setStatute={setStatute}
                  />
               </div>*/}
            </div>
        </CustomOverlayMap>
    );

    const renderApartmentOverlay = () => (
        <CustomOverlayMap position={markerPosition} yAnchor={1} xAnchor={0.5} zIndex={3}>
            <div className={styles.container}>
                {isApartmentsData.map((item) => {
                  const path = item.path.some((path) => path.latitude === markerPosition.lat && path.longitude === markerPosition.lng);
                    if (path) {
                        return (
                            <div key={item.id} className={styles.markerWrapper}>
                                <div
                                    className={styles.title}
                                    onMouseEnter={() => showTooltip(item.apartmentName)}
                                    onMouseLeave={hideTooltip}
                                >
                                    <p>{changeText(item.apartmentName, TITLE_CHAR_LIMIT)}</p>
                                    {tooltip && (
                                        <div className={styles.tooltip}>
                                            {tooltip}
                                        </div>
                                    )}
                                  <div className={styles.icon}>
                                    <img src={APART_ICON.src} alt="아파트" />
                                  </div>
                                </div>
                                <p className={styles.subTitle}>{item.address}</p>
                                {item.path.map((path) => (
                                  <div className={styles.detail} key={item.id}>
                                    <p>엘베이터 : {path.elevator === true ? '금연구역' : '흡연가능 구역'}</p>
                                    <p>복도 : {path.hallway === true ? '금연구역' : '흡연가능 구역'}</p>
                                    <p>계단 : {path.stairs === true ? '금연구역' : '흡연가능 구역'}</p>
                                    <p>지하주차장 : {path.underground_parking_lot === true ? '금연구역' : '흡연가능 구역'}</p>
                                  </div>
                                  ))}
                            </div>
                        );
                    }
                    return null;
                })}
                <div className={styles.close} onClick={() => { setIsOverlayClicked(false) }}>
                    <CLOSE_ICON />
                </div>
            </div>
        </CustomOverlayMap>
    );

    return (
        <div>
            {PolygonState === 'address' && renderAddressOverlay()}
            {PolygonState === 'apartment' && renderApartmentOverlay()}
            
        </div>
    );
}
