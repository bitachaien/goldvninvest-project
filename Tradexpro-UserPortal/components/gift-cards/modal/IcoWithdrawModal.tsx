import BankDetails from "components/deposit/bankDetails";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function IcoWithdrawModal({
  close,
  image,
  paymentDetails,
}: any) {
  const { t } = useTranslation("common");
  return (
    <div id="demo-modal" className="gift-card-modal">
      <div className="gift-card-modal__content section-padding-custom w-auto min-w-75p">
        {paymentDetails && <h2>{t("Payment Details")}</h2>}
        {image && <h2>{t("Payment Slip")}</h2>}

        <div className="row my-5">
          {paymentDetails && (
            <div className="col-lg-12">
              <div className="ico-withdraw-modal-container">
                <p>{paymentDetails}</p>
              </div>
            </div>
          )}
          {image && (
            <div className="col-lg-12">
              <div className="ico-withdraw-modal-container">
                <img src={image} alt="" />
              </div>
            </div>
          )}
        </div>

        <span
          className="gift-card-modal__close text-45 pointer"
          onClick={close}
        >
          &times;
        </span>
      </div>
    </div>
  );
}
