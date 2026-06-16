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

  const maintenanceModeStyle: React.CSSProperties = {
    height: "100vh",
    position: "relative",
    overflow: "hidden",
    zIndex: -1,
  };

  const maintenanceModeBeforeStyle: React.CSSProperties = {
    height: "100vh",
    width: "100%",
    content: '""',
    backgroundColor: "#000",
    position: "absolute",
    top: 0,
    left: 0,
    opacity: 0.6,
    zIndex: 0,
  };

  const maintenanceContentStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--text-primary-color)!important",
    justifyItems: "center",
    zIndex: 999999,
    height: "100vh",
    textAlign: "center",
    maxWidth: "50%",
    margin: "0 auto",
    position: "relative",
  };

  const maintenanceContentH2Style: React.CSSProperties = {
    fontSize: "52px",
    color: "var(--text-primary-color)!important",
    marginBottom: "15px",
  };

  const maintenanceContentPStyle: React.CSSProperties = {
    fontSize: "20px",
    color: "var(--text-primary-color)!important",
  };

  return (
    <div
      className="maintenance-mode"
      style={{
        ...maintenanceModeStyle,
        background: `${
          data?.data?.maintenance_mode_img
            ? `url(${data?.data?.maintenance_mode_img})`
            : "url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        }`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="maintenance-mode-before"
        style={maintenanceModeBeforeStyle}
      ></div>
      <div className="maintenance-content" style={maintenanceContentStyle}>
        <div>
          <h2 style={maintenanceContentH2Style}>
            {data?.data?.maintenance_mode_title
              ? data?.data?.maintenance_mode_title
              : t(
                  "Tradexpro Exchange is temporarily unavailable due to maintenance"
                )}
          </h2>
          <p style={maintenanceContentPStyle}>
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
  if (parseInt(data?.maintenance_mode_status) == STATUS_INACTIVE && !isApiLocalhost()) {
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
