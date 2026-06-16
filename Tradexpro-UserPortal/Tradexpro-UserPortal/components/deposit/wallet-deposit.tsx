import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  currencyDepositProcess,
  getCurrencyDepositRate,
} from "service/deposit";
import { UserSettingsApi } from "service/settings";
import { RootState } from "state/store";
import DepositGoogleAuth from "./deposit-g2fa";

const infoList = [
  "Login to your Perfect Money account.",
  "Click the Settings Tab.",
  'Click the "Change Security Settings" link under the Security section.',
  'On the page that appears, click the "Enable" button on the API section.',
  'And then click the "Edit" button below this API section.',
  "A form will appear with a field for IP.",
];

const WalletDeposit = ({ walletlist, method_id }: any) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { settings } = useSelector((state: RootState) => state.common);
  const [credential, setCredential] = useState<any>({
    wallet_id: null,
    payment_method_id: method_id ? method_id : null,
    amount: 0,
    from_wallet_id: null,
    code: "",
  });
  const [calculatedValue, setCalculatedValue] = useState<any>({
    calculated_amount: 0,
    rate: 0,
    fees: 0,
    net_amount: 0,
    coin_type: "",
  });
  const [available, setAvailable] = useState<any>(0);

  const [errorMessage, setErrorMessage] = React.useState({
    status: false,
    message: "",
  });
  const CheckG2faEnabled = async () => {
    const { data } = await UserSettingsApi();
    const { user } = data;
    if (
      user.google2fa !== 1 &&
      parseInt(settings.currency_deposit_2fa_status) === 1
    ) {
      setErrorMessage({
        status: true,
        message: t("Google 2FA is not enabled, Please enable Google 2FA fist"),
      });
    }
  };
  const getCurrencyRate = async () => {
    if (
      credential.wallet_id &&
      credential.payment_method_id &&
      credential.amount &&
      credential.from_wallet_id
    ) {
      const response = await getCurrencyDepositRate(credential);
      setCalculatedValue(response.data);
    }
  };
  const convertCurrency = async (credential: any) => {
    if (
      credential.wallet_id &&
      credential.payment_method_id &&
      credential.amount &&
      credential.from_wallet_id
    ) {
      const res = await currencyDepositProcess(credential);
      if (res.success) {
        toast.success(res.message);
        router.push("/user/currency-deposit-history");
      } else {
        toast.error(res.message);
      }
    } else {
      toast.error(t("Please provide all information's"));
    }
  };
  useEffect(() => {
    getCurrencyRate();
    CheckG2faEnabled();
  }, [credential]);
  return (
    <div className=" tradex-space-y-6">
      <p className=" tradex-text-base tradex-font-bold tradex-text-title">
        {t("Wallet Deposit")}
      </p>
      <div className=" tradex-space-y-6">
        <div className=" tradex-space-y-2">
          <label className="tradex-input-label !tradex-text-base tradex-mb-0 tradex-flex tradex-justify-between tradex-gap-6 tradex-items-center">
            <span>{t("From")}</span>
            <span>
              {t("Available Balance: ")}
              {parseFloat(available)}
            </span>
          </label>
          <div className="tradex-input-field tradex-flex tradex-justify-between tradex-items-center">
            <input
              type="number"
              className="tradex-w-full !tradex-border-none tradex-bg-transparent tradex-text-sm tradex-text-title"
              id="amount-one"
              placeholder={t("Please enter 1-2400000")}
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
                  from_wallet_id: parseInt(e.target.value),
                });
                setAvailable(
                  walletlist.find(
                    (wallet: any) =>
                      parseInt(wallet.id) === parseInt(e.target.value)
                  ).balance
                );
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
        </div>
        <div className=" tradex-space-y-2">
          <label className="tradex-input-label !tradex-text-base tradex-mb-0 tradex-flex tradex-justify-between tradex-gap-6 tradex-items-center">
            <span>{t("To")}</span>
          </label>
          <div className="tradex-input-field tradex-flex tradex-justify-between tradex-items-center">
            <input
              type="text"
              className="tradex-w-full !tradex-border-none tradex-bg-transparent tradex-text-sm tradex-text-title"
              id="amount-one"
              disabled
              value={calculatedValue.calculated_amount}
              placeholder={t("Please enter 10 -2400000")}
            />
            <select
              className=" tradex-w-[100px]  md:tradex-w-[150px] tradex-text-sm !tradex-text-title !tradex-bg-background-primary tradex-px-4 !tradex-border-0 !tradex-border-l !tradex-border-solid !tradex-border-title tradex-min-w-[100px] md:tradex-min-w-[150px]"
              id="currency-one"
              onChange={(e) => {
                setCredential({
                  ...credential,
                  wallet_id: parseInt(e.target.value),
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
        <DepositGoogleAuth
          convertCurrency={convertCurrency}
          credential={credential}
          setCredential={setCredential}
        />
        {errorMessage.status && (
          <div className="alert alert-danger">{errorMessage.message}</div>
        )}
        {parseInt(settings.currency_deposit_2fa_status) === 1 ? (
          <button
            className="tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-primary tradex-text-white"
            type="button"
            data-target="#exampleModal"
            disabled={errorMessage.status === true}
            data-toggle="modal"
          >
            Deposit
          </button>
        ) : (
          <button
            className="tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-primary tradex-text-white"
            type="button"
            disabled={errorMessage.status === true}
            onClick={() => {
              convertCurrency(credential);
            }}
          >
            Deposit
          </button>
        )}
      </div>
    </div>
  );
};

export default WalletDeposit;
