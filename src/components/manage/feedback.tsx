import { deatils } from "./feedbackContent"
import FeedbackDetail from "./feedbackDetail"

interface FeedbackProps {
    className1? : string,
    className2? : string,
    index : number,
    createAt : string,
    title : string,
    feedback_id : number
    showFeedbackDetail : (feedback_id : number) => void,

    details : deatils,
    closeFeedbackDetail : () => void,
    showDetail : boolean
}

export default function Feedback({
    className1,
    className2,
    index, 
    createAt, 
    title, 
    feedback_id, 
    showFeedbackDetail,
    details,
    closeFeedbackDetail,
    showDetail
} : FeedbackProps) {
    return (
        <>
            <div 
                key={feedback_id} 
                onClick={() => showFeedbackDetail(feedback_id)}
                className={className1}
            >
                <div>
                    {index + 1}
                </div>
                <div>
                    {title}
                </div>
                <div>
                    {createAt.substring(0, 10)} 
                </div>
            </div>
            {
                showDetail == true && feedback_id == details.id ? 
                <div className={showDetail ? className2 : undefined}>
                    <FeedbackDetail
                        feedback_id={details.id}
                        title={details.title}
                        content={details.content}
                        createAt={details.createAt}
                        closeFeedbackDetail={closeFeedbackDetail}
                    />
                </div> : null
            }
        </>
    )

}