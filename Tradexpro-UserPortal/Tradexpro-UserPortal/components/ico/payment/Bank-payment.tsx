import { BANK_DEPOSIT } from "helpers/core-constants";
import useTranslation from "next-translate/useTranslation";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { TokenBuyIcoBankAction } from "state/actions/launchpad";
import PaymentDetails from "./paymentDetails";
import AmountCheck from "./AmountCheck";
import BankDetails from "components/deposit/bankDetails";

const BankPayment = ({ pageInfo, initialData, phaseData }: any) => {
  const { t } = useTranslation("common");
  const [loading, setLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [doc, setDoc] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const [data, setData] = useState<any>({
    amount: null,
    bank_id: null,
    pay_currency: null,
    referance: "",
  });
  const inputRef = useRef(null);
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
  const handleClick = () => {
    // 👇️ open file input box on click of other element
    //@ts-ignore
    inputRef.current.click();
  };
  return (
    <form
      className=" tradex-grid md:tradex-grid-cols-2 tradex-gap-6"
      onSubmit={(e: any) => {
        e.preventDefault();
        TokenBuyIcoBankAction(
          initialData,
          setLoading,
          doc,
          data.bank_id,
          data.amount,
          BANK_DEPOSIT,
          pageInfo.ref,
          data.pay_currency
        );
      }}
    >
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
          {t("Select Bank")}
        </label>
        <select
          name="bank"
          className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-background-main`}
          required
          onChange={(e) => {
            setData({
              ...data,
              bank_id: e.target.value,
            });
            const findBank = pageInfo.bank.find(
              (bank: any) => parseInt(bank.id) === parseInt(e.target.value)
            );
            setSelectedBank(findBank);
          }}
        >
          <option value="">{t("Select Bank")}</option>
          {pageInfo?.bank?.map((item: any, index: any) => (
            <option value={item.id} key={index} onClick={() => {}}>
              {item?.bank_name}
            </option>
          ))}
        </select>
      </div>
      <div className="tradex-space-y-2">
        <label
          className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
          htmlFor=""
        >
          {t("Select Currency")}
        </label>
        <select
          name="bank"
          className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-background-main`}
          required
          onChange={(e) => {
            setData({
              ...data,
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
      <div className="tradex-space-y-2">
        <label
          className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
          htmlFor=""
        >
          {t("Bank Referance")}
        </label>
        <input
          type="text"
          name="amount"
          value={pageInfo.ref}
          placeholder={t("Bank Referance")}
          onClick={() => {
            toast.success("Bank Referance Copied");
          }}
          className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent`}
        />
        <small>
          {t("Copy this referance for further validation and bank payment")}
        </small>
      </div>
      <div className="tradex-space-y-2 md:tradex-col-span-2">
        <div className="file-upload-wrapper !tradex-rounded !tradex-border-background-primary">
          {/* @ts-ignore */}
          <label
            htmlFor="upload-photo"
            className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
            onClick={handleClick}
          >
            {/* @ts-ignore */}
            {doc ? doc.name : t("Browse")}
          </label>
          <input
            ref={inputRef}
            type="file"
            onChange={handleFileChange}
            className="d-none"
          />
        </div>
      </div>
      {selectedBank && (
        <div className="tradex-space-y-4 md:tradex-col-span-2">
          <h1 className=" tradex-text-xl !tradex-text-title">
            {t("Bank information")}
          </h1>
          <BankDetails bankInfo={selectedBank} />
        </div>
      )}
      <div className=" md:tradex-col-span-2">
        {data.pay_currency && data.amount && initialData.phase_id ? (
          <PaymentDetails
            currency={data.pay_currency}
            amount={data.amount}
            phase_id={initialData.phase_id}
            token_id={initialData.token_id}
            payment_method={BANK_DEPOSIT}
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
        {loading ? "Please Wait" : t("Make Payment")}
      </button>
    </form>
  );
};

export default BankPayment;
