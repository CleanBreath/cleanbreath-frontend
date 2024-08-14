import React, { useState } from 'react';
import styles from "../../styles/settingArea.module.css";
import InfoModal from "@/components/infoModal";
import RedPillModal from "@/components/redpillModal";
import WarningModal from "@/components/warningModal";
import FeedbackModal from '@/components/feedbackModal';
import LOGO_ICON from "../../public/logo.svg";

interface SettingAreaProps {
    onClose: () => void;
}

export default function SettingArea({ onClose }: SettingAreaProps) {
    const [isRedPillModalOpen, setIsRedPillModalOpen] = useState(false);

    const openRedPillModal = () => setIsRedPillModalOpen(true);
    const closeRedPillModal = () => setIsRedPillModalOpen(false);

    return (
        <div className={styles.settingArea}>

            <button className={styles.closeButton} onClick={onClose}>&times;</button>

            {/* 모바일에서만 보이는 헤더 */}
            <div className={styles.modalHeader}>
                <LOGO_ICON className={styles.logoIcon}/>
                <h1 className={styles.cleanBreath}>CleanBreath</h1>
            </div>

            <div className={styles.mobileMargin}>
                <button className={styles.settingButton} onClick={openRedPillModal}>
                    빨간약
                </button>

                <RedPillModal isOpen={isRedPillModalOpen} onClose={closeRedPillModal}/>
            </div>
        </div>
    );
}
