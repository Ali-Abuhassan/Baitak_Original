import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const AuthSlider = ({
  images = [
    "/Container.png",
    "/Container.png",
    "/Container.png",
  ],
  title = "Welcome to BAITAK",
  description = "Jordan's premier home services marketplace connecting you with verified professionals",
}) => {
  const [slideIndex, setSlideIndex] = useState(0);
    const { t } = useTranslation();

  // Auto slide
  useEffect(() => {
    const id = setInterval(() => {
      setSlideIndex((s) => (s + 1) % images.length);
    }, 4000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
      {/* Slider Images */}
      {images.map((src, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
            idx === slideIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Text Content */}
      <div className="z-10 mx-auto text-center text-white px-8 flex flex-col items-center justify-center h-full">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <img src="/baitk-logo.png" className="h-12" alt="logo" />
          <span className="text-3xl font-semibold" style={{ color: "#4A5565" }}>
            {t('auth.login.baitak')}
          </span>
        </div>

        <h1 className="text-4xl font-semibold">{title}</h1>

        <p className="mt-4 max-w-lg mx-auto">{description}</p>

        {/* Slider Dots */}
        <div className="flex items-center gap-2 mt-6">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIndex(i)}
              className={`h-3 w-8 rounded-full transition-all ${
                i === slideIndex ? "bg-green-400" : "bg-white/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthSlider;
