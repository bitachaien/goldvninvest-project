import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import {
  currencyDepositProcess,
  getCurrencyDepositRate,
} from "service/deposit";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import PaypalButtons from "./PaypalDeposit";
const PaypalSection = ({ walletlist, method_id }: any) => {
  const { t } = useTranslation("common");
  const [calculatedValue, setCalculatedValue] = useState<any>({
    calculated_amount: 0,
    rate: 0,
    fees: 0,
    net_amount: 0,
    coin_type: "",
  });
  //@ts-ignore
  const router = useRouter();
  const [credential, setCredential] = useState<any>({
    wallet_id: null,
    payment_method_id: method_id ? parseInt(method_id) : null,
    amount: 0,
    currency: "USD",
    paypal_token: null,
  });
  const getCurrencyRate = async () => {
    if (
      credential.wallet_id &&
      credential.payment_method_id &&
      credential.amount
    ) {
      const response = await getCurrencyDepositRate(credential);
      setCalculatedValue(response.data);
    }
  };
  useEffect(() => {
    getCurrencyRate();
  }, [credential]);
  return (
    <div className=" tradex-space-y-6">
      <p className=" tradex-text-base tradex-font-bold tradex-text-title">
        {t("Deposit With Paypal")}
      </p>
      <div className=" tradex-space-y-6">
        <div className=" tradex-space-y-2">
          <label className="tradex-input-label !tradex-text-base tradex-mb-0 tradex-flex tradex-justify-between tradex-gap-6 tradex-items-center">
            <span>{t("Enter amount")}</span>
            <span>{t("Currency(USD)")}</span>
          </label>
          <input
            type="number"
            className="tradex-input-field !tradex-text-sm"
            id="amount-one"
            placeholder={t("Please enter 1-2400000")}
            onChange={(e) => {
              setCredential({
                ...credential,
                amount: e.target.value,
              });
            }}
          />
        </div>
        <div className=" tradex-space-y-2">
          <label className="tradex-input-label !tradex-text-base tradex-mb-0 tradex-flex tradex-justify-between tradex-gap-6 tradex-items-center">
            <span>{t("Converted amount")}</span>
            <span>{t("Select wallet")}</span>
          </label>
          <div className="tradex-input-field tradex-flex tradex-justify-between tradex-items-center">
            <input
              type="number"
              className="tradex-w-full !tradex-border-none tradex-bg-transparent tradex-text-sm tradex-text-title"
              id="amount-one"
              disabled
              value={calculatedValue.calculated_amount}
              placeholder={t("Please enter 10 -2400000")}
              onChange={(e) => {
                setCredential({
                  ...credential,
                  amount: e.target.value,
                });
              }}
            />
            <select
              className="tradex-w-[100px]  md:tradex-w-[150px] tradex-text-sm !tradex-text-title !tradex-bg-background-primary tradex-px-4 !tradex-border-0 !tradex-border-l !tradex-border-solid !tradex-border-title tradex-min-w-[100px] md:tradex-min-w-[150px]"
              id="currency-one"
              onChange={(e) => {
                setCredential({
                  ...credential,
                  wallet_id: e.target.value,
                });
              }}
            >
              <option value="" selected disabled hidden>
                {t("Select one")}
              </option>
              {walletlist?.map((wallet: any, index: any) => (
                <option value={wallet.id} key={index}>
                  {wallet.coin_type}
                </option>
              ))}
            </select>
          </div>
          <div className="tradex-flex tradex-justify-between tradex-gap-6 tradex-items-center">
            <span>
              {t("Fees:")}
              {calculatedValue.fees}
            </span>
            <span>
              {t("Net Amount:")}
              {calculatedValue.net_amount}
              {calculatedValue?.coin_type}
            </span>
          </div>
        </div>
        {credential.wallet_id &&
          credential.payment_method_id &&
          credential.amount && (
            <PaypalButtons
              credential={credential}
              setCredential={setCredential}
            />
          )}
      </div>
    </div>
  );
};

export default PaypalSection;
