import React from "react";
import { GetServerSideProps } from "next";
import { commomSettings } from "service/landing-page";
import useTranslation from "next-translate/useTranslation";
import { isApiLocalhost } from "helpers/functions";
import { STATUS_INACTIVE } from "helpers/core-constants";
interface MaintenanceProps {
  data: any;
}

const Maintenance: React.FC<MaintenanceProps> = ({ data }) => {
  const { t } = useTranslation("common");

  return (
    <div
      className="tradex-min-h-screen tradex-h-full tradex-relative !tradex-bg-cover !tradex-bg-center !tradex-bg-no-repeat"
      style={{
        background: `${
          data?.data?.maintenance_mode_img
            ? `url(${data?.data?.maintenance_mode_img})`
            : "url('https://images.unsplash.com/photo-1761026532879-0477c13e8bb3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687')"
        }`,
      }}
    >
      <div className="tradex-absolute tradex-inset-0 tradex-bg-[#000]/60"></div>
      <div className=" tradex-max-w-3xl tradex-mx-auto tradex-relative tradex-z-10">
        <div className=" tradex-min-h-screen tradex-flex tradex-justify-center tradex-items-center tradex-gap-6 tradex-flex-col ">
          <h2 className=" !tradex-text-white tradex-font-bold tradex-text-2xl sm:tradex-text-5xl tradex-text-center">
            {data?.data?.maintenance_mode_title
              ? data?.data?.maintenance_mode_title
              : t("Website is temporarily unavailable due to maintenance")}
          </h2>
          <p className=" tradex-text-base sm:tradex-text-xl tradex-text-white tradex-text-center">
            {data?.data?.maintenance_mode_text
              ? data?.data?.maintenance_mode_text
              : "We are working hard to make it the best friendly exchange website. Please check back later. We apologize for any inconvenience"}
          </p>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const { data } = await commomSettings();
  if (
    parseInt(data?.maintenance_mode_status) == STATUS_INACTIVE &&
    !isApiLocalhost()
  ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: { data },
  };
};

export default Maintenance;
