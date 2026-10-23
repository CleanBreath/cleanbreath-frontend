import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// 언어 접두어(/en, /ja)를 자동으로 붙이는 Link·라우터. next/link, next/navigation 대신 사용
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
