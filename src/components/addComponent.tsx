import { Address } from "@/interface/AddressInterface";
import React, { useEffect, useState } from "react";
import styles from "../../styles/add.module.css";
import axios from "axios";
import dayjs from "dayjs";
import ClOSE_ICON from "../../public/close.svg";


interface AddComponentProps {
  setActiveMenu: (menu: string | null) => void;
  toggleAddFunc: (funcName: string | null) => void;
  addressData: Address[];
  position: { lat: number; lng: number };
  path: { lat: number; lng: number }[];
}

const API_URL = "https://server.bluesky-cleanbreath.com/v1/smokingArea/add";
const API_URL_DEV = "http://localhost:7001/v1/smokingArea/add";


export default function AddComponent({ setActiveMenu ,toggleAddFunc, addressData, position, path }: AddComponentProps) {
    const [category, setCategory] = useState<string>("");
    const [areaType, setAreaType] = useState<string>("");
    const [implicit, setImplicit] = useState<string | undefined>(undefined);
    const [buildingName, setBuildingName] = useState<string>("");

    const [address, setAddress] = useState<Address[]>([]);

    useEffect(() => {
        if(addressData) {
            setAddress(addressData);
        }
    }, [addressData])
    
    const submit = async() => {
        try {
            let requestData = {
              updateAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
              addressName:
                address[0].road_address?.address_name === undefined
                  ? address[0].address?.address_name
                  : address[0].road_address?.address_name,
              buildingName:
                addressData[0].road_address?.building_name === undefined
                  ? buildingName
                  : address[0].road_address?.building_name,
              latitude: position.lat,
              longitude: position.lng,
              category: category,
              paths: [
                {
                  divisionArea:
                    implicit === undefined ? areaType : areaType + implicit,
                  pathLat: path.map((item) => item.lat.toString()).join(","),
                  pathLng: path.map((item) => item.lng.toString()).join(","),
                },
              ],
            };


            if (valuidation()) {
              await axios.post(API_URL, requestData);
            }
          

            alert("제출 완료");
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("주소 지정해주세요")
        } 
    }


    const valuidation = () => {
      if (category.length <= 0) {
        alert("카테고리를 입력해주세요.");
      }
      if (areaType.length <= 0) {
        alert("흡연구역 구분을 선택해주세요.");
      }
      if (implicit === undefined) {
        alert("암묵적인 흡연구역 여부를 선택해주세요.");
      }
      if (buildingName.length <= 0) {
        alert("건물 이름을 입력해주세요.");
      }
      if (path.length <= 0) {
        alert("흡연구역 영역을 지정해주세요.");
      }
      return true;
    }

    return (
      <div className={styles.container}>
          <ClOSE_ICON className={styles.close} onClick={() => setActiveMenu(null)}/>
        <div className={styles.title}>
          <h1>
            <span style={{ color: "#027100" }}>흡연구역</span>&nbsp;
            <span style={{ color: "black" }}>추가요청</span>
          </h1>
        </div>
        <div className={styles.address}>
          <div>
            <h3>{"장소(주소)"}</h3>
            <button onClick={() => toggleAddFunc("getAddress")}>
              주소 지정
            </button>
          </div>
          <input
            type="text"
            value={
              address[0]?.road_address?.address_name === "" ?
                address[0]?.address?.address_name : address[0]?.road_address?.address_name
            } 
          />
        </div>
        <div className={styles.buildingName}>
          <div>
            <h3>{"건물 이름"}</h3>
          </div>
          <input
            type="text"
            value={
              address[0]?.road_address?.building_name === "" ?
                buildingName : address[0]?.road_address?.building_name
            }
            onChange={(e) => setBuildingName(e.target.value)}
          />
        </div>
        <div className={styles.category}>
          <div>
            <h3>{"카테고리"}</h3>
            <sub>예시 : 골목, 건물 뒷편 기타등등</sub>
          </div>
          <input type="text" onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div className={styles.setAreaPath}>
          <div>
            <h3>
              <span style={{ color: "#027100" }}>흡연구역</span>
              &nbsp; 영역지정
            </h3>
            <sub>영역 지정을 마치려면 더블클릭을 하세요.</sub>
          </div>
          <div>
            <button onClick={() => toggleAddFunc("drawPolygonStart")}>
              영역지정
            </button>
          </div>
        </div>
        <div className={styles.divisionArea}>
          <div>
            <h3>흡연구역&nbsp;구분</h3>
          </div>
          <div>
            <div>
              <input
                type="radio"
                name="areaType"
                onClick={() => setAreaType("SMOKING_ZONE_OPEN")}
              />
              &nbsp;개방형
            </div>
            <div>
              <input
                type="radio"
                name="areaType"
                onClick={() => setAreaType("SMOKING_ZONE_CLOSED")}
              />
              &nbsp;폐쇄형
            </div>
            <div>
              <input
                type="radio"
                name="areaType"
                onClick={() => setAreaType("SMOKING_ZONE_LINE")}
              />
              &nbsp;라인형
            </div>
          </div>
        </div>
        <div className={styles.implicit}>
          <div>
            <h3>암묵적인&nbsp;흡연구역&nbsp;여부</h3>
          </div>
          <div>
            <div>
              <input
                type="radio"
                name="implicitArea"
                onClick={() => setImplicit("_IMPLICIT")}
              />
              예
            </div>
            <div>
              <input
                type="radio"
                name="implicitArea"
                onClick={() => setImplicit(undefined)}
              />
              아니오
            </div>
          </div>
        </div>
        <div className={styles.submitBtn}>
          <button onClick={submit}>제출</button>
        </div>
      </div>
    );
}