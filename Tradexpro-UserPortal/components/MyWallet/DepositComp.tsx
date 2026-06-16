import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { GetWalletAddress, MyWalletProcessSidebar } from "service/wallet";
import { WalletDepositApiAction } from "state/actions/wallet";
import DipositQrCode from "./diposit-qr-code";
import DipositAddressCopyField from "./diposit-address-copy-field";
import TokenAddressBox from "./TokenAddressBox";
import { BiArrowBack } from "react-icons/bi";
import CheckDeposit from "components/check-deposit/CheckDeposit";
import FAQ from "components/FAQ";
import { RootState } from "state/store";
import { useSelector } from "react-redux";
import DepositCoinDetails from "./DepositCoinDetails";

export default function DepositComp({ coinLists = [], depositFaq = [] }: any) {
  const router = useRouter();
  const { settings } = useSelector((state: RootState) => state.common);

  const [address, setAddress] = useState<string>("");
  const [fullPage, setFullPage] = useState(false);
  const [selectedCoinType, setSelectedCoinType] = useState<any>("");

  const [isGettingCoinDetails, setIsGettingCoinDetails] =
    useState<boolean>(false);
  const [coinDetails, setCoinDetails] = useState<any>(null);
  const [processData, setProcessData]: any = useState([]);
  const { t } = useTranslation("common");

  const options = coinLists.map((item: any) => ({
    value: item?.coin_type,
    label: (
      <div className="tradex-flex tradex-gap-2 tradex-items-center">
        <img
          src={item?.coin_icon || "/bitcoin.png"}
          alt={item?.name}
          width="25px"
          height="25px"
          className="tradex-max-w-[25px] tradex-max-h-[25px] tradex-object-cover tradex-object-center"
        />
        <span>{item?.name}</span>
      </div>
    ),
  }));

  const handleChange = (selectedOption: any) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, coin_type: selectedOption.value },
      },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    if (!router?.query?.coin_type) return;
    getCoinDetailsByCoinType(router?.query?.coin_type);
  }, [router?.query?.coin_type]);

  const getCoinDetailsByCoinType = async (coinType: any) => {
    if (!coinType) return;

    setIsGettingCoinDetails(true);
    setSelectedCoinType("");
    setCoinDetails(null);
    setAddress("");

    try {
      const response = await WalletDepositApiAction(coinType);

      if (!response?.success) {
        toast.error(response?.message);
        return;
      }

      setCoinDetails(response.data);
      setSelectedCoinType(coinType);
      setAddress(
        response.data?.coin_payment_networks ? "" : response.data?.address
      );
    } catch (error) {
      toast.error("Failed to fetch coin details.");
    } finally {
      setIsGettingCoinDetails(false);
    }
  };
  const networkTypeCheckHandler = (network: any) => {
    if (!network) {
      return false;
    }
    if (network == 1 || network == 2 || network == 3) {
      return false;
    }
    return true;
  };

  const checkFullPageStatus = () => {
    const depositFaqStatus = Number(settings.coin_deposit_faq_status ?? 0);
    const depositProgressStatus = Number(
      processData?.data?.progress_status_for_deposit ?? 0
    );
    const progressStatusList = processData?.data?.progress_status_list ?? [];

    if (depositFaqStatus !== 1 && depositProgressStatus !== 1) {
      setFullPage(true);
      return;
    }

    if (depositFaq?.length === 0 && !progressStatusList.length) {
      setFullPage(true);
    }
  };

  const getProcess = async () => {
    const processData = await MyWalletProcessSidebar("deposit");
    setProcessData(processData);
  };
  useEffect(() => {
    getProcess();
  }, []);

  useEffect(() => {
    checkFullPageStatus();
  }, [
    settings.coin_deposit_faq_status,
    depositFaq?.length,
    processData?.data?.progress_status_list,
    processData?.data?.progress_status_for_deposit,
  ]);

  return (
    <>
      <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
        <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
          <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
            {t("Deposit")}
          </h2>
          <div
            onClick={() => {
              router.back();
            }}
            className=" tradex-flex tradex-gap-1 tradex-items-center tradex-cursor-pointer"
          >
            <BiArrowBack />
            <h5 className="tradex-text-xl tradex-leading-6 tradex-font-medium !tradex-text-title">
              {t("My Wallet")}
            </h5>
          </div>
        </div>

        <div
          className={`tradex-grid  tradex-gap-4 ${
            fullPage ? "tradex-grid-cols-1" : "md:tradex-grid-cols-2"
          }`}
        >
          <div className="tradex-space-y-6">
            <div className=" tradex-space-y-2">
              <label className=" tradex-input-label tradex-mb-0">
                {t("Select coin")}
              </label>

              <Select
                placeholder={t("Select Coin")}
                classNamePrefix="deposit-withdraw-select"
                options={options}
                isSearchable={false}
                value={options.find(
                  (option: any) => option.value === selectedCoinType
                )}
                onChange={handleChange}
                isDisabled={isGettingCoinDetails}
                //   menuIsOpen
              />
            </div>
            {selectedCoinType && coinDetails && (
              <DepositCoinDetails
                address={address}
                setAddress={setAddress}
                coinDetails={coinDetails}
                selectedCoinType={selectedCoinType}
              />
            )}
          </div>
          {fullPage === false && (
            <div>
              {parseInt(settings.coin_deposit_faq_status) === 1 &&
                depositFaq?.length > 0 && (
                  <div className={`box-one single-box visible mb-25`}>
                    <div className="my-wallet-new rounded px-0">
                      <FAQ faqs={depositFaq} />
                    </div>
                  </div>
                )}

              {processData?.data?.progress_status_list?.length > 0 && (
                <div className="mt-3">
                  <h4>{t("Deposit Step's")}</h4>

                  <div className="flexItem">
                    <div>
                      {processData?.data?.progress_status_list?.map(
                        (item: any, index: number) => (
                          <div
                            key={`progress${index}`}
                            className={"timeLineLists"}
                          >
                            <div
                              className={`${
                                processData?.data?.progress_status_list
                                  ?.length ==
                                index + 1
                                  ? "timeLineIcon removeBeforeCSS"
                                  : "timeLineIcon"
                              }`}
                            >
                              <i className="fa-sharp fa-solid fa-circle-check active"></i>
                            </div>
                            <div className="progressContent">
                              <h5>{item.title}</h5>
                              <span>{item.description}</span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {networkTypeCheckHandler(coinDetails?.network?.id) && <CheckDeposit />}
    </>
  );
}
