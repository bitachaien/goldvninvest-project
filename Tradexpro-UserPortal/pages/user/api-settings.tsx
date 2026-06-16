import type { GetServerSideProps, NextPage } from "next";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { useEffect, useState } from "react";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import {
  UserSettingsAction,
  Google2faLoginAction,
  UpdateCurrencyAction,
} from "state/actions/settings";
import GoogleAuthModal from "components/settings/GoogleAuthModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state/store";
import useTranslation from "next-translate/useTranslation";
import Footer from "components/common/footer";
import { customPage, landingPage } from "service/landing-page";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import SecretKeyModal from "components/settings/SecretKeyModal";
import { toast } from "react-toastify";
import { CUstomSelect } from "components/common/CUstomSelect";
import CustomDataTable from "components/Datatable";
import IpAddressModal from "components/settings/IpAddressModal";
import {
  addWhiteListApi,
  deleteWhiteListApi,
  getApiSettingsApi,
  getWhiteListsApi,
  updateApiSettingsApi,
  updateWhiteListApi,
} from "service/settings";
import SectionLoading from "components/common/SectionLoading";
import moment from "moment";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";

const allowUser = [
  {
    label: "Yes",
    value: 1,
  },
  {
    label: "No",
    value: 0,
  },
];

const withdrawlAccess = [
  {
    label: "Off",
    value: 0,
  },
  {
    label: "On",
    value: 1,
  },
];

