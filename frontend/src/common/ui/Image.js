import classNames from "classnames";
import { useState } from "react";

// Fallback if image fails to load
const fallback = process.env.REACT_APP_NO_IMAGE_AVAILABLE_LOGO || "https://sandbox.densndente.ca/SSP%20Applications/NetSuite%20Inc.%20-%20SCS/SuiteCommerce%20Standard/home-page/no-image-available.png";

export default function Image({ src, alt, className = "", ...props }) {
  // If no src, use fallback. Otherwise, use src as is
  const fullSrc = src ? src : fallback;
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



