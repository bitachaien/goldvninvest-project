import { formateDateMunite } from "common";
import moment from "moment";
import Link from "next/link";
import React, { useState } from "react";

const VerticalBlogCard = ({ blog }: any) => {
  const [imgSrc, setImgSrc] = useState(blog?.thumbnail);
  const handleError = () => {
    setImgSrc("./bitcoin-cryptocurrency-investing-concept.png");
  };
  return (
    <Link href={"/blog/" + blog?.post_id}>
      <div className=" tradex-flex tradex-cursor-pointer tradex-gap-2.5">
        <div className=" tradex-min-h-[127px] tradex-min-w-[127px]">
          <img
            className=" tradex-max-h-[127px] tradex-max-w-[127px]  tradex-h-full tradex-w-full tradex-rounded-lg tradex-object-cover tradex-object-center"
            src={imgSrc || "./bitcoin-cryptocurrency-investing-concept.png"}
            onError={handleError}
            alt="Card image cap"
          />
        </div>

        <div className="tradex-space-y-1">
          <div className=" tradex-space-y-0.5  tradex-max-w-[600px]">
            <div className=" tradex-flex tradex-gap-1 tradex-items-center">
              <span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className=" tradex-fill-primary tradex-stroke-primary tradex-max-w-4 tradex-max-h-4"
                >
                  <path
                    d="M5.43281 16.0157L4.65019 17.2199C4.49871 17.4547 4.56435 17.7677 4.79914 17.9192C4.88498 17.9747 4.97841 18 5.07432 18C5.24094 18 5.40254 17.9192 5.49846 17.7703L6.26342 16.5938C7.35909 17.2451 8.63655 17.6213 9.99985 17.6213C11.3657 17.6213 12.6431 17.2451 13.7363 16.5913L14.4987 17.7678C14.5946 17.9167 14.7588 17.9975 14.9229 17.9975C15.0163 17.9975 15.1122 17.9723 15.198 17.9167C15.4328 17.7652 15.4985 17.4522 15.347 17.2174L14.5669 16.0132C16.2432 14.6726 17.3212 12.61 17.3212 10.2999C17.3212 6.26305 14.0367 2.97852 9.99985 2.97852C5.96298 2.97852 2.67847 6.263 2.67847 10.2999C2.67847 12.6099 3.75647 14.6725 5.43281 16.0157ZM9.99985 3.98831C13.4813 3.98831 16.3114 6.81843 16.3114 10.2999C16.3114 13.7814 13.4813 16.6115 9.99985 16.6115C6.51841 16.6115 3.6883 13.7814 3.6883 10.2999C3.6883 6.81843 6.51841 3.98831 9.99985 3.98831Z"
                    fill="inherit"
                    stroke="inherit"
                    strokeWidth="0.3"
                  />
                  <path
                    d="M11.6865 12.4482C11.7824 12.5315 11.9011 12.5719 12.0197 12.5719C12.1611 12.5719 12.3 12.5138 12.4009 12.4002C12.5852 12.1907 12.5625 11.8726 12.353 11.6883L10.5049 10.07V6.00785C10.5049 5.73013 10.2777 5.50293 10 5.50293C9.72232 5.50293 9.49512 5.73013 9.49512 6.00785V10.2997C9.49512 10.4461 9.55823 10.585 9.66679 10.6809L11.6865 12.4482Z"
                    fill="inherit"
                    stroke="inherit"
                    strokeWidth="0.3"
                  />
                  <path
                    d="M3.68835 4.62704C3.81963 4.62704 3.95092 4.57654 4.04937 4.47556C4.65024 3.86208 5.33189 3.34957 6.0716 2.95069C6.31646 2.8194 6.40989 2.51395 6.2786 2.26651C6.14732 2.02164 5.84186 1.92821 5.59442 2.0595C4.76133 2.50636 3.9989 3.07945 3.32484 3.76869C3.13043 3.96816 3.13296 4.28875 3.33243 4.48315C3.43336 4.57911 3.56212 4.62704 3.68835 4.62704Z"
                    fill="inherit"
                    stroke="inherit"
                    strokeWidth="0.3"
                  />
                  <path
                    d="M13.9282 2.95065C14.6705 3.347 15.3496 3.86204 15.9505 4.47552C16.0489 4.57649 16.1802 4.627 16.3115 4.627C16.4377 4.627 16.5665 4.57902 16.6649 4.48311C16.8644 4.2887 16.8669 3.96807 16.6725 3.76865C16.001 3.08194 15.236 2.50632 14.4029 2.0595C14.1555 1.92821 13.85 2.02164 13.7187 2.26651C13.5899 2.51391 13.6808 2.81936 13.9282 2.95065Z"
                    fill="inherit"
                    stroke="inherit"
                    strokeWidth="0.3"
                  />
                </svg>
              </span>
              <p className=" tradex-text-primary tradex-text-xs tradex-leading-[18px] tradex-font-bold">
                {formateDateMunite(blog?.created_at)}
              </p>
            </div>

            <h3 className=" tradex-text-base tradex-leading-5 !tradex-text-title tradex-line-clamp-2">
              {blog?.title}
            </h3>
          </div>
          <p className=" tradex-text-xs tradex-leading-[18px] tradex-text-body tradex-line-clamp-3">
            {blog?.description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VerticalBlogCard;
