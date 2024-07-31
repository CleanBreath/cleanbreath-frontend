import React, { useState } from 'react';
import styles from "../../styles/settingArea.module.css";
import verificationListStyles from "../../styles/verificationList.module.css"; // 리스트 스타일
import InfoModal from "@/components/infoModal";
import RedPillModal from "@/components/redpillModal";
import WarningModal from "@/components/warningModal";
import { testData } from "@/components/testData";

export default function SettingArea() {
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isRedPillModalOpen, setIsRedPillModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

    const openInfoModal = () => setIsInfoModalOpen(true);
    const closeInfoModal = () => setIsInfoModalOpen(false);

    const openRedPillModal = () => setIsRedPillModalOpen(true);
    const closeRedPillModal = () => setIsRedPillModalOpen(false);

    const openWarningModal = () => setIsWarningModalOpen(true);
    const closeWarningModal = () => setIsWarningModalOpen(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className={styles.settingArea}>
            <button className={styles.settingButton} onClick={openInfoModal}>
                기타 금연구역 안내
            </button>
            <button className={styles.settingButton} onClick={openWarningModal}> {/* 변경 */}
                흡연구역 검증기
            </button>
            <button className={styles.settingButton} onClick={openWarningModal}> {/* 변경 */}
                빨간약
            </button>

            <InfoModal isOpen={isInfoModalOpen} onClose={closeInfoModal} />
            <WarningModal isOpen={isWarningModalOpen} onClose={closeWarningModal} /> {/* 추가 */}
        </div>
    );
}