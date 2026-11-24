"use client";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "yet-another-react-lightbox/styles.css";

type Props = {
  src: string;
  alt: string;
  onClose: () => void;
};

export default function AiImageLightbox({ src, alt, onClose }: Props) {
  return (
    <Lightbox
      open
      close={onClose}
      slides={[{ src, alt }]}
      plugins={[Zoom]}
      zoom={{ scrollToZoom: true, maxZoomPixelRatio: 3 }}
      carousel={{ finite: true }}
      render={{
        buttonPrev: () => null,
        buttonNext: () => null,
      }}
    />
  );
}
