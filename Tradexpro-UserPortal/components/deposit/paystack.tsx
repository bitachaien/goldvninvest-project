import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { GetPaystackPaymentUrl, globalConvertAmount } from "service/deposit";
import { UserSettingsApi } from "service/settings";
import { RootState } from "state/store";
import DepositGoogleAuth from "./deposit-g2fa";

const Paystack = ({ walletlist, method_id }: any) => {
  const { t } = useTranslation("common");
  const [email, setEmail] = useState("");
  const [credential, setCredential] = useState<any>({
    code: "",
  });
  const [calculatedValue, setCalculatedValue] = useState<any>({
    converted_amount: 0,
    rate: 0,
    fees: 0,
    net_amount: 0,
    coin_type: "",
  });
  const [walletID, setwalletID] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { settings } = useSelector((state: RootState) => state.common);
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
  // useEffect(() => {
  //   CheckG2faEnabled();
  // }, []);
  const [amount, setAmount] = useState("");
  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const response = await GetPaystackPaymentUrl(
      email,
      amount,
      walletID,
      1,
      "",
      method_id
    );
    if (response.success) {
      toast.success(response.message);
      setLoading(false);

      window.open(response.data.authorization_url, "_blank");
    } else {
      toast.error(response.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    convertAmount();
  }, [walletID, amount]);

  const convertAmount = async () => {
    if (!amount || !walletID) return;
    const newWallet = walletlist.find((item: any) => item.id == walletID);

    const response = await globalConvertAmount(
      "USD",
      newWallet?.coin_type,
      amount
    );

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    setCalculatedValue(response.data);
  };

  return (
    <div className="tradex-space-y-6">
      <p className=" tradex-text-base tradex-font-bold tradex-text-title">
        {t("Deposit With Paystack")}
      </p>
      <form className="tradex-space-y-6" onSubmit={onSubmit}>
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
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
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
              value={calculatedValue.converted_amount}
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
              value={walletID}
              onChange={(e) => {
                setwalletID(e.target.value);
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
        <div className=" tradex-space-y-2">
          <label className="tradex-input-label !tradex-text-base tradex-mb-0 tradex-flex tradex-justify-between tradex-gap-6 tradex-items-center">
            <span>{t("Enter Email address")}</span>
          </label>
          <input
            type="email"
            className="tradex-input-field !tradex-text-sm"
            id="amount-one"
            placeholder={t("Enter your email")}
            value={email}
            onChange={(e: any) => {
              setEmail(e.target.value);
            }}
          />
        </div>

        {email && amount && walletID && (
          <button
            disabled={loading}
            className="tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-primary tradex-text-white"
            type="submit"
          >
            {t(loading ? "Processing" : "Deposit")}
          </button>
        )}
      </form>
    </div>
  );
};

export default Paystack;
