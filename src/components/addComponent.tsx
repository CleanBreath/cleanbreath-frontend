import React from "react";

export default function AddComponent() {
return (
    <div>
        <h1>
            <span style={{color: "red"}}>흡연구역</span>{' '}
            <span style={{color: "black"}}>추가하기</span>
        </h1>
        <div>
            <div>
                <p>{'장소(주소)'}</p>
                <button onClick={() => {}}>장소지정</button>
            </div>
            <input type="text" className="input-text"/>
        </div>
        <div>
            <div>
                <p>{'상세주소'}</p>
                <button onClick={() => {}}>영역지정</button>
            </div>
            <input type="text"/>
        </div>
        <div>
            <p>흡연구역 구분</p>
            <input type="checkbox" style={{}}/>
        </div>
    </div>
);
}