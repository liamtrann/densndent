import React from "react";
import classNames from "classnames";

export default function Image({ src, alt, className = "", ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      className={classNames(className)}
      {...props}
    />
  );
}