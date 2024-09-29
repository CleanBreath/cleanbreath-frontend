import React, { useState, useMemo, useEffect } from "react";
import { AddressData, ApartmentData } from "../api/types";
import NON_SMOKING_ICON from "../../public/nonSmok.svg";
import SMOKING_ICON from "../../public/smok.svg";
import CLOSE_ICON from "../../public/close.svg";
import styles from "../../styles/search.module.css";
import LOGO_ICON from "../../public/logo.svg";

interface searchProps {
    onListClick: (item: AddressData) => void;
    isData: AddressData[];
    isApartmentsData: ApartmentData[];
    isLoading: boolean;
    error: string | null;
    setActiveMenu: (menu: string | null) => void;
}

const useSize = () => {
    const [size, setSize] = useState<number | null>(null);

    useEffect(() => {
        const updateSize = () => {
            setSize(window.innerWidth);
        };
        updateSize();

        window.addEventListener("resize", updateSize);

        return () => window.removeEventListener("resize", updateSize);
    }, []);
    return size;
}


export default function SearchComponent({ onListClick, isData, isApartmentsData, isLoading, error, setActiveMenu }: searchProps) {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const size = useSize();

    const filteredData = useMemo(() => {
        if (searchTerm.trim() === "") {
            return isData;
        }

        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return isData.filter(item =>
            item.address_buildingName.toLowerCase().includes(lowerCaseSearchTerm) ||
            item.address_name.toLowerCase().includes(lowerCaseSearchTerm) ||
            item.smoking.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [searchTerm, isData]);

    const handleListItemClick = (item: AddressData) => {
        onListClick(item);
    };

    return (
        <div>
            <button className={styles.closeButton} onClick={() => setActiveMenu(null)}>&times;</button>

            {/* 모바일에서만 보이는 헤더 */}
            <div className={styles.modalHeader}>
                <LOGO_ICON className={styles.logoIcon} />
                <h1 className={styles.cleanBreath}>CleanBreath</h1>
            </div>

            <div className={styles.searchContainer}>
                <div className={styles.searchArea}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="주소 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.close}>
                    <CLOSE_ICON onClick={() => setActiveMenu(null)} />
                </div>
            </div>
            <div className={styles.list}>
                {
                    searchTerm.trim() !== "" ? (
                        isLoading ? (
                            <p>불러오는중...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <div key={item.address_idx} className={styles.listdata}
                                     onClick={() => {handleListItemClick(item); (size !== null && size <= 768) ? setActiveMenu(null) : null; }}>
                                    <p>{item.address_idx}</p>
                                    <p>{item.address_buildingName}</p>
                                    {item.smoking === "금연구역" ? <NON_SMOKING_ICON /> : <SMOKING_ICON />}
                                </div>
                            ))
                        ) : (
                            <p style={{ margin: '10px 0 0 10px' }}>리스트가 비어 있습니다.</p>
                        )
                    ) : (
                        <p style={{ margin: '10px 0 0 10px' }}>검색어를 입력해주세요.</p>
                    )
                }
            </div>
        </div>
    );
}
