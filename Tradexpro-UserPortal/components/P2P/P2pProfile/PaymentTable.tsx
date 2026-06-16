import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";
import { GoPlus } from "react-icons/go";
import { useDeleteP2PBank, useGetP2PBankListAction } from "state/actions/p2p";

export const PaymentTable = () => {
  const { t } = useTranslation("common");

  const { error, loading, refetch, userBankLists } = useGetP2PBankListAction();

  const { deleteBankAction, loading: isDeleteLoading } = useDeleteP2PBank();

  const handleBankItemDelete = async (bank_id: any) => {
    if (!bank_id) return;
    const confirm = window.confirm("Are you sure you want to proceed?");
    if (!confirm) return;
    await deleteBankAction(bank_id);
    refetch();
  };

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
        {userBankLists?.map((item: any, index: any) => (
          <div
            className="tradex-flex tradex-gap-6 tradex-justify-between tradex-items-center tradex-pb-3 tradex-border-b tradex-border-background-primary"
            key={index}
          >
            <p className=" tradex-min-w-[120px]  tradex-text-nowrap tradex-text-base tradex-leading-[22px] tradex-font-semibold tradex-text-title">
              {item?.bank_form?.title}
            </p>
            <div className=" tradex-flex tradex-items-center tradex-gap-4">
              <Link href={"/p2p/add-payment-method?edit=true&id=" + item?.id}>
                <a className=" tradex-rounded tradex-text-sm tradex-leading-[22px] tradex-font-semibold tradex-min-h-10 tradex-min-w-[92px] tradex-px-3 tradex-bg-primary !tradex-text-white tradex-flex tradex-justify-center tradex-items-center">
                  {t("Edit")}
                </a>
              </Link>
              <button
                onClick={() => handleBankItemDelete(item?.id)}
                disabled={isDeleteLoading}
                className=" tradex-cursor-pointer tradex-rounded tradex-text-sm tradex-leading-[22px] tradex-font-semibold tradex-min-h-10 tradex-min-w-[92px] tradex-px-3 tradex-bg-body !tradex-text-background-main tradex-flex tradex-justify-center tradex-items-center"
              >
                <b>{t("Delete")}</b>
              </button>
            </div>
          </div>
        ))}
        {userBankLists?.length == 0 && (
          <div className=" tradex-p-5 tradex-text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              className="tradex-mx-auto tradex-h-20 tradex-w-20 tradex-text-muted-400"
              width="1em"
              height="1em"
              viewBox="0 0 48 48"
            >
              <circle
                cx="27.569"
                cy="23.856"
                r="7.378"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></circle>
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m32.786 29.073l1.88 1.88m-1.156 1.155l2.311-2.312l6.505 6.505l-2.312 2.312z"
              ></path>
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M43.5 31.234V12.55a3.16 3.16 0 0 0-3.162-3.163H7.662A3.16 3.16 0 0 0 4.5 12.55v18.973a3.16 3.16 0 0 0 3.162 3.162h22.195"
              ></path>
            </svg>
            <p className="tradex-text-base tradex-font-medium tradex-text-title">
              {t("No Payment Method Found")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
