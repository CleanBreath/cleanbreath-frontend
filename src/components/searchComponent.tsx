import React, { useState, useMemo } from "react";
import { AddressData } from "./listData";
import NON_SMOKING_ICON from "../../public/nonSmok.svg";
import SMOKING_ICON from "../../public/smok.svg";
import styles from "../../styles/search.module.css";

interface searchProps {
    onListClick: (item: AddressData) => void;
    isData: AddressData[];
    isLoading: boolean;
    error: string | null;
}

export default function searchComponent({ onListClick, isData, isLoading, error }: searchProps) {
    const [searchTerm, setSearchTerm] = useState<string>("");

    const filteredData = useMemo(() => {
        if (searchTerm.trim() === "") {
        return isData;
        }

        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return isData.filter(item =>
        item.adress_detail.toLowerCase().includes(lowerCaseSearchTerm) || item.address_name.toLowerCase().includes(lowerCaseSearchTerm)
        || item.smoking.toLowerCase().includes(lowerCaseSearchTerm)
        );

    }, [searchTerm, isData]);

    return (
        <div>
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
                        <div key={item.address_idx} className={styles.listdata} onClick={() => onListClick(item)}>
                        <p>{item.address_idx}</p>
                        <p>{item.address_name}</p>
                        {item.smoking === "금연" ? <NON_SMOKING_ICON /> : <SMOKING_ICON />}
                        </div>
                    ))
                    ) : (
                    <p style={{margin: '10px 0 0 10px'}}>리스트가 비어 있습니다.</p>
                    )
                ) : (
                    <p style={{margin: '10px 0 0 10px'}}>검색어를 입력해주세요.</p>
                )
                }

            </div>
        </div>
    );
}