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
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isRedPillModalOpen, setIsRedPillModalOpen] = useState(false);
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

    const openInfoModal = () => setIsInfoModalOpen(true);
    const closeInfoModal = () => setIsInfoModalOpen(false);

    const openRedPillModal = () => setIsRedPillModalOpen(true);
    const closeRedPillModal = () => setIsRedPillModalOpen(false);

    const openWarningModal = () => setIsWarningModalOpen(true);
    const closeWarningModal = () => setIsWarningModalOpen(false);

    const openFeedbackModal = () => { setIsFeedbackModalOpen(true); };
    const closeFeedbackModal = () => { setIsFeedbackModalOpen(false); };

    return (
        <div className={styles.settingArea}>

            <button className={styles.closeButton} onClick={onClose}>&times;</button>

            {/* 모바일에서만 보이는 헤더 */}
            <div className={styles.modalHeader}>
                <LOGO_ICON className={styles.logoIcon}/>
                <h1 className={styles.cleanBreath}>CleanBreath</h1>
            </div>

            <div className={styles.mobileMargin}>
                {/*<button className={styles.settingButton} onClick={openInfoModal}>*/}
                {/*    기타 금연구역 안내*/}
                {/*</button>*/}
                {/*<button className={styles.settingButton} onClick={openWarningModal}>*/}
                {/*    흡연구역 검증기*/}
                {/*</button>*/}
                <button className={styles.settingButton} onClick={openRedPillModal}>
                    빨간약
                </button>
                {/*<button className={styles.settingButton} onClick={openFeedbackModal}>*/}
                {/*    피드백하기*/}
                {/*</button>*/}

                {/*<InfoModal isOpen={isInfoModalOpen} onClose={closeInfoModal}/>*/}
                {/*<WarningModal isOpen={isWarningModalOpen} onClose={closeWarningModal}/>*/}
                <RedPillModal isOpen={isRedPillModalOpen} onClose={closeRedPillModal}/>
                {/*<FeedbackModal isOpen={isFeedbackModalOpen} onClose={closeFeedbackModal}/>*/}
            </div>
        </div>
    );
}
