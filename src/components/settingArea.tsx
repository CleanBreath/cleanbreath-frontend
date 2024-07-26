import React, { useState } from 'react';
import styles from "../../styles/settingArea.module.css";
import InfoModal from "@/components/infoModal";

export default function SettingArea() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={styles.settingArea}>
            <button className={styles.settingButton} onClick={openModal}>
                기타 금연구역 안내
            </button>
            <button className={styles.settingButton}>흡연구역 검증기</button>
            <button className={styles.settingButton}>빨간약</button>

            {/* InfoModal 컴포넌트 */}
            <InfoModal isOpen={isModalOpen} onClose={closeModal}>
            </InfoModal>
        </div>
    );
}
