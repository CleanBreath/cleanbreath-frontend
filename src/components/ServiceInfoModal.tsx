import React, { useState, useEffect } from 'react';
import styles from "../../styles/serviceInfoModal.module.css";
import LOGO_ICON from "../../public/logo.svg";

interface ServiceInfoModalProps {
    setActiveMenu: (menu: string | null) => void;
    activeMenu: string | null;
}

export const getCookie = (cname: string): string => {
    const name = cname + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return '';
};

const ServiceInfoModal = ({ setActiveMenu, activeMenu }: ServiceInfoModalProps) => {
    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // e.target이 modalContent가 아니면 모달을 닫음
        if (e.target === e.currentTarget) {
            setActiveMenu(null);
        }
    };

    const setCookie = (cname: string, cvalue: string, exdays: number): void => {
        const todayDate = new Date();
        todayDate.setTime(todayDate.getTime() + exdays * 24 * 60 * 60 * 1000);
        const expires = 'expires=' + todayDate.toUTCString();
        document.cookie = `${cname}=${cvalue}; ${expires}; path=/`;
    };

    const [isChecked, setIsChecked] = useState(false);

    const closePopup = () => {
        if (isChecked) {
            setCookie('close', 'Y', 1);
        }
        setActiveMenu(null); 
    };

    const cookieData = getCookie('close');

    return (
        <article className={styles.modalOverlay} onClick={handleBackgroundClick}>
            <section className={styles.modalContent}>
                <header className={styles.modalHeader}>
                    <LOGO_ICON className={styles.logoIcon} alt="CleanBreath 로고" />
                    <h1 className={styles.cleanBreath}>CleanBreath</h1>
                    <p className={styles.modalHashTags}>#안양시 #금연구역 #흡연구역 #클브</p>
                    <button className={styles.closeButton} onClick={closePopup}>&times;</button>
                    {cookieData !== 'Y' &&
                        <label className={styles.modalHashTags}>
                            <input 
                                type="checkbox" 
                                checked={isChecked} 
                                onChange={(e) => setIsChecked(e.target.checked)} 
                            />
                            오늘 하루동안 보지 않기
                        </label>
                    }
                </header>
                <main>
                    <h2 className={styles.modalTitle}>
                        <span className={styles.highlightGreen}>서비스</span> 소개
                    </h2>
                    <p className={styles.modalBody}>
                        <span className={styles.BoldText}>CleanBreath</span>는 안양 시내의 흡연자와 비흡연자를 위해 <span className={styles.BoldText}>금연·흡연구역</span>을 안내하는 서비스 입니다.
                        그리고 사용자에게 흡연 가능한 장소와 금연구역을 시각적으로 쉽게 확인할 수 있는 기능입니다.
                    </p>
                    <section className={styles.element}>
                        <h3 className={styles.sectionTitle}>주요 기능</h3>
                        <ul className={styles.featureList}>
                            <li>시각화 : 특정 지역이나 주소를 입력하여 해당 위치의 흡연 및 금연구역을 확인할 수 있습니다.</li>
                            <li>사용자 요청 피드백 : 사용자들이 직접 흡연구역 정보를 신고하거나 수정 요청을 할 수 있는 기능을 제공합니다.</li>
                        </ul>
                    </section>
                    <section className={styles.element}>
                        <h3 className={styles.sectionTitle}>문제점 및 문제 해결</h3>
                        <ul className={styles.problemList}>
                            <li>흡연구역 인식 부족 : 많은 사람들이 흡연구역과 금연구역의 경계에 대해 혼동하고 있습니다. CleanBreath는 이 문제를 해결하여 흡연자와 비흡연자 모두가 불편함 없이 공존할 수 있도록 돕습니다.</li>
                            <li>공공장소의 갈등 : 정확한 위치 정보를 제공하여 불필요한 분쟁을 줄이고, 모두가 쾌적한 환경을 즐길 수 있도록 합니다.</li>
                        </ul>
                    </section>
                    <section className={styles.element}>
                        <h3 className={styles.sectionTitle}>기대 효과</h3>
                        <ul className={styles.effectList}>
                            <li>간접흡연 피해 감소 : 흡연구역 정보를 명확하게 제공함으로써 흡연자들이 지정된 구역에서만 흡연하도록 유도합니다.</li>
                            <li>정보의 직관적 제공 : 실시간으로 업데이트되는 금연·흡연구역 정보를 통해 시민들이 건강과 안전을 고려하여 
                            행동할 수 있도록 지원합니다. </li>
                            <li>쾌적한 환경 조성 : 금연구역의 확대와 흡연구역의 명확한 안내로 공공장소에서의 쾌적한 환경을 유지할 수 있습니다.</li>
                        </ul>
                    </section>
                </main>
                <footer className={styles.modalBottom}>
                    <p>아이콘 출처 : 흡연 구역 아이콘 제작자 : Freepik - Flaticon</p>
                    <p>정보 출처 : 안양시 동안구 및 만안구 보건소 자료실</p>
                    <p className={styles.Team}>대림대학교 CieloBlu 팀 : 최현준, 유현목, 최시헌, 김건우, 문찬수, 김장환</p>
                    <br />
                    <p>최종 업데이트 : 2024-08-15</p>
                </footer>
            </section>
        </article>
    );
};

export default ServiceInfoModal;