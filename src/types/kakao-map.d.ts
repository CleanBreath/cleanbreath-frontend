/**
 * Kakao Map API 타입 정의
 */

declare global {
  interface Window {
    kakao: typeof kakao;
  }
}

declare namespace kakao.maps {
  class Map {
    constructor(container: HTMLElement, options: MapOptions);
    setCenter(latlng: LatLng): void;
    getCenter(): LatLng;
    setLevel(level: number): void;
    getLevel(): number;
    panTo(latlng: LatLng): void;
  }

  class LatLng {
    constructor(lat: number, lng: number);
    getLat(): number;
    getLng(): number;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    setPosition(position: LatLng): void;
    getPosition(): LatLng;
  }

  class CustomOverlay {
    constructor(options: CustomOverlayOptions);
    setMap(map: Map | null): void;
    setPosition(position: LatLng): void;
    setContent(content: string | HTMLElement): void;
  }

  class Polygon {
    constructor(options: PolygonOptions);
    setMap(map: Map | null): void;
    setPath(path: LatLng[] | LatLng[][]): void;
    getPath(): LatLng[];
  }

  class MarkerImage {
    constructor(src: string, size: Size, options?: MarkerImageOptions);
  }

  class Size {
    constructor(width: number, height: number);
  }

  class Point {
    constructor(x: number, y: number);
  }

  interface MapOptions {
    center: LatLng;
    level?: number;
    mapTypeId?: MapTypeId;
    draggable?: boolean;
    scrollwheel?: boolean;
    disableDoubleClick?: boolean;
    disableDoubleClickZoom?: boolean;
  }

  interface MarkerOptions {
    position: LatLng;
    map?: Map;
    image?: MarkerImage;
    title?: string;
    clickable?: boolean;
  }

  interface MarkerImageOptions {
    offset?: Point;
    alt?: string;
    coords?: string;
    shape?: string;
    spriteOrigin?: Point;
    spriteSize?: Size;
  }

  interface CustomOverlayOptions {
    position: LatLng;
    content: string | HTMLElement;
    map?: Map;
    clickable?: boolean;
    xAnchor?: number;
    yAnchor?: number;
    zIndex?: number;
  }

  interface PolygonOptions {
    path: LatLng[] | LatLng[][];
    strokeWeight?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeStyle?: StrokeStyles;
    fillColor?: string;
    fillOpacity?: number;
    map?: Map;
  }

  type MapTypeId = "ROADMAP" | "SKYVIEW" | "HYBRID";
  type StrokeStyles =
    | "solid"
    | "shortdash"
    | "shortdot"
    | "shortdashdot"
    | "shortdashdotdot"
    | "dot"
    | "dash"
    | "dashdot"
    | "longdash"
    | "longdashdot"
    | "longdashdotdot";

  namespace event {
    function addListener(
      target: Map | Marker | Polygon | CustomOverlay,
      type: string,
      callback: (...args: unknown[]) => void
    ): void;
    function removeListener(
      target: Map | Marker | Polygon | CustomOverlay,
      type: string,
      callback: (...args: unknown[]) => void
    ): void;
  }

  function load(callback: () => void): void;
}

export {};
