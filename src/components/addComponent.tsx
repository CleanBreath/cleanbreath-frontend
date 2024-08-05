import React from 'react';
import styles from "../../styles/addArea.module.css";

//새로추가
export default function AddComponent() {
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
                        <input type="text" placeholder="상세주소를 입력하세요." className={styles.addressInput} />
                    </div>
                    <button className={`${styles.buttonCommon} ${styles.areaButton}`}>영역 지정</button>
                </div>
            </div>
            <div className={styles.divisionSection}>
                <p className={styles.sctitle}>흡연구역 구분</p>
                <div className={styles.radioGroup}>
                    <label>
                        <input type="radio" name="smokingArea" value="open" />
                        개방형
                    </label>
                    <label>
                        <input type="radio" name="smokingArea" value="closed" />
                        폐쇠형
                    </label>
                    <label>
                        <input type="radio" name="smokingArea" value="line" />
                        라인형
                    </label>
                </div>
                <p className={styles.sctitle}>암묵적인 흡연구역 여부</p>
                <div className={styles.radioGroup}>
                    <label>
                        <input type="radio" name="implicitSmokingArea" value="yes" />
                        맞다
                    </label>
                    <label>
                        <input type="radio" name="implicitSmokingArea" value="no" />
                        아니다
                    </label>
                </div>
            </div>
            <button className={styles.addButton}>제출</button>
        </div>
    );
}
