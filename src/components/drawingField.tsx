import { Polygon } from "react-kakao-maps-sdk";

interface DrawingFieldProps {
    activeFunc: string | null;
    setPolygon: (polygon: kakao.maps.Polygon | undefined) => void;
    path: { lat: number, lng: number }[];
    mousePosition: { lat: number, lng: number };
}

export default function DrawingField({activeFunc, setPolygon, path, mousePosition}: DrawingFieldProps) {
    return (
      <>
        <Polygon
          path={
            activeFunc === "drawPolygonStart" ? [...path, mousePosition] : path
          }
          strokeWeight={3}
          strokeColor={"#148F00"}
          strokeOpacity={0.8}
          strokeStyle={"solid"}
          fillColor={"#7CFF89"}
          fillOpacity={0.2}
          onCreate={setPolygon}
        />
      </>
    );
}