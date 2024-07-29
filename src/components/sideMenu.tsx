import React from "react";
import styles from "../../styles/sidebar.module.css";
import LOGO_ICON from "../../public/logo.svg";
import LIST_ICON from "../../public/list.svg";
import ADD_ICON from "../../public/add.svg";
import NON_SMOKING_ICON from "../../public/nonSmok.svg";
import SMOKING_ICON from "../../public/smok.svg";
import SETTING_ICON from "../../public/setting.svg";
import { AddressData } from "./listData";
import SettingArea from "@/components/settingArea";
import AddComponent from "./addComponent";

interface SideMenuProps {
  onListClick: (item: AddressData) => void;
  isOpen: boolean;
  isListOpen: boolean;
  isAddOpen: boolean;
  isSettingOpen: boolean;
  isNonSmoking: boolean;
  isSmoking: boolean;
  isData: AddressData[];
  isLoading: boolean;
  error: string | null;
  listToggle: () => void;
  addToggle: () => void;
  settingToggle: () => void;
  nonSmokingToggle: () => void;
  smokingToggle: () => void;
}

const SideMenu = ({
  onListClick,
  isOpen,
  isListOpen,
  isAddOpen,
  isSettingOpen,
  isNonSmoking,
  isSmoking,
  isData,
  isLoading,
  error,
  listToggle,
  addToggle,
  settingToggle,
  nonSmokingToggle,
  smokingToggle
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
          <LIST_ICON />
        </div>
        <div className={isAddOpen ? styles.addIconOpen : styles.addIcon} onClick={addToggle}>
          <ADD_ICON />
        </div>
        <div className={isNonSmoking ? styles.nonSmokingIconOpen : styles.nonSmokingIcon} onClick={nonSmokingToggle}>
          <NON_SMOKING_ICON />
        </div>
        <div className={isSmoking ? styles.smokingIconOpen : styles.smokingIcon} onClick={smokingToggle}>
          <SMOKING_ICON />
        </div>
        <div className={isSettingOpen ? styles.settingIconOpen : styles.settingIcon} onClick={settingToggle}>
          <SETTING_ICON />
        </div>
      </div>
      {/* 리스트 View */}
      {isListOpen && (
        <div className={styles.list}>
          {isLoading ? (
            <p>데이터 로딩 중...</p>
          ) : error ? (
            <p>{error}</p>
          ) : isData.length > 0 ? (
            isData.map((item) => (
              <div key={item.address_idx} className={styles.listdata} onClick={() => onListClick(item)}>
                <p>{item.address_idx}</p>
                <p>{item.address_name}</p>
                {item.smoking === "금연" ? <NON_SMOKING_ICON /> : <SMOKING_ICON />}
              </div>
            ))
          ) : (
            <p>리스트가 비어 있습니다.</p>
          )}
        </div>
      )}
      {/* 추가 컴포넌트 */}
      {isAddOpen && <div className={styles.add}><AddComponent /></div>}
      {/* 설정 컴포넌트 */}
      {isSettingOpen && <SettingArea />}
    </div>
  );
};

export default SideMenu;
