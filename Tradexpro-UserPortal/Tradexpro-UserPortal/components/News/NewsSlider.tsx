import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={
        "tradex-z-10 tradex-absolute tradex-right-[-8px] md:tradex-right-[-24px] tradex-top-1/2 -tradex-translate-y-1/2 tradex-w-8 tradex-h-8 md:tradex-w-12 md:tradex-h-12 tradex-flex tradex-justify-center tradex-items-center tradex-bg-primary tradex-border-[3px] tradex-border-white tradex-rounded-full"
      }
      onClick={onClick}
    >
      <FaArrowRight
        className=" tradex-w-[14px] md:tradex-w-[18px]"
        color="white"
      />
    </div>
  );
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={
        "tradex-z-10 tradex-absolute tradex-left-[-8px] md:tradex-left-[-24px] tradex-top-1/2 -tradex-translate-y-1/2 tradex-w-8 tradex-h-8 md:tradex-w-12 md:tradex-h-12 tradex-flex tradex-justify-center tradex-items-center tradex-bg-[#070000] tradex-border-[3px] tradex-border-white tradex-rounded-full"
      }
      onClick={onClick}
    >
      <FaArrowLeft
        className=" tradex-w-[14px] md:tradex-w-[18px]"
        color="white"
      />
    </div>
  );
}

export const NewsSlider = ({ PopularNews }: any) => {
  const settings = {
    dots: false,
    infinite: PopularNews?.length > 3,
    speed: 2000,
    className: "center",
    // vertical: true,
    slidesToShow: PopularNews?.length < 3 ? 1 : 3,
    // slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 1000,
    arrows: true,

    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 900,
        settings: {
          infinite: PopularNews?.length > 2,
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 460,
        settings: {
          infinite: PopularNews?.length > 1,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-py-4 tradex-px-2">
      <Slider {...settings}>
        {PopularNews?.map((item: any, index: any) => (
          <Link href={`/news/${encodeURIComponent(item?.post_id)}`} key={index}>
            <div className=" tradex-min-h-[223px]">
              <img
                className="tradex-max-h-[223px] tradex-h-full tradex-w-full tradex-object-cover tradex-object-center tradex-rounded-lg"
                src={item?.thumbnail}
                alt=""
              />
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
};
