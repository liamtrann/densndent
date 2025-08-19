import classNames from "classnames";
import { useState } from "react";

// Default base path for NetSuite from environment variable
const base_file_url =
  process.env.BASE_FILE_URL_FOR_IMG || "https://4571901-sb1.app.netsuite.com";
// Fallback if image fails to load
const fallback =
  process.env.REACT_APP_NO_IMAGE_AVAILABLE_LOGO ||
  "https://sandbox.densndente.ca/SSP%20Applications/NetSuite%20Inc.%20-%20SCS/SuiteCommerce%20Standard/home-page/no-image-available.png";

export default function ProductImage({ src, alt, className = "", ...props }) {
  // If no src, use fallback. If src exists, always prepend base_file_url
  const fullSrc = src ? `${base_file_url}${src}` : fallback;
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
