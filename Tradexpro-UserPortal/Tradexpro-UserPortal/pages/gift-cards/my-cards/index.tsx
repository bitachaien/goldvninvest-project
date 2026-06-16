import { CUstomSelect } from "components/common/CUstomSelect";
import ImageComponent from "components/common/ImageComponent";
import MyCardModal from "components/gift-cards/modal/MyCardModal";
import SendCryptoCardModal from "components/gift-cards/modal/SendCryptoCardModal";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Footer from "components/common/footer";
import { NoItemFound } from "components/NoItemFound/NoItemFound";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import SectionLoading from "components/common/SectionLoading";
import { getMyCardPageData, getMyCards } from "state/actions/giftCards";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";

const options = [
  { value: "all", label: "All" },
  { value: "1", label: "Active" },
  { value: "2", label: "Redeemed" },
  { value: "3", label: "Transfared" },
  { value: "4", label: "Trading" },
  { value: "5", label: "Locked" },
];
const limit = 9;
export default function Index() {
  const { t } = useTranslation("common");
  const [loading, setLoading] = useState(false);
  const [myCards, setMyCards] = useState<any>({});
  const [pageData, setPageData] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [giftCardData, setGiftCardData] = useState({});
  const [activeStatus, setActiveStatus] = useState("all");
  const [isSendCryptoCardModalOpen, setIsSendCryptoCardModalOpen] =
    useState(false);

  useEffect(() => {
    getMyCardPageData(setPageData);
    getMyCards("all", limit, 1, setLoading, setMyCards);
  }, []);

  const myCardHandle = (cardData: any) => {
    setGiftCardData(cardData);
    setIsModalOpen(true);
  };

  const sendCryptoCardModalHandler = () => {
    setIsSendCryptoCardModalOpen(true);
    setIsModalOpen(false);
  };

  const handleStatus = (event: any) => {
    if (activeStatus === event.value) return;
    getMyCards(event.value, limit, 1, setLoading, setMyCards);
    setActiveStatus(event.value);
  };

  const handlePageClick = (event: any) => {
    getMyCards(activeStatus, limit, event.selected + 1, setLoading, setMyCards);
  };

  const handleModalData = () => {
    getMyCards(activeStatus, limit, 1, setLoading, setMyCards);
  };

  return (
    <>
      <div className=" tradex-relative">
        <div className="tradex-bg-background-primary tradex-relative">
          <TopLeftInnerPageCircle className=" tradex-z-0" />
          <TopRightInnerPageCircle className=" tradex-z-0" />
          <div className="tradex-container tradex-relative tradex-z-10 tradex-pt-8 md:tradex-pt-[80px] tradex-pb-[140px]">
            <div className=" tradex-grid lg:tradex-grid-cols-2 tradex-gap-6 tradex-items-center">
              <div className=" tradex-space-y-8">
                <div className=" tradex-space-y-4">
                  <h2 className=" tradex-text-[48px] tradex-leading-[60px] tradex-font-bold !tradex-text-title">
                    {t(pageData?.header || "My Cards")}
                  </h2>
                  <p className=" tradex-text-xl tradex-text-body">
                    {t(
                      pageData?.description ||
                        "Tradexpro exchange is such a marketplace where people can trade directly with each other"
                    )}
                  </p>
                </div>
              </div>
              <div>
                <img src={pageData?.banner || "/gift_card_banner.png"} alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="tradex-container tradex-relative tradex-z-10 -tradex-mt-[80px]">
          <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
            <div className=" tradex-flex tradex-flex-col md:tradex-flex-row tradex-gap-6 md:tradex-items-center tradex-justify-between tradex-pb-4 tradex-border-b tradex-border-background-primary">
              <div className=" tradex-space-y-3">
                <h2 className=" tradex-text-[32px] tradex-leading-[38px] tradex-font-bold !tradex-text-title">
                  {t("My Cards")}
                </h2>
                <p className=" tradex-text-xl tradex-leading-6 tradex-text-body">
                  {t("Send a crypto gift card for any occasion")}
                </p>
              </div>
              <div className="d-flex align-items-center gap-10 border px-2 rounded tradex-min-w-[200px] ">
                <span>
                  <b>{t("Status")}:</b>{" "}
                </span>
                <CUstomSelect
                  options={options}
                  classname={"themed-category-select-section w-full"}
                  handleFunction={handleStatus}
                  defaultValue={options[0]}
                />
              </div>
            </div>
            <div>
              {loading ? (
                <SectionLoading />
              ) : myCards?.data?.length > 0 ? (
                <>
                  <div className="tradex-grid sm:tradex-grid-cols-2 lg:tradex-grid-cols-3 tradex-gap-6 tradex-mt-6">
                    {myCards?.data?.map((item: any, index: number) => (
                      <div
                        className=" tradex-group tradex-border tradex-border-background-primary tradex-rounded-lg"
                        onClick={() => myCardHandle(item)}
                        key={index}
                      >
                        <div className=" tradex-rounded-tl-lg tradex-rounded-tr-lg tradex-overflow-hidden">
                          <ImageComponent
                            src={item.banner.image || "/demo_gift_banner.png"}
                            height={220}
                          />
                        </div>
                        <div className="tradex-px-4 tradex-pt-4 tradex-pb-5 tradex-space-y-4">
                          <div className=" tradex-space-y-2">
                            <h4 className=" tradex-text-2xl tradex-leading-[30px] !tradex-text-title tradex-font-semibold">
                              {t(item.banner.title)}
                            </h4>
                            <p className=" tradex-text-base tradex-leading-[22px] tradex-text-body tradex-line-clamp-2">
                              {t(item.banner.sub_title)}
                            </p>
                          </div>
                          <button className=" tradex-h-9 tradex-px-2.5 tradex-flex tradex-justify-center tradex-items-center tradex-border tradex-border-title tradex-rounded tradex-text-xs tradex-text-title group-hover:tradex-border-primary group-hover:tradex-bg-primary group-hover:tradex-text-white">
                            {t("View Details")}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="mt-4">
                  <NoItemFound />
                </div>
              )}

              <div className="row justify-content-center mt-5">
                <ReactPaginate
                  nextLabel=">"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={5}
                  pageCount={Math.ceil(myCards.total / limit)}
                  previousLabel="<"
                  renderOnZeroPageCount={null}
                  className={`d-flex align-items-center justify-content-center`}
                  pageLinkClassName={`paginate-number`}
                  activeLinkClassName={`active-paginate-cls`}
                  previousLinkClassName={`text-primary-color text-25 mr-2`}
                  nextLinkClassName={`text-primary-color text-25 ml-2`}
                />
              </div>
            </div>
          </div>
        </div>
        <StartTrending />
        <BottomLeftInnerPageCircle />
        <BottomRigtInnerPageCircle />
      </div>
      {isModalOpen && (
        <MyCardModal
          giftCardData={giftCardData}
          setIsModalOpen={setIsModalOpen}
          sendCryptoCardModalHandler={sendCryptoCardModalHandler}
          modalFunc={handleModalData}
          isHome={false}
        />
      )}
      {isSendCryptoCardModalOpen && (
        <SendCryptoCardModal
          setIsSendCryptoCardModalOpen={setIsSendCryptoCardModalOpen}
          giftCardData={giftCardData}
        />
      )}
      <Footer />
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/gift-cards");

  return {
    props: {},
  };
};
