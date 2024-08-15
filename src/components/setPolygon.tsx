import { AddressData, ApartmentData } from '../api/types';
import { Polygon } from 'react-kakao-maps-sdk';
import { useState, useEffect } from 'react';

interface PolygonProps {
    isData: AddressData[];
    isApartmentsData: ApartmentData[];
    isSmoking: boolean;
    isNonSmoking: boolean; 
    isOverlayClicked: boolean;
    handlePolygonClick: (lat: number, lng: number) => void;
    handleOverlayClick: () => void;
    setPolygonState: (state: string) => void;
    setStatute: (statute: string | null) => void;
}

export default function SetPolygon({
    isData,
    isApartmentsData,
    isSmoking,
    isNonSmoking,
    isOverlayClicked,
    handlePolygonClick,
    handleOverlayClick,
    setPolygonState,
    setStatute
}: PolygonProps) {
    const [apartStrokeStyle, setApartStrokeStyle] = useState<'shortdash' | 'dash'>('shortdash');
    const [hoveredPolygon, setHoveredPolygon] = useState<number | null>(null);
    const [apartHoveredPolygon, setApartHoveredPolygon] = useState<number | null>(null);
    const [apartClickedPolygon, setApartClickedPolygon] = useState<number | null>(null);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | undefined;

        if(!isOverlayClicked) {
          setApartClickedPolygon(null);
        }

        if (isOverlayClicked || apartClickedPolygon !== null || apartHoveredPolygon !== null) {
            intervalId = setInterval(() => {
                setApartStrokeStyle(prevStyle => (prevStyle === 'shortdash' ? 'dash' : 'shortdash'));
            }, 200);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isOverlayClicked, apartHoveredPolygon, apartClickedPolygon]);

    const parsePathCoordinates = (path: { pathsLat?: string[], pathsLng?: string[], pathsLatitude?: string[], pathsLongitude?: string[] }) => {
        let latitudes: number[];
        let longitudes: number[];

        if (path.pathsLat && path.pathsLng) {
            latitudes = path.pathsLat.map(lat => parseFloat(lat.trim()));
            longitudes = path.pathsLng.map(lng => parseFloat(lng.trim()));
        } else if (path.pathsLatitude && path.pathsLongitude) {
            latitudes = path.pathsLatitude.map(lat => parseFloat(lat.trim()));
            longitudes = path.pathsLongitude.map(lng => parseFloat(lng.trim()));
        } else {
            return [];
        }

        return latitudes.map((lat, i) => ({
            lat,
            lng: longitudes[i]
        }));
    };

    return (
        <>
            {isData.flatMap((item, index) =>
                item.paths
                    .filter(path =>
                        (isNonSmoking && path.divisionArea === 'NON_SMOKING_ZONE') ||
                        (isSmoking && path.divisionArea.startsWith('SMOKING_ZONE'))
                    )
                    .map((path, pathIndex) => {
                        const isSmokingZone = path.divisionArea.startsWith('SMOKING_ZONE');
                        const pathCoordinates = parsePathCoordinates(path);

                        if (item.address_category.includes('병설유치원')) {
                            return null;
                        }

                        const setSpecialCategoryColor = (addressCategory: string) => {
                            const specialCategories = [
                                '유치원', '초등학교', '중학교', '고등학교'
                            ];
                            
                            if (specialCategories.some(cat => addressCategory.includes(cat))) {
                                return hoveredPolygon === index ? '#E8005D' : '#E83600';
                            }
                            
                            return null;
                        };

                        const fillColor = isSmokingZone 
                            ? (hoveredPolygon === index ? '#A0FF9F' : '#7CFF89') 
                            : (hoveredPolygon === index 
                                ? (setSpecialCategoryColor(item.address_category) || '#FFE259') 
                                : (setSpecialCategoryColor(item.address_category) || '#FFBA5A'));
                        const fillOpacity = hoveredPolygon === index ? 0.9 : 0.7;
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
                                    strokeStyle={'solid'}
                                    fillColor={fillColor}
                                    fillOpacity={fillOpacity}
                                    zIndex={1}
                                    onClick={() => {
                                        handlePolygonClick(item.address_latitude, item.address_longitude);
                                        handleOverlayClick();
                                        setPolygonState("address");
                                        setApartClickedPolygon(null);
                                        setStatute(null);
                                    }}
                                    onMouseover={() => setHoveredPolygon(index)}
                                    onMouseout={() => setHoveredPolygon(null)}
                                />
                            </div>
                        );
                    })
            )}

            {isNonSmoking &&
            isApartmentsData.flatMap((apartment, index) =>
                apartment.path
                    .map((path, pathIndex) => {
                    const pathCoordinates = parsePathCoordinates(path);

                    const strokeWeight = apartHoveredPolygon === index || apartClickedPolygon === index ? 3 : 0;
                  
                    return (
                        <div
                            key={`apartment-${index}-${pathIndex}`}
                        >
                            <Polygon
                                path={pathCoordinates}
                                strokeWeight={strokeWeight}
                                strokeColor="#000000"
                                strokeOpacity={0.7}
                                strokeStyle={apartStrokeStyle}
                                fillColor="#007E8F"
                                fillOpacity={0.7}
                                zIndex={1}
                                onClick={() => {
                                    handlePolygonClick(path.latitude, path.longitude);
                                    handleOverlayClick();
                                    setPolygonState("apartment");
                                    setApartClickedPolygon(index);
                                    setStatute(null);
                                }}
                                onMouseover={() => setApartHoveredPolygon(index)}
                                onMouseout={() => setApartHoveredPolygon(null)}
                            />
                        </div>
                    );
                })
            )}
        </>
    );
}
