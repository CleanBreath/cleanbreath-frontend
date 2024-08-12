import React from 'react';
import CLOSE_ICON from "../../public/close.svg";
import statuteJson from "../json/statute.json";
import statuteCss from "../../styles/statute.module.css";

interface StatuteProps {
    statute: string | null;
    setStatute: (statute: string | null) => void;
}

interface StatuteJson {
    category: string;
    designated_no_smoking_areas: string[];
    content: string[];
}

const Statute = ({ statute, setStatute }: StatuteProps) => {
    let Info = false;

    return (
        <div className={statuteCss.container}>
            <div className={statuteCss.close} onClick={() => setStatute(null)}>
                <CLOSE_ICON />
            </div>
            {statute && (
                statuteJson
                    .filter((item: StatuteJson) => 
                        item.category.includes(statute) ||
                        statute.includes("주유소") ||
                        statute.includes("공원")
                    )
                    .map((item: StatuteJson) => (
                        <div key={item.category}>
                            {(statute.includes("주유소") || statute.includes("공원")) && !Info ? (
                                <>
                                    <p className={statuteCss.Info}>
                                        근거 : 안양시 금연환경 조성 및 간접흡연 피해방지 조례
                                    </p>
                                    {Info = true}
                                    <p className={statuteCss.link}>
                                        {statute.includes("주유소") ? (
                                            <a href="https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EC%84%9D%EC%9C%A0%EB%B0%8F%EC%84%9D%EC%9C%A0%EB%8C%80%EC%B2%B4%EC%97%B0%EB%A3%8C%EC%82%AC%EC%97%85%EB%B2%95">법령보기</a>
                                        ) : (statute.includes('공원') ? (
                                            <a href="https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EB%8F%84%EC%8B%9C%EA%B3%B5%EC%9B%90%EB%B0%8F%EB%85%B9%EC%A7%80%EB%93%B1%EC%97%90%EA%B4%80%ED%95%9C%EB%B2%95%EB%A5%A0">법령보기</a>
                                        ) : null
                                        )}
                                    </p>
                                </>
                            ) : (
                                !statute.includes("주유소") && !statute.includes("공원") && (
                                    <>
                                        <h2>금연 구역</h2>
                                        <ul>
                                            {item.designated_no_smoking_areas.map((area, index) => (
                                                <li key={index}>{area}</li>
                                            ))}
                                        </ul>
                                        <h3>내용</h3>
                                        <ul>
                                            {item.content.map((text, index) => (
                                                <li key={index}>{text}</li>
                                            ))}
                                        </ul>
                                    </>
                                )
                            )}
                        </div>
                    ))
            )}
        </div>
    );
}

export default Statute;
