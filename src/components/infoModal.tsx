import React from 'react';
import styles from "../../styles/infoModal.module.css";

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
}

export default InfoModal;
