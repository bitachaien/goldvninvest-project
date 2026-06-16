import { BuyFrom } from "./BuyFrom";
import { useState } from "react";
import Link from "next/link";
import { NoItemFound } from "components/NoItemFound/NoItemFound";
import { BUY } from "helpers/core-constants";
import { RootState } from "state/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { handleP2PDeleteApi, handleP2PStatusChangeApi } from "service/p2p";
import { toast } from "react-toastify";

export const P2pDataTable = ({
  history,
  filters,
  isLoggedIn,
  statusChange = false,
  deleteBtn = false,
  action = true,
  payment = true,
  edit = false,
  adsType,
}: any) => {
  const { t } = useTranslation("common");

  const router = useRouter();

  const [historyData, setHistoryData] = useState(history || []);

  const handleStatusChange = async (item: any) => {
    if (!statusChange) return;
    const response = await handleP2PStatusChangeApi({
      type: adsType,
      id: item.uid,
    });
    if (!response.success) {
      toast.error(response.message);
      return;
    }
    let newData = historyData.map((item: any) => {
      if (item.uid == response.data.id) {
        return {
          ...item,
          status: response.data.status ? 1 : 0,
        };
      }
      return item;
    });

    setHistoryData(newData);
    toast.success(response.message);
  };

  const handleAdsDelete = async (ads_id: any) => {
    if (!deleteBtn) return;
    const confirm = window.confirm("Are you sure you want to proceed?");
    if (!confirm) return;
    const response = await handleP2PDeleteApi({
      ads_type: adsType,
      uid: ads_id,
    });
    if (!response.success) {
      toast.error(response.message);
      return;
    }
    let newData = historyData.filter((item: any) => item.uid != ads_id);

    setHistoryData(newData);
    toast.success(response.message);
  };
  return (
    <div className="table-responsive overflow-x-auto">
      {historyData?.length <= 0 || !historyData ? (
        <NoItemFound />
      ) : (
        <table className="tradex-w-full tradex-border-separate tradex-border-spacing-y-2">
          <thead>
            <tr>
              <th
                scope="col"
                className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
              >
                {t("Advertisers")}
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
                {t("Limit")}/{t("Available")}
              </th>
              {statusChange && (
                <th
                  scope="col"
                  className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
                >
                  {t("Status")}
                </th>
              )}

              {payment === true && (
                <th
                  scope="col"
                  className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
                >
                  {t("Payment")}
                </th>
              )}
              {action === true && (
                <th
                  scope="col"
                  className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
                >
                  {t("Trade")}
                </th>
              )}
              {edit === true && (
                <th
                  scope="col"
                  className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
                >
                  {t("Action")}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {historyData?.map((item: any, index: any) => (
              <tr
                className="tradex-group hover:tradex-shadow-[2px_2px_37px_0px_#0000000D]"
                key={index}
              >
                <td className="tradex-min-w-[100px] tradex-h-11 ">
                  <div
                    className={`${
                      index + 1 != historyData?.length && "tradex-border-b"
                    } !tradex-pr-4 last:tradex-pr-0  tradex-text-sm tradex-text-body tradex-flex tradex-items-center tradex-h-full group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-16`}
                  >
                    <Link href={"/p2p/profile/" + item?.user_id}>
                      <div className=" tradex-flex tradex-gap-1 tradex-items-center">
                        <div className=" tradex-min-w-[18px]">
                          <img
                            className=" tradex-w-[18px]  tradex-h-[18px] tradex-max-w-[18px]  tradex-max-h-[18px] tradex-rounded-full"
                            src={item?.user?.photo}
                            alt=""
                          />
                        </div>
                        <h5 className=" tradex-text-sm tradex-leading-5 !tradex-text-body">
                          {item?.user?.nickname}
                        </h5>
                      </div>
                    </Link>
                  </div>
                </td>
                <td className="tradex-min-w-[100px] tradex-h-11 ">
                  <div
                    className={`${
                      index + 1 != historyData?.length && "tradex-border-b"
                    } !tradex-pr-4 last:tradex-pr-0  tradex-text-sm tradex-text-body tradex-flex tradex-items-center tradex-h-full group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-16`}
                  >
                    <div className=" tradex-flex tradex-gap-1 tradex-items-center !tradex-text-body">
                      <h5 className="tradex-text-sm tradex-leading-5 !tradex-text-body">
                        {parseFloat(item?.price).toFixed(2)}
                      </h5>{" "}
                      {item?.currency}
                    </div>
                  </div>
                </td>
                <td className="tradex-min-w-[100px] tradex-h-11 ">
                  <div
                    className={`${
                      index + 1 != historyData?.length && "tradex-border-b"
                    } !tradex-pr-4 last:tradex-pr-0  tradex-text-sm tradex-text-body tradex-flex tradex-items-center tradex-h-full group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-16`}
                  >
                    <div className=" tradex-space-y-2">
                      <div className="tradex-flex tradex-gap-1 tradex-items-center !tradex-text-body">
                        <small>{t("Available")}</small>
                        <h6 className="tradex-text-sm tradex-leading-5 !tradex-text-body">
                          {parseFloat(item?.available).toFixed(8)}{" "}
                          {item?.coin_type}
                        </h6>
                      </div>
                      <div className="tradex-flex tradex-gap-1 tradex-items-center !tradex-text-body">
                        <small>{t("Limit")}</small>
                        <h6 className="tradex-text-sm tradex-leading-5 !tradex-text-body">
                          {item?.minimum_trade_size} {item?.currency}-
                          {item?.maximum_trade_size} {item?.currency}
                        </h6>
                      </div>
                    </div>
                  </div>
                </td>
                {statusChange && (
                  <td className="tradex-min-w-[100px] tradex-h-11 ">
                    <div
                      className={`${
                        index + 1 != historyData?.length && "tradex-border-b"
                      } !tradex-pr-4 last:tradex-pr-0  tradex-text-sm tradex-text-body tradex-flex tradex-items-center tradex-h-full group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-16`}
                    >
                      <label className="gift-card-buy-switch mb-0">
                        <input
                          type="checkbox"
                          checked={item?.status == 1 ? true : false}
                          onChange={(e) => handleStatusChange(item)}
                        />
                        <span className="gift-card-buy-slider gift-card-buy"></span>
                      </label>
                    </div>
                  </td>
                )}

                {payment && (
                  <td className="tradex-min-w-[100px] tradex-h-11 ">
                    <div
                      className={`${
                        index + 1 != historyData?.length && "tradex-border-b"
                      } !tradex-pr-4 last:tradex-pr-0  tradex-text-sm tradex-text-body tradex-flex tradex-items-center tradex-h-full group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-16`}
                    >
                      {item?.payment_method_list?.map(
                        (payment: any, index: any) => (
                          <span
                            className=" tradex-text-primary tradex-text-sm tradex-leading-5"
                            key={index}
                          >
                            {payment?.admin_pamynt_method?.name}
                          </span>
                        )
                      )}
                    </div>
                  </td>
                )}

                {action === true && (
                  <td className="tradex-min-w-[100px] tradex-h-11 ">
                    <div
                      className={`${
                        index + 1 != historyData?.length && "tradex-border-b"
                      } !tradex-pr-4 last:tradex-pr-0  tradex-text-sm tradex-text-body tradex-flex tradex-items-center tradex-h-full group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-16`}
                    >
                      {isLoggedIn === true && (
                        <Link
                          href={`/p2p/details/${item.uid}?adtype=${filters.type}`}
                        >
                          <button className="tableButton !tradex-py-3">
                            {filters.type === BUY ? "Buy" : "Sell"}{" "}
                            {item.coin_type}
                          </button>
                        </Link>
                      )}
                    </div>
                  </td>
                )}
                {(edit === true || deleteBtn === true) && (
                  <td className="tradex-min-w-[100px] tradex-h-11 ">
                    <div
                      className={`${
                        index + 1 != historyData?.length && "tradex-border-b"
                      } !tradex-pr-4 last:tradex-pr-0  tradex-text-sm tradex-text-body tradex-flex tradex-items-center tradex-h-full group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-16`}
                    >
                      {isLoggedIn === true && (
                        // <Link
                        //   href={`/p2p/add-post?uid=${item.uid}&&ads_type=${filters.type}`}
                        // >
                        <>
                          {edit && (
                            <button
                              onClick={async () => {
                                await router.push(
                                  `/p2p/add-post?uid=${item.uid}&&ads_type=${filters.type}`
                                );
                                await router.reload();
                              }}
                              className="tableButton !tradex-py-3"
                            >
                              {t("Edit")}
                            </button>
                          )}

                          {deleteBtn && (
                            <button
                              onClick={() => handleAdsDelete(item.uid)}
                              className="tableButton bg-secondary ml-2 !tradex-py-3"
                            >
                              {t("Delete")}
                            </button>
                          )}
                        </>
                        // </Link>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
