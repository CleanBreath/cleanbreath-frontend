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
import Image from 'next/image';

interface MarkerOverlayProps {
    markerPosition: { lat: number; lng: number };
    isData: AddressData[];
    isApartmentsData: ApartmentData[];
    PolygonState: string | null;
    setIsOverlayClicked: (isOverlayClicked: boolean) => void;
    statute: string | null;
    setStatute: (statute: string | null) => void; 
}

const changeText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? text.slice(0, maxLength) + ".." : text;
};

const TITLE_CHAR_LIMIT = 9;

export default function MarkerOverlay({ markerPosition, isData, isApartmentsData, PolygonState, setIsOverlayClicked, statute, setStatute }: MarkerOverlayProps) {
    const [tooltip, setTooltip] = useState<string | null>(null);
    const filteredData = isData.filter(
      (item : AddressData) => item.address_latitude === markerPosition.lat && item.address_longitude === markerPosition.lng
    );

    const showTooltip = (text: string) => setTooltip(text);
    const hideTooltip = () => setTooltip(null);

    const renderAddressOverlay = () => (
      <CustomOverlayMap position={markerPosition} yAnchor={1} xAnchor={0.5} zIndex={3}>
        <div className={styles.container}>
          {filteredData.map((item) => {
            const cat = item.address_category;
            return (
              <div key={item.address_idx} className={styles.markerWrapper}>
                <div
                  className={styles.title}
                  onMouseEnter={() => showTooltip(item.address_buildingName)}
                  onMouseLeave={hideTooltip}
                >
                  <p>{changeText(item.address_buildingName, TITLE_CHAR_LIMIT)}</p>
                  <div className={styles.icon} onClick={() => {}}>
                    {(cat.includes('학교') || cat.includes('유치원')) && (<Image src={SCHOOL_ICON} alt="학교" />)}
                    {cat.includes('공원') && <Image src={PARK_ICON} alt="공원" />}
                    {cat.includes('지방청사') && <Image src={GOVERNMENT_ICON} alt="지방청사" />}
                    {cat.includes('금융기관') && <Image src={BANK_ICON} alt="금융기관" />}
                    {(cat.includes('복합상가건물') || cat.includes('회사')) && (<Image src={BUILDING_ICON} alt="건물" />)}
                    {cat.includes('아파트') && <Image src={APART_ICON} alt="아파트" />}
                    {cat.includes('의료기관') && <Image src={MEDICAL_ICON} alt="의료기관" />}
                    {cat.includes('주유소') && <Image src={GAS_ICON} alt="주유소" />}
                    {cat.includes('주택') && <Image src={HOUSE_ICON} alt="주택" />}
                    {cat.includes('지하철') && <Image src={SUBWAY_ICON} alt="지하철" />}
                  </div>
                  {tooltip && <div className={styles.tooltip}>{tooltip}</div>}
                </div>
                <p className={styles.subTitle}>{item.address_name}</p>
              </div>
            );
          })}
          
          <div className={styles.close} onClick={() => { setIsOverlayClicked(false) }}>
            <CLOSE_ICON />
          </div>

          {filteredData.some((item) => item.smoking === '금연구역') && (
            <>
              <p className={styles.AUStatute}>
                국민건강증진법 제9조제6항, 시행: 2024.7.10
              </p>
              <div className={styles.help}>
                <a href="https://www.anyang.go.kr/health/contents.do?key=1329"><HELP_ICON /></a>
              </div> 
            </>
          )}
          
          {statute !== null && (
            <div className={styles.statute}>
              <Statute statute={statute} setStatute={setStatute} />
            </div>
          )}
        </div>
      </CustomOverlayMap>
    );

    const renderApartmentOverlay = () => (
        <CustomOverlayMap position={markerPosition} yAnchor={1} xAnchor={0.5} zIndex={3}>
            <div className={styles.container}>
                {isApartmentsData.map((item : ApartmentData) => {
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
                                    <Image src={APART_ICON} alt="아파트" />
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
