import { formateDateMunite } from "common";
import moment from "moment";
import Link from "next/link";
import React, { useState } from "react";

const VerticalNewsCard = ({ news }: any) => {
  const [imgSrc, setImgSrc] = useState(news?.thumbnail);
  const handleError = () => {
    setImgSrc("./bitcoin-cryptocurrency-investing-concept.png");
  };
  return (
    <Link href={`/news/${encodeURIComponent(news?.post_id)}`}>
      <div className=" tradex-flex tradex-cursor-pointer tradex-gap-2.5">
        <div className=" tradex-min-h-[80px] tradex-min-w-[80px]">
          <img
            className=" tradex-max-h-[80px] tradex-max-w-[80px]  tradex-h-full tradex-w-full tradex-rounded-lg tradex-object-cover tradex-object-center"
            src={imgSrc || "./bitcoin-cryptocurrency-investing-concept.png"}
            onError={handleError}
            alt="Card image cap"
          />
        </div>

        <div className="tradex-space-y-2 tradex-pt-0.5">
          <div className=" tradex-space-y-2">
            <div className=" tradex-flex tradex-gap-1 tradex-items-center">
              <span>
                <svg
                  width="16"
                  height="18"
                  viewBox="0 0 16 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className=" tradex-stroke-primary"
                >
                  <path
                    d="M5 1V3.4M11.4 1V3.4M1.4 6.672H15M15.4 6.2V13C15.4 15.4 14.2 17 11.4 17H5C2.2 17 1 15.4 1 13V6.2C1 3.8 2.2 2.2 5 2.2H11.4C14.2 2.2 15.4 3.8 15.4 6.2Z"
                    stroke="inherit"
                    strokeWidth="1.2"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.1562 10.3604H11.1634M11.1562 12.7604H11.1634M8.19615 10.3604H8.20415M8.19615 12.7604H8.20415M5.23535 10.3604H5.24335M5.23535 12.7604H5.24335"
                    stroke="inherit"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p className=" tradex-text-primary tradex-text-xs tradex-leading-[18px] tradex-font-bold">
                {formateDateMunite(news?.created_at)}
              </p>
            </div>

            <h3 className=" tradex-text-lg tradex-leading-6 !tradex-text-title tradex-line-clamp-2">
              {news?.title}
            </h3>
          </div>
          {/* <p className=" tradex-text-xs tradex-leading-[18px] tradex-text-body tradex-line-clamp-3">
            {news?.description}
          </p> */}
        </div>
      </div>
    </Link>
  );
};

export default VerticalNewsCard;
