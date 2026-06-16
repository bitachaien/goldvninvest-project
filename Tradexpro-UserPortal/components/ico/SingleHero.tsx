import {
  PHASE_SORT_BY_FEATURED,
  PHASE_SORT_BY_FUTURE,
  PHASE_SORT_BY_RECENT,
} from "helpers/core-constants";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";
import { FaArrowLeft } from "react-icons/fa";

export const SingleHero = ({ type }: any) => {
  const { t } = useTranslation("common");
  return (
    <div className=" tradex-space-y-4">
      <div className=" tradex-space-y-2">
        <h2 className="tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] !tradex-text-title tradex-font-bold ">
          {t(
            `${
              PHASE_SORT_BY_FEATURED === parseInt(type)
                ? "Featured"
                : PHASE_SORT_BY_RECENT === parseInt(type)
                ? "Ongoing"
                : PHASE_SORT_BY_FUTURE === parseInt(type)
                ? "Upcoming"
                : ""
            } List`
          )}
        </h2>
        <p className=" tradex-text-base tradex-leading-5 tradex-text-body">
          {t("A token launch platform for transformative projects.")}
        </p>
      </div>
      <div className=" tradex-flex tradex-items-center tradex-gap-5">
        <Link href={"/ico"}>
          <div className=" tradex-cursor-pointer tradex-flex tradex-gap-2 tradex-items-center tradex-text-title">
            <FaArrowLeft />
            <h2 className=" tradex-text-xl tradex-leading-6 !tradex-text-title">
              {t("Homepage")}
            </h2>
          </div>
        </Link>
        <div className=" tradex-w-full tradex-h-[1px] tradex-bg-background-primary"></div>
      </div>
    </div>
  );
};
