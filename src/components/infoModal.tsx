import React from 'react';
import styles from "../../styles/infoModal.module.css";

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <img src="logo.svg" alt="logo" className={styles.logoIcon}/>
                    <h1 className={styles.cleanBreath}>CleanBreath</h1>
                    <p className={styles.modalHashTags}>#금연구역 #흡연구역 #클브</p>
                    <button className={styles.closeButton} onClick={onClose}>&times;</button>
                </div>
                <h2 className={styles.modalTitle}>기타 금연구역 안내</h2>
                <div className={styles.modalBody}>
                    <p>- 어린이집, 유치원, 초중고등학교, 버스정류장, 택시정류장, 지하철 출입구 경계 10m 이내</p>
                    <p>- 초중고, 대학교 출입문 50m 이내</p>
                    <p>- 공원, 하천 산책로</p>
                    <p>- 국민건강증진법 제9조제5항에 따른 금연구역</p>
                </div>
                <div className={styles.modalBottom}>
                    <p>최종 업데이트:2024-07-26</p>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;
