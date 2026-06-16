import { url } from "inspector";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { BsArrowRight } from "react-icons/bs";

export default function SecondBannerSection({
  second_header,
  second_description,
  second_banner,
}: {
  second_header: string;
  second_description: string;
  second_banner: string;
}) {
  const { t } = useTranslation("common");
  return (
    <>
      <section
        className={`tradex-bg-primary tradex-min-h-[220px] tradex-flex tradex-items-center tradex-justify-center tradex-relative tradex-overflow-hidden`}
      >
        <div className=" tradex-container tradex-py-12 tradex-px-4 tradex-relative tradex-z-50">
          <div className="tradex-flex tradex-flex-col tradex-gap-y-6 tradex-items-center tradex-justify-center tradex-max-w-[832px] tradex-mx-auto tradex-text-center">
            <h2 className="tradex-text-[40px] tradex-leading-[60px] !tradex-text-white">
              {t(second_header)}
            </h2>
            <p className="!tradex-text-white tradex-text-xl">
              {t(second_description)}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
