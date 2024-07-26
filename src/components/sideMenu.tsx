import React, { useEffect, useState } from "react";
import styles from "../../styles/sidebar.module.css";
import LOGO_ICON from "../../public/logo.svg";
import LIST_ICON from "../../public/list.svg";
import ADD_ICON from "../../public/add.svg";
import NON_SMOKING_ICON from "../../public/nonSmok.svg";
import SMOKING_ICON from "../../public/smok.svg";
import SETTING_ICON from "../../public/setting.svg";
import { AddressData, fetchTestData } from "./testData";
import SettingArea from "@/components/settingArea";
import AddComponent from "./addComponent";

interface SideMenuProps {
  onListClick: (item: AddressData) => void;
}

const SideMenu = ({ onListClick }: SideMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isNonSmoking, setIsNonSmoking] = useState(false);
  const [isSmoking, setIsSmoking] = useState(false);
  const [testData, setTestData] = useState<AddressData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchTestData();
        setTestData(data);
      } catch (err) {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    console.log("testData updated:", testData);
    console.log("testData length:", testData.length);
  }, [testData]);

  const listClick = (item: AddressData) => {
    onListClick(item);
  };

  const listToggle = () => {
    setIsListOpen(!isListOpen);
    setIsOpen(!isOpen);
    setIsAddOpen(false);
    setIsSettingOpen(false);
  };

  const addToggle = () => {
    setIsListOpen(false);
    setIsOpen(!isOpen);
    setIsAddOpen(!isAddOpen);
    setIsSettingOpen(false);
  };

  const settingToggle = () => {
    setIsListOpen(false);
    setIsOpen(!isOpen);
    setIsAddOpen(false);
    setIsSettingOpen(!isSettingOpen);
  };

  const nonSmokingToggle = () => {
    setIsNonSmoking(!isNonSmoking);
  };

  const smokingToggle = () => {
    setIsSmoking(!isSmoking);
  };

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
          ) : testData.length > 0 ? (
            testData.map((item) => (
              <div key={item.address_idx} className={styles.listdata} onClick={() => listClick(item)}>
                <p>{item.address_idx}</p>
                <p>{item.address_name}</p>
                {item.smoking === "금연" ? <NON_SMOKING_ICON /> : <SMOKING_ICON />}
              </div>
            ))
          ) : (
            null
          )}
        </div>
      )}
      {/* 추가 View */}
      {isAddOpen && (
        <div className={styles.add} style={{ overflow: "hidden" }}>
          <AddComponent />
        </div>
      )}
      {isSettingOpen && <SettingArea />} {/* SettingArea 컴포넌트 렌더링 */}
    </div>
  );
};

export default SideMenu;