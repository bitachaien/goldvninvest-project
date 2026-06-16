import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { copyTextById } from "common";
import { useRef } from "react";

import {
  currencyDepositProcess,
  getCurrencyDepositRate,
} from "service/deposit";
import { toast } from "react-toastify";
import BankDetails from "./bankDetails";
import { useRouter } from "next/router";
import { UserSettingsApi } from "service/settings";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import DepositGoogleAuth from "./deposit-g2fa";
import request from "lib/request";

const infoList = [
  "Login to your Perfect Money account.",
  "Click the Settings Tab.",
  'Click the "Change Security Settings" link under the Security section.',
  'On the page that appears, click the "Enable" button on the API section.',
  'And then click the "Edit" button below this API section.',
  "A form will appear with a field for IP.",
];
const PerfectMoney = ({ currencyList, walletlist, method_id, banks }: any) => {
  const { t } = useTranslation("common");
  const { settings } = useSelector((state: RootState) => state.common);

  const [calculatedValue, setCalculatedValue] = useState<any>({
    calculated_amount: 0,
    rate: 0,
  });

  const [errorMessage, setErrorMessage] = React.useState({
    status: false,
    message: "",
  });
  // const CheckG2faEnabled = async () => {
  //   const { data } = await UserSettingsApi();
  //   const { user } = data;
  //   if (
  //     user.google2fa !== 1 &&
  //     parseInt(settings.currency_deposit_2fa_status) === 1
  //   ) {
  //     setErrorMessage({
  //       status: true,
  //       message: t("Google 2FA is not enabled, Please enable Google 2FA fist"),
  //     });
  //   }
  // };
  const [credential, setCredential] = useState<any>({
    wallet_id: null,
    payment_method_id: method_id ? parseInt(method_id) : null,
    amount: 0,
    currency: null,
    code: "",
    account_id: "",
    account_password: "",
    payer_id: "",
  });
  const router = useRouter();
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
  const convertCurrency = async (credential: any) => {
    let selectedCurrencyType = currencyList.find(
      (item: any) => item.code == credential.currency
    );

    localStorage.setItem("perfect_money_wallet_id", credential?.wallet_id);
    localStorage.setItem(
      "perfect_money_payment_method_id",
      credential?.payment_method_id
    );
    // return
    const form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "https://perfectmoney.com/api/step1.asp");

    const formData = [
      {
        name: "PAYEE_ACCOUNT",
        value: `${selectedCurrencyType?.perfect_money_account}`,
      },
      { name: "PAYEE_NAME", value: `${settings.app_title}` },
      { name: "PAYMENT_AMOUNT", value: credential?.amount },
      { name: "PAYMENT_UNITS", value: `${selectedCurrencyType?.code}` },
      {
        name: "STATUS_URL",
        value: `${process.env.NEXT_PUBLIC_HOSTED_CLIENT_URL}/fiat-deposit?status=pending`,
      },
      {
        name: "PAYMENT_URL",
        value: `${process.env.NEXT_PUBLIC_HOSTED_CLIENT_URL}/fiat-deposit?status=success`,
      },
      { name: "PAYMENT_URL_METHOD", value: "GET" },
      {
        name: "NOPAYMENT_URL",
        value: `${process.env.NEXT_PUBLIC_HOSTED_CLIENT_URL}/fiat-deposit?status=cancel`,
      },
      { name: "NOPAYMENT_URL_METHOD", value: "GET" },
      { name: "SUGGESTED_MEMO", value: "" },
      { name: "BAGGAGE_FIELDS", value: "" },
    ];

    formData.forEach((field: any) => {
      const input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", field.name);
      input.setAttribute("value", field.value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };
  useEffect(() => {
    getCurrencyRate();
    // CheckG2faEnabled();
  }, [credential]);
  return (
    <div className="tradex-space-y-6">
      <p className=" tradex-text-base tradex-font-bold tradex-text-title">
        {t("Perfect Money")}
      </p>

      <div className=" tradex-space-y-2">
        <label className="tradex-input-label !tradex-text-base tradex-mb-0 tradex-flex tradex-justify-between tradex-gap-6 tradex-items-center">
          <span>{t("Enter amount")}</span>
          <span>{t("Select currency")}</span>
        </label>
        <div className="tradex-input-field tradex-flex tradex-justify-between tradex-items-center">
          <input
            type="number"
            className="tradex-w-full !tradex-border-none tradex-bg-transparent tradex-text-sm tradex-text-title"
            id="amount-one"
            placeholder={t("Please enter 1 -2400000")}
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
                currency: e.target.value,
              });
            }}
          >
            <option value="" selected disabled hidden>
              {t("Select one")}
            </option>
            {currencyList
              .filter((item: any) => item.perfect_money_account !== null)
              .map((currency: any, index: any) => (
                <option value={currency.code} key={index}>
                  {currency.name}
                </option>
              ))}
          </select>
        </div>
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
            {walletlist.map((wallet: any, index: any) => (
              <option value={wallet.id} key={index}>
                {wallet.coin_type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {errorMessage.status && (
        <div className="alert alert-danger">{errorMessage.message}</div>
      )}

      <button
        className="tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-primary tradex-text-white"
        type="button"
        disabled={errorMessage.status === true}
        onClick={() => {
          convertCurrency(credential);
        }}
      >
        {t("Deposit")}
      </button>
    </div>
  );
};

export default PerfectMoney;
