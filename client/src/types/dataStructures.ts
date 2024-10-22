import { StaticImageData } from "next/image";

export type Position2 = [number, number];
export type Position3 = [number, number, number];

export type LinkData = {
  href: string;
  title: string;
};
export type VideoSource = {
  src: string;
  type: string;
  media?: string;
  width?: number;
  height?: number;
};

export type ImgOrVideo =
  | {
      type: "img";
      src: string | StaticImageData;
    }
  | {
      type: "video";
      src: string;
    };
