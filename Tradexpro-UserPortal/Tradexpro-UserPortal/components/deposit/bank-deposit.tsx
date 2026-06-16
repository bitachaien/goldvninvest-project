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
import { AiOutlineCloudUpload } from "react-icons/ai";
const BankDeposit = ({ currencyList, walletlist, method_id, banks }: any) => {
  const { t } = useTranslation("common");
  const inputRef = useRef(null);
  const { settings } = useSelector((state: RootState) => state.common);
  const handleClick = () => {
    // 👇️ open file input box on click of other element
    //@ts-ignore
    inputRef.current.click();
  };
  const prepareCopyData = (data: any) => {
    const copyData = `Account Holder Name:${data.account_holder_name},
     Bank Name:${data.bank_name}, 
     Bank Address:${data.bank_address}, 
     Country:${data.country}, 
     Swift Code:${data.swift_code}, 
     Account Number:${data.iban}`;
    copyTextById(copyData);
  };

  const handleFileChange = (event: any) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }
    event;
    if (fileObj.size > 2 * 1024 * 1024) {
      toast.error(t("File size must be less than 2MB"));
      return;
    }
    setDoc(event.target.files[0]);
  };
  const [calculatedValue, setCalculatedValue] = useState<any>({
    calculated_amount: 0,
    rate: 0,
    fees: 0,
    net_amount: 0,
    coin_type: "",
  });

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
  const [credential, setCredential] = useState<any>({
    wallet_id: null,
    payment_method_id: method_id ? parseInt(method_id) : null,
    amount: 0,
    currency: null,
    bank_id: null,
    code: "",
  });
  const router = useRouter();
  const [bankInfo, setBankInfo] = useState({});
  const [doc, setDoc] = useState<any>(null);
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
    if (
      credential.wallet_id &&
      credential.payment_method_id &&
      credential.amount &&
      credential.currency &&
      credential.bank_id &&
      doc
    ) {
      const formData: any = new FormData();
      formData.append("wallet_id", credential.wallet_id);
      formData.append("payment_method_id", credential.payment_method_id);
      formData.append("amount", credential.amount);
      formData.append("currency", credential.currency);
      formData.append("bank_id", credential.bank_id);
      formData.append("bank_receipt", doc);
      formData.append("code", credential.code);

      const res = await currencyDepositProcess(formData);
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
        {t("Bank Deposit")}
      </p>

      <div className=" tradex-space-y-6">
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
              {currencyList.map((currency: any, index: any) => (
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
              className=" tradex-w-[100px]  md:tradex-w-[150px] tradex-text-sm !tradex-text-title !tradex-bg-background-primary tradex-px-4 !tradex-border-0 !tradex-border-l !tradex-border-solid !tradex-border-title tradex-min-w-[100px] md:tradex-min-w-[150px]"
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
            <span>{t("Select Bank")}</span>
          </label>
          <div className="tradex-input-field tradex-flex tradex-justify-between tradex-items-center">
            <select
              name="method"
              className=" tradex-w-full tradex-text-sm !tradex-text-title !tradex-bg-background-primary !tradex-border-0"
              onChange={(e: any) => {
                setCredential({
                  ...credential,
                  bank_id: parseInt(e.target.value),
                });
                setBankInfo(
                  banks.find(
                    (bank: any) => bank.id === parseInt(e.target.value)
                  )
                );
              }}
            >
              <option>{t("Select bank")}</option>
              {banks?.map((bank: any, index: any) => (
                <option key={index} value={bank.id}>
                  {bank.bank_name}
                </option>
              ))}
            </select>
          </div>
          {credential.bank_id && (
            <div>
              <div className="split-title">
                <span className="file-lable">{t("Bank details")}</span>
                <span
                  className="file-lable copy-btn"
                  onClick={() => {
                    prepareCopyData(bankInfo);
                  }}
                >
                  {t("Copy")}
                </span>
              </div>
              <BankDetails bankInfo={bankInfo} />
            </div>
          )}
        </div>
        <div className=" tradex-space-y-2">
          <label className="tradex-input-label !tradex-text-base tradex-mb-0 tradex-flex tradex-justify-between tradex-gap-6 tradex-items-center">
            <span>{t("Select document")}</span>
          </label>
          <div className="tradex-min-h-[60px] tradex-border tradex-border-background-primary tradex-rounded-lg tradex-flex tradex-justify-center tradex-items-center !tradex-py-4 ">
            {/* @ts-ignore */}
            <label
              htmlFor="upload-photo"
              className="tradex-cursor-pointer tradex-mb-0"
              onClick={handleClick}
            >
              {/* @ts-ignore */}
              {doc ? (
                doc.name
              ) : (
                <span className=" tradex-text-base tradex-font-medium tradex-text-body">
                  {t("Browse")}
                </span>
              )}
            </label>
            <input
              ref={inputRef}
              type="file"
              onChange={handleFileChange}
              className="d-none"
            />
          </div>
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
          {t("Deposit")}
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
          {t("Deposit")}
        </button>
      )}
    </div>
  );
};

export default BankDeposit;
