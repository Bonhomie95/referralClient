import { useRef } from "react";
import { reviews } from "../constants/reviewsData";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Reviews = () => {
  const sliderRef = useRef(null);
  const cardWidth = 340; // Adjust as needed (card width + gap)

  const scrollPrev = () => {
    sliderRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
  };

  const scrollNext = () => {
    sliderRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
  };

  return (
    <section id="reviews" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Reviews</h2>
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={scrollPrev}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full z-10"
          >
            <FaArrowLeft size={20} />
          </button>
          {/* Slider Container */}
          <div
            ref={sliderRef}
            className="flex overflow-x-scroll scroll-smooth gap-4 px-8 hide-scrollbar"
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="min-w-[320px] max-w-[320px] bg-gray-800 rounded p-4 m-2"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div className="text-xl">
                    {review.rating === 4
                      ? "★★★★"
                      : review.rating === 4.5
                      ? "★★★★½"
                      : review.rating === 5
                      ? "★★★★★"
                      : ""}
                  </div>
                </div>
                <blockquote className="italic mb-2">
                  “{review.comment}”
                </blockquote>
                <p className="font-bold">{review.name}</p>
              </div>
            ))}
          </div>
          {/* Right Arrow */}
          <button
            onClick={scrollNext}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full z-10"
          >
            <FaArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
