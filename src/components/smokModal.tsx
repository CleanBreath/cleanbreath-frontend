import React from 'react';
import { CustomOverlayMap } from 'react-kakao-maps-sdk';

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
            yAnchor={2} // 모달이 마커 위에 나타나도록 조정
        >
            <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '5px'}}>
                <p>선택한 흡연구역에 대한 정보</p>
                <button onClick={onClose}>Close</button>
            </div>
        </CustomOverlayMap>
    );
};

export default SmokModal;
