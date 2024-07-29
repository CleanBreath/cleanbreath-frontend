import React from 'react';
import styles from "../../styles/addArea.module.css";

export default function AddArea() {
    return (
        <div className={styles.addArea}>
            <p className={styles.title}>
                <span className={styles.highlight}>흡연구역</span> 추가하기
            </p>
            <div className={styles.locationSection}>
                <div className={styles.locationRow}>
                    <div className={styles.locationLabelInput}>
                        <p className={styles.sctitle}>장소(주소)</p>
                        <input type="text" placeholder="주소를 입력하세요." className={styles.addressInput} />
                    </div>
                    <button className={`${styles.buttonCommon} ${styles.locationButton}`}>장소 지정</button>
                </div>
                <div className={styles.locationRow}>
                    <div className={styles.locationLabelInput}>
                        <p className={styles.sctitle}>상세장소</p>
                        <input type="text" placeholder="상세 주소를 입력하세요." className={styles.addressInput} />
                    </div>
                    <button className={`${styles.buttonCommon} ${styles.areaButton}`}>영역 지정</button>
                </div>
            </div>
            <button className={styles.addButton}>제출</button>
        </div>
    );
}
