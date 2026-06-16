import { CUstomSelect } from "components/common/CUstomSelect";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { BsQuestionSquareFill } from "react-icons/bs";

export const AddPostTwo = ({
  setAddStep,
  selectedAsset,
  data,
  selectedPayment,
  setSelectedPayment,
  selectedPaymentTime,
  setSelectedPaymentTime,
  amount,
  selectedCurrency,
  setAmount,
  getAvailableBalanceAction,
  uid,
}: any) => {
  const [PaymentOption, setPaymentOption] = useState([]);
  const [PaymentTime, setPaymentTime] = useState([]);
  const [minError, setMinError] = useState("");
  const [maxError, setMaxError] = useState("");
  const [limit, setLimit] = useState<any>({
    minimum_price: 0,
    maximum_price: 0,
  });
  const { t } = useTranslation("common");

  useEffect(() => {
    const value = data?.data?.assets.find(
      (item: any) => (item.coin_type = selectedAsset?.value)
    );
    setLimit({
      minimum_price: value.minimum_price,
      maximum_price: value.maximum_price,
    });
  }, [data?.data?.assets, selectedAsset?.value]);
  const handlePayment = (e: any) => {
    setSelectedPayment(e);
  };
  const handlePaymentTime = (e: any) => {
    setSelectedPaymentTime(e);
  };
  useEffect(() => {
    let payment_method: any = [];
    let payment_time: any = [];
    data?.data?.payment_method?.map((asset: any) => {
      const obj = {
        value: asset.uid,
        label: asset?.admin_pamynt_method?.name,
      };
      payment_method.push(obj);
    });
    data?.data?.payment_time?.map((asset: any) => {
      const obj = {
        value: asset.uid,
        label: asset.time.toString(),
      };
      payment_time.push(obj);
    });
    setPaymentOption(payment_method);
    setPaymentTime(payment_time);
  }, [data.data.payment_method, data.data.payment_time]);

  return (
    <div>
      <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
        <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
          <h2 className=" tradex-text-2xl tradex-leading-[30px] tradex-font-bold !tradex-text-title">
            {uid ? "Edit ads" : "Post ads"}
          </h2>
        </div>
        <div className="tradex-grid sm:tradex-grid-cols-2 tradex-gap-6">
          <div className="tradex-space-y-2">
            <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
              {t("Payment Method")}
            </label>

            <CUstomSelect
              options={PaymentOption}
              isSearchable={true}
              isMulti={true}
              placeholder={t("Add")}
              handleFunction={handlePayment}
              defaultValue={selectedPayment}
            />

            <small>{t("Select up to 5 payment methods")}</small>
          </div>
          <div className="tradex-space-y-2">
            <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
              {t("Payment Time Limit (in Minutes)")}
            </label>

            <CUstomSelect
              options={PaymentTime}
              isSearchable={false}
              placeholder={t("Select payment time")}
              handleFunction={handlePaymentTime}
              defaultValue={selectedPaymentTime}
            />
          </div>
          <div className="tradex-space-y-2">
            <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
              {" "}
              {t("Order Limit:")}
            </label>
            <div className="tradex-flex tradex-items-center tradex-justify-between tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md tradex-text-sm !tradex-text-body">
              <input
                type="number"
                placeholder={t("Min limit")}
                value={amount.min_limit}
                onChange={(e) => {
                  setAmount({
                    ...amount,
                    min_limit: e.target.value,
                  });
                }}
                className=" !tradex-border-0 tradex-w-full tradex-bg-transparent"
              />
              <span className=" tradex-text-nowrap tradex-text-body">
                {selectedCurrency?.value}
              </span>
            </div>
            {minError && <span className="text-danger">{minError}</span>}
          </div>
          <div className="tradex-space-y-2">
            <label></label>
            <div className="tradex-flex tradex-items-center tradex-justify-between tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md tradex-text-sm !tradex-text-body">
              <input
                type="text"
                placeholder={t("Max limit")}
                value={amount.max_limit}
                onChange={(e) => {
                  setAmount({
                    ...amount,
                    max_limit: e.target.value,
                  });
                }}
                className=" !tradex-border-0 tradex-w-full tradex-bg-transparent"
              />

              <span className="tradex-text-nowrap tradex-text-body">
                {selectedCurrency?.value}
              </span>
            </div>
            {maxError && <span className="text-danger">{maxError}</span>}
          </div>
          <div className="tradex-space-y-2">
            <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold !tradex-mb-0">
              {" "}
              {t("Total Amount:")}
            </label>
            <div className="tradex-flex tradex-items-center tradex-justify-between tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded-md tradex-text-sm !tradex-text-body">
              <input
                type="number"
                placeholder="0.00"
                value={amount.amount}
                onChange={(e) => {
                  setAmount({
                    ...amount,
                    amount: e.target.value,
                  });
                }}
                className=" !tradex-border-0 tradex-w-full tradex-bg-transparent"
              />

              <span className="tradex-text-nowrap tradex-text-body">
                {selectedAsset?.value}
              </span>
            </div>
            <div className="adFromPriceInecDecButton mt-3">
              <button className=" py-2" onClick={getAvailableBalanceAction}>
                {t("Get all balance")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className=" tradex-mt-5 tradex-flex tradex-gap-6 tradex-items-center">
        <button
          onClick={() => setAddStep("stepOne")}
          className=" tradex-min-h-12 tradex-min-w-[157px] tradex-bg-body tradex-text-background-main tradex-rounded tradex-flex tradex-justify-center tradex-items-center tradex-text-base tradex-leading-[22px] tradex-font-bold"
        >
          {t("Previous")}
        </button>
        {selectedPayment.length > 0 && (
          <button
            onClick={() => setAddStep("stepThree")}
            className=" tradex-min-h-12 tradex-min-w-[157px] tradex-bg-primary tradex-text-white tradex-rounded tradex-flex tradex-justify-center tradex-items-center tradex-text-base tradex-leading-[22px] tradex-font-bold"
          >
            {t("Next")}
          </button>
        )}
      </div>
    </div>
  );
};
