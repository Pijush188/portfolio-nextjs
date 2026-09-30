import type { Ref } from "react";

type Props = {
  host: string;
  src?: string;
  alt?: string;
  viewRef?: Ref<HTMLDivElement>;
  imgRef?: Ref<HTMLImageElement>;
};

/** Fake browser chrome (traffic lights + URL bar) around a screenshot viewport. */
export function BrowserWindow({ host, src, alt = "", viewRef, imgRef }: Props) {
  return (
    <div className="win">
      <div className="win-bar">
        <i />
        <i />
        <i />
        <div className="win-url">{host}</div>
      </div>
      <div className="win-view" ref={viewRef}>
        <img ref={imgRef} src={src || undefined} alt={alt} decoding="async" />
      </div>
    </div>
  );
}
