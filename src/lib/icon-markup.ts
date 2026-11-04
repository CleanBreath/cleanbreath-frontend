import type { LucideIcon, LucideProps } from "lucide-react";
import { createElement, type ReactElement, type ReactNode } from "react";

const FORWARD_REF = Symbol.for("react.forward_ref");

// JSX 속성 이름 → HTML. SVG 표현 속성(stroke·fill·clip 계열)만 kebab-case이고 viewBox 등은 그대로 둔다
function attrName(name: string): string {
  if (name === "className") return "class";
  return /^(stroke|fill|clip)[A-Z]/.test(name)
    ? name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)
    : name;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type ElementProps = Record<string, unknown> & { children?: ReactNode };

function toMarkup(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number")
    return escapeHtml(String(node));
  if (Array.isArray(node)) return node.map(toMarkup).join("");

  const { type, props } = node as ReactElement<ElementProps>;
  // lucide 아이콘은 훅 없는 forwardRef 컴포넌트가 svg 트리를 반환한다
  if (typeof type === "object" && type !== null) {
    const exotic = type as {
      $$typeof?: symbol;
      render?: (p: ElementProps, ref: null) => ReactNode;
    };
    if (exotic.$$typeof === FORWARD_REF && exotic.render)
      return toMarkup(exotic.render(props, null));
  }
  if (typeof type === "function")
    return toMarkup((type as (p: ElementProps) => ReactNode)(props));
  if (typeof type !== "string") return "";

  let attrs = "";
  for (const [key, value] of Object.entries(props)) {
    if (key === "children" || key === "ref" || key === "key") continue;
    if (value == null || value === false || typeof value === "function")
      continue;
    attrs += ` ${attrName(key)}="${escapeHtml(String(value))}"`;
  }
  return `<${type}${attrs}>${toMarkup(props.children)}</${type}>`;
}

/**
 * lucide 아이콘을 HTML 문자열로 만든다 (지도 HTML 마커용).
 * react-dom/server의 renderToString은 홈 번들을 크게 늘려서 쓰지 않는다
 */
export function iconMarkup(Icon: LucideIcon, props: LucideProps = {}): string {
  return toMarkup(createElement(Icon, props));
}
