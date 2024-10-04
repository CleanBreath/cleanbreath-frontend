import React from 'react';
import styles from "../../styles/serviceInfoModal.module.css";
import LOGO_ICON from "../../public/logo.svg";

interface ServiceInfoModalProps {
    setActiveMenu: (meny : string | null) => void;
}

const ServiceInfoModal = ({ setActiveMenu }: ServiceInfoModalProps) => {
    return (
        <article className={styles.modalOverlay}>
            <section className={styles.modalContent}>
                <header className={styles.modalHeader}>
                    <LOGO_ICON className={styles.logoIcon} alt="CleanBreath 로고"/>
                    <h1 className={styles.cleanBreath}>CleanBreath</h1>
                    <p className={styles.modalHashTags}>#금연구역 #흡연구역 #클브</p>
                    <button className={styles.closeButton} onClick={() => setActiveMenu(null)}>&times;</button>
                </header>
                <h2 className={styles.modalTitle}>
                    <span className={styles.highlightGreen}>서비스</span> 소개
                </h2>
                <main className={styles.modalBody}>
                    <p>안양시 흡연구역과 금연구역의 시각화된 정보 제공 서비스</p>
                    <br/>
                    <p>CleanBreath는 저희가 수집한 데이터와 안양시 보건소 데이터를 바탕으로 흡연구역과 금연구역의 시각화된 정보를 제공합니다.</p>
                    <p>CleanBreath가 제공하는 흡연구역 및 금연구역은 참고용으로, 정보의 정확성에 대한 책임을 지지 않습니다.</p>
                </main>
                <footer className={styles.modalBottom}>
                    <p>아이콘 출처: 흡연 구역 아이콘 제작자: Freepik - Flaticon</p>
                    <p>정보 출처: 안양시 동안구 및 만안구 보건소 자료실</p>
                    <p>대림대학교 bluesky팀: 최현준, 유현목, 최시헌, 김건우, 문찬수, 김장환</p>
                    <p>최종 업데이트: 2024-08-15</p>
                </footer>
            </section>
        </article>
    );
};

export default ServiceInfoModal;
