import React, { useState } from 'react';
import styles from "../../styles/settingArea.module.css";
import listStyles from "../../styles/verificationList.module.css";
import InfoModal from "@/components/infoModal";
import RedPillModal from "@/components/redpillModal";
import { testData } from "@/components/testData";

export default function SettingArea() {
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isRedPillModalOpen, setIsRedPillModalOpen] = useState(false);
    const [isVerificationOpen, setIsVerificationOpen] = useState(false);

    const openInfoModal = () => {
        setIsInfoModalOpen(true);
    };

    const closeInfoModal = () => {
        setIsInfoModalOpen(false);
    };

    const openRedPillModal = () => {
        setIsRedPillModalOpen(true);
    };

    const closeRedPillModal = () => {
        setIsRedPillModalOpen(false);
    };

    const toggleVerificationList = () => {
        setIsVerificationOpen(!isVerificationOpen);
    };

    return (
        <div className={styles.settingArea}>
            <button className={styles.settingButton} onClick={openInfoModal}>
                기타 금연구역 안내
            </button>
            <button className={styles.settingButton} onClick={toggleVerificationList}>
                흡연구역 검증기
            </button>
            <button className={styles.settingButton} onClick={openRedPillModal}>
                빨간약
            </button>

            <InfoModal isOpen={isInfoModalOpen} onClose={closeInfoModal} />
            <RedPillModal isOpen={isRedPillModalOpen} onClose={closeRedPillModal} />

            {isVerificationOpen && (
                <div className={listStyles.verificationList}>
                    {testData.map((item) => (
                        <div key={item.address_idx} className={listStyles.verificationItem}>
                            <div className={listStyles.itemHeader}>
                                <h3 className={listStyles.itemName}>{item.address_name}</h3>
                                <div className={listStyles.itemIcon}>{item.smoking}</div>
                            </div>
                            <p className={listStyles.itemDivision}>{item.address_division}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