const tradeAccess = [
  {
    label: "Off",
    value: 0,
  },
  {
    label: "On",
    value: 1,
  },
];
const colourStyles: any = {
  placeholder: (defaultStyles: any) => {
    return {
      ...defaultStyles,
      color: "var(--text-primary-color-2)",
    };
  },
};
const ApiSettings: NextPage = () => {
  const dispatch = useDispatch();
  const [isWhiteListModalOpen, setIsWhiteListModalOpen] = useState<any>(false);
  const [isSecretKeyModalOpen, setIsSecretKeyModalOpen] = useState<any>(false);
  const [isKeyGenerate, setIsKeyGenerate] = useState(true);
  const [isSecretKeyAvailable, setIsSecretKeyAvailable] = useState<any>(false);
  const [isUpdateApiSettingsLoading, setIsUpdateApiSettingsLoading] =
    useState<any>(false);
  const [isGetApiSettingsLoading, setIsGetApiSettingsLoading] =
    useState<any>(false);

  const { t } = useTranslation("common");
  const [selectedAllowUser, setSelectedAllowUser] = useState<any>({});
  const [selectedTradeAcces, setSelectedTradeAcces] = useState<any>({});
  const [selectedWithdrawAcces, setSelectedWithdrawAcces] = useState<any>({});

  const { settings: settingsReducer } = useSelector(
    (state: RootState) => state.common
  );

  const [selectedLimit, setSelectedLimit] = useState<any>("10");
  const [Changeable, setChangeable] = useState<any>({});
  const [processing, setProcessing] = useState<boolean>(false);
  const [search, setSearch] = useState<any>("");
  const [settings, setSettings] = useState<any>();
  const [page, setPage] = useState<any>(1);

  const columns = [
    {
      Header: t("Ip Address"),
      accessor: "ip_address",
    },

    {
      Header: t("Trading Access"),
      Cell: ({ row }: any) => (
        <label className="gift-card-buy-switch mb-0">
          <input
            type="checkbox"
            checked={row?.original?.trade_access}
            onChange={() =>
              updateWhiteListStatus(
                row?.original?.id,
                "trade",
                row?.original?.trade_access ? 0 : 1
              )
            }
          />
          <span className="gift-card-buy-slider gift-card-buy"></span>
        </label>
      ),
    },
    {
      Header: t("Withdrawal Access"),
      Cell: ({ row }: any) => (
        <label className="gift-card-buy-switch mb-0">
          <input
            type="checkbox"
            checked={row?.original?.withdrawal_access}
            onChange={() =>
              updateWhiteListStatus(
                row?.original?.id,
                "withdrawal",
                row?.original?.withdrawal_access ? 0 : 1
              )
            }
          />
          <span className="gift-card-buy-slider gift-card-buy"></span>
        </label>
      ),
    },
    {
      Header: t("Is Blocked"),
      Cell: ({ row }: any) => (
        <label className="gift-card-buy-switch mb-0">
          <input
            type="checkbox"
            checked={row?.original?.status}
            onChange={() =>
              updateWhiteListStatus(
                row?.original?.id,
                "status",
                row?.original?.status ? 0 : 1
              )
            }
          />
          <span className="gift-card-buy-slider gift-card-buy"></span>
        </label>
      ),
    },
    {
      Header: t("Date"),
      accessor: "created_at",
      Cell: ({ row }: any) =>
        moment(row?.original?.created_at).format("DD MMM YYYY"),
    },
    {
      Header: t("Action"),
      Cell: ({ row }: any) => (
        <div className="active-link">
          <button
            className="btn"
            onClick={() => deleteWhiteList(row?.original?.id)}
          >
            {t("Delete")}
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(UserSettingsAction(setSettings));

    return () => {
      setSettings(null);
    };
  }, []);

  useEffect(() => {
    if (isSecretKeyAvailable) {
      getApiSttingsHandler();
    }
  }, [isSecretKeyAvailable]);

  useEffect(() => {
    if (!settingsReducer || !settingsReducer?.secret_key_available) {
      return;
    }
    setIsSecretKeyAvailable(true);
  }, [settingsReducer]);

  useEffect(() => {
    getWhiteListsHandler(1);
  }, [selectedLimit]);

  const getWhiteListsHandler = async (c_page: any) => {
    setProcessing(true);
    const response = await getWhiteListsApi(c_page, selectedLimit, search);
    if (!response.success) {
      // toast.error(response.message);
      setProcessing(false);
      return;
    }

    setChangeable(response?.data);
    setProcessing(false);
  };

  const getApiSttingsHandler = async () => {
    setIsGetApiSettingsLoading(true);
    const response = await getApiSettingsApi();

    if (!response.success) {
      toast.error(response.message);
      setIsGetApiSettingsLoading(false);
      return;
    }
    setSelectedAllowUser(
      allowUser.find((user) => user.value == response.data?.status) || {}
    );
    setSelectedTradeAcces(
      tradeAccess.find((trade) => trade.value == response.data?.trade_access) ||
        {}
    );
    setSelectedWithdrawAcces(
      withdrawlAccess.find(
        (withdraw) => withdraw.value == response.data?.withdrawal_access
      ) || {}
    );
    setIsGetApiSettingsLoading(false);
  };

  const handleUpdateApiSettings = async () => {
    let value = {
      status: selectedAllowUser?.value || 0,
      trade: selectedTradeAcces?.value || 0,
      withdrawal: selectedWithdrawAcces?.value || 0,
    };
    setIsUpdateApiSettingsLoading(true);
    const response = await updateApiSettingsApi(value);
    if (!response.success) {
      toast.error(response.message);
      setIsUpdateApiSettingsLoading(false);
      return;
    }
    toast.success(response.message);
    setIsUpdateApiSettingsLoading(false);
  };

  const handlePageClick = (event: any) => {
    getWhiteListsHandler(event.selected + 1);
    setPage(event.selected + 1);
  };

  const updateWhiteListStatus = async (id: any, type: any, value: any) => {
    const response = await updateWhiteListApi(id, type, value);
    if (!response.success) {
      toast.error(response.message);
      return;
    }
    toast.success(response.message);
    getWhiteListsHandler(page);
  };

  const deleteWhiteList = async (id: any) => {
    const response = await deleteWhiteListApi(id);
    if (!response?.success) {
      toast.error(response.message);
      return;
    }
    toast.success(response.message);
    getWhiteListsHandler(page);
  };

  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />

          <div className=" tradex-container tradex-relative tradex-space-y-6">
            <div className=" tradex-flex tradex-gap-6 tradex-items-center">
              <h2 className="!tradex-text-title tradex-text-3xl sm:tradex-text-[40px] sm:tradex-leading-[48px] tradex-font-bold tradex-text-nowrap">
                {t("Api Settings")}
              </h2>
              <hr className=" tradex-w-full tradex-bg-background-primary" />
            </div>
            <div className="setting-bg boxShadow mb-5">
              <div className="row">
                <div className="col-md-12 mb-xl-0 mb-4">
                  <div className="card-body">
                    <div className="cp-user-card-header-area">
                      <div className="cp-user-title">
                        <h4>{t("Generate Secret Key")}</h4>
                      </div>
                    </div>
                    <div className="my-3 ">
                      <div className="border rounded d-flex flex-wrap py-2 px-3 align-items-center justify-content-between gap-10">
                        <div className=" d-flex flex-wrap gap-10">
                          <p>{t("Public Key")} :</p>
                          <p className="word-break-all ">
                            {settingsReducer?.public_key ||
                              process.env.NEXT_PUBLIC_SECRET_KEY}
                          </p>
                        </div>
                        {(settingsReducer?.public_key ||
                          process.env.NEXT_PUBLIC_SECRET_KEY) && (
                          <span
                            onClick={() => {
                              navigator.clipboard.writeText(
                                settingsReducer?.public_key ||
                                  process.env.NEXT_PUBLIC_SECRET_KEY
                              );
                              toast.success("Successfully copied");
                            }}
                            className="cursor-pointer"
                          >
                            <i className="fa fa-clone"></i>
                          </span>
                        )}
                      </div>
                      <div className="border mt-3 rounded px-3 py-2 d-flex flex-wrap gap-10">
                        <p>{t("Secret Key")} : </p>
                        <p>*********************</p>
                      </div>
                    </div>
                    {settingsReducer?.secret_key_available == 1 ? (
                      <button
                        type="button"
                        className="btn btn-primary px-3 py-2 !tradex-bg-primary"
                        onClick={() => {
                          setIsKeyGenerate(false);
                          setIsSecretKeyModalOpen(true);
                        }}
                      >
                        {t("Show Secret Key")}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary px-3 py-2 !tradex-bg-primary"
                        onClick={() => {
                          setIsKeyGenerate(true);
                          setIsSecretKeyModalOpen(true);
                        }}
                      >
                        {t("Generate Secret Key")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {isSecretKeyAvailable && (
              <div className="setting-bg boxShadow mb-5">
                <div className="row">
                  <div className="col-md-12 mb-xl-0 mb-4">
                    <div className="card-body">
                      {isGetApiSettingsLoading ? (
                        <SectionLoading />
                      ) : (
                        <>
                          <div className="cp-user-card-header-area">
                            <div className="cp-user-title">
                              <h4>{t("Api Access Settings")}</h4>
                            </div>
                          </div>
                          <div className="my-3 ">
                            <div className="row align-items-end">
                              <div className="col-md-3">
                                <div className="form-group p2pSelectFilter">
                                  <label>
                                    {" "}
                                    {t("Allow User To Access Api")}
                                  </label>
                                  <Select
                                    options={allowUser}
                                    classNamePrefix={"custom-select"}
                                    value={selectedAllowUser}
                                    onChange={(e: any) =>
                                      setSelectedAllowUser(e)
                                    }
                                    styles={colourStyles}
                                  />
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="form-group p2pSelectFilter">
                                  <label>
                                    {" "}
                                    {t("Withdrawal Api Access Enable")}
                                  </label>

                                  <Select
                                    options={withdrawlAccess}
                                    classNamePrefix={"custom-select"}
                                    value={selectedWithdrawAcces}
                                    onChange={(e: any) =>
                                      setSelectedWithdrawAcces(e)
                                    }
                                    styles={colourStyles}
                                  />
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="form-group p2pSelectFilter">
                                  <label>{t("Trade Api Access Enable")}</label>
                                  <Select
                                    options={tradeAccess}
                                    classNamePrefix={"custom-select"}
                                    value={selectedTradeAcces}
                                    onChange={(e: any) =>
                                      setSelectedTradeAcces(e)
                                    }
                                    styles={colourStyles}
                                  />
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="form-group p2pSelectFilter">
                                  <button
                                    className="btn w-full h-42 !tradex-bg-primary"
                                    onClick={handleUpdateApiSettings}
                                    disabled={isUpdateApiSettingsLoading}
                                  >
                                    {isUpdateApiSettingsLoading
                                      ? t("Processing")
                                      : t("Update")}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="setting-bg boxShadow mb-5">
              <div className="row">
                <div className="col-md-12 mb-xl-0 mb-4">
                  <div className="card-body">
                    <div className="cp-user-card-header-area mb-0">
                      <div className="cp-user-title">
                        <h4>{t("White Listed Ip Address")}</h4>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="btn btn-primary px-3 py-2 !tradex-bg-primary"
                          onClick={() => setIsWhiteListModalOpen(true)}
                        >
                          {t("Add New")}
                        </button>
                      </div>
                    </div>

                    <div className="asset-balances-area cstm-loader-area">
                      <div className="asset-balances-left">
                        <div className="section-wrapper px-0">
                          <div className="tableScroll pr-0">
                            <div className=" table-responsive">
                              <CustomDataTable
                                columns={columns}
                                data={Changeable?.data || []}
                                selectedLimit={selectedLimit}
                                setSelectedLimit={setSelectedLimit}
                                search={search}
                                setSearch={setSearch}
                                processing={processing}
                                verticalAlignData={`middle`}
                                isOverflow={true}
                              />
                              {Changeable?.data?.length > 0 && (
                                <div className="row justify-content-end mt-1 px-5">
                                  <ReactPaginate
                                    nextLabel=">"
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={5}
                                    pageCount={Math.ceil(
                                      Changeable?.total / selectedLimit
                                    )}
                                    previousLabel="<"
                                    renderOnZeroPageCount={null}
                                    className={`d-flex align-items-center justify-content-center`}
                                    pageLinkClassName={`paginate-number`}
                                    activeLinkClassName={`active-paginate-cls`}
                                    previousLinkClassName={`text-primary-color text-25 mr-2`}
                                    nextLinkClassName={`text-primary-color text-25 ml-2 mr-4`}
                                    forcePage={Changeable?.current_page - 1}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <StartTrending />
        <BottomLeftInnerPageCircle />
        <BottomRigtInnerPageCircle />
      </div>

      <Footer />
      {isSecretKeyModalOpen && (
        <SecretKeyModal
          isKeyGenerate={isKeyGenerate}
          setIsSecretKeyAvailable={setIsSecretKeyAvailable}
          generateSecret2faEnable={settingsReducer?.generate_secret_2fa_enable}
          setIsSecretKeyModalOpen={setIsSecretKeyModalOpen}
          settings={settings}
        />
      )}
      {isWhiteListModalOpen && (
        <IpAddressModal
          setIsWhiteListModalOpen={setIsWhiteListModalOpen}
          isWhiteListModalOpen={isWhiteListModalOpen}
          getWhiteListsHandler={getWhiteListsHandler}
        />
      )}
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/api-settings");
  return {
    props: {},
  };
};

export default ApiSettings;
