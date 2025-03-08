import { useState, useEffect } from 'react';
import { slides } from '../constants/slideshowData';

function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden pb-16">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex h-full items-center justify-center">
            {index % 2 === 0 ? (
              // For odd-numbered slides (1, 3, 5, …; index 0,2,4) on desktop: image left, text right
              <div className="flex flex-col md:flex-row items-center justify-center w-full">
                <div className="md:w-1/2 px-4">
                  <img
                    src={slide.image}
                    alt={slide.header}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8 text-center md:text-left">
                  <h2 className="text-4xl font-bold whitespace-nowrap">
                    {slide.header}
                  </h2>
                  <p className="mt-4 text-xl">{slide.subheader}</p>
                </div>
              </div>
            ) : (
              // For even-numbered slides (2, 4, 6, …; index 1,3,5):
              // Mobile: image on top, text below; Desktop: text left, image right.
              <div className="flex flex-col md:flex-row items-center justify-center w-full">
                <div className="order-1 md:order-2 md:w-1/2 px-4">
                  <img
                    src={slide.image}
                    alt={slide.header}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="order-2 md:order-1 md:w-1/2 p-8 text-center md:text-right">
                  <h2 className="text-4xl font-bold whitespace-nowrap">
                    {slide.header}
                  </h2>
                  <p className="mt-4 text-xl">{slide.subheader}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      {/* Bullet indicators */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-blue-600' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroSlideshow;
