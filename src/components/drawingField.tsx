'use client';
import {
    Dispatch,
    SetStateAction,
    useEffect,
    useState
} from "react";
import {
    CustomOverlayMap,
    Polygon,
} from "react-kakao-maps-sdk";
import {
    handleClickProps,
    Path
} from "@/interface/polygonMethodlnterface";

// DrawingField의 프로퍼티 정의
interface DrawingFieldProps {
    isDrawing: boolean;
    polygon: kakao.maps.Polygon | undefined;
    setPolygon: Dispatch<SetStateAction<kakao.maps.Polygon | undefined>>;
    paths: Path[];
    mousePosition: { lat: number, lng: number };
    onDrawEnd?: (polygon: kakao.maps.Polygon) => void; // 선택적 프로퍼티
    map: kakao.maps.Map; // 필수 프로퍼티
}

// DrawingField 컴포넌트
export default function DrawingField({
    isDrawing,
    polygon,
    setPolygon,
    paths,
    mousePosition,
    onDrawEnd,
    map
}: DrawingFieldProps) {
    // Polygon이 생성되었을 때 호출되는 함수
    const handlePolygonCreate = (polygon: kakao.maps.Polygon) => {
        setPolygon(polygon);
        // onDrawEnd 콜백이 정의되어 있는 경우 호출
        if (onDrawEnd) {
            onDrawEnd(polygon);
        }
    };

    return (
        <>
            <Polygon
                path={isDrawing ? [...paths, mousePosition] : paths}
                strokeWeight={3}
                strokeColor={"#00a0e9"}
                strokeOpacity={0.8}
                strokeStyle={"solid"}
                fillColor={"#00a0e9"}
                fillOpacity={0.2}
                onCreate={handlePolygonCreate} // 수정된 콜백 함수
            />
        </>
    );
}
