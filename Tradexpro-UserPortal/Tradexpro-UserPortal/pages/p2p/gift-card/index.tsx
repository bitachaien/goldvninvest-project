import { NoItemFound } from "components/NoItemFound/NoItemFound";
import P2PGiftCardNavbar from "components/P2P/p2p-gift-card/p2p-gift-card-navbar/P2PGiftCardNavbar";
import { CUstomSelect } from "components/common/CUstomSelect";
import SectionLoading from "components/common/SectionLoading";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { getGiftCardTradeHeder } from "service/p2p";
import Select from "react-select";
import {
  getAllGiftCardAdsApi,
  getCreateAdsSettingsDataApi,
} from "service/p2pGiftCards";
import useTranslation from "next-translate/useTranslation";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import Footer from "components/common/footer";
import P2PGiftCardLayout from "components/P2P/p2p-gift-card/P2PGiftCardLayout";
import ReactDataTable from "components/ReactDataTable";
import CustomPagination from "components/Pagination/CustomPagination";

const options = [
  { value: 1, label: "Bank Transfer" },
  { value: 2, label: "Crypto Transfer" },
];
const limit = 15;

export default function Index({ data }: any) {
  const router = useRouter();
  const [allGiftCardAds, setAllGiftCardAds] = useState<any>({});
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const [selectedPaymentType, setSelectedPaymentType] = useState<any>({});
  const [selectedCurrencyType, setSelectedCurrencyType] = useState<any>({});
  const [selectedPayment, setSelectedPayment] = useState<any>({});
  const [selectedCountry, setSelectedCountry] = useState<any>({});
  const [price, setPrice] = useState("");
  const { t } = useTranslation("common");

  useEffect(() => {
    getCreateAdsSettingsData();
  }, []);

  useEffect(() => {
    getAllGiftCardAds(1);
  }, [
    selectedPaymentType,
    selectedCurrencyType,
    selectedPayment,
    selectedCountry,
    price,
  ]);

  const columns = [
    {
      Header: t("Advertisers"),
      Cell: ({ row }: any) => (
        <div className="tableImg d-flex align-items-center">
          <img src={row?.original?.user?.photo} alt="" />
          <h5 className=" tradex-text-base !tradex-text-body tradex-capitalize">
            {row?.original?.user?.nickname || "Unknown"}
          </h5>
        </div>
      ),
    },
    {
      Header: t("Price"),
      accessor: "price",
      Cell: ({ cell }: any) => <span>{cell.value}</span>,
    },
    {
      Header: t("Value of gift card"),
      accessor: "amount",
      Cell: ({ cell }: any) => <span>{cell.value}</span>,
    },
    {
      Header: t("Payment"),
      accessor: "payment_currency_type",
      Cell: ({ row }: any) => (
        <div>
          {Number(row?.original?.payment_currency_type) === 1 ? (
            row?.original?.payment_methods.map((item: any, index: any) => (
              <span
                className="mr-1 bg-primary-color px-2 py-1 rounded"
                key={index}
              >
                {item.admin_pamynt_method.name}
              </span>
            ))
          ) : (
            <span className="mr-1 bg-card-primary-color px-2 py-1 rounded">
              {t("Crypto")}
            </span>
          )}
        </div>
      ),
    },
    {
      Header: t("Action"),
      Cell: ({ row }: any) => (
        <button
          className="tableButton p2p-gift-card-adds-margin-bottom !tradex-py-3"
          onClick={() => handleBuyFunc(row?.original?.uid)}
        >
          {t("Buy Gift Card")}
        </button>
      ),
    },
  ];

  const getCreateAdsSettingsData = async () => {
    const data: any = await getCreateAdsSettingsDataApi();
    if (!data?.success) {
      toast.error(data?.message);
      return;
    }

    setSettings(data?.data);
  };

  const getAllGiftCardAds = async (page: any) => {
    setLoading(true);
    const data = await getAllGiftCardAdsApi(
      selectedPaymentType?.value || "",
      selectedCurrencyType?.value || "",
      price,
      selectedPayment?.value || "",
      selectedCountry?.value || "",
      page,
      limit
    );
    setLoading(false);

    if (!data.success) {
      toast.error(data.message);
      return;
    }
    setAllGiftCardAds(data.data);
  };

  const handlePageClick = (event: any) => {
    getAllGiftCardAds(event.selected + 1);
  };

  const handleBuyFunc = (uid: any) => {
    router.push(`/p2p/gift-card/ads/details/${uid}`);
  };
  const changeBackground = () => {
    const elements = document.getElementsByClassName("p2p_bg");

    // Loop through the elements and add the background image
    for (let i = 0; i < elements.length; i++) {
      //@ts-ignore
      elements[i].style.backgroundImage = `url('${data?.banner}')`;
    }
  };
  // useEffect(() => {
  //   changeBackground();
  // }, []);

  const resetHandler = () => {
    setSelectedPaymentType({});
    setSelectedCurrencyType({});
    setSelectedPayment({});
    setSelectedCountry({});
    setPrice("");
  };

  return (
    <>
      <P2PGiftCardLayout>
        <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
          <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
            <div>
              <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                {data?.header || t("P2P Gift Card")}
              </h2>
              <p className=" tradex-text-sm tradex-text-body">
                {data?.description || t("Gift Card Description")}
              </p>
            </div>
          </div>
          <div className=" tradex-space-y-6">
            <div className=" tradex-grid sm:tradex-grid-cols-2 md:tradex-grid-cols-3 tradex-gap-y-4 tradex-gap-x-6">
              <div className=" tradex-space-y-2">
                <label className=" tradex-input-label tradex-mb-0 !tradex-text-sm">
                  {t("Name")}
                </label>
                <input
                  type="number"
                  placeholder={t("Enter Price")}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="tradex-input-field !tradex-text-sm tradex-max-h-[48px] !tradex-bg-transparent !tradex-border !tradex-border-solid !tradex-border-background-primary"
                />
              </div>

              <div className="tradex-space-y-2 p2p-gift-card-select">
                <label className=" tradex-input-label tradex-mb-0 !tradex-text-sm">
                  {" "}
                  {t("Payment Type")}
                </label>
                <Select
                  classNamePrefix={"custom-select"}
                  options={options}
                  onChange={setSelectedPaymentType}
                  value={selectedPaymentType}
                />
              </div>
              <div className="tradex-space-y-2 p2p-gift-card-select">
                <label className=" tradex-input-label tradex-mb-0 !tradex-text-sm">
                  {" "}
                  {t("Currency Type")}
                </label>
                <Select
                  classNamePrefix={"custom-select"}
                  options={
                    selectedPaymentType.value === 1
                      ? settings?.currency
                      : settings?.assets
                  }
                  value={selectedCurrencyType}
                  onChange={setSelectedCurrencyType}
                />
              </div>
              <div className="tradex-space-y-2 p2p-gift-card-select">
                <label className=" tradex-input-label tradex-mb-0 !tradex-text-sm">
                  {t("Payment Method")}
                </label>
                <Select
                  classNamePrefix={"custom-select"}
                  options={settings?.payment_method}
                  value={selectedPayment}
                  onChange={setSelectedPayment}
                />
              </div>
              <div className="tradex-space-y-2 p2p-gift-card-select">
                <label className=" tradex-input-label tradex-mb-0 !tradex-text-sm">
                  {t("Available Region(s)")}
                </label>
                <Select
                  classNamePrefix={"custom-select"}
                  options={settings?.country}
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                />
              </div>
              <div className=" tradex-flex tradex-items-end">
                <button
                  className=" tradex-w-full tradex-h-[48px] tradex-bg-primary tradex-max-h-[48px] tradex-rounded tradex-text-white tradex-font-semibold"
                  onClick={resetHandler}
                >
                  {t("Reset")}
                </button>
              </div>
            </div>
            <ReactDataTable
              columns={columns}
              data={allGiftCardAds?.data || []}
              processing={loading}
              isSearchable={false}
              isSortEnable={false}
            />
          </div>
        </div>
        {!loading && allGiftCardAds?.data?.length > 0 && (
          <CustomPagination
            per_page={allGiftCardAds?.per_page}
            current_page={allGiftCardAds?.current_page}
            total={allGiftCardAds?.total}
            handlePageClick={handlePageClick}
          />
        )}
      </P2PGiftCardLayout>
      <Footer />
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const { data } = await getGiftCardTradeHeder();
  return {
    props: {
      data: data,
    },
  };
};
