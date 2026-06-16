import { NoItemFound } from "components/NoItemFound/NoItemFound";
import P2PGiftCardLayout from "components/P2P/p2p-gift-card/P2PGiftCardLayout";
import P2PGiftCardHeader from "components/P2P/p2p-gift-card/p2p-gift-card-header/P2PGiftCardHeader";
import P2PGiftCardNavbar from "components/P2P/p2p-gift-card/p2p-gift-card-navbar/P2PGiftCardNavbar";
import CustomPagination from "components/Pagination/CustomPagination";
import ReactDataTable from "components/ReactDataTable";
import ImageComponent from "components/common/ImageComponent";
import SectionLoading from "components/common/SectionLoading";
import Footer from "components/common/footer";
import MyCardModal from "components/gift-cards/modal/MyCardModal";
import P2PGiftCardSingleModal from "components/gift-cards/modal/P2PGiftCardSingleModal";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { getP2PGiftCardListsApi } from "service/p2pGiftCards";

const limit = 10;
export default function Index() {
  const [loading, setLoading] = useState(false);
  const [myCards, setMyCards] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [giftCardData, setGiftCardData] = useState({});
  const { t } = useTranslation("common");

  useEffect(() => {
    getP2PGiftCardLists(limit, 1);
  }, []);

  const columns = [
    {
      Header: t("Image"),
      accessor: "image",
      Cell: ({ row }: any) => (
        <div>
          <img
            src={row?.original?.banner?.image || "/demo_gift_banner.png"}
            alt=""
            className=" tradex-max-h-[100px] tradex-max-w-[150px] tradex-object-cover tradex-object-center"
          />
        </div>
      ),
    },
    {
      Header: t("Name"),
      accessor: "title",
      Cell: ({ row }: any) => <span>{row?.original?.banner?.title}</span>,
    },
    {
      Header: t("Amount"),
      accessor: "amount",
      Cell: ({ row }: any) => (
        <span>
          {parseFloat(row?.original?.amount)} {row?.original?.coin_type}
        </span>
      ),
    },

    {
      Header: t("Action"),
      Cell: ({ row }: any) => (
        <div className=" tradex-flex tradex-items-center tradex-gap-4">
          <Link href={`/p2p/gift-card/create-ads/${row?.original?.id}`}>
            <a className="tradex-px-4 tradex-py-1.5 tradex-bg-primary !tradex-text-white tradex-font-semibold tradex-rounded">
              {t("Create Ads")}
            </a>
          </Link>

          <span
            className="tradex-px-4 tradex-py-1.5 tradex-bg-primary !tradex-text-white tradex-font-semibold tradex-rounded tradex-cursor-pointer"
            onClick={() => myCardHandle(row?.original)}
          >
            {t("Details")}
          </span>
        </div>
      ),
    },
  ];

  const getP2PGiftCardLists = async (limit: any, page: any) => {
    setLoading(true);

    const data = await getP2PGiftCardListsApi(limit, page);
    setLoading(false);
    if (!data.success) {
      toast.error(data.message);
      return;
    }
    setMyCards(data.data);
  };

  const handlePageClick = (event: any) => {
    getP2PGiftCardLists(limit, event.selected + 1);
  };

  const myCardHandle = (cardData: any) => {
    setGiftCardData(cardData);
    setIsModalOpen(true);
  };

  return (
    <>
      <P2PGiftCardLayout>
        <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
          <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
            <div>
              <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                {t("Gift Card Lists")}
              </h2>
            </div>
          </div>
          <div className=" tradex-space-y-6">
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

      {isModalOpen && (
        <P2PGiftCardSingleModal
          giftCardData={giftCardData}
          setIsModalOpen={setIsModalOpen}
        />
      )}
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
