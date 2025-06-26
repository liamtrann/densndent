import React, { useState } from "react";
import classNames from "classnames";

export default function Image({ src, alt, className = "", ...props }) {
  const fallback = process.env.REACT_APP_NO_IMAGE_AVAILABLE_LOGO;
  const [imgSrc, setImgSrc] = useState(src || fallback);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={classNames(className)}
      onError={() => setImgSrc(fallback)}
      {...props}
    />
  );
}