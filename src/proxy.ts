import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // api·_next·_vercel과 점이 들어간 정적 파일(favicon, images, manifest.json, robots.txt, sitemap.xml, naver*.html, OGImage.png 등)은 제외
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
