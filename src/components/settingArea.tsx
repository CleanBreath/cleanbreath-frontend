import React, { useState } from 'react';
import styles from "../../styles/settingArea.module.css";
import InfoModal from "@/components/infoModal"; // 변경된 import 경로

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
                <h2>기타 금연구역 안내</h2>
                <p>여기에 금연구역 안내 정보를 표시합니다.</p>
            </InfoModal>
        </div>
    );
}
