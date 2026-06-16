import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import LaunchTopFeatItem from "./LaunchTopFeatItem";

const LaunchTop = ({ data }: any) => {
  const { t } = useTranslation("common");
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  return (
    <div className=" tradex-border tradex-border-background-primary tradex-py-10 tradex-px-6 tradex-space-y-10 tradex-rounded-lg tradex-bg-background-main">
      <div className=" tradex-space-y-8 tradex-pb-8 tradex-border-b-2 tradex-border-background-primary">
        <div className=" tradex-space-y-4">
          <h2 className="tradex-text-2xl sm:tradex-text-[32px] sm:tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] !tradex-text-title tradex-font-bold ">
            {data?.launchpad_first_title
              ? data?.launchpad_first_title
              : t("Tradexpro Token Launch Platform")}
          </h2>
          <p className=" tradex-text-sm sm:tradex-text-base sm:tradex-leading-6 tradex-text-body tradex-capitalize">
            {data?.launchpad_first_description
              ? data?.launchpad_first_description
              : t("Buy Or Earn New Tokens Directly On Tradexpro.")}
          </p>
        </div>
        {isLoggedIn && (
          <Link href="/ico/applied-launchpad">
            <div className=" tradex-cursor-pointer tradex-w-fit tradex-flex tradex-gap-2 tradex-items-center tradex-text-lg tradex-leading-[21px] tradex-font-bold tradex-text-primary tradex-border-b tradex-border-primary">
              <span>{t("Launchpad dashboard")}</span>
              <BsArrowRight />
            </div>
          </Link>
        )}
      </div>

      <div className=" tradex-grid sm:tradex-grid-cols-2 lg:tradex-grid-cols-4 tradex-gap-6">
        <LaunchTopFeatItem
          title={parseFloat(
            data?.current_funds_locked ? data?.current_funds_locked : 0
          )}
          content={`Total Supplied Token`}
        />
        <LaunchTopFeatItem
          title={parseFloat(
            data?.total_funds_raised ? data?.total_funds_raised : 0
          )}
          content={`Total Sold Raised`}
        />
        <LaunchTopFeatItem
          title={parseFloat(
            data?.project_launchpad ? data?.project_launchpad : 0
          )}
          content={`Projects Launched`}
        />
        <LaunchTopFeatItem
          title={parseFloat(
            data?.all_time_unique_participants
              ? data?.all_time_unique_participants
              : 0
          )}
          content={`Total Participants`}
        />
      </div>
    </div>
  );
};

export default LaunchTop;
