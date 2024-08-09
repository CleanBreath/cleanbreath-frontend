import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import styles from "../../styles/addArea.module.css";

//addComponent.tsx,addArea.module.css,page.tsx만 병합하면될듯
interface AddComponentProps {
    address: string;
    buildingName: string;
    category: {
        customCategory?: string;
        divisionArea?: string;
        pathLat?: string;
        pathLng?: string;
        implicitSmokingArea?: string;
    };
    onCategoryChange: (category: Partial<AddComponentProps['category']>) => void;
    onSaveLocation: () => void;
    onStartDrawingPolygon: () => void;
    onEndDrawingPolygon: () => void;
    onSmokingAreaTypeChange: (type: string) => void;
    onImplicitSmokingChange: (implicit: string) => void;
}

export default function AddComponent({
    address,
    buildingName,
    category = {},
    onCategoryChange,
    onSaveLocation,
    onStartDrawingPolygon,
    onEndDrawingPolygon,
    onSmokingAreaTypeChange,
    onImplicitSmokingChange
}: AddComponentProps) {
    const [smokingAreaType, setSmokingAreaType] = useState<string>(category.divisionArea || '');
    const [implicitSmoking, setImplicitSmoking] = useState<string>(category.implicitSmokingArea || '');
    const [categoryInput, setCategoryInput] = useState<string>(category.customCategory || '');
    const [pathLat, setPathLat] = useState<string>(category.pathLat || '');
    const [pathLng, setPathLng] = useState<string>(category.pathLng || '');

    useEffect(() => {
        setSmokingAreaType(category.divisionArea || '');
        setImplicitSmoking(category.implicitSmokingArea || '');
        setCategoryInput(category.customCategory || '');
        setPathLat(category.pathLat || '');
        setPathLng(category.pathLng || '');
    }, [category]);

    const currentDateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');

    const getDivisionArea = () => {
        let divisionAreaValue = smokingAreaType;
        if (implicitSmoking === 'yes') {
            divisionAreaValue += '_IMPLICIT';
        }
        return divisionAreaValue;
    };

    const paths = [{
        divisionArea: getDivisionArea(),
        pathLat: pathLat,
        pathLng: pathLng
    }];

    const data = {
        updateAt: currentDateTime,
        addressName: address,
        buildingName: buildingName,
        latitude: 37.3825740647496,
        longitude: 126.959932808289,
        category: categoryInput, 
        paths 
    };

    const handleSubmit = async () => {
        try {
            console.log('제출할 데이터:', data); // 데이터 확인용 로그
            const response = await axios.post('https://server.bluesky-cleanbreath.com/v1/smokingArea/add', data);
            console.log('서버 응답:', response.data); // 서버 응답 확인용 로그
            alert('데이터가 성공적으로 전송되었습니다!');
        } catch (error) {
            console.error('API 요청 중 오류가 발생했습니다:', error);
            alert('데이터 전송에 실패했습니다.');
        }
    };

    const handleCategoryChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCategoryInput = e.target.value;
        setCategoryInput(newCategoryInput);
        onCategoryChange({ customCategory: newCategoryInput });
    };

    return (
        <div className={styles.addArea}>
            <section className={styles.headerSection}>
                <p className={styles.title}>
                    <span className={styles.highlight}>흡연구역</span> 추가하기
                </p>
            </section>

            <section className={styles.locationSection}>
                <div className={styles.locationRow}>
                    <div className={styles.locationLabelInput}>
                        <p className={styles.sctitle}>장소(주소)</p>
                        <input
                            type="text"
                            placeholder="주소를 입력하세요."
                            className={styles.addressInput}
                            value={address}
                            readOnly
                        />
                    </div>
                    <button className={`${styles.buttonCommon} ${styles.locationButtonCustom}`} onClick={onSaveLocation}>지정</button>
                </div>

                <div className={styles.locationRow}>
                    <div className={styles.locationLabelInput}>
                        <p className={styles.sctitle}>카테고리</p>
                        <input
                            type="text"
                            placeholder="카테고리를 입력하세요."
                            className={styles.addressInput}
                            value={categoryInput}
                            onChange={handleCategoryChangeInput}
                        />
                    </div>
                </div>

                <div className={styles.locationRow}>
                    <div className={styles.locationLabelInput}>
                        <p className={styles.sctitle}>상세주소</p>
                        <input
                            type="text"
                            placeholder="상세주소를 입력하세요."
                            className={styles.addressInput}
                            value={buildingName}
                            readOnly
                        />
                    </div>
                </div>
            </section>

            <section className={styles.areaSection}>
                <p className={styles.sctitle}>흡연 구역 영역지정</p>
                <div className={styles.areaButtonsContainer}>
                    <button className={`${styles.buttonCommon} ${styles.areaButtonStart}`} onClick={onStartDrawingPolygon}>영역 지정 시작</button>
                    <button className={`${styles.buttonCommon} ${styles.areaButtonEnd}`} onClick={onEndDrawingPolygon}>영역 지정 완료</button>
                </div>
            </section>

            <section className={styles.divisionSection}>
                <p className={styles.sctitle}>흡연구역 구분</p>
                <div className={styles.radioGroup}>
                    <label>
                        <input
                            type="radio"
                            name="smokingArea"
                            value="SMOKING_ZONE_OPEN"
                            checked={smokingAreaType === "SMOKING_ZONE_OPEN"}
                            onChange={() => {
                                setSmokingAreaType("SMOKING_ZONE_OPEN");
                                onSmokingAreaTypeChange("SMOKING_ZONE_OPEN");
                            }}
                        />
                        개방형
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="smokingArea"
                            value="SMOKING_ZONE_CLOSED"
                            checked={smokingAreaType === "SMOKING_ZONE_CLOSED"}
                            onChange={() => {
                                setSmokingAreaType("SMOKING_ZONE_CLOSED");
                                onSmokingAreaTypeChange("SMOKING_ZONE_CLOSED");
                            }}
                        />
                        폐쇄형
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="smokingArea"
                            value="SMOKING_ZONE_LINE"
                            checked={smokingAreaType === "SMOKING_ZONE_LINE"}
                            onChange={() => {
                                setSmokingAreaType("SMOKING_ZONE_LINE");
                                onSmokingAreaTypeChange("SMOKING_ZONE_LINE");
                            }}
                        />
                        라인형
                    </label>
                </div>
                <div className={styles.implicitSmokingSection}>
                    <p className={styles.sctitle}>암묵적인 흡연구역 여부</p>
                    <div className={styles.radioGroup}>
                        <label>
                            <input
                                type="radio"
                                name="implicitSmokingArea"
                                value="yes"
                                checked={implicitSmoking === "yes"}
                                onChange={() => {
                                    setImplicitSmoking("yes");
                                    onImplicitSmokingChange("yes");
                                }}
                            />
                            맞다
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="implicitSmokingArea"
                                value="no"
                                checked={implicitSmoking === "no"}
                                onChange={() => {
                                    setImplicitSmoking("no");
                                    onImplicitSmokingChange("no");
                                }}
                            />
                            아니다
                        </label>
                    </div>
                </div>
            </section>

            <button className={styles.addButton} onClick={handleSubmit}>제출</button>
        </div>
    );
}
