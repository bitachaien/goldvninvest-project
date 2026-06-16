import useTranslation from "next-translate/useTranslation";
import React, { useEffect } from "react";
import { FaHome } from "react-icons/fa";
import { ImListNumbered } from "react-icons/im";
import { copyTextById, formateZert } from "common";
import WalletGoogleAuth from "components/wallet/wallet-google-auth";
import { UserSettingsApi } from "service/settings";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import { RootState } from "state/store";
import { useSelector } from "react-redux";
import { WalletWithdrawProcessApiAction } from "state/actions/wallet";
import {
  WITHDRAW_FESS_FIXED,
  WITHDRAW_FESS_PERCENT,
} from "helpers/core-constants";
import { getFeeAmountApi } from "service/wallet";

export const WithdrawComponent = ({ responseData, router, fullPage }: any) => {
  const { t } = useTranslation("common");
  const { settings } = useSelector((state: RootState) => state.common);
  const [selectedNetwork, setSelectedNetwork] = React.useState(
    responseData?.data && responseData?.data[0]
  );
  const [withdrawalCredentials, setWithdrawalCredentials] = React.useState({
    wallet_id: responseData?.wallet?.id,
    code: "",
    address: "",
    amount: "",
    note: "withdrawal",
    memo: "",
    network_type: selectedNetwork?.network_type ?? "",
  });

  const [feesData, setFeesData] = React.useState<any>({});
  const [errorMessage, setErrorMessage] = React.useState({
    status: false,
    message: "",
  });
  const [processing, setProcessing] = React.useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await WalletWithdrawProcessApiAction(
      withdrawalCredentials,
      setProcessing
    );
    if (response.success) {
      setWithdrawalCredentials({
        wallet_id: responseData?.wallet?.id,
        code: "",
        address: "",
        amount: "",
        note: "withdrawal",
        memo: "",
        network_type: selectedNetwork?.network_type ?? "",
      });
    }
  };
  const CheckG2faEnabled = async () => {
    const { data } = await UserSettingsApi();
    const { user } = data;
    if (
      !user.google2fa_secret &&
      parseInt(settings.two_factor_withdraw) === 1
    ) {
      setErrorMessage({
        status: true,
        message: "Google 2FA is not enabled, Please enable Google 2FA fist",
      });
    }
  };
  React.useEffect(() => {
    if (responseData?.data && responseData?.data[0]) {
      setSelectedNetwork(responseData?.data[0]);
    }
  }, [responseData?.data[0]]);
  React.useEffect(() => {
    setWithdrawalCredentials({
      ...withdrawalCredentials,
      wallet_id: responseData?.wallet?.id,
    });

    CheckG2faEnabled();
  }, [responseData?.wallet?.id]);

  React.useEffect(() => {
    setWithdrawalCredentials({
      ...withdrawalCredentials,
      network_type: selectedNetwork?.network_type,
    });
  }, [selectedNetwork?.network_type]);

  const checkNetworkFunc = (networkId: any) => {
    if (networkId == 4) {
      return `(ERC20 Token)`;
    }
    if (networkId == 5) {
      return `(BEP20 Token)`;
    }
    if (networkId == 6) {
      return `(TRC20 Token)`;
    }
    return "";
  };

  useEffect(() => {
    if (withdrawalCredentials?.address && withdrawalCredentials?.amount) {
      getFeeAmount();
    }
  }, [withdrawalCredentials]);

  const getFeeAmount = async () => {
    const response = await getFeeAmountApi(withdrawalCredentials);
    if (!response.success) {
      return;
    }
    setFeesData(response.data);
  };

  return (
    <div className="tradex-space-y-6">
      <div className=" tradex-space-y-2">
        <p className=" tradex-input-label tradex-mb-0">{t("Total Balance")}</p>
        <div className="tradex-input-field tradex-flex tradex-justify-between tradex-items-center">
          <div className=" tradex-flex tradex-gap-2 tradex-items-center">
            <img
              className=" tradex-max-w-[25px] tradex-max-h-[25px] tradex-object-cover tradex-object-center"
              src={responseData?.wallet?.coin_icon || "/bitcoin.png"}
              alt="coin"
              width="25px"
              height="25px"
            />
            <p className=" tradex-text-sm tradex-text-body">
              {responseData?.wallet?.coin_type}
            </p>
          </div>

          <p className="tradex-text-sm tradex-text-body">
            {responseData?.wallet?.balance
              ? parseFloat(responseData?.wallet?.balance).toFixed(10) +
                " " +
                responseData?.wallet?.coin_type
              : "Loading"}
          </p>
        </div>
      </div>

      <div className=" tradex-space-y-6">
        {responseData?.wallet.coin_type == "USDT" &&
          parseInt(responseData?.wallet.network) === 1 && (
            <div className="tradex-space-y-2">
              <p className="tradex-input-label">{t("Select Network")}</p>
              <select
                name="currency"
                className="tradex-input-field !tradex-bg-background-primary !tradex-border-solid !tradex-border !tradex-border-background-primary"
                onChange={(e) => {
                  const findObje = responseData?.data?.find(
                    (x: any) => x.id === parseInt(e.target.value)
                  );
                  setSelectedNetwork(findObje);
                }}
              >
                {responseData?.data?.map((item: any, index: number) => (
                  <option value={item.id} key={index}>
                    {item?.network_name}
                  </option>
                ))}
              </select>
            </div>
          )}

        <div className="tradex-space-y-2">
          <p className="tradex-input-label">{t("Address")}</p>
          <div className=" tradex-space-y-1">
            <div className="tradex-input-field tradex-flex tradex-justify-between tradex-items-center">
              <input
                type="text"
                className=" tradex-w-full !tradex-border-none tradex-bg-transparent tradex-text-sm"
                id="address"
                name="address"
                placeholder={t("Address")}
                value={withdrawalCredentials.address}
                onChange={(e) => {
                  setWithdrawalCredentials({
                    ...withdrawalCredentials,
                    address: e.target.value,
                  });
                }}
              />
              <span className="input-address-bar-btn">
                <FaHome />
              </span>
            </div>

            <p className=" tradex-text-red-600 tradex-text-xs">
              {t(
                `Only enter a ${
                  responseData?.wallet?.coin_type ?? ""
                } ${checkNetworkFunc(
                  responseData?.wallet?.network
                )} address in this field. Otherwise the asset you withdraw, may be lost.`
              )}
            </p>
          </div>
        </div>

        <div className="tradex-space-y-2">
          <p className="tradex-input-label">{t("Amount")}</p>
          <div className=" tradex-space-y-1">
            <div className="tradex-input-field tradex-flex tradex-justify-between tradex-items-center">
              <input
                type="text"
                className="tradex-w-full !tradex-border-none tradex-bg-transparent tradex-text-sm"
                id="amountWithdrawal"
                name="amount"
                placeholder={t("AMOUNT To Withdraw")}
                value={withdrawalCredentials.amount}
                onChange={(e) => {
                  setWithdrawalCredentials({
                    ...withdrawalCredentials,
                    amount: e.target.value,
                  });
                }}
              />
              <span className="input-address-bar-btn">
                <ImListNumbered />
              </span>
            </div>
            {Object.keys(feesData).length > 0 && (
              <p className="tradex-text-body tradex-text-xs">
                {t(
                  `You will be charged ${feesData?.fees} ${feesData?.coin_type} as Withdrawal Fee for this withdrawal.`
                )}
              </p>
            )}
            {responseData?.wallet?.withdrawal_fees_type ==
              WITHDRAW_FESS_PERCENT && (
              <p className=" tradex-text-xs tradex-text-body">
                <span className=" tradex-mr-2">
                  {t("Fees ")}
                  {parseFloat(responseData?.wallet?.withdrawal_fees).toFixed(
                    8
                  )}{" "}
                  %
                </span>
                <span className="tradex-mr-2">
                  {t("Min withdraw ")}{" "}
                  {parseFloat(responseData?.wallet?.minimum_withdrawal).toFixed(
                    5
                  )}
                  {responseData?.wallet?.coin_type}
                </span>
                <span className="tradex-mr-2">
                  {t("Max withdraw")}{" "}
                  {parseFloat(responseData?.wallet?.maximum_withdrawal)}{" "}
                  {responseData?.wallet?.coin_type}
                </span>
              </p>
            )}
          </div>
        </div>
        <div className="tradex-space-y-2">
          <p className=" tradex-input-label">
            {t("Memo")} ({t("optional")})
          </p>
          <div className=" tradex-space-y-1">
            <input
              type="text"
              className="tradex-input-field tradex-text-sm"
              id="memo"
              name="memo"
              placeholder={t("Memo if needed")}
              value={withdrawalCredentials.memo}
              onChange={(e) => {
                setWithdrawalCredentials({
                  ...withdrawalCredentials,
                  memo: e.target.value,
                });
              }}
            />

            <p className=" tradex-text-xs tradex-text-body">
              {t(
                `Add your memo if needed but please ensure it that's correct, otherwise you lost coin.`
              )}
            </p>
          </div>
        </div>

        <WalletGoogleAuth
          handleSubmit={handleSubmit}
          withdrawalCredentials={withdrawalCredentials}
          setWithdrawalCredentials={setWithdrawalCredentials}
          processing={processing}
        />
        <input type="hidden" name="wallet_id" value="19" />
        {errorMessage.status && (
          <div className="alert alert-danger">{errorMessage.message}</div>
        )}
        {parseInt(settings.two_factor_withdraw) === 1 ? (
          <button
            type="button"
            className={` ${
              (withdrawalCredentials.address === "" ||
                withdrawalCredentials.amount === "" ||
                errorMessage.status === true ||
                processing) &&
              "tradex-cursor-not-allowed"
            } tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-primary tradex-text-white`}
            data-target="#exampleModal"
            disabled={
              withdrawalCredentials.address === "" ||
              withdrawalCredentials.amount === "" ||
              errorMessage.status === true ||
              processing
            }
            data-toggle="modal"
            onClick={() => {
              setErrorMessage({
                status: false,
                message: "",
              });
            }}
          >
            {t("Withdraw")}
          </button>
        ) : (
          <button
            className={` ${
              (withdrawalCredentials.address === "" ||
                withdrawalCredentials.amount === "" ||
                processing) &&
              "tradex-cursor-not-allowed"
            } tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-primary tradex-text-white`}
            type="button"
            disabled={
              withdrawalCredentials.address === "" ||
              withdrawalCredentials.amount === "" ||
              processing
            }
            onClick={handleSubmit}
          >
            {t("Withdraw")}
          </button>
        )}
      </div>
    </div>
  );
};
