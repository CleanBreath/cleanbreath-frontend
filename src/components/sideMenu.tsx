import React from "react";
import styles from "../../styles/sidebar.module.css";
import LOGO_ICON from "../../public/logo.svg";
import SEARCH_ICON from "../../public/search.svg";
import ADD_ICON from "../../public/add.svg";
import SETTING_ICON from "../../public/setting.svg";
import SettingArea from "@/components/settingArea";
import AddComponent from "./addComponent";
import { AddressData } from "./listData";
import SearchComponent from "./searchComponent";

interface SideMenuProps {
  onListClick: (item: AddressData) => void;
  isOpen: boolean;
  isListOpen: boolean;
  isAddOpen: boolean;
  isSettingOpen: boolean;
  isData: AddressData[];
  isLoading: boolean;
  error: string | null;
  listToggle: () => void;
  addToggle: () => void;
  settingToggle: () => void;
}

const SideMenu = ({
  onListClick,
  isOpen,
  isListOpen,
  isAddOpen,
  isSettingOpen,
  isData,
  isLoading,
  error,
  listToggle,
  addToggle,
  settingToggle
}: SideMenuProps) => {
  return (
    <div className={isOpen ? styles.sidebarOpen : styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <a href="#">
          <LOGO_ICON />
        </a>
        {isOpen ? <p>CleanBreath</p> : null}
      </div>
      <div className={styles.menu}>
        <div className={isListOpen ? styles.listIconOpen : styles.listIcon} onClick={listToggle}>
          <SEARCH_ICON />
        </div>
        <div className={isAddOpen ? styles.addIconOpen : styles.addIcon} onClick={addToggle}>
          <ADD_ICON />
        </div>
        <div className={isSettingOpen ? styles.settingIconOpen : styles.settingIcon} onClick={settingToggle}>
          <SETTING_ICON />
        </div>
      </div>
      
      {/* 리스트 View */}
      {isListOpen && <SearchComponent onListClick={onListClick} isData={isData} isLoading={isLoading} error={error} />}

      {/* 추가 컴포넌트 */}
      {isAddOpen && <div className={styles.add}><AddComponent /></div>}

      {/* 설정 컴포넌트 */}
      {isSettingOpen && <SettingArea />}
    </div>
  );
};

export default SideMenu;
