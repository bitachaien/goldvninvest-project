import { CRYPTO_DEPOSIT } from "helpers/core-constants";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { TokenBuyIcoCryptoAction } from "state/actions/launchpad";
import PaymentDetails from "./paymentDetails";
import AmountCheck from "./AmountCheck";

const CryptoPayment = ({ walletlist, initialData, phaseData }: any) => {
  const [data, setData] = useState<any>({
    amount: null,
    payer_wallet: null,
  });
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("common");
  return (
    <form
      onSubmit={(e: any) => {
        e.preventDefault();
        TokenBuyIcoCryptoAction(
          initialData,
          setLoading,
          data.payer_wallet,
          data.amount,
          CRYPTO_DEPOSIT
        );
      }}
    >
      <div className=" tradex-grid md:tradex-grid-cols-2 tradex-gap-6">
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
        <div className="tradex-space-y-2">
          <label
            className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
            htmlFor=""
          >
            {t("Select Coin Currency")}
          </label>
          <select
            name="coin_currency"
            className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-background-main`}
            required
            onChange={(e) => {
              setData({
                ...data,
                payer_wallet: e.target.value,
              });
            }}
          >
            <option value="">{t("Select")}</option>
            {walletlist?.map((item: any, index: any) => (
              <option value={item.id} key={index}>
                {item?.name}
              </option>
            ))}
          </select>
        </div>
        <div className=" md:tradex-col-span-2">
          {data.payer_wallet && data.amount && initialData.phase_id ? (
            <PaymentDetails
              amount={data.amount}
              phase_id={initialData.phase_id}
              token_id={initialData.token_id}
              payment_method={CRYPTO_DEPOSIT}
              payer_wallet={data.payer_wallet}
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
        >
          {loading ? t("Please wait") : t("Make Payment")}
        </button>
      </div>
    </form>
  );
};

export default CryptoPayment;
