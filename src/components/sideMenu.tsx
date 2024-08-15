import React, { useState } from "react";
import styles from "../../styles/sidebar.module.css";
import LOGO_ICON from "../../public/logo.svg";
import MOBILELOGO_ICON from "../../public/mobilelogo.svg";
import ADD_ICON from "../../public/add.svg";
import SETTING_ICON from "../../public/setting.svg";
import FEEDBACK_ICON from "../../public/feedback.svg";
import INFO_ICON from "../../public/info.svg";
import MOBILEINFO_ICON from "../../public/mobileinfo.svg";
import SEARCH_ICON from "../../public/search.svg";
import RIGHT_ICON from "../../public/right.svg";
import SettingArea from "@/components/settingArea";
import AddComponent from "./addComponent";
import FeedbackModal from '@/components/feedbackModal';
import SearchComponent from "./searchComponent";
import { Address } from "@/interface/AddressInterface";
import ServiceInfoModal from "../components/ServiceInfoModal"; 

interface SideMenuProps {
    onListClick: (item: any) => void;
    activeMenu: string | null;
    setActiveMenu: (menu: string | null) => void;
    isData: any[];
    isApartmentsData: any[];
    isLoading: boolean;
    error: string | null;
    toggleAddFunc : (funcName : string | null) => void;
    addressData : Address[];
    position : { lat: number, lng: number };
    path : { lat: number, lng: number }[];
}

const SideMenu = ({
    onListClick,
    isData,
    isLoading,
    activeMenu,
    setActiveMenu,
    error,
    isApartmentsData,
    toggleAddFunc,
    addressData,
    position,
    path,
}: SideMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isServiceInfoOpen, setIsServiceInfoOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleIconClick = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleMenuClick = (menu: string | null) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    return (
        <div>
            {/* 모바일 화면에서 플로팅 버튼 */}
            <div className={styles.sidebarButton} onClick={toggleMenu}>
                <MOBILELOGO_ICON className={styles.sidebarButtonIcon} />
            </div>

            {/* 모바일 화면에서 플로팅 버튼 클릭 시 나타나는 메뉴 */}
            {isOpen && (
                <div className={styles.menuItems}>
                    <div className={styles.menuItem} onClick={() => handleMenuClick("info")}>
                        <MOBILEINFO_ICON className={styles.sidebarButtonIcon} />
                        {isSidebarOpen && <span>서비스 소개</span>}
                    </div>
                    <div className={styles.menuItem} onClick={() => handleMenuClick("search")}>
                        <SEARCH_ICON className={styles.sidebarButtonIcon} />
                        {isSidebarOpen && <span>검색하기</span>}
                    </div>
                    <div className={styles.menuItem} onClick={() => handleMenuClick("add")}>
                        <ADD_ICON className={styles.sidebarButtonIcon} />
                        {isSidebarOpen && <span>흡연구역 추가요청</span>}
                    </div>
                    <div className={styles.menuItem} onClick={() => handleMenuClick("setting")}>
                        <SETTING_ICON className={styles.sidebarButtonIcon} />
                        {isSidebarOpen && <span>실험실</span>}
                    </div>
                    <div className={styles.menuItem} onClick={() => handleMenuClick("feedback")}>
                        <FEEDBACK_ICON className={styles.sidebarButtonIcon} />
                        {isSidebarOpen && <span>피드백</span>}
                    </div>

                    {/* 서비스 소개 모달 렌더링 */}
                    {
                        activeMenu === "info" && (
                            <ServiceInfoModal 
                                setActiveMenu={setActiveMenu}
                            />
                        )
                    }


                    {/* 설정 컴포넌트 */}
                    {activeMenu === "setting" && (
                        <SettingArea onClose={() => setActiveMenu(null)} />
                    )}

                    {/* 피드백 컴포넌트 */}
                    {activeMenu === "feedback" && (
                        <FeedbackModal onClose={() => setActiveMenu(null)} isOpen />
                    )}

                    {/* 흡연구역 컴포넌트 */}
                    {
                        activeMenu === "add" && (
                            <AddComponent
                                setActiveMenu={setActiveMenu}
                                toggleAddFunc={toggleAddFunc}
                                addressData={addressData}
                                position={position}
                                path={path}
                            />
                        )
                    }

                    {/* 검색 컴포넌트 */}
                    {activeMenu === "search" && (
                        <SearchComponent
                            onListClick={onListClick}
                            isApartmentsData={isApartmentsData}
                            isData={isData}
                            isLoading={isLoading}
                            error={error}
                            setActiveMenu={setActiveMenu}
                        />
                    )}
                </div>
            )}

            {/* 데스크탑 화면에서의 사이드바 */}
            <div className={isSidebarOpen ? styles.sidebarOpen : styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    {isSidebarOpen ? (
                        <>
                            <a href="#">
                                <LOGO_ICON />
                            </a>
                            <p>CleanBreath</p>
                        </>
                    ) : null}
                    <RIGHT_ICON
                        className={styles.activeIcon}
                        onClick={handleIconClick}
                    />
                </div>
                <div className={styles.menu}>
                    <div
                        className={isSidebarOpen ? styles.IconOpen : styles.Icon}
                        onClick={() => handleMenuClick('info')}  
                    >
                        <INFO_ICON />
                        {isSidebarOpen && (<h1>서비스 소개</h1>)}
                    </div>
                    <div
                        className={isSidebarOpen ? styles.IconOpen : styles.Icon}
                        onClick={() => handleMenuClick('list')}
                    >
                        <SEARCH_ICON />
                        {isSidebarOpen && (<h1>검색하기</h1>)}
                    </div>
                    <div
                        className={isSidebarOpen ? styles.IconOpen : styles.Icon}
                        onClick={() => handleMenuClick('add')}
                    >
                        <ADD_ICON />
                        {isSidebarOpen && (<h1>흡연구역 추가 요청하기</h1>)}
                    </div>
                    <div
                        className={isSidebarOpen ? styles.IconOpen : styles.Icon}
                        onClick={() => isSidebarOpen ? handleMenuClick('setting') : setIsSidebarOpen(true)}
                    >
                        <SETTING_ICON />
                        {isSidebarOpen && (<h1>실험실</h1>)}
                        {isSidebarOpen && <RIGHT_ICON
                            className={activeMenu === 'setting' ? styles.down : styles.up}
                        />}
                    </div>
                </div>

                {/* 리스트 View */}
                {activeMenu === 'list' && (
                    <SearchComponent
                        onListClick={onListClick}
                        isData={isData}
                        isApartmentsData={isApartmentsData}
                        isLoading={isLoading}
                        error={error}
                        setActiveMenu={setActiveMenu}
                    />
                )}

                {/* 추가 컴포넌트 */}
                {activeMenu === "add" && (
                    <div className={styles.add}>
                        <AddComponent
                            setActiveMenu={setActiveMenu}
                            toggleAddFunc={toggleAddFunc}
                            addressData={addressData}
                            position={position}
                            path={path}
                        />
                    </div>
                )}

                {/* 설정 컴포넌트 */}
                {activeMenu === "setting" && isSidebarOpen && (
                    <SettingArea onClose={() => setActiveMenu(null)} />
                )}
            </div>

             {/* 서비스 소개 모달 렌더링 */}
             {activeMenu === "info" && isSidebarOpen && (
             <ServiceInfoModal 
                setActiveMenu={setActiveMenu} 
            />)}
        </div>
    );
};

export default SideMenu;
