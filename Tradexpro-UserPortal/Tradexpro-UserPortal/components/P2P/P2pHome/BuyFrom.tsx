import { CUstomSelect } from "components/common/CUstomSelect";
import { AMOUNT, AMOUNT_PRICE, BUY, SELL } from "helpers/core-constants";
import { useRouter } from "next/router";
import BackButton from "components/P2P/BackButton";
import { useEffect, useState } from "react";
import { TfiHandPointRight } from "react-icons/tfi";
import { toast } from "react-toastify";
import { getAvailableBalance } from "service/p2p";
import { placeP2POrderAction } from "state/actions/p2p";
import useTranslation from "next-translate/useTranslation";
import { BiArrowBack } from "react-icons/bi";

export const BuyFrom = ({
  details,
  rate,
  setRate,
  getRate,
  lastChanged,
  setlastChanged,
  ads_type,
  ads_id,
}: any) => {
  const router = useRouter();
  const [paymentMethods, setPaymethods] = useState([]);
  const { t } = useTranslation("common");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState();
  const getAvailableBalanceAction = async () => {
    const response = await getAvailableBalance(
      parseInt(ads_type) === BUY ? SELL : BUY,
      details?.ads?.coin_type,
      details?.ads?.uid
    );
    if (response.success) {
      //  setAmount({
      //    ...Amount,
      //    amount: response?.data?.balance,
      //  });
      setRate({ ...rate, amount: parseFloat(response?.data?.balance) });
      getRate(parseFloat(response?.data?.balance), null);
      setlastChanged(AMOUNT);
    } else {
      toast.error(response?.message);
    }
  };
  const handlePayment = (e: any) => {
    setSelectedPaymentMethod(e.value);
  };
  useEffect(() => {
    let PaymentMethods: any = [];
    details?.payment_methods?.map((item: any) =>
      PaymentMethods.push({
        value: item.uid,
        label: item?.admin_pamynt_method?.name,
      })
    );
    setPaymethods(PaymentMethods);
  }, [details]);
  return (
    <div className="tradex-pb-10 tradex-bg-background-main tradex-rounded-lg">
      <div className=" tradex-px-4  tradex-rounded-tl-lg tradex-rounded-tr-lg tradex-py-6  tradex-space-y-3 tradex-border-b tradex-border-background-primary">
        <h3 className=" tradex-text-[40px]  tradex-leading-[48px] !tradex-text-title">
          {t("Details")}
        </h3>
        <div
          onClick={() => {
            router.back();
          }}
          className=" tradex-flex tradex-gap-3 tradex-text-xl tradex-leading-6 tradex-text-body tradex-items-center tradex-cursor-pointer"
        >
          <BiArrowBack />
          {t("Back")}
        </div>
      </div>
      <div className="tradex-px-4 tradex-pt-6 tradex-grid lg:tradex-grid-cols-2 tradex-gap-6">
        <div className=" tradex-space-y-8">
          <div className=" tradex-grid sm:tradex-grid-cols-3 tradex-gap-8">
            <div className=" tradex-px-3 tradex-py-2 tradex-border tradex-border-background-primary tradex-rounded tradex-flex tradex-items-center tradex-gap-2.5">
              <div className=" tradex-min-w-8">
                <img
                  src="https://api-tradex.nftarttoken.xyz/images/avatars/yellow-hat.png"
                  alt=""
                  className=" tradex-max-w-8 tradex-max-h-8 tradex-h-8 tradex-w-8 tradex-rounded-full"
                />
              </div>
              <p className=" tradex-text-lg tradex-leading-6 tradex-text-title tradex-font-semibold">
                {details?.ads?.user?.first_name} {details?.ads?.user?.last_name}
              </p>
            </div>
            <div className=" tradex-px-3 tradex-py-2 sm:tradex-justify-center tradex-border tradex-border-background-primary tradex-rounded tradex-flex tradex-items-center tradex-gap-2.5">
              <p className=" tradex-text-lg tradex-leading-6 tradex-text-body tradex-font-semibold">
                {details?.orders} {t("orders")}
              </p>
            </div>
            <div className=" tradex-px-3 tradex-py-2 sm:tradex-justify-center tradex-border tradex-border-background-primary tradex-rounded tradex-flex tradex-items-center tradex-gap-2.5">
              <p className=" tradex-text-lg tradex-leading-6 tradex-text-body tradex-font-semibold">
                {details?.completion}% {t("completion")}
              </p>
            </div>
          </div>
          <div className=" tradex-px-4 tradex-pt-6 tradex-pb-10 tradex-border tradex-border-background-primary tradex-rounded-lg tradex-grid sm:tradex-grid-cols-2 tradex-gap-6">
            <div className=" tradex-space-y-2">
              <p className=" tradex-text-lg tradex-leading-[22px] tradex-text-title tradex-font-semibold">
                {t("Price")}
              </p>
              <div className="tradex-min-h-[48px] tradex-flex tradex-items-center tradex-border tradex-border-background-primary tradex-rounded tradex-text-body tradex-text-base tradex-leading-5 tradex-px-3 tradex-py-[14px]">
                {parseFloat(details?.price)} {details?.ads?.currency}
              </div>
            </div>
            <div className=" tradex-space-y-2">
              <p className=" tradex-text-lg tradex-leading-[22px] tradex-text-title tradex-font-semibold">
                {t("Available")}
              </p>
              <div className="tradex-min-h-[48px] tradex-font-semibold tradex-flex tradex-items-center tradex-border tradex-border-background-primary tradex-rounded tradex-text-primary tradex-text-base tradex-leading-5 tradex-px-3 tradex-py-[14px]">
                {parseFloat(details?.available)} {details?.ads?.coin_type}
              </div>
            </div>
            <div className="sm:tradex-col-span-2 tradex-space-y-2">
              <p className=" tradex-text-lg tradex-leading-[22px] tradex-text-title tradex-font-semibold">
                {t("Payment Time Limit")}
              </p>
              <div className="tradex-min-h-[48px] tradex-flex tradex-items-center tradex-border tradex-border-background-primary tradex-rounded tradex-text-body tradex-text-base tradex-leading-5 tradex-px-3 tradex-py-[14px]">
                {details?.ads?.payment_times} {t("Minutes")}
              </div>
            </div>
            {details?.ads?.terms && (
              <div className="sm:tradex-col-span-2 tradex-space-y-2">
                <p className=" tradex-text-lg tradex-leading-[22px] tradex-text-title tradex-font-semibold">
                  {t("Terms and Conditions")}
                </p>
                <div className="tradex-min-h-[48px] tradex-flex tradex-items-center tradex-border tradex-border-background-primary tradex-rounded tradex-text-body tradex-text-base tradex-leading-5 tradex-px-3 tradex-py-[14px]">
                  {details?.ads?.terms}
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!selectedPaymentMethod) {
                toast.error("Please select a payment method");
                return;
              }
              if (!lastChanged) {
                toast.error("Field cannot be 0, please enter a value");
                return;
              }
              placeP2POrderAction(
                parseInt(ads_type),
                ads_id,
                selectedPaymentMethod,
                lastChanged === AMOUNT_PRICE ? rate.amount_price : rate.amount,
                lastChanged,
                router
              );
              // if (response.success) {
              // }
            }}
          >
            <div className=" tradex-space-y-6">
              <div className=" tradex-grid sm:tradex-grid-cols-2 tradex-gap-4 tradex-px-4 tradex-pt-6 tradex-pb-10 tradex-border tradex-border-background-primary tradex-rounded-lg">
                <div className="tradex-space-y-2">
                  <label className="tradex-text-lg tradex-leading-[22px] tradex-text-title tradex-font-semibold tradex-mb-0">
                    {parseInt(ads_type) === BUY
                      ? "I want to pay"
                      : "I will receive"}
                  </label>
                  <div className="tradex-min-h-[48px]  tradex-w-full tradex-flex tradex-items-center tradex-justify-between tradex-border tradex-border-background-primary tradex-rounded tradex-text-body tradex-text-base tradex-leading-5 tradex-px-3 tradex-py-[14px]">
                    <input
                      type="text"
                      value={rate?.amount_price}
                      placeholder="233.0555 - 24.24240"
                      onChange={(e) => {
                        if (
                          Number(e.target.value) < 0 ||
                          isNaN(Number(e.target.value))
                        ) {
                          return;
                        }
                        if (!e.target.value) {
                          setRate({
                            ...rate,
                            amount_price: 0,
                          });
                          getRate(null, 0);
                          return;
                        }
                        setRate({
                          ...rate,
                          amount_price: e.target.value,
                        });
                        getRate(null, e.target.value);
                        setlastChanged(AMOUNT_PRICE);
                      }}
                      className=" !tradex-border-0 tradex-w-full tradex-bg-transparent"
                    />

                    <span className=" tradex-text-nowrap">
                      {details?.ads?.currency}
                    </span>
                  </div>
                  <p className=" tradex-text-xs tradex-leading-[14px] tradex-text-body">
                    {t("Min price")} {details?.ads?.minimum_trade_size}{" "}
                    {details?.ads?.currency}- Max price{" "}
                    {details?.ads?.maximum_trade_size} {details?.ads?.currency}
                  </p>
                </div>
                <div className="tradex-space-y-2">
                  <label className="tradex-text-lg tradex-leading-[22px] tradex-text-title tradex-font-semibold tradex-mb-0">
                    {parseInt(ads_type) === BUY
                      ? t("I will receive")
                      : t("I want to sell")}
                  </label>
                  <div className="tradex-min-h-[48px]  tradex-w-full tradex-flex tradex-items-center tradex-justify-between tradex-border tradex-border-background-primary tradex-rounded tradex-text-body tradex-text-base tradex-leading-5 tradex-px-3 tradex-py-[14px]">
                    <input
                      type="text"
                      placeholder="0.00"
                      value={rate?.amount}
                      onChange={(e) => {
                        if (
                          Number(e.target.value) < 0 ||
                          isNaN(Number(e.target.value))
                        ) {
                          return;
                        }
                        if (!e.target.value) {
                          setRate({ ...rate, amount: 0 });
                          getRate(0, null);
                          return;
                        }
                        setRate({ ...rate, amount: e.target.value });
                        getRate(e.target.value, null);
                        setlastChanged(AMOUNT);
                      }}
                      className="!tradex-border-0 tradex-w-full tradex-bg-transparent"
                    />

                    <span className=" tradex-text-nowrap">
                      {details?.ads?.coin_type}
                    </span>
                  </div>
                </div>
                
              </div>
              <div className="tradex-px-4 tradex-pt-6 tradex-pb-10 tradex-border tradex-border-background-primary tradex-rounded-lg tradex-space-y-8">
                <div className=" tradex-space-y-2">
                  <label className="tradex-text-lg tradex-leading-[22px] tradex-text-title tradex-font-semibold tradex-mb-0">
                    {t("Select payment method")}
                  </label>

                  <CUstomSelect
                    options={paymentMethods}
                    handleFunction={handlePayment}
                  />
                </div>

                <button
                  className=" tradex-rounded tradex-w-full tradex-min-h-12 tradex-flex tradex-justify-center tradex-items-center tradex-bg-primary tradex-text-white tradex-text-base tradex-leading-6"
                  type="submit"
                >
                  {parseInt(ads_type) === BUY ? "Buy" : "Sell"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
