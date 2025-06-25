import React from "react";
import PropTypes from "prop-types";
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

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
}; 