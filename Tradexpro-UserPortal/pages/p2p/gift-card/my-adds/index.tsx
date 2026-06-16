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
import moment from "moment";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import {
  getMyGiftCardAdsListsApi,
  handleAdsDeleteApi,
} from "service/p2pGiftCards";

const limit = 10;
const options = [
  { value: "all", label: "All" },
  { value: 0, label: "Deactive" },
  { value: 1, label: "Active" },
  { value: 2, label: "Success" },
  { value: 3, label: "Canceled" },
  { value: 4, label: "Ongoing" },
];

export default function Index() {
  const [loading, setLoading] = useState(false);
  const [myCards, setMyCards] = useState<any>({});
  const [selectStatus, setSelectStatus] = useState(options[0]);
  const router = useRouter();
  const { t } = useTranslation("common");

  useEffect(() => {
    getMyGiftCardAdsLists(limit, 1, selectStatus.value);
  }, [selectStatus]);

  const columns = [
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
      Header: t("Amount"),
      accessor: "amount",
      Cell: ({ row }: any) => (
        <span>
          {parseFloat(row?.original?.amount)}{" "}
          {row?.original?.gift_card?.coin_type}
        </span>
      ),
    },

    {
      Header: t("Status"),
      accessor: "status_name",
      Cell: ({ cell }: any) => <span>{cell?.value}</span>,
    },
    {
      Header: t("Created At"),
      accessor: "created_at",
      Cell: ({ cell }: any) => <span>{moment(cell?.value).calendar()}</span>,
    },
    {
      Header: t("Action"),
      Cell: ({ row }: any) => (
        <>
          {(row?.original?.status == 1 || row?.original?.status == 0) && (
            <div className=" tradex-flex tradex-items-center tradex-gap-4">
              <button
                className="tradex-px-4 tradex-py-1.5 tradex-bg-primary !tradex-text-white tradex-font-semibold tradex-rounded"
                onClick={() => handleAdsEdit(row?.original?.uid)}
              >
                {t("Edit")}
              </button>
              <button
                className="tradex-px-4 tradex-py-1.5 tradex-bg-red-600 !tradex-text-white tradex-font-semibold tradex-rounded"
                onClick={() => handleAdsDelete(row?.original?.id)}
              >
                {t("Delete")}
              </button>
            </div>
          )}
        </>
      ),
    },
  ];

  const getMyGiftCardAdsLists = async (limit: any, page: any, status: any) => {
    setLoading(true);

    const data = await getMyGiftCardAdsListsApi(limit, page, status);
    setLoading(false);
    if (!data.success) {
      toast.error(data.message);
      return;
    }
    setMyCards(data.data);
  };

  const handlePageClick = (event: any) => {
    getMyGiftCardAdsLists(limit, event.selected + 1, selectStatus.value);
  };

  const handleAdsDelete = async (ads_id: any) => {
    const confirm = window.confirm("Are you sure you want to proceed?");
    if (!confirm) return;
    const data = await handleAdsDeleteApi(ads_id);
    if (!data.success) {
      toast.error(data.message);
      return;
    }
    toast.success(data.message);
    getMyGiftCardAdsLists(limit, 1, selectStatus.value);
  };
  const handleAdsEdit = (ads_uid: any) => {
    router.push(`/p2p/gift-card/edit-ads/${ads_uid}`);
  };

  return (
    <>
      <P2PGiftCardLayout>
        <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
          <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
            <div>
              <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                {t("My Gift Card Ads")}
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
              data={myCards?.data || []}
              processing={loading}
              isSearchable={false}
              isSortEnable={false}
            />
          </div>
        </div>
        {!loading && myCards?.data?.length > 0 && (
          <CustomPagination
            per_page={myCards?.per_page}
            current_page={myCards?.current_page}
            total={myCards?.total}
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
