import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import { NoItemFound } from "components/NoItemFound/NoItemFound";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import { CUstomSelect } from "components/common/CUstomSelect";
import ImageComponent from "components/common/ImageComponent";
import SectionLoading from "components/common/SectionLoading";
import Footer from "components/common/footer";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import {
  getThemedCardCat,
  getThemedGiftCardData,
} from "state/actions/giftCards";

const limit = 10;
export default function Index() {
  const { t } = useTranslation("common");
  const [themedCardData, setThemedCardData] = useState<any>({});
  const [activeCategory, setActiveCategory] = useState({
    value: "all",
    label: "All",
  });
  const [allGiftCards, setAllGiftCards] = useState<any>({});
  const [categories, setCategories] = useState([
    {
      value: "all",
      label: "All",
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(false);
  useEffect(() => {
    getThemedCardCat(setLoading, setThemedCardData, setCategories);
    getThemedGiftCardData("all", 1, limit, setProductLoading, setAllGiftCards);
  }, []);

  const handleCategory = (event: any) => {
    if (activeCategory.value === event.value) return;
    getThemedGiftCardData(
      event.value,
      1,
      limit,
      setProductLoading,
      setAllGiftCards
    );
    setActiveCategory(event);
  };

  const handlePageClick = (event: any) => {
    getThemedGiftCardData(
      activeCategory.value,
      event.selected + 1,
      limit,
      setProductLoading,
      setAllGiftCards
    );
  };

  if (loading) return <></>;
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
                    {t(themedCardData?.header || "Themed Gift Cards")}
                  </h2>
                  <p className=" tradex-text-xl tradex-text-body">
                    {t(
                      themedCardData?.description ||
                        "Tradexpro exchange is such a marketplace where people can trade directly with each other"
                    )}
                  </p>
                </div>
              </div>
              <div>
                <img
                  src={themedCardData?.banner || "/gift_card_banner.png"}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div className="tradex-container tradex-relative tradex-z-10 -tradex-mt-[80px]">
          <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
            <div className=" tradex-flex tradex-flex-col md:tradex-flex-row tradex-gap-6 md:tradex-items-center tradex-justify-between tradex-pb-4 tradex-border-b tradex-border-background-primary">
              <div className=" tradex-space-y-3">
                <h2 className=" tradex-text-[32px] tradex-leading-[38px] tradex-font-bold !tradex-text-title">
                  {t("Themed Gift Cards")}
                </h2>
                <p className=" tradex-text-xl tradex-leading-6 tradex-text-body">
                  {t("Send a crypto gift card for any occasion")}
                </p>
              </div>
              <div className="d-flex align-items-center gap-10 border px-2 rounded ">
                <span>
                  <b>{t("Category")}:</b>{" "}
                </span>
                <CUstomSelect
                  options={categories}
                  classname={"themed-category-select-section w-full"}
                  handleFunction={handleCategory}
                  defaultValue={categories[0]}
                />
              </div>
            </div>
            <div>
              {productLoading ? (
                <SectionLoading />
              ) : (
                <>
                  {allGiftCards?.data?.length > 0 ? (
                    <div className="tradex-grid tradex-gap-6 tradex-grid-cols-1 md:tradex-grid-cols-2 lg:tradex-grid-cols-4">
                      {allGiftCards?.data?.map((item: any, index: number) => (
                        <Link href={`/gift-cards/buy/${item.uid}`} key={index}>
                          <a className=" tradex-rounded-lg tradex-overflow-hidden">
                            <ImageComponent
                              src={item.banner || "/demo_gift_banner.png"}
                              height={300}
                            />
                          </a>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4">
                      <NoItemFound />
                    </div>
                  )}
                </>
              )}

              <div className="row justify-content-center mt-5">
                <ReactPaginate
                  nextLabel=">"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={5}
                  pageCount={Math.ceil(allGiftCards.total / limit)}
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
      <Footer />
    </>
  );
}
