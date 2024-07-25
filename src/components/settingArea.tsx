import React from 'react';
import styles from "../../styles/settingArea.module.css";

export default function SettingArea() {
    return (
        <div className={styles.settingArea}>
            <button className={styles.settingButton}>기타 금연구역 안내</button>
            <button className={styles.settingButton}>흡연구역 검증기</button>
            <button className={styles.settingButton}>빨간약</button>
        </div>
    );
}