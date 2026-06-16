import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React, { useState } from "react";
import { GoPlus } from "react-icons/go";
import {
  deletePaymentMethodsAction,
  getPaymentMethodsAction,
} from "state/actions/p2p";

export const PaymentTable = () => {
  const { t } = useTranslation("common");

  const [sortingInfo, setSortingInfo] = useState<any>({
    column_name: "created_at",
    order_by: "desc",
  });
  const [processing, setProcessing] = useState<boolean>(false);
  const [history, setHistory] = useState<any>([]);
  const [stillHistory, setStillHistory] = useState<any>([]);
  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    getPaymentMethodsAction(
      10,
      parseInt(number),
      setHistory,
      setProcessing,
      setStillHistory
    );
  };
  const getReport = async () => {
    getPaymentMethodsAction(10, 1, setHistory, setProcessing, setStillHistory);
  };
  React.useEffect(() => {
    getReport();
    return () => {
      setHistory([]);
    };
  }, []);
  return (
    <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
      <div className=" tradex-flex tradex-flex-col sm:tradex-flex-row tradex-gap-4 sm:tradex-justify-between sm:tradex-items-center tradex-pb-4 tradex-border-b tradex-border-background-primary">
        <h5 className=" tradex-text-xl tradex-leading-6 !tradex-text-title">
          {t("P2P Payment Methods")}
        </h5>

        <Link href={"/p2p/add-payment-method"}>
          <button className=" tradex-min-h-12 tradex-px-3 tradex-flex tradex-justify-center tradex-items-center tradex-border tradex-border-background-primary tradex-rounded tradex-text-base tradex-leading-5 tradex-text-body tradex-font-medium">
            <GoPlus className="mr-2" /> {t("Add a payment method")}
          </button>
        </Link>
      </div>
      <div className=" tradex-space-y-4 tradex-overflow-x-auto">
        {history.map((item: any, index: any) => (
          <div
            className="tradex-flex tradex-gap-6 tradex-justify-between tradex-items-center tradex-pb-3 tradex-border-b tradex-border-background-primary"
            key={index}
          >
            <p className=" tradex-min-w-[120px]  tradex-text-nowrap tradex-text-base tradex-leading-[22px] tradex-font-semibold tradex-text-title">
              {item?.admin_pamynt_method?.name}
            </p>
            <div className=" tradex-flex tradex-items-center tradex-gap-4">
              <Link href={"/p2p/add-payment-method?edit=true&uid=" + item?.uid}>
                <a className=" tradex-rounded tradex-text-sm tradex-leading-[22px] tradex-font-semibold tradex-min-h-10 tradex-min-w-[92px] tradex-px-3 tradex-bg-primary !tradex-text-white tradex-flex tradex-justify-center tradex-items-center">
                  {t("Edit")}
                </a>
              </Link>
              <a
                onClick={() => {
                  deletePaymentMethodsAction(
                    10,
                    1,
                    setHistory,
                    setProcessing,
                    setStillHistory,
                    item?.uid
                  );
                }}
                className=" tradex-cursor-pointer tradex-rounded tradex-text-sm tradex-leading-[22px] tradex-font-semibold tradex-min-h-10 tradex-min-w-[92px] tradex-px-3 tradex-bg-body !tradex-text-background-main tradex-flex tradex-justify-center tradex-items-center"
              >
                <b>{t("Delete")}</b>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
