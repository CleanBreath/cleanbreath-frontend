import React, { useState } from "react";
import styles from "../../styles/sidebar.module.css";

import LOGO_ICON from "../../public/logo.svg";
import MOBILELOGO_ICON from "../../public/mobilelogo.svg";
import LIST_ICON from "../../public/list.svg";
import ADD_ICON from "../../public/add.svg";
import SETTING_ICON from "../../public/setting.svg";
import NOTICE_ICON from "../../public/Notice.svg";
import SEARCH_ICON from "../../public/search.svg";

import SettingArea from "@/components/settingArea";
import AddComponent from "@/components/addComponent";
import NoticeList from "@/components/noticeList";
import SearchComponent from "./searchComponent";
import { AddressData } from "@/api/types";

interface SideMenuProps {
    onListClick: (item: any) => void;
    activeMenu: string | null;
    setActiveMenu: (menu: string | null) => void;
    isData: any[];
    isLoading: boolean;
    error: string | null;
}

const SideMenu = ({
    onListClick,
    isData,
    isLoading,
    activeMenu,
    setActiveMenu,
    error,
}: SideMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
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
                    <div className={styles.menuItem} onClick={() => setActiveMenu("list")}>
                        <LIST_ICON className={styles.sidebarButtonIcon} />
                    </div>
                    <div className={styles.menuItem} onClick={() => setActiveMenu("add")}>
                        <ADD_ICON className={styles.sidebarButtonIcon} />
                    </div>
                    <div className={styles.menuItem} onClick={() => setActiveMenu("setting")}>
                        <SETTING_ICON className={styles.sidebarButtonIcon} />
                    </div>
                    <div className={styles.menuItem} onClick={() => setActiveMenu("notice")}>
                        <NOTICE_ICON className={styles.sidebarButtonIcon} />
                    </div>

                    {/* 설정 컴포넌트 */}
                    {activeMenu === "setting" && (
                        <SettingArea onClose={() => setActiveMenu(null)} />
                    )}
                </div>
            )}

            {/* 데스크탑 화면에서의 기존 사이드바 */}
            <div className={activeMenu ? styles.sidebarOpen : styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <a href="#">
                        <LOGO_ICON />
                    </a>
                    {activeMenu ? <p>CleanBreath</p> : null}
                </div>
                <div className={styles.menu}>
                    <div
                        className={activeMenu === 'list' ? styles.listIconOpen : styles.listIcon}
                        onClick={() => setActiveMenu("list")}
                    >
                        <SEARCH_ICON />
                    </div>
                    <div
                        className={activeMenu === 'add' ? styles.addIconOpen : styles.addIcon}
                        onClick={() => setActiveMenu("add")}
                    >
                        <ADD_ICON />
                    </div>
                    <div
                        className={activeMenu === 'setting' ? styles.settingIconOpen : styles.settingIcon}
                        onClick={() => setActiveMenu("setting")}
                    >
                        <SETTING_ICON />
                    </div>
                    <div
                        className={activeMenu === 'notice' ? styles.settingIconOpen : styles.settingIcon}
                        onClick={() => setActiveMenu("notice")}
                    >
                        <NOTICE_ICON />
                    </div>
                </div>

                {/* 리스트 View */}
                {activeMenu === 'list' && (
                    <SearchComponent 
                        onListClick={onListClick}
                        isData={isData}
                        isLoading={isLoading}
                        error={error}
                    />
                )}

                {activeMenu === "add" && (

                        <AddComponent
                        />
                )}

                {/* 공지사항 컴포넌트 */}
                {activeMenu === "notice" && <NoticeList />}

                {/* 설정 컴포넌트 */}
                {activeMenu === "setting" && (
                    <SettingArea onClose={() => setActiveMenu(null)} />
                )}
            </div>
        </div>
    );
};

export default SideMenu;
