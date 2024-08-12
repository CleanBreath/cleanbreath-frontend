import { useState } from "react";

interface NoticeDetailProps {
    className?: string;
    id: number;
    title: string;
    date: string;
    content: string;
    closeDetail: () => void;
}


export default function NoticeDetail({className, id, title, date, content, closeDetail}: NoticeDetailProps) {

    const [update, setUpdate] = useState<boolean>(false);
    const [updateTitle, setUpdateTitle] = useState<string>();
    const [updateContent, setUpdateContent] = useState<string>();

    const updateDetail = (status : string) => {
        setUpdate(status === 'update' ? true : false);
    }

    const handleUpdateTitle = (e : React.ChangeEvent<HTMLInputElement>) => {
        if (update) {
            setUpdateTitle(e.target.value);
        }
    }
    const handleUpdateContent = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        if (update) {
            setUpdateContent(e.target.value);
        }
    }

    console.log(update);

    return (
        <>
            <div key={id} className={className}>
                <div>
                    <div onClick={closeDetail}>
                        <button>닫기</button>
                    </div>
                    {
                        !update ? (
                            <div onClick={() => updateDetail('update')}>
                                <button>수정</button>
                            </div>
                        ) : (
                            <div onClick={() => updateDetail('updateCancel')}>
                                <button>취소</button>
                            </div>
                        )
                    }
                </div>
                <div>
                    <div>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => handleUpdateTitle(e)}
                        />
                    </div>
                    <div>
                        <p>{date.substring(0, 10)}</p>
                    </div>
                </div>
                <div>
                    <textarea 
                        value={content}
                        onChange={(e) => handleUpdateContent(e)}
                    />
                </div>
            </div>
        </>
    )
}