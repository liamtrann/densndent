import React from "react";
import { Button, Image, Paragraph } from "./index";

export default function InfoBanner({
  title,
  titleClass = "",
  description,
  descriptionClass = "",
  imageSrc,
  imageAlt = "",
  buttonText,
  buttonClass = "",
  onButtonClick,
  sectionClass = "",
  children,
}) {
  return (
    <section
      className={`relative py-16 px-6 text-left overflow-hidden ${sectionClass}`}
      style={{
        backgroundImage: imageSrc ? `url(${imageSrc})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "right center", // ✅ Align the image to the right
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Lighter overlay so image remains prominent */}
      <div className="absolute inset-0 bg-white bg-opacity-30 md:bg-opacity-20"></div>

      {/* Content box */}
      <div className="relative max-w-2xl bg-white p-6 md:p-10 rounded-xl shadow-lg">
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${titleClass}`}>
          {title}
        </h2>

        {description && (
          <Paragraph className={`text-gray-700 mb-4 ${descriptionClass}`}>
            {description}
          </Paragraph>
        )}

        {children}

        {buttonText && (
          <Button
            variant="primary"
            className={`mt-2 ${buttonClass}`}
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </section>
  );
}
