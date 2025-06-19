import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Pagination, Navigation } from "swiper";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/navigation";

import "../../App.css";
import { FaStar } from "react-icons/fa";

import { apiConnector } from "../../services/apiconnector";
import { ratingsEndpoints } from "../../services/apis";

function ReviewSlider() {
  const [reviews, setReviews] = useState([]);
  const truncateWords = 15;

  // Fetch reviews from backend
  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        );
        if (data?.success) {
          setReviews(data?.data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    })();
  }, []);

  return (
    <div className="text-lg">
      <div className="my-[50px] border-2 border-white p-4 h-fitContent max-w-maxContent mx-auto">
        <Swiper
          slidesPerView={3} // <-- fixed slides per view
          spaceBetween={30}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Pagination, Autoplay, Navigation]}
          navigation={true}
          className="w-full h-fitContent"
        >
          {reviews.map((review, i) => (
            <SwiperSlide key={i}>
              <div className="min-w-[300px] max-w-[400px] mx-auto h-full flex flex-col justify-between gap-4 bg-richblack-800 rounded-xl p-6 text-base text-richblack-25 shadow-md">
                {/* User info */}
                <div className="flex items-center gap-2 text-2xl">
                  <img
                    src={
                      review?.user?.image
                        ? review?.user?.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                    }
                    alt="user"
                    className="h-9 w-9 rounded-full object-cover mx-5 my-2"
                  />
                  <div className="flex flex-col">
                    <h1 className="font-semibold text-richblack-5 text-[24px]">
                      {`${review?.user?.firstName} ${review?.user?.lastName}`}
                    </h1>
                    <h2 className="text-[16px] font-medium text-richblack-300">
                      {review?.course?.courseName}
                    </h2>
                  </div>
                </div>

                {/* Review text */}
                <p className="font-medium text-richblack-5 italic p-8 text-center">
                  {review?.review.split(" ").length > truncateWords
                    ? `"${review?.review
                        .split(" ")
                        .slice(0, truncateWords)
                        .join(" ")} ..."`
                    : `"${review?.review}"`}
                </p>

                {/* Star rating */}
                <div className="mx-auto">
                  <div className="flex items-center gap-2">
                    <ReactStars
                      count={5}
                      value={review.rating}
                      size={20}
                      edit={false}
                      activeColor="#ffd700"
                      emptyIcon={<FaStar />}
                      fullIcon={<FaStar />}
                    />
                  </div>
                  <h3 className="font-semibold text-yellow-100 text-center">
                    {review.rating.toFixed(1)}
                  </h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default ReviewSlider;
