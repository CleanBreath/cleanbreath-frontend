import NON_SMOKING_ICON from "../../public/nonSmok.svg";
import SMOKING_ICON from "../../public/smok.svg";

export const testData = Array.from({ length: 100 }, (_, i) => ({
  address_idx: (i + 1).toString(),
  address_name: ["평촌공원", "평촌중앙공원", "범계역", "평촌역", "인덕원역"][
    Math.floor(Math.random() * 4)
  ],
  address_division: ["공공기관", "공원", "학교", "병원"][
    Math.floor(Math.random() * 4)
  ],
  smoking : Math.random() > 0.5 ? <SMOKING_ICON /> : <NON_SMOKING_ICON />,
}));