import React, { useState, useMemo } from "react";
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
  // 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 검색어에 따라 필터링된 데이터
  const filteredData = useMemo(() => {
    if (searchTerm.trim() === "") {
      return isData;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return isData.filter(item =>
      item.address_name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [searchTerm, isData]);

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
        <div className={isSettingOpen ? styles.settingIconOpen : styles.settingIcon} onClick={settingToggle}>
          <SETTING_ICON />
        </div>
      </div>
      {/* 검색창 추가 
      {isListOpen && (
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="주소 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      */}
      
      {/* 리스트 View */}
      {isListOpen && (
        <div className={styles.list}>
          {isLoading ? (
            <p>데이터 로딩 중...</p>
          ) : error ? (
            <p>{error}</p>
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => (
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
