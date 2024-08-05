// VerificationList.tsx
import React, { useEffect, useState } from 'react';
import { AddressData } from "@/api/types";
import { listData } from '../api/api';
import styles from "../../styles/verificationList.module.css";

type VerificationListProps = {
    onClose: () => void;
};

const VerificationList: React.FC<VerificationListProps> = ({ onClose }) => {
    const [data, setData] = useState<AddressData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 데이터를 가져와서 상태를 설정
        const fetchData = async () => {
            try {
                const result = await listData();
                setData(result);
            } catch (err) {
                setError('데이터를 가져오는 중 오류가 발생했습니다.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p>로딩 중...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className={styles.verificationList}>
            <button onClick={onClose}>닫기</button>
            <ul>
                {data.map((item) => (
                    <li key={item.address_idx}>
                        <strong><span className={styles.mainColor}>{item.address_name}</span><br/>
                                {item.address_name}
                        </strong>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VerificationList;
