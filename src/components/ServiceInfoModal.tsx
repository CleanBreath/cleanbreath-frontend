import React from 'react';
import styles from "../../styles/serviceInfoModal.module.css";
import LOGO_ICON from "../../public/logo.svg";

interface ServiceInfoModalProps {
    setActiveMenu: (meny : string | null) => void;
}

const ServiceInfoModal = ({ setActiveMenu }: ServiceInfoModalProps) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <LOGO_ICON className={styles.logoIcon} />
                    <h1 className={styles.cleanBreath}>CleanBreath</h1>
                    <p className={styles.modalHashTags}>#금연구역 #흡연구역 #클브</p>
                    <button className={styles.closeButton} onClick={() => setActiveMenu(null)}>&times;</button>
                </div>
                <h2 className={styles.modalTitle}>
                    <span className={styles.highlightGreen}>서비스</span> 소개
                </h2>
                <p className={styles.modalBody}>
                    CleanBreath는 흡연자와 비흡연자를 위해 흡연구역과 금연구역을 명확하게 안내하는 서비스입니다.
                    사용자에게 흡연 가능한 장소와 금연구역을 시각적으로 쉽게 확인할 수 있는 기능을 제공합니다.
                </p>
                <div className={styles.element}>
                    <h3 className={styles.sectionTitle}>주요 기능</h3>
                    <ul className={styles.featureList}>
                        <li>위치 검색: 특정 지역이나 주소를 입력하여 해당 위치의 흡연 및 금연구역을 확인할 수 있습니다.</li>
                        <li>사용자 피드백: 사용자들이 직접 흡연구역 정보를 신고하거나 수정 요청을 할 수 있는 기능을 제공합니다.</li>
                    </ul>
                </div>
                <div className={styles.element}>
                    <h3 className={styles.sectionTitle}>문제 해결</h3>
                    <ul className={styles.problemList}>
                        <li>흡연구역 인식 부족: 많은 사람들이 흡연구역과 금연구역의 경계에 대해 혼동하고 있습니다. CleanBreath는 이 문제를 해결하여 흡연자와 비흡연자 모두가 불편함 없이 공존할 수 있도록 돕습니다.</li>
                        <li>정보의 투명성: 정확한 위치 정보를 제공하여 불필요한 분쟁을 줄이고, 모두가 쾌적한 환경을 즐길 수 있도록 합니다.</li>
                    </ul>
                </div>
                <div className={styles.element}>
                    <h3 className={styles.sectionTitle}>기대 효과</h3>
                    <ul className={styles.effectList}>
                        <li>공공질서 향상: 흡연구역과 금연구역을 명확히 구분하여, 공공질서를 유지하고 모두가 쾌적한 환경을 누릴 수 있게 합니다.</li>
                        <li>건강 보호: 비흡연자들이 금연구역을 쉽게 확인하고 피할 수 있어, 간접흡연으로부터 보호받을 수 있습니다.</li>
                        <li>흡연자 편의 제공: 흡연자들에게 합법적이고 적절한 흡연 장소를 쉽게 찾아갈 수 있도록 지원합니다.</li>
                    </ul>
                </div>
                <div className={styles.element}>
                    <h3 className={styles.sectionTitle}>서비스 사용 방법</h3>
                    <ul className={styles.methodList}>
                        <li>간편한 시작: 웹사이트에 접속한 후, 사용자는 간단한 인터페이스를 통해 주변의 흡연구역과 금연구역을 탐색할 수 있습니다.</li>
                        <li>모바일 친화성: CleanBreath는 모바일 환경에서도 최적화되어 있어, 언제 어디서든 쉽게 이용할 수 있습니다.</li>
                    </ul>
                </div>
                <div className={styles.modalBottom}>
                    <p>아이콘 출처 : 흡연 구역 아이콘 제작자: Freepik - Flaticon</p>
                    <p>정보 출처 : 안양시 동안구 및 만안구 보건소 자료실</p>
                    <p>대림대학교 bluesky팀 : 최현준, 유현목, 최시헌, 김건우, 문찬수, 김장환</p>
                    <p>최종 업데이트: 2024-08-15</p>
                </div>
            </div>
        </div>
    );
};

export default ServiceInfoModal;
