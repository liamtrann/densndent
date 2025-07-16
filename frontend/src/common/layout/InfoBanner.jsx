// src/common/InfoBanner.jsx
import React from "react";
import Button from "../ui/Button";
import Paragraph from "../ui/Paragraph";
import { Link } from "react-router-dom";

export default function InfoBanner({
  title,
  titleClass = "",
  description,
  descriptionClass = "",
  imageSrc,
  imageAlt = "",
  buttonText,
  buttonClass = "",
  buttonLink = "#",
  sectionClass = "",
  titleColorClass = "text-smiles-blue",
}) {
  return (
    <section className={`w-full py-12 px-4 ${sectionClass}`}>
      <div
        className="max-w-7xl mx-auto rounded-lg shadow-md bg-cover bg-center bg-no-repeat flex items-center"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundPosition: "right center",
          backgroundSize: "cover",
        }}
        aria-label={imageAlt}
      >
        <div className="bg-white/90 p-8 m-6 rounded-lg max-w-xl">
          <h2 className={`text-3xl font-bold mb-4 ${titleColorClass}`}>
            {title}
          </h2>
          {description && (
            <Paragraph className={`text-gray-700 mb-6 ${descriptionClass}`}>
              {description}
            </Paragraph>
          )}
          {buttonText && (
            <Link to={buttonLink}>
              <Button variant="primary" className={`px-6 py-2 ${buttonClass}`}>
                {buttonText}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
