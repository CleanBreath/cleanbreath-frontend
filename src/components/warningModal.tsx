import React from 'react';
import styles from "../../styles/infoModal.module.css";
import LOGO_ICON from "../../public/logo.svg";

interface WarningModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const WarningModal: React.FC<WarningModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <LOGO_ICON className={styles.logoIcon}/>
                    <h1 className={styles.cleanBreath}>CleanBreath</h1>
                    <p className={styles.modalHashTags}>#금연구역 #흡연구역 #클브</p>
                    <button className={styles.closeButton} onClick={onClose}>&times;</button>
                </div>
                <div className={styles.modalBody}>
                    <h2 className={styles.modalTitle}>기능 <span className={styles.highlightGreen}>개발</span> 중</h2>
                    <p>이 기능은 아직 개발 중입니다. 추후 업데이트를 기대해 주세요!</p>
                </div>
            </div>
        </div>
    );
};

export default WarningModal;
