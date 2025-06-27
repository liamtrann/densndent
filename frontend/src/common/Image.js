import React, { useState } from "react";
import classNames from "classnames";

const base_file_url = process.env.BASE_FILE_URL || "https://4571901-sb1.app.netsuite.com";

export default function Image({ src, alt, className = "", ...props }) {
  const fallback = process.env.REACT_APP_NO_IMAGE_AVAILABLE_LOGO;
  // If src is a relative file_url, prepend base_file_url
  const fullSrc = src && !/^https?:\/\//.test(src) ? `${base_file_url}${src}` : src;
  const [imgSrc, setImgSrc] = useState(fullSrc || fallback);

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