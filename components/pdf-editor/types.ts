export type Tool =
  | "select"
  | "text"
  | "highlight"
  | "draw"
  | "signature"
  | "image"
  | "eraser";

export interface Annotation {
  id: string;
  pageIndex: number;
  type: "text" | "highlight" | "draw" | "signature" | "image";
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  text?: string;
  color?: string;
  fontSize?: number;
  path?: { x: number; y: number }[];
  imageData?: string;
  opacity?: number;
  strokeWidth?: number;
}

export interface PageState {
  rotation: number;
  annotations: Annotation[];
}