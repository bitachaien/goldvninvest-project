import useTranslation from "next-translate/useTranslation";

export const TradeDetails = ({ details }: any) => {
  const { t } = useTranslation("common");

  return (
    <div className="glass-color-bg-custom">
      <div className="container-4xl pb-5">
        <div className="row">
          <div className="col-lg-3 col-md-4 col-6 mt-4">
            <p>{t("30d Trades")}</p>
            <div className="d-flex align-items-center">
              <h6 className="mr-1">
                {" "}
                {details?.completion_rate_30d
                  ? details?.completion_rate_30d
                  : 0}{" "}
              </h6>
              %
            </div>
          </div>
          <div className="col-lg-3 col-md-4 col-6 mt-4">
            <p>{t("First order at")}</p>
            <div className="d-flex align-items-center">
              <h6 className="mr-1"> {details?.first_order_at} </h6>{" "}
              {t("days ago")}
            </div>
          </div>
          <div className="col-lg-3 col-md-4 col-6 mt-4">
            <p>{t("Negative reviews")}</p>
            <div className="d-flex align-items-center">
              <h6 className="mr-1"> {details?.negative} </h6>
            </div>
          </div>
          <div className="col-lg-3 col-md-4 col-6 mt-4">
            <p>{t("Positive reviews")}</p>
            <div className="d-flex align-items-center">
              <h6 className="mr-1"> {details?.positive} </h6>
            </div>
          </div>
          <div className="col-lg-3 col-md-4 col-6 mt-4">
            <p>{t("Positive reviews percentage")}</p>
            <div className="d-flex align-items-center">
              <h6 className="mr-1"> {details?.positive_feedback}%</h6>
            </div>
          </div>
          <div className="col-lg-3 col-md-4 col-6 mt-4">
            <p>{t("Total trades")}</p>
            <div className="d-flex align-items-center">
              <h6 className="mr-1"> {details?.total_trade} </h6>
            </div>
          </div>
          <div className="col-lg-3 col-md-4 col-6 mt-4">
            <p>{t("Registered at")}</p>
            <div className="d-flex align-items-center">
              <h6 className="mr-1">
                {" "}
                {details?.user_register_at} {t("days ago")}
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
