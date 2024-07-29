import React, { useState, useEffect } from 'react';

interface CurrentLocationProps {
  setUserLocation: (location: { lat: number; lng: number }) => void;
}

export default function CurrentLocation({ setUserLocation }: CurrentLocationProps) {
  const [errMsg, setErrMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLocation);
          setIsLoading(false);
        },
        (err) => {
          setErrMsg(err.message);
          setIsLoading(false);
        }
      );
    } else {
      setErrMsg('geolocation을 사용할 수 없습니다.');
      setIsLoading(false);
    }
  }, [setUserLocation]);

  return (
    <div>
      {!isLoading && errMsg && (
        <div style={{ padding: '10px', color: 'red' }}>
          {errMsg}
        </div>
      )}
    </div>
  );
}
