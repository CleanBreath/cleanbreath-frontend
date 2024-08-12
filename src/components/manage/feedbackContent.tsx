import { useEffect, useState } from "react";
import styles from "../../../styles/manageCss/feedbackContent.module.css";
import axios from "axios";
import Feedback from "./feedback";

export interface deatils {
    content : string,
    createAt : string,
    id : number,
    title : string,
}



export async function getAPI(url : string) {
    const FEEDBACK_API_URL = "https://server.bluesky-cleanbreath.com/v1";
    const response = await axios.get(`${FEEDBACK_API_URL}/${url}`);
    if (response.status !== 200) {
        return new Error("API Error");
    }
    return response.data;
}


export default function FeedbackContent() {
    const [feedback, setFeedback] = useState([]);
    const [details, setDetails] = useState<deatils>({content : "", createAt : "", id : 0, title : ""});
    const [showDetail, setShowDetail] = useState(false);

    const showFeedbackDetail = async (feedback_id : number) => {
        const data = await getAPI(`feedback/${feedback_id}`);
        setDetails(data);
        setShowDetail(true);
    }
    const closeFeedbackDetail = () => {
        setShowDetail(false);
    }

    useEffect(() => {
        async function axiosApi() {
            const data = await getAPI("feedback-list");
            setFeedback(data);
        }
        axiosApi();
    }, [feedback]);

    return (
        <div className={styles.container}>
            <div className={styles.feedback}>
                <h1>피드백 현황</h1>
            </div>
            <div className={styles.title}>
                <div>
                    번호
                </div>
                <div>
                    제목
                </div>
                <div>
                    등록일
                </div>
            </div>
            <div className={styles.elements}>
                {
                    feedback && feedback.map((data : any, index) => {
                        return (
                        <Feedback
                            className1={styles.list} 
                            className2={styles.details}
                            key={data.feedback_id} 
                            index={index}
                            createAt={data.createAt} 
                            title={data.title} 
                            feedback_id={data.feedback_id} 
                            showFeedbackDetail={showFeedbackDetail}
                            details={details}
                            closeFeedbackDetail={closeFeedbackDetail}
                            showDetail={showDetail}
                        />)
                    })
                }
            </div>
        </div>
    )
}