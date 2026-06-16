import { NoItemFound } from "components/NoItemFound/NoItemFound";
import P2PGiftCardLayout from "components/P2P/p2p-gift-card/P2PGiftCardLayout";
import P2PGiftCardHeader from "components/P2P/p2p-gift-card/p2p-gift-card-header/P2PGiftCardHeader";
import P2PGiftCardNavbar from "components/P2P/p2p-gift-card/p2p-gift-card-navbar/P2PGiftCardNavbar";
import CustomPagination from "components/Pagination/CustomPagination";
import ReactDataTable from "components/ReactDataTable";
import { CUstomSelect } from "components/common/CUstomSelect";
import ImageComponent from "components/common/ImageComponent";
import SectionLoading from "components/common/SectionLoading";
import Footer from "components/common/footer";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { getP2PGiftCardOrderListsApi } from "service/p2pGiftCards";

const options = [
  { value: "all", label: "All" },
  { value: 0, label: "Time Expierd " },
  { value: 1, label: "Escrow" },
  { value: 2, label: "Payment Done" },
  { value: 3, label: "Transfer Done" },
  { value: 5, label: "Disputed" },
  { value: 4, label: "Canceled" },
  { value: 6, label: "Refunded By Admin" },
  { value: 7, label: "Released By Admin" },
];

const limit = 10;
export default function Index() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any>({});
  const [selectStatus, setSelectStatus] = useState(options[0]);

  useEffect(() => {
    getP2PGiftCardLists(limit, 1, selectStatus.value);
  }, [selectStatus]);
  const { t } = useTranslation("common");

  const columns = [
    {
      Header: t("Order Id"),
      accessor: "order_id",
      Cell: ({ cell }: any) => <span>{cell.value}</span>,
    },
    {
      Header: t("Amount"),
      accessor: "amount",
      Cell: ({ row }: any) => (
        <span>
          {parseFloat(row?.original?.amount)}{" "}
          {row?.original?.p_gift_card?.gift_card?.coin_type}
        </span>
      ),
    },
    {
      Header: t("Price"),
      accessor: "price",
      Cell: ({ row }: any) => (
        <span>
          {parseFloat(row?.original?.price)} {row?.original?.currency_type}
        </span>
      ),
    },
    {
      Header: t("Status"),
      accessor: "status_name",
      Cell: ({ cell }: any) => <span>{cell.value}</span>,
    },
    {
      Header: t("Action"),
      Cell: ({ row }: any) => (
        <Link href={`/p2p/gift-card/ads/buy/${row?.original?.uid}`}>
          <a className="tradex-px-4 tradex-py-1.5 tradex-bg-primary !tradex-text-white tradex-font-semibold tradex-rounded">
            {t("Details")}
          </a>
        </Link>
      ),
    },
  ];

  const getP2PGiftCardLists = async (limit: any, page: any, status: any) => {
    setLoading(true);

    const data = await getP2PGiftCardOrderListsApi(limit, page, status);
    setLoading(false);
    if (!data.success) {
      toast.error(data.message);
      return;
    }
    setOrders(data.data);
  };

  const handlePageClick = (event: any) => {
    getP2PGiftCardLists(limit, event.selected + 1, selectStatus.value);
  };
  return (
    <>
      <P2PGiftCardLayout>
        <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
          <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
            <div>
              <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                {t("Order Lists")}
              </h2>
            </div>
          </div>
          <div className=" tradex-space-y-6">
            <div className=" tradex-grid sm:tradex-grid-cols-2 md:tradex-grid-cols-3">
              <div className="tradex-space-y-2 p2p-gift-card-select">
                <label className=" tradex-input-label tradex-mb-0 !tradex-text-sm">
                  {" "}
                  {t("Payment Type")}
                </label>
                <CUstomSelect
                  options={options}
                  handleFunction={setSelectStatus}
                  defaultValue={options[0]}
                />
              </div>
            </div>
            <ReactDataTable
              columns={columns}
              data={orders?.data || []}
              processing={loading}
              isSearchable={false}
              isSortEnable={false}
            />
          </div>
        </div>
        {!loading && orders?.data?.length > 0 && (
          <CustomPagination
            per_page={orders?.per_page}
            current_page={orders?.current_page}
            total={orders?.total}
            handlePageClick={handlePageClick}
          />
        )}
      </P2PGiftCardLayout>

      <Footer />
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/p2p/gift-card");
  return {
    props: {},
  };
};
