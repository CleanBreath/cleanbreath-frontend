import React, { useState, useMemo } from "react";
import styles from "../../styles/sidebar.module.css";
import LOGO_ICON from "../../public/logo.svg";
import SEARCH_ICON from "../../public/search.svg"
import ADD_ICON from "../../public/add.svg";
import SETTING_ICON from "../../public/setting.svg";
import SettingArea from "@/components/settingArea";
import AddComponent from "./addComponent";
import { AddressData } from "@/api/types";
import SearchComponent from "./searchComponent";

interface SideMenuProps {
  onListClick: (item: AddressData) => void;
  activeMenu : string | null;
  setActiveMenu : (menu : string | null) => void;
  isData: AddressData[];
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
  return (
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

      {/* 추가 컴포넌트 */}
      {activeMenu === 'add' && (
        <div className={styles.add}>
          <AddComponent />
        </div>
      )}

      {/* 설정 컴포넌트 */}
      {activeMenu === 'setting' && <SettingArea />}
    </div>
  );
};

export default SideMenu;