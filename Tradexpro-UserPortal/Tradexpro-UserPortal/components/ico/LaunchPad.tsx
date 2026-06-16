import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";
import LaunchPadInnerItem from "./LaunchPadInnerItem";

const LaunchPad = ({ viewMore, data, core, image, link }: any) => {
  const { t } = useTranslation("common");
  return (
    <>
      <Link href={link === false ? "#" : `/ico/token-details/${data?.id}`}>
        <div className=" tradex-cursor-pointer tradex-px-4 tradex-py-[34px] tradex-bg-background-main tradex-border tradex-border-background-primary tradex-rounded-lg tradex-min-h-[276px] tradex-grid tradex-grid-cols-1 md:tradex-grid-cols-12 tradex-gap-6">
          <div
            className={`${
              image === false ? " md:tradex-col-span-12" : "md:tradex-col-span-8"
            }`}
          >
            <div>
              {/* <h3 className="mt-1">{data?.phase_title}</h3>
              <p>{data?.description}</p> */}

              <div className=" tradex-grid tradex-grid-cols-1 md:tradex-grid-cols-2 tradex-gap-6">
                <LaunchPadInnerItem
                  title={`Tokens Offered:`}
                  content={`${parseFloat(data?.total_token_supply)} ${
                    data?.coin_type
                  }`}
                />
                <LaunchPadInnerItem
                  title={`Participants:`}
                  content={`${
                    data?.total_participated ? data?.total_participated : 0
                  }`}
                />
                <LaunchPadInnerItem
                  title={`Sale Price:`}
                  content={`1 ${data?.coin_type} = ${parseFloat(
                    data?.coin_price
                  ).toFixed(2)} ${data?.coin_currency}`}
                />
                <LaunchPadInnerItem
                  title={`Total Sell:`}
                  content={`${parseFloat(data?.sold_phase_tokens)} ${
                    data?.coin_type
                  }`}
                />
                <LaunchPadInnerItem
                  title={`Available:`}
                  content={`${
                    parseFloat(data?.total_token_supply) -
                    parseFloat(data?.sold_phase_tokens)
                  } 
                    ${data?.coin_type}`}
                />
                <LaunchPadInnerItem title={``} content={``} />
                <LaunchPadInnerItem
                  title={`Start time:`}
                  content={data?.start_date}
                  classes={`tradex-border-transparent`}
                />
                <LaunchPadInnerItem
                  title={`End time:`}
                  classes={`tradex-border-transparent`}
                  content={data?.end_date}
                />
              </div>
            </div>
          </div>
          {image !== false && (
            <div className=" md:tradex-col-span-4 tradex-flex tradex-items-center tradex-justify-center">
              <img
                src={
                  data?.image
                    ? data?.image
                    : "/default_launchedpad_item_img.png"
                }
                alt=""
                className=" tradex-max-h-[210px] tradex-object-cover tradex-object-center tradex-w-full tradex-h-full"
              />
            </div>
          )}
        </div>
      </Link>
    </>
  );
};

export default LaunchPad;
