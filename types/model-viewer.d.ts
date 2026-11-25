import type { DetailedHTMLProps, HTMLAttributes } from "react";

type ModelViewerProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  src?: string;
  "ios-src"?: string;
  poster?: string;
  alt?: string;
  ar?: boolean;
  "ar-modes"?: string;
  "ar-placement"?: "floor" | "wall";
  "ar-scale"?: "auto" | "fixed";
  "camera-controls"?: boolean;
  "auto-rotate"?: boolean;
  "shadow-intensity"?: string;
  "shadow-softness"?: string;
  "environment-image"?: string;
  exposure?: string;
  loading?: "auto" | "lazy" | "eager";
  reveal?: "auto" | "manual";
  "touch-action"?: string;
  "interaction-prompt"?: "auto" | "none";
  "camera-orbit"?: string;
};

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerProps;
    }
  }
}
