import axios from "axios";
import { useEffect, useState } from "react"
import TableRow from "./TableRowProps";
import styles from "../../../styles/manageCss/smokingAreaContent.module.css";


const NOTICE_API_URL_DEV = "http://localhost:7001/v1/findAllNotice";

export default function NoticeContent() {
    const [noticeList, setNoticeList] = useState<any[]>([]);
    const [selected, setSelected] = useState<number[]>();
    const handleCheckChange = (id : number) => {
        setSelected((prev) => 
            prev?.includes(id) ? prev.filter((item) => item !== id) : [...(prev || []), id]
        )
    }

    useEffect(() => {
        async function getNoticeList() {
            const response = await axios.get(NOTICE_API_URL_DEV, { withCredentials: true });
            if (response.status !== 200) {
                return new Error("API Error");
            }
            setNoticeList(response.data.content);
        }
        getNoticeList();
    }, [noticeList]);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.title}>
                    <h1>공지사항</h1>
                </div>
                <div className={styles.contentContainer}>
                    <div className={styles.addNoticeBtn}>
                        <button>
                            새 글 작성
                        </button>
                    </div>
                    <table>
                        <thead className={styles.tableColumn}>
                            <tr>
                                <th>선택</th>
                                <th>번호</th>
                                <th>제목</th>
                                <th>게시 날짜</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tableRow}>
                            {
                                Array.isArray(noticeList) && noticeList.map((notice, index: number) => (
                                    <TableRow
                                        key={notice.id}
                                        id={notice.id}
                                        index={index}
                                        title={notice.title}
                                        date={notice.updateAt}
                                        checked={selected?.includes(notice.id) || false}
                                        onCkeckChange={handleCheckChange}
                                    />
                                ))
                            }
                        </tbody>
                    </table>
                    <div className={styles.deleteNoticeBtn}>
                        <button>
                            삭제
                        </button>
                        {selected?.length}개 선택됨
                    </div>
                </div>
            </div>
        </>
    )
}