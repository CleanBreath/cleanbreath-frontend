import { AddressData } from '../api/types';
import { Polygon } from 'react-kakao-maps-sdk';
import { useState, useEffect } from 'react';

interface PolaygonProps {
    isData: AddressData[];
    isSmoking: boolean;
    isNonSmoking: boolean; 
    isOverlayClicked: boolean;
    handlePolygonClick: (lat: number, lng: number) => void;
    handleOverlayClick: () => void;
}

export default function SetPolygon({isData, isNonSmoking, isSmoking, isOverlayClicked, handlePolygonClick, handleOverlayClick}: PolaygonProps) {
    const [apartstrokeStyle, setApartStrokeStyle] = useState<'shortdash' | 'dash'>('shortdash');
    const [hoveredPolygon, setHoveredPolygon] = useState<number | null>(null);

    useEffect(() => {
      let intervalId: NodeJS.Timeout | undefined;
  
      if (isOverlayClicked) {
        intervalId = setInterval(() => {
          setApartStrokeStyle((prevStyle) => (prevStyle === 'shortdash' ? 'dash' : 'shortdash'));
        }, 200);
      } else {
        clearInterval(intervalId);
        setApartStrokeStyle('shortdash');
      }
  
      return () => {
        clearInterval(intervalId);
      };
    }, [isOverlayClicked]);

    return (
        <>
          {isData
            .flatMap((item, index) =>
              item.paths
                .filter(path => (isNonSmoking && path.divisionArea === 'NON_SMOKING_ZONE') || 
                                (isSmoking && path.divisionArea.startsWith('SMOKING_ZONE')))
                .map((path, pathIndex) => {
                  const isSmokingZone = path.divisionArea.startsWith('SMOKING_ZONE');
                  const parsePathCoordinates = (path: { pathsLatitude: string[], pathsLongitude: string[] }) => {
                    const latitudes = path.pathsLatitude.map(lat => parseFloat(lat.trim()));
                    const longitudes = path.pathsLongitude.map(lng => parseFloat(lng.trim()));
            
                    return latitudes.map((lat, i) => ({
                        lat,
                        lng: longitudes[i]
                    }));
                };
                  const pathCoordinates = parsePathCoordinates(path);
                  const setSpecialCategoryColor = (addressCategory: string) => {
                    const specialCategories = [
                      '유치원', '초등학교', '중학교', '고등학교'
                    ];
                    
                    if (specialCategories.some(cat => addressCategory.includes(cat))) {
                      return hoveredPolygon === index ? '#E8005D' : '#E83600';
                    }
                    
                    return null;
                  };
                                      
                  const fillColor = isSmokingZone ? (hoveredPolygon === index ? '#A0FF9F' : '#7CFF89') : 
                  (hoveredPolygon === index ? (setSpecialCategoryColor(item.address_category) || '#FFE259' ) 
                                              : (setSpecialCategoryColor(item.address_category) || '#FFBA5A'));
                  const fillOpacity = hoveredPolygon === index ? 0.9 : 0.7;
                  const strokeStyle = hoveredPolygon === index ? 'solid' : apartstrokeStyle;
                  const strokeWeight = hoveredPolygon === index ? 5 : 0;
      
                  return (
                    <div
                      key={`${isSmokingZone ? 'smoking' : 'nonSmoking'}-${index}-${pathIndex}`}
                    >
                      <Polygon
                        path={pathCoordinates}
                        strokeWeight={strokeWeight}
                        strokeColor="#000000"
                        strokeOpacity={0.2}
                        strokeStyle={strokeStyle}
                        fillColor={fillColor}
                        fillOpacity={fillOpacity}
                        zIndex={1}
                        onClick={() => {handlePolygonClick(item.address_latitude, item.address_longitude); handleOverlayClick();}}
                        onMouseover={() => setHoveredPolygon(index)}
                        onMouseout={() => setHoveredPolygon(null)}
                      />
                    </div>
                  );
                })
            )}
        </>
    );
}