import React, { useState } from "react";
import classNames from "classnames";

// Default base path for NetSuite
const base_file_url = process.env.BASE_FILE_URL || "https://4571901-sb1.app.netsuite.com";

// Fallback if image fails to load
const fallback = process.env.REACT_APP_NO_IMAGE_AVAILABLE_LOGO || "/no-image.png";

export default function Image({ src, alt, className = "", ...props }) {
  // Determine if the src is absolute (URL), public asset, or relative NetSuite path
  const isAbsoluteUrl = src?.startsWith("http://") || src?.startsWith("https://");
  const isPublicAsset = src?.startsWith("/");
  const fullSrc = isAbsoluteUrl
    ? src
    : isPublicAsset
    ? src
    : src
    ? `${base_file_url}${src}`
    : fallback;

  const [imgSrc, setImgSrc] = useState(fullSrc);

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
