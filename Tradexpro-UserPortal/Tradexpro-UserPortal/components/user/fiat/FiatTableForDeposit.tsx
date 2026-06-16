import React, { useState } from "react";
import moment from "moment";
import useTranslation from "next-translate/useTranslation";
import FiatHistoryModal from "components/gift-cards/modal/FiatHistoryModal";
export default function FiatTableForDeposit({ data }: any) {
  const { t } = useTranslation("common");
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [modalItem, setModalItem] = useState<any>({});
  return (
    <>
      <div className="tradex-overflow-x-auto">
        <table className="tradex-w-full tradex-border-separate tradex-border-spacing-y-2">
          <thead>
            <tr className="tradex-h-[44px]">
              <th
                scope="col"
                className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[80px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
              >
                Created At
              </th>
              <th
                scope="col"
                className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[80px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
              >
                Payment Method
              </th>
              <th
                scope="col"
                className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[80px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
              >
                Payment Title
              </th>
              <th
                scope="col"
                className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[80px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
              >
                Coin
              </th>
              <th
                scope="col"
                className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[80px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
              >
                Amount
              </th>
              <th
                scope="col"
                className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[80px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
              >
                Bank Recept
              </th>
              <th
                scope="col"
                className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[80px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
              >
                Status
              </th>
              <th
                scope="col"
                className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[80px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
              >
                Note
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item: any, index: any) => (
              <tr
                key={index}
                className="tradex-group hover:tradex-shadow-[2px_2px_37px_0px_#0000000D]"
              >
                <td className="tradex-border-b tradex-pr-4 last:tradex-pr-0 tradex-min-w-[80px] tradex-h-11  tradex-max-w-[200px]  tradex-text-sm tradex-text-body  tradex-items-center group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-11">
                  {moment(item.created_at).format("DD MMM YYYY")}
                </td>
                <td className="tradex-border-b tradex-pr-4 last:tradex-pr-0 tradex-min-w-[80px] tradex-h-11  tradex-max-w-[200px]  tradex-text-sm tradex-text-body  tradex-items-center group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-11">
                  {item.payment_type}
                </td>
                <td className="tradex-border-b tradex-pr-4 last:tradex-pr-0 tradex-min-w-[80px] tradex-h-11  tradex-max-w-[200px]  tradex-text-sm tradex-text-body  tradex-items-center group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-11">
                  {item.payment_title}
                </td>
                <td className="tradex-border-b tradex-pr-4 last:tradex-pr-0 tradex-min-w-[80px] tradex-h-11  tradex-max-w-[200px]  tradex-text-sm tradex-text-body  tradex-items-center group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-11">
                  {item.coin_type}
                </td>
                <td className="tradex-border-b tradex-pr-4 last:tradex-pr-0 tradex-min-w-[80px] tradex-h-11  tradex-max-w-[200px]  tradex-text-sm tradex-text-body  tradex-items-center group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-11">
                  {item.amount}
                </td>
                <td className="tradex-border-b tradex-pr-4 last:tradex-pr-0 tradex-min-w-[80px] tradex-h-11  tradex-max-w-[200px]  tradex-text-sm tradex-text-body  tradex-items-center group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-11 cursor-pointer">
                  {item.bank_recipt ? (
                    <span
                      onClick={() => {
                        setIsModalOpen(true);
                        setModalItem({
                          isBankRecipt: true,
                          title: "Bank Recipt",
                          img_link: item.bank_recipt,
                        });
                      }}
                    >
                      Receipt
                    </span>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="tradex-border-b tradex-pr-4 last:tradex-pr-0 tradex-min-w-[80px] tradex-h-11  tradex-max-w-[200px]  tradex-text-sm tradex-text-body  tradex-items-center group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-11">
                  {item.status}
                </td>
                <td className="tradex-border-b tradex-pr-4 last:tradex-pr-0 tradex-min-w-[80px] tradex-h-11  tradex-max-w-[200px]  tradex-text-sm tradex-text-body  tradex-items-center group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-11 cursor-pointer">
                  {item.note ? (
                    <span
                      onClick={() => {
                        setIsModalOpen(true);
                        setModalItem({
                          isBankRecipt: false,
                          title: "Note",
                          note: item.note,
                        });
                      }}
                    >
                      Note
                    </span>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length == 0 && (
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
              {" "}
              No Item Found
            </p>
          </div>
        )}
      </div>
      {isModalOpen && (
        <FiatHistoryModal
          setIsModalOpen={setIsModalOpen}
          modalItem={modalItem}
        />
      )}
    </>
  );
}
