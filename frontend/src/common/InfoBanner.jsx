import React from "react";
import PropTypes from "prop-types";
import { Button, Image, Paragraph } from "./index";

export default function InfoBanner({
  title,
  titleClass = "",
  description,
  descriptionClass = "",
  imageSrc,
  imageAlt,
  imageClass = "",
  buttonText,
  buttonClass = "",
  onButtonClick,
  sectionClass = "",
  children,
}) {
  return (
    <section className={`flex flex-col md:flex-row justify-between items-center gap-6 px-6 py-12 ${sectionClass}`}>
      <div className="max-w-md">
        <h2 className={`text-3xl font-bold mb-3 ${titleClass}`}>{title}</h2>
        {description && <Paragraph className={descriptionClass}>{description}</Paragraph>}
        {children}
        {buttonText && (
          <Button variant="primary" className={buttonClass} onClick={onButtonClick}>
            {buttonText}
          </Button>
        )}
      </div>
      {imageSrc && <Image src={imageSrc} alt={imageAlt} className={`w-full md:w-1/2 rounded-lg ${imageClass}`} />}
    </section>
  );
}

