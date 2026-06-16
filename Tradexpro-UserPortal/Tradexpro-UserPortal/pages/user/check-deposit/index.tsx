import SectionLoading from "components/common/SectionLoading";
import Footer from "components/common/footer";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BiArrowBack } from "react-icons/bi";
import {
  checkCoinTransactionDepositApi,
  getCoinListsForCheckDeposit,
  getNetworkListsForCheckDeposit,
} from "service/user";
import WalletLayout from "components/wallet/WalletLayout";

export default function CheckDeposit() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [isLoading, setIsLoading] = useState<any>(false);
  const [networkLists, setNetworkLists] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState<any>("");
  const [coinLists, setCoinLists] = useState<any>([]);
  const [selectedCoin, setSelectedCoin] = useState<any>("");
  const [transactionId, setTransactionId] = useState<any>("");
  const [depositInfo, setDepositInfo] = useState<any>({});
  useEffect(() => {
    getNetworkLists();
  }, []);

  const getNetworkLists = async () => {
    setIsLoading(true);
    const response = await getNetworkListsForCheckDeposit();
    if (!response?.success) {
      toast.error(response.message);
      setIsLoading(false);
      return;
    }
    setNetworkLists(response.data);
    setIsLoading(false);
  };

  const getCoinLists = async (event: any) => {
    setCoinLists([]);
    setSelectedCoin("");
    if (!event.target.value) {
      setSelectedNetwork(event.target.value);
      return;
    }

    setSelectedNetwork(event.target.value);
    const response = await getCoinListsForCheckDeposit(event.target.value);
    if (!response?.success) {
      toast.error(response.message);
      return;
    }
    setCoinLists(response.data);
  };

  const handleCheckDeposit = async () => {
    if (!selectedNetwork) {
      toast.error("Please select a network");
      return;
    }
    if (!selectedCoin) {
      toast.error("Please select a coin");
      return;
    }

    if (!transactionId) {
      toast.error("Please enter transaction ID");
      return;
    }
    setIsProcessing(true);

    let value = {
      coin_id: Number(selectedCoin),
      network_id: Number(selectedNetwork),
      trx_id: transactionId,
    };
    setIsModalOpen(true);
    const response = await checkCoinTransactionDepositApi(value);

    if (!response?.success) {
      toast.error(response?.message);
      setIsProcessing(false);
      setIsModalOpen(false);
      return;
    }
    setDepositInfo(response);
    setSelectedCoin("");
    setSelectedNetwork("");
    setTransactionId("");
    setIsProcessing(false);
  };

  return (
    <div>
      <WalletLayout>
        <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
          <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
            <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
              {t("Check Deposit")}
            </h2>
            <div
              onClick={() => {
                router.back();
              }}
              className=" tradex-flex tradex-gap-1 tradex-items-center tradex-cursor-pointer"
            >
              <BiArrowBack />
              <h5 className="tradex-text-xl tradex-leading-6 tradex-font-medium !tradex-text-title">
                {t("Back")}
              </h5>
            </div>
          </div>

          <div>
            <p className=" tradex-text-sm tradex-text-body">
              {t(
                "If your deposit has not appeared on your balance yet, use the following form to check if the deposit has been received"
              )}
              <br />
              {t(
                "So first, select the Network, then select the Coin and then enter the Transaction ID of the deposit that you made"
              )}
              <br />
              {t(
                "Then click the Submit button, And then you can check the balance again"
              )}
            </p>
          </div>

          <div className=" tradex-space-y-12">
            <div className="tradex-space-y-6">
              <div className=" tradex-space-y-2">
                <label className=" tradex-input-label tradex-mb-0">
                  {t("Select Network")}
                </label>
                <select
                  name="currency"
                  className="tradex-input-field !tradex-bg-background-primary !tradex-border-solid !tradex-border !tradex-border-background-primary"
                  onChange={getCoinLists}
                  value={selectedNetwork}
                >
                  <option value="">Select Network</option>
                  {networkLists.map((item: any, index: number) => (
                    <option value={item?.id} key={index}>
                      {item?.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className=" tradex-space-y-2">
                <label className=" tradex-input-label tradex-mb-0">
                  {t("Select Coin")}
                </label>
                <select
                  name="currency"
                  className={`tradex-input-field !tradex-bg-background-primary !tradex-border-solid !tradex-border !tradex-border-background-primary ${
                    !selectedNetwork && " tradex-cursor-not-allowed"
                  } `}
                  disabled={!selectedNetwork}
                  onChange={(e: any) => setSelectedCoin(e.target.value)}
                  value={selectedCoin}
                >
                  <option value="">Select Coin</option>
                  {coinLists.map((coin: any, index: number) => (
                    <option value={coin?.id} key={index}>
                      {coin?.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className=" tradex-space-y-2">
                <label className=" tradex-input-label tradex-mb-0">
                  {t("Transaction ID")}
                </label>
                <input
                  type="text"
                  className="tradex-input-field"
                  id="amountWithdrawal"
                  name="amount"
                  placeholder={t("Enter Transaction ID")}
                  value={transactionId}
                  onChange={(e: any) => setTransactionId(e.target.value)}
                />
              </div>
            </div>
            <button
              className={`tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-primary tradex-text-white ${
                isProcessing && "tradex-cursor-not-allowed"
              }`}
              type="button"
              onClick={handleCheckDeposit}
              disabled={isProcessing}
            >
              {isProcessing ? t("Processing") : t("Submit")}
            </button>
          </div>
        </div>
      </WalletLayout>

      <Footer />
      {isModalOpen && (
        <>
          <div className="modal d-block">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{t("Deposit Info")}</h5>
                  <button
                    type="button"
                    className="close right-0"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                {isProcessing ? (
                  <SectionLoading />
                ) : (
                  <>
                    <div className="modal-body p-3">
                      <div>
                        <table className="table">
                          <tbody>
                            <tr>
                              <td className="font-bold">{t("Network")}</td>
                              <td>: {depositInfo?.data?.network}</td>
                            </tr>
                            <tr>
                              <td className="font-bold">{t("Address")}</td>
                              <td className="text-break text-wrap">
                                : {depositInfo?.data?.address}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-bold">{t("From Address")}</td>
                              <td className="text-break text-wrap">
                                : {depositInfo?.data?.from_address}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-bold">
                                <span className=" tradex-whitespace-nowrap">
                                  {t("Transaction ID")}
                                </span>
                              </td>
                              <td className="text-break text-wrap">
                                <div className=" tradex-flex tradex-items-start tradex-gap-1">
                                  <span>:</span>{" "}
                                  <span className=" tradex-whitespace-break-spaces">
                                    {depositInfo?.data?.txId}
                                  </span>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td className="font-bold">{t("Amount")}</td>
                              <td>
                                : {depositInfo?.data?.amount}{" "}
                                {depositInfo?.data?.coin_type}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="modal-footer justify-content-center">
                      <h6 className="font-bold">{`**${depositInfo?.message}**`}</h6>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/check-deposit");

  return {
    props: {},
  };
};
