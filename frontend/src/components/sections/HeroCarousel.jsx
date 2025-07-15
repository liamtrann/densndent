import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import classNames from "classnames";

const slides = [
  {
    image: "/assets/banners/3m-banner.jpg",
    headline: "Don’t Wait—Explore 3M Essentials Today!",
    subtext: "Available on Our Website!",
    button: { text: "SHOP NOW", link: "/products/by-brand/3m" },
    bgColor: "bg-gradient-to-r from-orange-500 to-orange-700",
    duration: 7000
  },
  {
    image: "/assets/banners/d2-banner.jpg",
    headline: "Check Out Our D2 Healthcare Products",
    subtext: "A Proudly Canadian Company",
    button: { text: "SHOP NOW", link: "/products/by-brand/d2" },
    bgColor: "bg-teal-600",
    duration: 7000
  },
  {
    image: "/assets/banners/metrex-banner.jpg",
    headline: "Metrex Cavi Wipes",
    subtext: "Tuberculocidal, Bactericidal, Virucidal",
    button: { text: "SHOP NOW", link: "/products/by-brand/metrex" },
    bgColor: "bg-gradient-to-r from-orange-600 to-orange-700",
    duration: 7000
  },
  {
    image: "/assets/banners/raffle-banner.jpg",
    headline: "Congrats to Our JDIQ Raffle Winners",
    subtext: "Check Them Out Now!",
    button: { text: "VIEW NOW", link: "/promotions/jdiq" },
    bgColor: "bg-blue-600",
    duration: 7000
  },
  {
    image: "/assets/banners/q3-banner.jpg",
    headline: "Explore Our Q3 July Specials",
    subtext: "Offers from Top Vendors",
    button: { text: "BROWSE NOW", link: "/promotions/q3-vendor" },
    bgColor: "bg-red-700",
    duration: 7000
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const goTo = (index) => setCurrent(index);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const next = () => setCurrent((prev) => (prev + 1) % slides.length);

  const { image, headline, subtext, button, bgColor } = slides[current];

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      <div
        className={classNames(
          "absolute inset-0 w-full h-full text-white flex items-center justify-between px-6 transition-all duration-700 ease-in-out",
          bgColor
        )}
      >
        <div className="z-10 max-w-2xl space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">{headline}</h1>
          <p className="text-lg">{subtext}</p>
          <Link
            to={button.link}
            className="inline-block bg-white text-blue-700 px-4 py-2 font-semibold rounded shadow hover:bg-gray-100"
          >
            {button.text}
          </Link>
        </div>
        <div className="hidden md:block w-1/2 h-full">
          <img src={image} alt={headline} className="h-full w-full object-contain" />
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/30 p-2 rounded-full"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/30 p-2 rounded-full"
      >
        <FaChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
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
