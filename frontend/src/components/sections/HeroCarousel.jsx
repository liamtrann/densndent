import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import classNames from "classnames";

const slides = [
  {
    desktopImage:
      "https://www.densndente.ca/SSP Applications/NetSuite Inc. - SCS/SuiteCommerce Standard/home-page/JDIQ_Raffle_Prize_WINNERS_Web_Banners_20252.jpg",
    mobileImage:
      "https://www.densndente.ca/Mobile Image Views/JDIQ_Raffle_Prize_WINNERS_Web_Banners_20252_mobile.jpg",
    button: { text: "VIEW NOW", link: "/promotions/jdiq" },
    duration: 7000,
  },
  {
    desktopImage:
      "https://www.densndente.ca/SSP Applications/NetSuite Inc. - SCS/SuiteCommerce Standard/home-page/DND_July_Web_2025.jpg",
    mobileImage:
      "https://www.densndente.ca/Mobile Image Views/DND_July_Mobile_2025.jpg",
    button: { text: "BROWSE NOW", link: "/promotions/q3-vendor" },
    duration: 7000,
  },
  {
    desktopImage:
      "https://www.densndente.ca/SSP Applications/NetSuite Inc. - SCS/SuiteCommerce Standard/home-page/DND_Q3_Social_Media_2025_new.jpg",
    mobileImage:
      "https://www.densndente.ca/Mobile Image Views/DND_Q3_Social_Media_2025_new2.jpg",
    button: { text: "VIEW NOW", link: "/promotions/q3-vendor" },
    duration: 7000,
  },
  {
    desktopImage:
      "https://www.densndente.ca/SSP Applications/NetSuite Inc. - SCS/SuiteCommerce Standard/home-page/Medicom_Web_Banners_Available_Now_1.jpg",
    mobileImage:
      "https://www.densndente.ca/Mobile Image Views/Medicom_Web_Banners_Available_Now_1_Mobile.jpg",
    button: { text: "SHOP NOW", link: "/products/by-brand/medicom" },
    duration: 7000,
  },
  {
    desktopImage:
      "https://www.densndente.ca/SSP Applications/NetSuite Inc. - SCS/SuiteCommerce Standard/home-page/[JPEG]Short Expiry Web Banners.jpg",
    mobileImage:
      "https://www.densndente.ca/Mobile Image Views/[JPEG]Short Expiry Mobile Banners.jpg",
    button: { text: "VIEW SPECIALS", link: "/promotions/short-expiry" },
    duration: 7000,
  },
  {
    desktopImage:
      "https://www.densndente.ca/SSP Applications/NetSuite Inc. - SCS/SuiteCommerce Standard/home-page/3M_Web_Banners_Available_Now.jpg",
    mobileImage:
      "https://www.densndente.ca/Mobile Image Views/3M_Web_Banners_Available_Now_Mobile.jpg",
    button: { text: "SHOP NOW", link: "/products/by-brand/3m" },
    duration: 7000,
  },
  {
    desktopImage:
      "https://www.densndente.ca/SSP Applications/NetSuite Inc. - SCS/SuiteCommerce Standard/home-page/Web Banners D2 Redesign.jpg",
    mobileImage:
      "https://www.densndente.ca/Mobile Image Views/[JPEGS]Web Banners D2 Redesign.jpg",
    button: { text: "SHOP NOW", link: "/products/by-brand/d2" },
    duration: 7000,
  },
  {
    desktopImage:
      "https://www.densndente.ca/SSP Applications/NetSuite Inc. - SCS/SuiteCommerce Standard/home-page/[JPEGS]Web Banners DND Redesign.jpg",
    mobileImage:
      "https://www.densndente.ca/Mobile Image Views/[JPEGS]Web Banners DND Redesign5.jpg",
    button: { text: "SHOP NOW", link: "/products/by-brand/metrex" },
    duration: 7000,
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, slides[current].duration);
    return () => clearInterval(interval);
  }, [current]);

  const goTo = (index) => setCurrent(index);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const next = () => setCurrent((prev) => (prev + 1) % slides.length);

  const { desktopImage, mobileImage, button } = slides[current];

  return (
    <div className="relative w-full h-[400px] md:h-[550px] overflow-hidden bg-white">
      {/* Desktop Image */}
      <img
        src={desktopImage}
        alt={button.text}
        className="hidden md:block w-full h-full object-contain object-top"
      />

      {/* Mobile Image */}
      <img
        src={mobileImage}
        alt={button.text}
        className="block md:hidden w-full h-full object-contain object-center"
      />

      {/* CTA Button */}
      {/* <Link
        to={button.link}
        className="absolute left-6 bottom-6 bg-white text-blue-700 px-5 py-2 font-semibold rounded shadow hover:bg-gray-100 z-10"
      >
        {button.text}
      </Link> */}

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/30 p-2 rounded-full z-10"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/30 p-2 rounded-full z-10"
      >
        <FaChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={classNames(
              "w-3 h-3 rounded-full",
              current === idx ? "bg-white" : "bg-white/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
