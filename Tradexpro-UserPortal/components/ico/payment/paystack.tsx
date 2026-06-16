import { PAYSTACK } from "helpers/core-constants";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { PaystackAction } from "state/actions/launchpad";
import PaymentDetails from "./paymentDetails";
import AmountCheck from "./AmountCheck";

const Paystack = ({ pageInfo, initialData, phaseData }: any) => {
  const { t } = useTranslation("common");
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [data, setData] = useState<any>({
    email: null,
    amount: null,
  });
  return (
    <form
      className="tradex-grid md:tradex-grid-cols-2 tradex-gap-6"
      onSubmit={(e: any) => {
        e.preventDefault();
        PaystackAction(
          initialData,
          setLoading,
          data.email,
          data.amount,
          PAYSTACK
        );
      }}
    >
      <div className="tradex-space-y-2">
        <label
          className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
          htmlFor=""
        >
          {t("Email")}
        </label>
        <input
          type="email"
          name="email"
          value={data.email}
          placeholder={t("Enter your email")}
          required
          className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent`}
          onChange={(e: any) => {
            setData({
              ...data,
              email: e.target.value,
            });
          }}
        />
      </div>
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
          value={data.amount}
          placeholder={t("Quantity of token")}
          required
          className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent`}
          onChange={(e: any) => {
            setData({
              ...data,
              amount: e.target.value,
            });
          }}
        />
        <AmountCheck phaseData={phaseData} data={data} />
      </div>
      <div className=" md:tradex-col-span-2">
        {data.amount && initialData.phase_id ? (
          <PaymentDetails
            currency={"USD"}
            amount={data.amount}
            phase_id={initialData.phase_id}
            token_id={initialData.token_id}
            payment_method={PAYSTACK}
            data={paymentData}
            setData={setPaymentData}
          />
        ) : (
          ""
        )}
      </div>
      <button
        className="primary-btn tradex-w-fit !tradex-text-white"
        type="submit"
        disabled={!data.email && !data.amount}
      >
        {loading ? "Please Wait" : t("Make Payment")}
      </button>
    </form>
  );
};

export default Paystack;
