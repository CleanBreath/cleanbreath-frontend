import React, { useState } from 'react';
import { CustomOverlayMap } from 'react-kakao-maps-sdk';
import { AddressData } from '@/api/types';
import NON_SMOKING_ICON from "../../public/nonSmok.svg";
import SMOKING_ICON from "../../public/smok.svg";
import CLOSE_ICON from "../../public/close.svg";
import styles from "../../styles/markerOverlay.module.css";

interface MarkerOverlayProps {
    markerPosition: { lat: number; lng: number };
    isData: AddressData[];
    handleOverlay: () => void;
}

const changeText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const TITLE_CHAR_LIMIT = 7;

export default function MarkerOverlay({ markerPosition, isData, handleOverlay }: MarkerOverlayProps) {
  const [tooltip, setTooltip] = useState<string | null>(null);

  const showTooltip = (text: string) => setTooltip(text);
  const hideTooltip = () => setTooltip(null);

  return (
    <>
      <CustomOverlayMap position={markerPosition} yAnchor={1} xAnchor={0.5} zIndex={3}>
        <div className={styles.container}>
          {isData.map((item) => {
            if (item.address_latitude === markerPosition.lat && item.address_longitude === markerPosition.lng) {
              return (
                <div key={item.address_idx} className={styles.markerWrapper}>
                  <div 
                    className={styles.title}
                    onMouseEnter={() => showTooltip(item.address_buildingName)}
                    onMouseLeave={hideTooltip}
                  >
                    <p>{changeText(item.address_buildingName, TITLE_CHAR_LIMIT)}</p>
                    {item.smoking === "금연구역" ? <div className={styles.nonSmok}><NON_SMOKING_ICON /></div> : <div className={styles.smok}><SMOKING_ICON /></div>}
                    {tooltip && (
                      <div className={styles.tooltip}>
                        {tooltip}
                      </div>
                    )}
                  </div>
                  <div className={styles.close} onClick={handleOverlay}>
                    <CLOSE_ICON />
                  </div>
                  <p className={styles.subTitle}>{item.address_name}</p>
                </div>
              );
            }
            return null;
          })}
        </div>
      </CustomOverlayMap>
    </>
  );
}
