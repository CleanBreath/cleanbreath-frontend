import React from 'react';
import styles from "../../styles/redPillModal.module.css";

interface RedPillModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RedPillModal: React.FC<RedPillModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>&times;</button>
                <h2 className={styles.modalTitle}>빨간약 안내</h2>
                <div className={styles.modalBody}>
                    <p>빨간약에 대한 정보를 여기에 표시합니다.</p>
                </div>
            </div>
        </div>
    );
};

export default RedPillModal;
