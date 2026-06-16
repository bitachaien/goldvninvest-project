import Link from "next/link";
import React from "react";
import Slider from "react-slick";
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

const SliderSection = ({
  bannerListdata,
  landing,
  announcementListdata,
}: any) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 2000,
    className: "center",
    // vertical: true,
    slidesToShow: bannerListdata.length < 3 ? 1 : 3,
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
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 460,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const notifiactionSettings = {
    dots: false,
    infinite: true,
    speed: 2000,
    className: "center",
    vertical: true,
    // slidesToShow: bannerListdata.length < 4 ? 1 : 4,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 500,
    arrows: false,
  };

  if (landing?.landing_first_section_status != 1) return <></>;

  return (
    <section
      className={`tradex-relative tradex-z-10 ${
        landing?.landing_first_section_status == 1 && "-tradex-mt-[140px] "
      }`}
    >
      <div className="tradex-container tradex-space-y-6 ">
        {announcementListdata?.length > 0 && (
          <div className="tradex-min-h-[28px] md:tradex-min-h-[30px]">
            <Slider {...notifiactionSettings} className="announcement-slider">
              {announcementListdata?.map((item: any, index: number) => (
                <div className="single-info" key={index}>
                  <Link href={`/announcement/${item.slug}`}>
                    <a className=" tradex-flex tradex-gap-2 tradex-items-center tradex-text-xs md:tradex-text-lg tradex-font-bold tradex-text-title hover:!tradex-text-title">
                      {/* <TfiAnnouncement /> */}
                      <span>
                        <svg
                          width="27"
                          height="22"
                          viewBox="0 0 27 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className=" tradex-fill-title tradex-max-w-[18px] md:tradex-max-w-[27px]"
                        >
                          <path
                            d="M19.6731 0C19.2244 0.000503908 18.7943 0.178962 18.477 0.496222C18.1597 0.813482 17.9813 1.24363 17.9808 1.69231V1.97402C16.174 3.88638 13.7294 5.19586 11.9719 5.96501C9.81343 6.90959 7.82719 7.40385 6.98077 7.40385H1.90385C1.39909 7.40441 0.915161 7.60517 0.558242 7.96209C0.201323 8.31901 0.000559911 8.80293 0 9.30769V12.6923C0.000559911 13.1971 0.201323 13.681 0.558242 14.0379C0.915161 14.3948 1.39909 14.5956 1.90385 14.5962H2.96154V19.0385C2.96154 19.2068 3.0284 19.3682 3.14741 19.4872C3.26643 19.6062 3.42784 19.6731 3.59615 19.6731H5.71154C5.85307 19.6731 5.99053 19.6258 6.10209 19.5387C6.21365 19.4516 6.29289 19.3297 6.32722 19.1924L7.46694 14.6338C8.46297 14.7649 10.1564 15.2407 11.9719 16.0352C13.7294 16.8044 16.174 18.1138 17.9808 20.0262V20.3077C17.9808 20.7565 18.1591 21.187 18.4764 21.5043C18.7938 21.8217 19.2242 22 19.6731 22C20.1219 22 20.5523 21.8217 20.8697 21.5043C21.1871 21.187 21.3654 20.7565 21.3654 20.3077V1.69231C21.3649 1.24363 21.1864 0.813482 20.8692 0.496222C20.5519 0.178962 20.1217 0.000503908 19.6731 0ZM6.34615 13.3269H4.23077V8.67308H6.34615V13.3269ZM1.26923 12.6923V9.30769C1.26941 9.13944 1.33633 8.97813 1.45531 8.85915C1.57428 8.74018 1.73559 8.67326 1.90385 8.67308H2.96154V13.3269H1.90385C1.73559 13.3267 1.57428 13.2598 1.45531 13.1408C1.33633 13.0219 1.26941 12.8606 1.26923 12.6923ZM5.21606 18.4038H4.23077V14.5962H6.16799L5.21606 18.4038ZM7.61538 13.376V8.624C9.846 8.32695 14.6456 6.67467 17.9808 3.73434V18.2657C14.6456 15.3253 9.846 13.6731 7.61538 13.376ZM20.0962 20.3077C20.0962 20.4199 20.0516 20.5275 19.9722 20.6069C19.8929 20.6862 19.7853 20.7308 19.6731 20.7308C19.5609 20.7308 19.4533 20.6862 19.3739 20.6069C19.2946 20.5275 19.25 20.4199 19.25 20.3077V1.69231C19.25 1.5801 19.2946 1.47249 19.3739 1.39315C19.4533 1.3138 19.5609 1.26923 19.6731 1.26923C19.7853 1.26923 19.8929 1.3138 19.9722 1.39315C20.0516 1.47249 20.0962 1.5801 20.0962 1.69231V20.3077Z"
                            fill="inherit"
                          />
                          <path
                            d="M26.0195 10.3654H23.9041C23.7358 10.3654 23.5744 10.4323 23.4554 10.5513C23.3364 10.6703 23.2695 10.8317 23.2695 11C23.2695 11.1683 23.3364 11.3298 23.4554 11.4488C23.5744 11.5678 23.7358 11.6346 23.9041 11.6346H26.0195C26.1878 11.6346 26.3493 11.5678 26.4683 11.4488C26.5873 11.3298 26.6541 11.1683 26.6541 11C26.6541 10.8317 26.5873 10.6703 26.4683 10.5513C26.3493 10.4323 26.1878 10.3654 26.0195 10.3654Z"
                            fill="inherit"
                          />
                          <path
                            d="M22.8597 7.05147C22.9548 7.05146 23.0486 7.02998 23.1343 6.98864L25.0409 6.07199C25.1926 5.99906 25.3091 5.86885 25.3648 5.71002C25.4205 5.55118 25.4108 5.37673 25.3379 5.22504C25.2649 5.07335 25.1347 4.95685 24.9759 4.90116C24.817 4.84547 24.6426 4.85516 24.4909 4.9281L22.5845 5.8448C22.4548 5.90709 22.3501 6.01161 22.2876 6.14122C22.2251 6.27082 22.2085 6.41782 22.2405 6.5581C22.2726 6.69837 22.3513 6.8236 22.4638 6.91325C22.5764 7.00289 22.7161 7.05163 22.8599 7.05147H22.8597Z"
                            fill="inherit"
                          />
                          <path
                            d="M25.0407 15.928L23.1343 15.0114C22.9828 14.9398 22.8091 14.931 22.6511 14.987C22.4932 15.043 22.3638 15.1592 22.2912 15.3102C22.2186 15.4612 22.2086 15.6348 22.2635 15.7931C22.3185 15.9514 22.4337 16.0816 22.5843 16.1552L24.4907 17.0719C24.6424 17.1449 24.8168 17.1546 24.9757 17.0989C25.1345 17.0432 25.2647 16.9267 25.3376 16.775C25.4106 16.6233 25.4203 16.4489 25.3646 16.29C25.3089 16.1312 25.1924 16.001 25.0407 15.928Z"
                            fill="inherit"
                          />
                        </svg>
                      </span>
                      {item.title}
                    </a>
                  </Link>
                </div>
              ))}
            </Slider>
          </div>
        )}
        {bannerListdata?.length > 0 &&
          parseInt(landing?.landing_second_section_status) === 1 && (
            <Slider {...settings} className="slider-banner-cls">
              {bannerListdata?.map((item: any, index: number) => (
                <Link href={`/banner/${item.slug}`} key={index}>
                  <img
                    src={item.image || "Frame 1321314198.png"}
                    alt="about-image-phone"
                    className=" tradex-cursor-pointer tradex-max-h-[175px] tradex-bg-background-main tradex-h-[175px] md:tradex-max-h-[215px] md:tradex-h-[215px] tradex-w-full tradex-object-cover tradex-object-center tradex-rounded-lg"
                  />
                </Link>
              ))}
            </Slider>
          )}
      </div>
    </section>
  );
};

export default SliderSection;
