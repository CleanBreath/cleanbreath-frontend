import React, { useState } from "react";
import styles from "../../styles/sidebar.module.css";

import LOGO_ICON from "../../public/logo.svg";
import MOBILELOGO_ICON from "../../public/mobilelogo.svg";
import LIST_ICON from "../../public/list.svg";
import ADD_ICON from "../../public/add.svg";
import SETTING_ICON from "../../public/setting.svg";
import NOTICE_ICON from "../../public/Notice.svg";
import FEEDBACK_ICON from "../../public/feedback.svg";
import INFO_ICON from "../../public/info.svg";
import MOBILEINFO_ICON from "../../public/mobileinfo.svg";
import SEARCH_ICON from "../../public/search.svg";

import SettingArea from "@/components/settingArea";
import AddComponent from "./addComponent";
import NoticeList from "@/components/noticeList";
import FeedbackModal from '@/components/feedbackModal';
import SearchComponent from "./searchComponent";

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

    const handleClose = () => {
        setActiveMenu(null);
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
                    <div className={styles.menuItem} onClick={() => setActiveMenu("info")}>
                        <MOBILEINFO_ICON className={styles.sidebarButtonIcon}/>
                    </div>
                    <div className={styles.menuItem} onClick={() => setActiveMenu("search")}>
                        <SEARCH_ICON className={styles.sidebarButtonIcon}/>
                    </div>
                    <div className={styles.menuItem} onClick={() => setActiveMenu("add")}>
                        <ADD_ICON className={styles.sidebarButtonIcon}/>
                    </div>
                    <div className={styles.menuItem} onClick={() => setActiveMenu("setting")}>
                        <SETTING_ICON className={styles.sidebarButtonIcon}/>
                    </div>
                    <div className={styles.menuItem} onClick={() => setActiveMenu("feedback")}>
                        <FEEDBACK_ICON className={styles.sidebarButtonIcon}/>
                    </div>

                    {/* 설정 컴포넌트 */}
                    {activeMenu === "setting" && (
                        <SettingArea onClose={() => setActiveMenu(null)}/>
                    )}

                    {/* 피드백 컴포넌트 */}
                    {activeMenu === "feedback" && (
                        <FeedbackModal onClose={() => setActiveMenu(null)} isOpen/>
                    )}

                    {/* 검색 컴포넌트 */}
                    {activeMenu === "search" && (
                        <SearchComponent
                            onListClick={onListClick}
                            isData={isData}
                            isLoading={isLoading}
                            error={error}
                            onClose={handleClose} // onClose 추가
                        />
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
                    <div>
                        <INFO_ICON/>
                    </div>
                    <div
                        className={activeMenu === 'list' ? styles.listIconOpen : styles.listIcon}
                        onClick={() => setActiveMenu("list")}
                    >
                        <SEARCH_ICON/>
                    </div>
                    <div
                        className={activeMenu === 'add' ? styles.addIconOpen : styles.addIcon}
                        onClick={() => setActiveMenu("add")}
                    >
                        <ADD_ICON/>
                    </div>
                    <div
                        className={activeMenu === 'setting' ? styles.settingIconOpen : styles.settingIcon}
                        onClick={() => setActiveMenu("setting")}
                    >
                        <SETTING_ICON/>
                    </div>
                    {/*<div*/}
                    {/*    className={activeMenu === 'notice' ? styles.settingIconOpen : styles.settingIcon}*/}
                    {/*    onClick={() => setActiveMenu("notice")}*/}
                    {/*>*/}
                    {/*    <NOTICE_ICON />*/}
                    {/*</div>*/}
                </div>

                {/* 리스트 View */}
                {activeMenu === 'list' && (
                    <SearchComponent
                        onListClick={onListClick}
                        isData={isData}
                        isLoading={isLoading}
                        error={error}
                        onClose={handleClose} // onClose 추가
                    />
                )}

                {/* 추가 컴포넌트 */}
                {activeMenu === "add" && (
                    <div className={styles.add}>
                        <AddComponent />
                    </div>
                )}

                {/*/!* 공지사항 컴포넌트 *!/*/}
                {/*{activeMenu === "notice" && <NoticeList />}*/}

                {/* 설정 컴포넌트 */}
                {activeMenu === "setting" && (
                    <SettingArea onClose={() => setActiveMenu(null)} />
                )}
            </div>
        </div>
    );
};

export default SideMenu;
