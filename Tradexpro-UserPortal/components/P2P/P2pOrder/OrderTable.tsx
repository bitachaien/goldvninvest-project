import { NoItemFound } from "components/NoItemFound/NoItemFound";
import SectionLoading from "components/common/SectionLoading";
import Link from "next/link";
import { useEffect, useState } from "react";
import { OrderFilter } from "./OrderFilter";
import { myP2pOrderListData } from "service/p2p";
import {
  TRADE_STATUS_CANCELED,
  TRADE_STATUS_CANCELED_TIME_EXPIRED,
  TRADE_STATUS_ESCROW,
  TRADE_STATUS_PAYMENT_DONE,
  TRADE_STATUS_REFUNDED_BY_ADMIN,
} from "helpers/core-constants";
import useTranslation from "next-translate/useTranslation";
import CustomPagination from "components/Pagination/CustomPagination";

export const OrderTable = ({
  actionFunction,
  filter = false,
  setselectedMenu,
  selectedMenu,
}: any) => {
  const { t } = useTranslation("common");

  const [fromDate, setFromData] = useState();
  const [toDate, setToData] = useState();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCoin, setSelectedCoins] = useState("all");
  const [processing, setProcessing] = useState<boolean>(false);
  const [history, setHistory] = useState<any>([]);
  const [stillHistory, setStillHistory] = useState<any>([]);
  const [filterData, setfilterData] = useState<any>([]);
  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    actionFunction(
      5,
      parseInt(number),
      setHistory,
      setProcessing,
      setStillHistory,
      selectedStatus,
      selectedCoin,
      fromDate,
      toDate
    );
  };
  const getFilterData = async () => {
    const response = await myP2pOrderListData();
    setfilterData(response.data);
  };
  useEffect(() => {
    actionFunction(
      5,
      1,
      setHistory,
      setProcessing,
      setStillHistory,
      selectedStatus,
      selectedCoin,
      fromDate,
      toDate
    );
    getFilterData();
  }, [fromDate, toDate, selectedStatus, selectedCoin]);

  const handlePageClick = (event: any) => {
    actionFunction(
      5,
      parseInt(event.selected + 1),
      setHistory,
      setProcessing,
      setStillHistory,
      selectedStatus,
      selectedCoin,
      fromDate,
      toDate
    );
  };

  if (history?.length <= 0 || !history)
    return (
      <div>
        <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
          <h4 className=" tradex-text-[40px] tradex-leading-[48px] !tradex-text-title tradex-font-bold ">
            {t("My Orders")}
          </h4>
          <div className=" tradex-border-b-[3px] tradex-border-background-primary tradex-flex tradex-items-center tradex-gap-8">
            <button
              onClick={() => {
                setselectedMenu(1);
              }}
              className={`${
                selectedMenu === 1
                  ? " tradex-text-primary tradex-border-primary tradex-border-b-[3px] -tradex-mb-[3px]"
                  : "tradex-text-title"
              } tradex-min-w-10 tradex-text-left tradex-text-base tradex-leading-[22px] tradex-font-bold tradex-pb-2.5 `}
            >
              {t("All Orders")}
            </button>
            <button
              onClick={() => {
                setselectedMenu(2);
              }}
              className={`${
                selectedMenu === 2
                  ? " tradex-text-primary tradex-border-primary tradex-border-b-[3px] -tradex-mb-[3px]"
                  : "tradex-text-title"
              } tradex-min-w-10 tradex-text-left tradex-text-base tradex-leading-[22px] tradex-font-bold tradex-pb-2.5 `}
            >
              {t("Disputed Orders")}
            </button>
          </div>
          {filter && (
            <OrderFilter
              setSelectedStatus={setSelectedStatus}
              filterData={filterData}
              setSelectedCoins={setSelectedCoins}
              setFromData={setFromData}
              setToData={setToData}
            />
          )}
        </div>

        <div className="pt-5">
          <NoItemFound />
        </div>
      </div>
    );
  return (
    <div className=" tradex-space-y-8">
      <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
        <h4 className=" tradex-text-[40px] tradex-leading-[48px] !tradex-text-title tradex-font-bold ">
          {t("My Orders")}
        </h4>
        <div className=" tradex-border-b-[3px] tradex-border-background-primary tradex-flex tradex-items-center tradex-gap-8">
          <button
            onClick={() => {
              setselectedMenu(1);
            }}
            className={`${
              selectedMenu === 1
                ? " tradex-text-primary tradex-border-primary tradex-border-b-[3px] -tradex-mb-[3px]"
                : "tradex-text-title"
            } tradex-min-w-10 tradex-text-left tradex-text-base tradex-leading-[22px] tradex-font-bold tradex-pb-2.5 `}
          >
            {t("All Orders")}
          </button>
          <button
            onClick={() => {
              setselectedMenu(2);
            }}
            className={`${
              selectedMenu === 2
                ? " tradex-text-primary tradex-border-primary tradex-border-b-[3px] -tradex-mb-[3px]"
                : "tradex-text-title"
            } tradex-min-w-10 tradex-text-left tradex-text-base tradex-leading-[22px] tradex-font-bold tradex-pb-2.5 `}
          >
            {t("Disputed Orders")}
          </button>
        </div>
        {filter && (
          <OrderFilter
            setSelectedStatus={setSelectedStatus}
            filterData={filterData}
            setSelectedCoins={setSelectedCoins}
            setFromData={setFromData}
            setToData={setToData}
          />
        )}
      </div>

      <div className=" tradex-space-y-4">
        <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
          <div className="table-responsive overflow-x-auto">
            <table className="tradex-w-full tradex-border-separate tradex-border-spacing-y-2">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
                  >
                    {t("Order Id")}
                  </th>
                  <th
                    scope="col"
                    className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
                  >
                    {t("Amount")}
                  </th>
                  <th
                    scope="col"
                    className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
                  >
                    {t("Price")}
                  </th>
                  <th
                    scope="col"
                    className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
                  >
                    {t("Seller fees")}
                  </th>
                  <th
                    scope="col"
                    className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
                  >
                    {t("Status")}
                  </th>
                  <th
                    scope="col"
                    className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
                  >
                    {t("Operation")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {history?.map((item: any, index: any) => (
                  <tr
                    className="tradex-group hover:tradex-shadow-[2px_2px_37px_0px_#0000000D]"
                    key={index}
                  >
                    <td className="tradex-min-w-[100px] tradex-h-11 ">
                      <div
                        className={`${
                          index + 1 != history?.length && "tradex-border-b"
                        } !tradex-pr-4 last:tradex-pr-0  tradex-text-sm tradex-text-body tradex-flex tradex-items-center tradex-h-full group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-16`}
                      >
                        <p>{item.order_id}</p>
                      </div>
                    </td>
                    <td className="tradex-min-w-[100px] tradex-h-11 ">
                      <div
                        className={`${
                          index + 1 != history?.length && "tradex-border-b"
                        } !tradex-pr-4 last:tradex-pr-0  tradex-text-sm tradex-text-body tradex-flex tradex-items-center tradex-h-full group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-16`}
                      >
                        <p>
                          {parseFloat(item.amount)} {item.coin_type}
                        </p>
                      </div>
                    </td>
                    <td className="tradex-min-w-[100px] tradex-h-11 ">
                      <div
                        className={`${
                          index + 1 != history?.length && "tradex-border-b"
                        } !tradex-pr-4 last:tradex-pr-0  tradex-text-sm tradex-text-body tradex-flex tradex-items-center tradex-h-full group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-16`}
                      >
                        <p>
                          {parseFloat(item.price)} {item.currency}
                        </p>
                      </div>
                    </td>
                    <td className="tradex-min-w-[100px] tradex-h-11 ">
                      <div
                        className={`${
                          index + 1 != history?.length && "tradex-border-b"
                        } !tradex-pr-4 last:tradex-pr-0  tradex-text-sm tradex-text-body tradex-flex tradex-items-center tradex-h-full group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-16`}
                      >
                        <p>{item.seller_fees}</p>
                      </div>
                    </td>
                    <td className="tradex-min-w-[100px] tradex-h-11 ">
                      <div
                        className={`${
                          index + 1 != history?.length && "tradex-border-b"
                        } !tradex-pr-4 last:tradex-pr-0  tradex-text-sm tradex-text-body tradex-flex tradex-items-center tradex-h-full group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-16`}
                      >
                        {parseInt(item?.is_reported) !== 0
                          ? "Disputed"
                          : parseInt(item.is_success) === 1
                          ? "Completed"
                          : parseInt(item.status) === TRADE_STATUS_ESCROW
                          ? "In Escrowed"
                          : parseInt(item.status) === TRADE_STATUS_PAYMENT_DONE
                          ? "Payment Complete"
                          : parseInt(item.status) ===
                            TRADE_STATUS_CANCELED_TIME_EXPIRED
                          ? "Time Expired"
                          : parseInt(item.status) === TRADE_STATUS_CANCELED ||
                            parseInt(item.status) ===
                              TRADE_STATUS_REFUNDED_BY_ADMIN
                          ? "Cancelled"
                          : parseInt(item.is_success) === 0
                          ? "Pending"
                          : ""}
                      </div>
                    </td>

                    <td className="tradex-min-w-[100px] tradex-h-11 ">
                      <div
                        className={`${
                          index + 1 != history?.length && "tradex-border-b"
                        } !tradex-pr-4 last:tradex-pr-0  tradex-text-sm tradex-text-body tradex-flex tradex-items-center tradex-h-full group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-16`}
                      >
                        <Link href={`/p2p/trade/${item.uid}`}>
                          <span className=" tradex-cursor-pointer tradex-py-3 tradex-px-6 tradex-rounded-[3px] tradex-border tradex-border-primary group-hover:tradex-bg-primary group-hover:!tradex-text-white !tradex-text-primary tradex-bg-transparent tradex-text-sm tradex-leading-[18px]">
                            {t("Details")}
                          </span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {history?.length > 0 && (
          <>
            <CustomPagination
              per_page={stillHistory?.per_page}
              current_page={stillHistory?.current_page}
              total={stillHistory?.total}
              handlePageClick={handlePageClick}
            />
          </>
        )}
      </div>
    </div>
  );
};
