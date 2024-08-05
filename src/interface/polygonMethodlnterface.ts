import React, {
    Dispatch
} from "react";

export interface handleClickProps {
    _map : kakao.maps.Map
    isDrawing : boolean,
    setIsDrawing : Dispatch<React.SetStateAction<boolean>>
    setPaths : Dispatch<React.SetStateAction<Path[]>>
    mouseEvent : kakao.maps.event.MouseEvent
}

export interface Path {
    lat : number;
    lng : number;
}