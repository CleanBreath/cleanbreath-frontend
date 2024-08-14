
interface FeedbackDetailProps {
    className?: string;
    feedback_id : number,
    title : string,
    content : string,
    createAt : string,
    closeFeedbackDetail : () => void
}

export default function FeedbackDetail({feedback_id, title, content, createAt, closeFeedbackDetail, className} : FeedbackDetailProps) {
    return (
        <>
            <div key={feedback_id}>
                <div>
                    <div>
                        <h3>문의내용</h3>
                    </div>
                    <div>
                        {content}
                    </div>
                    <button onClick={closeFeedbackDetail}>닫기</button>
                </div>
            </div>    
        </>
    )
}