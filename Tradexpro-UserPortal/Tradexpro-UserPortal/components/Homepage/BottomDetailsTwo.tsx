import ImageComponent from "components/common/ImageComponent";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";
import { BsChevronRight } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";

const BottomDetailsTwo = ({ landing }: any) => {
  const { t } = useTranslation("common");

  return (
    <>
      <div>
        <div className="container-4xl tradex-pb-[120px]">
          <div className="tradex-grid lg:tradex-grid-cols-2 tradex-gap-12 tradex-items-center">
            <div className="tradex-relative">
              <div className="tradex-z-[-2] tradex-absolute tradex-inset-0 tradex-m-auto tradex-grid tradex-h-3/5 tradex-w-3/5 tradex-grid-cols-2 -tradex-space-x-52 tradex-opacity-40">
                <div className="tradex-h-full tradex-rounded-full tradex-bg-gradient-to-br tradex-from-primary tradex-to-[#eafbf3] tradex-blur-[106px]"></div>
                <div className="tradex-h-full tradex-bg-gradient-to-r tradex-from-[#eafbf3] tradex-to-primary tradex-blur-[106px]"></div>
              </div>

              <svg
                className="tradex-absolute tradex-top-0 sm:tradex-left-[calc((100%-520px)/2)] tradex-max-w-[520px] tradex-max-h-[260px] sm:tradex-max-h-[520px] tradex-z-[-1] tradex-w-full"
                width="840"
                height="840"
                viewBox="0 0 840 840"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_166_250)">
                  <path
                    d="M0 224H840"
                    stroke="url(#paint0_linear_166_250)"
                    strokeWidth="2"
                  />
                  <path
                    d="M0 322H840"
                    stroke="url(#paint1_linear_166_250)"
                    strokeWidth="2"
                  />
                  <path
                    d="M0 420H840"
                    stroke="url(#paint2_linear_166_250)"
                    strokeWidth="2"
                  />
                  <path
                    d="M0 518H840"
                    stroke="url(#paint3_linear_166_250)"
                    strokeWidth="2"
                  />
                  <path
                    d="M0 616H840"
                    stroke="url(#paint4_linear_166_250)"
                    strokeWidth="2"
                  />
                  <path
                    d="M616 0L616 840"
                    stroke="url(#paint5_linear_166_250)"
                    strokeWidth="2"
                  />
                  <path
                    d="M518 0L518 840"
                    stroke="url(#paint6_linear_166_250)"
                    strokeWidth="2"
                  />
                  <path
                    d="M420 0L420 840"
                    stroke="url(#paint7_linear_166_250)"
                    strokeWidth="2"
                  />
                  <path
                    d="M322 0L322 840"
                    stroke="url(#paint8_linear_166_250)"
                    strokeWidth="2"
                  />
                  <path
                    d="M224 0L224 840"
                    stroke="url(#paint9_linear_166_250)"
                    strokeWidth="2"
                  />
                </g>
                <defs>
                  <linearGradient
                    id="paint0_linear_166_250"
                    x1="-107.778"
                    y1="224.5"
                    x2="924.444"
                    y2="224.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      offset="0.100006"
                      stopColor="#92E6BD"
                      stopOpacity="0"
                    />
                    <stop offset="0.51" stopColor="rgb(var(--primary-color))" />
                    <stop
                      offset="0.899429"
                      stopColor="#92E6BD"
                      stopOpacity="0"
                    />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_166_250"
                    x1="-107.778"
                    y1="322.5"
                    x2="924.444"
                    y2="322.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      offset="0.100006"
                      stopColor="#92E6BD"
                      stopOpacity="0"
                    />
                    <stop offset="0.51" stopColor="rgb(var(--primary-color))" />
                    <stop
                      offset="0.899429"
                      stopColor="#92E6BD"
                      stopOpacity="0"
                    />
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_166_250"
                    x1="-107.778"
                    y1="420.5"
                    x2="924.444"
                    y2="420.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      offset="0.100006"
                      stopColor="#92E6BD"
                      stopOpacity="0"
                    />
                    <stop offset="0.51" stopColor="rgb(var(--primary-color))" />
                    <stop
                      offset="0.899429"
                      stopColor="#92E6BD"
                      stopOpacity="0"
                    />
                  </linearGradient>
                  <linearGradient
                    id="paint3_linear_166_250"
                    x1="-107.778"
                    y1="518.5"
                    x2="924.444"
                    y2="518.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      offset="0.100006"
                      stopColor="#92E6BD"
                      stopOpacity="0"
                    />
                    <stop offset="0.51" stopColor="rgb(var(--primary-color))" />
                    <stop
                      offset="0.899429"
                      stopColor="#92E6BD"
                      stopOpacity="0"
                    />
                  </linearGradient>
                  <linearGradient
                    id="paint4_linear_166_250"
                    x1="-107.778"
                    y1="616.5"
                    x2="924.444"
                    y2="616.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      offset="0.100006"
                      stopColor="#92E6BD"
                      stopOpacity="0"
                    />
                    <stop offset="0.51" stopColor="rgb(var(--primary-color))" />
                    <stop
                      offset="0.899429"
                      stopColor="#92E6BD"
                      stopOpacity="0"
                    />
                  </linearGradient>
                  <linearGradient
                    id="paint5_linear_166_250"
                    x1="615.5"
                    y1="-107.778"
                    x2="615.5"
                    y2="924.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      offset="0.100006"
                      stopColor="#92E6BD"
                      stopOpacity="0"
                    />
                    <stop offset="0.51" stopColor="rgb(var(--primary-color))" />
                    <stop
                      offset="0.899429"
                      stopColor="#92E6BD"
                      stopOpacity="0"
                    />
                  </linearGradient>
                  <linearGradient
                    id="paint6_linear_166_250"
                    x1="517.5"
                    y1="-107.778"
                    x2="517.5"
                    y2="924.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      offset="0.100006"
                      stopColor="#92E6BD"
                      stopOpacity="0"
                    />
                    <stop offset="0.51" stopColor="rgb(var(--primary-color))" />
                    <stop
                      offset="0.899429"
                      stopColor="#92E6BD"
                      stopOpacity="0"
                    />
                  </linearGradient>
                  <linearGradient
                    id="paint7_linear_166_250"
                    x1="419.5"
                    y1="-107.778"
                    x2="419.5"
                    y2="924.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      offset="0.100006"
                      stopColor="#92E6BD"
                      stopOpacity="0"
                    />
                    <stop offset="0.51" stopColor="rgb(var(--primary-color))" />
                    <stop
                      offset="0.899429"
                      stopColor="#92E6BD"
                      stopOpacity="0"
                    />
                  </linearGradient>
                  <linearGradient
                    id="paint8_linear_166_250"
                    x1="321.5"
                    y1="-107.778"
                    x2="321.5"
                    y2="924.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      offset="0.100006"
                      stopColor="#92E6BD"
                      stopOpacity="0"
                    />
                    <stop offset="0.51" stopColor="rgb(var(--primary-color))" />
                    <stop
                      offset="0.899429"
                      stopColor="#92E6BD"
                      stopOpacity="0"
                    />
                  </linearGradient>
                  <linearGradient
                    id="paint9_linear_166_250"
                    x1="223.5"
                    y1="-107.778"
                    x2="223.5"
                    y2="924.444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      offset="0.100006"
                      stopColor="#92E6BD"
                      stopOpacity="0"
                    />
                    <stop offset="0.51" stopColor="rgb(var(--primary-color))" />
                    <stop
                      offset="0.899429"
                      stopColor="#92E6BD"
                      stopOpacity="0"
                    />
                  </linearGradient>
                  <clipPath id="clip0_166_250">
                    <rect width="840" height="840" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <img
                src={landing?.new_advertisement_image || "Frame 1261156713.png"}
                alt=""
                className=" tradex-mt-6"
              />
            </div>
            <div>
              <h3 className="tradex-text-2xl tradex-max-w-xl tradex-font-bold !tradex-text-title dark:tradex-text-white md:tradex-text-3xl lg:tradex-text-4xl">
                {landing?.new_advertisement_title ||
                  t("TradexPro Mobile: Trade with Confidence Anywhere")}
              </h3>
              {/* <h5 className="tradex-mt-8 tradex-text-2xl">
                Easy Customization
              </h5> */}
              <p className="tradex-mb-8 tradex-mt-8 tradex-text-gray-600 dark:tradex-text-gray-300">
                {landing?.new_advertisement_description ||
                  t(`Discover the future of trading with the TradexPro Mobile App.
                Download now on Google Play and the Apple Store for a seamless
                and secure trading experience. Trade with confidence, stay
                informed on-the-go, and take control of your investments
                wherever life takes you. Elevate your trading with TradexPro
                Mobile.`)}
              </p>
              <div className=" tradex-flex tradex-flex-col sm:tradex-flex-row tradex-items-center tradex-gap-8">
                <Link href={landing?.new_advertisement_first_url || "/"}>
                  <button className="tradex-group tradex-w-full sm:tradex-w-auto tradex-flex tradex-items-center hover:tradex-bg-primary tradex-gap-4 tradex-min-h-[62px] tradex-px-3 tradex-py-2 sm:tradex-min-w-[184px] tradex-border tradex-border-primary tradex-rounded-lg">
                    <span>
                      <svg
                        width="29"
                        height="35"
                        viewBox="0 0 29 35"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="tradex-fill-primary-one group-hover:tradex-fill-white"
                      >
                        <path d="M24.2215 18.5067C24.2391 17.1729 24.602 15.865 25.2765 14.7049C25.9509 13.5447 26.915 12.57 28.079 11.8714C27.3395 10.8403 26.364 9.99184 25.2299 9.39327C24.0959 8.79471 22.8344 8.46255 21.5459 8.42319C18.7971 8.1415 16.1324 10.029 14.7316 10.029C13.3038 10.029 11.1472 8.45116 8.82493 8.4978C7.3228 8.54518 5.85886 8.97164 4.57574 9.73562C3.29262 10.4996 2.23408 11.5751 1.50327 12.8572C-1.6624 18.2082 0.698907 26.0725 3.7314 30.398C5.24863 32.516 7.02183 34.8819 9.34205 34.798C11.6125 34.7061 12.4605 33.3845 15.2011 33.3845C17.9163 33.3845 18.7119 34.798 21.0792 34.7447C23.5155 34.7061 25.0505 32.6172 26.5145 30.4791C27.6046 28.97 28.4435 27.302 29 25.537C27.5846 24.9525 26.3767 23.9742 25.5269 22.724C24.6772 21.4739 24.2232 20.0071 24.2215 18.5067Z" />
                        <path d="M19.7508 5.57834C21.0791 4.02147 21.7336 2.02036 21.5751 0C19.5457 0.208103 17.671 1.15506 16.3247 2.6522C15.6664 3.38359 15.1623 4.23448 14.841 5.15621C14.5198 6.07794 14.3878 7.05244 14.4525 8.02401C15.4676 8.03421 16.4719 7.81941 17.3896 7.39578C18.3073 6.97215 19.1147 6.35073 19.7508 5.57834Z" />
                      </svg>
                    </span>
                    <div className=" tradex-text-left tradex-mt-1">
                      <p className="tradex-text-sm tradex-text-title group-hover:tradex-text-white tradex-font-[450] tradex-leading-4">
                        Download on the
                      </p>
                      <p className="tradex-text-base tradex-text-title group-hover:tradex-text-white tradex-font-bold tradex-leading-6">
                        App Store
                      </p>
                    </div>
                  </button>
                </Link>
                <Link href={landing?.new_advertisement_second_url || "/"}>
                  <button className="tradex-group tradex-w-full sm:tradex-w-auto hover:tradex-bg-primary tradex-flex tradex-items-center tradex-gap-4 tradex-min-h-[62px] tradex-px-3 tradex-py-2 sm:tradex-min-w-[184px] tradex-border tradex-border-primary tradex-rounded-lg">
                    <span>
                      <svg
                        viewBox="-28 0 511 511.99976"
                        xmlns="http://www.w3.org/2000/svg"
                        className=" tradex-w-[36px] tradex-fill-primary-one group-hover:tradex-fill-white"
                      >
                        <path d="m9.9375 18.855469c-6.0625 8.011719-9.4375 17.867187-9.4375 28.414062v417.453125c0 9.796875 2.921875 19 8.199219 26.6875l227.140625-236.921875zm0 0" />
                        <path d="m256.636719 232.792969 73.6875-76.859375-259.019531-149.542969c-11.242188-6.492187-24.140626-8.03125-36.175782-4.648437zm0 0" />
                        <path d="m256.636719 276.179688-223.746094 233.382812c4.824219 1.621094 9.816406 2.4375 14.8125 2.4375 8.105469 0 16.214844-2.132812 23.601563-6.398438l260.882812-150.621093zm0 0" />
                        <path d="m432.828125 215.117188-75.726563-43.722657-79.664062 83.089844 81.523438 85.039063 73.867187-42.648438c14.78125-8.53125 23.605469-23.816406 23.605469-40.878906 0-17.066406-8.824219-32.347656-23.605469-40.878906zm0 0" />
                      </svg>
                    </span>
                    <div className=" tradex-text-left tradex-mt-1">
                      <p className=" tradex-text-sm tradex-text-title group-hover:tradex-text-white tradex-font-[450] tradex-leading-4">
                        Get it on
                      </p>
                      <p className="tradex-text-base tradex-text-title group-hover:tradex-text-white tradex-font-bold tradex-leading-6">
                        Google Play
                      </p>
                    </div>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomDetailsTwo;
