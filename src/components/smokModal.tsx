import React from 'react';
import { CustomOverlayMap } from 'react-kakao-maps-sdk';
import styles from '../../styles/smokMarkerModal.module.css'

interface SmokModalProps {
    position: {
        lat: number;
        lng: number;
    };
    onClose: () => void;
}

const SmokModal: React.FC<SmokModalProps> = ({ position, onClose }) => {
    return (
        <CustomOverlayMap
            position={position}
            yAnchor={1.3} // 모달이 마커 위에 나타나도록 조정
        >
            <div className={styles.markerModal}>
                <p>정보를 표시하는 기능을 개발 중입니다!</p>
                <button onClick={onClose}>Close</button>
            </div>
        </CustomOverlayMap>
    );
};

export default SmokModal;
