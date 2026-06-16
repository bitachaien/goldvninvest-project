import PaypalButtons from "components/ico/payment/PaypalComponent";
import { PAYPAL } from "helpers/core-constants";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import PaymentDetails from "./paymentDetails";
import AmountCheck from "./AmountCheck";

const PaypalPayment = ({ initialData, pageInfo, phaseData }: any) => {
  const { t } = useTranslation("common");
  const [paymentData, setPaymentData] = useState(null);
  const [credential, setCredential] = useState<any>({
    payment_method_id: PAYPAL,
    amount: null,
    currency: "USD",
    paypal_token: null,
    phase_id: initialData.phase_id,
    token_id: initialData.token_id,
    pay_currency: "USD",
  });
  return (
    <form className=" tradex-space-y-6">
      <div className="tradex-space-y-2">
        <label
          className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
          htmlFor=""
        >
          {t("Quantity of token")}
        </label>
        <input
          type="number"
          name="amount"
          value={credential.amount}
          placeholder={t("Quantity of token")}
          required
          className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent`}
          onChange={(e: any) => {
            setCredential({
              ...credential,
              amount: e.target.value,
            });
          }}
        />
        <AmountCheck phaseData={phaseData} data={credential} />
      </div>
      {/* <div className="col-md-6 form-input-div pr-0 pr-sm-3">
      <label className="ico-label-box" htmlFor="">
        {t("Select Currency")}
      </label>
      <div className="cp-select-area">
        <select
          name="bank"
          className={`ico-input-box`}
          required
          onChange={(e) => {
            setCredential({
              ...credential,
              pay_currency: e.target.value,
            });
          }}
        >
          <option value="">{t("Select")}</option>
          {pageInfo?.currency_list?.map((item: any, index: any) => (
            <option value={item.code} key={index}>
              {item?.name}
            </option>
          ))}
        </select>
      </div>
    </div> */}
      {credential.pay_currency && credential.amount && initialData?.phase_id ? (
        <PaymentDetails
          currency={credential.pay_currency}
          amount={credential.amount}
          phase_id={initialData.phase_id}
          token_id={initialData.token_id}
          payment_method={PAYPAL}
          data={paymentData}
          setData={setPaymentData}
        />
      ) : (
        ""
      )}
      {credential.amount && credential.pay_currency && (
        <div className="">
          <PaypalButtons
            credential={credential}
            setCredential={setCredential}
            paymentData={paymentData}
          />
        </div>
      )}
    </form>
  );
};

export default PaypalPayment;
