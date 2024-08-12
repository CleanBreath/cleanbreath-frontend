import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/noticeList.module.css";
import NoticeModal from "@/components/noticeModal";

const POST_API_URL = "https://server.bluesky-cleanbreath.com/v1/findAllNotice";

type Notice = {
    id: number;
    title: string;
    content: string;
    updateAt: string;
};

export default function NoticeList() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.get(POST_API_URL);
                setNotices(response.data.content);
                setIsLoading(false);
            } catch (error) {
                setError("공지사항을 불러오는 중 오류가 발생했습니다.");
                setIsLoading(false);
            }
        };

        fetchNotices();
    }, []);

    // 제목으로 필터링
    const filteredNotices = notices.filter(notice =>
        notice.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNoticeClick = (notice: Notice) => {
        setSelectedNotice(notice);
    };

    const handleCloseModal = () => {
        setSelectedNotice(null);
    };

    return (
        <div>
            <div className={styles.searchContainer}>
                <div className={styles.searchArea}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="공지사항 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className={styles.list}>
                {isLoading ? (
                    <p>불러오는 중...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : filteredNotices.length > 0 ? (
                    filteredNotices.map((notice) => (
                        <div key={notice.id} className={styles.listdata} onClick={() => handleNoticeClick(notice)}>
                            <p>{notice.id}</p>
                            <p><span className={styles.highlightGreen}>{notice.title}<br/></span></p>
                            <p>{new Date(notice.updateAt).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    <p style={{ margin: '10px 0 0 10px' }}>공지사항이 없습니다.</p>
                )}
            </div>

            {selectedNotice && (
                <NoticeModal
                    title={selectedNotice.title}
                    content={selectedNotice.content}
                    updateAt={selectedNotice.updateAt}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}