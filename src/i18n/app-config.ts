import type about from "../../messages/ko/about.json";
import type board from "../../messages/ko/board.json";
import type common from "../../messages/ko/common.json";
import type errors from "../../messages/ko/errors.json";
import type health from "../../messages/ko/health.json";
import type home from "../../messages/ko/home.json";
import type map from "../../messages/ko/map.json";
import type meta from "../../messages/ko/meta.json";
import type overlays from "../../messages/ko/overlays.json";
import type privacy from "../../messages/ko/privacy.json";
import type register from "../../messages/ko/register.json";
import type sidebar from "../../messages/ko/sidebar.json";
import type statute from "../../messages/ko/statute.json";
import type { routing } from "./routing";

// t()의 키를 한국어 메시지 기준으로 타입 검사한다 (request.ts의 NAMESPACES와 같은 목록)
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: {
      common: typeof common;
      meta: typeof meta;
      errors: typeof errors;
      home: typeof home;
      map: typeof map;
      sidebar: typeof sidebar;
      overlays: typeof overlays;
      statute: typeof statute;
      about: typeof about;
      privacy: typeof privacy;
      register: typeof register;
      board: typeof board;
      health: typeof health;
    };
  }
}
