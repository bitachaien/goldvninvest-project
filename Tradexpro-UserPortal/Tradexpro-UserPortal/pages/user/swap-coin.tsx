import type { GetServerSideProps, NextPage } from "next";

import * as React from "react";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import {
  getUserCoinForSwapAction,
  getRateAction,
  swapCoinAction,
} from "state/actions/swap";
import { parseCookies } from "nookies";
import { getRateSsr } from "service/swap";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import SmallLoading from "components/common/smallLoading";
import Footer from "components/common/footer";
import { AiOutlineSwap, AiFillWallet } from "react-icons/ai";
import { toast } from "react-toastify";
import { IoIosArrowBack } from "react-icons/io";
import WalletLayout from "components/wallet/WalletLayout";
const SwapCoin: NextPage = ({
  walletLists,
  wallet_rate,
  convert_rate,
  ssrRate,
  from_wallet,
  to_wallet,
  from_wallet_details,
  to_wallet_details,
}: any) => {
  const { t } = useTranslation("common");

  const [loading, setLoading] = React.useState(false);
  let tempfromSelected;
  let temptoSelected;
  const [fromSelected, setFromSelected] = React.useState<any>({
    amount: 0,
    selected: null,
    coin_id: null,
    balamce: 0,
  });
  const [toSelected, setToSelected] = React.useState<any>({
    amount: 0,
    selected: null,
    coin_id: null,
    balamce: 0,
  });
  const [rate, setRate] = React.useState<any>({
    wallet_rate: 0,
    convert_rate: 0,
    rate: 0,
    from_wallet: null,
    to_wallet: null,
  });
  const swapSelected = () => {
    // Swap 'fromSelected' and 'toSelected' directly without using temporary variables
    setFromSelected((prevFromSelected: any) => ({
      ...prevFromSelected,
      amount: toSelected.amount,
      selected: toSelected.selected,
      coin_id: toSelected.coin_id,
      balamce: toSelected.balamce,
    }));

    setToSelected((prevToSelected: any) => ({
      ...prevToSelected,
      amount: fromSelected.amount,
      selected: fromSelected.selected,
      coin_id: fromSelected.coin_id,
      balamce: fromSelected.balamce,
    }));
  };
  const convertCoin = async (amount: any, from_id: any, to_id: any) => {
    setLoading(true);
    const data = await getRateAction(from_id, to_id, amount, setRate);
    setLoading(false);
    return data;
  };

  React.useEffect(() => {
    setToSelected({
      ...toSelected,
      amount: rate.convert_rate,
    });
  }, [rate]);
  React.useEffect(() => {
    setFromSelected({
      amount: 1,
      selected: from_wallet_details?.coin_type,
      coin_id: from_wallet_details?.id,
      balamce: from_wallet_details?.balance,
    });
    setToSelected({
      amount: wallet_rate,
      selected: to_wallet_details?.coin_type,
      coin_id: to_wallet_details?.id,
      balamce: to_wallet_details?.balance,
    });
    setRate({
      wallet_rate: wallet_rate,
      convert_rate: convert_rate,
      rate: ssrRate,
      from_wallet: from_wallet,
      to_wallet: to_wallet,
    });
  }, []);

  return (
    <>
      <WalletLayout>
        <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
          <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
            <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
              {t("Swap Coin")}
            </h2>
            <Link href="/user/my-wallet">
              <div className=" tradex-flex tradex-gap-1 tradex-items-center tradex-cursor-pointer">
                <IoIosArrowBack />
                <h5 className="tradex-text-xl tradex-leading-6 tradex-font-medium !tradex-text-title">
                  {t("My Wallet")}
                </h5>
              </div>
            </Link>
          </div>
          <div className="tradex-space-y-6">
            <div className=" tradex-space-y-2">
              <label className="tradex-input-label tradex-mb-0 tradex-flex tradex-justify-between tradex-gap-6 tradex-items-center">
                <span>{t("From")}</span>
                <span>
                  {t("Available")} :{" "}
                  {parseFloat(fromSelected.balamce).toFixed(8)}{" "}
                  {fromSelected.selected}
                </span>
              </label>
              <div className="tradex-input-field tradex-flex tradex-justify-between tradex-items-center">
                <input
                  type="number"
                  className="!tradex-border-none tradex-bg-transparent tradex-text-sm tradex-text-title"
                  id="amount-one"
                  value={fromSelected ? fromSelected.amount : ""}
                  placeholder={t("Please enter 10 -2400000")}
                  onChange={(e) => {
                    if (Number(e.target.value) < 0) {
                      return;
                    }
                    if (!e.target.value) {
                      setFromSelected({
                        ...fromSelected,
                        amount: 0,
                      });
                      convertCoin(
                        0,
                        fromSelected.coin_id,
                        toSelected.coin_id
                      ).then((data) => {
                        setToSelected({
                          ...toSelected,
                          coin_id: data?.to_wallet?.id,
                          selected: data?.to_wallet?.coin_type,
                          balamce: data?.to_wallet?.balance,
                          amount: data?.convert_rate,
                        });
                      });
                      return;
                    }
                    setFromSelected({
                      ...fromSelected,
                      amount: e.target.value,
                    });
                    convertCoin(
                      e.target.value,
                      fromSelected.coin_id,
                      toSelected.coin_id
                    ).then((data) => {
                      setToSelected({
                        ...toSelected,
                        coin_id: data?.to_wallet?.id,
                        selected: data?.to_wallet?.coin_type,
                        balamce: data?.to_wallet?.balance,
                        amount: data?.convert_rate,
                      });
                    });
                  }}
                />
                <select
                  className="tradex-text-sm !tradex-text-title !tradex-bg-background-primary tradex-px-4 !tradex-border-0 !tradex-border-l !tradex-border-solid !tradex-border-title tradex-min-w-[105px]"
                  id="currency-one"
                  onChange={(e: any) => {
                    setFromSelected({
                      ...fromSelected,
                      coin_id: e.target.value,
                      selected: walletLists.find(
                        (wallet: any) =>
                          parseInt(wallet.id) === parseInt(e.target.value)
                      ).coin_type,
                    });
                    convertCoin(
                      fromSelected.amount,
                      e.target.value,
                      toSelected.coin_id
                    ).then((data) => {
                      setFromSelected({
                        ...fromSelected,
                        coin_id: data?.from_wallet?.id,
                        selected: data?.from_wallet?.coin_type,
                        balamce: data?.from_wallet?.balance,
                        amount: data?.convert_rate,
                      });
                    });
                  }}
                >
                  <option value="" selected disabled hidden>
                    {fromSelected.selected ? fromSelected.selected : "Select"}
                  </option>
                  {walletLists?.map((item: any, index: number) => (
                    <option
                      key={index}
                      value={item.id}
                      selected={fromSelected.coin_id == item.id}
                    >
                      {item.coin_type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className=" tradex-min-h-[40px] tradex-flex tradex-items-center">
              <hr className=" tradex-w-full tradex-bg-background-primary" />
              <button
                id="swap"
                className="tradex-min-w-10 tradex-w-10 tradex-h-10 tradex-flex tradex-justify-center tradex-items-center tradex-rounded-full tradex-border tradex-border-background-primary"
                onClick={async () => {
                  setLoading(true);
                  await swapSelected();
                  await getRateAction(
                    toSelected.coin_id,
                    fromSelected.coin_id,
                    toSelected.amount,
                    setRate
                  );
                  setLoading(false);
                }}
              >
                <i className="fa fa-refresh" />
              </button>
              <hr className=" tradex-w-full tradex-bg-background-primary" />
            </div>
            <div className=" tradex-space-y-2">
              <label className="tradex-input-label tradex-mb-0 tradex-flex tradex-justify-between tradex-gap-6 tradex-items-center">
                <span>{t("To")}</span>
                <span>
                  {t("Available")} : {parseFloat(toSelected.balamce).toFixed(8)}
                  {toSelected.selected}
                </span>
              </label>
              <div className="tradex-input-field tradex-flex tradex-justify-between tradex-items-center">
                <input
                  type="number"
                  className="!tradex-border-none tradex-bg-transparent tradex-text-sm tradex-text-title"
                  id="amount-one"
                  value={toSelected?.amount || 0}
                  placeholder={t("Please enter 10 -2400000")}
                  disabled
                />
                <select
                  className="tradex-text-sm !tradex-text-title !tradex-bg-background-primary tradex-px-4 !tradex-border-0 !tradex-border-l !tradex-border-solid !tradex-border-title tradex-min-w-[105px]"
                  id="currency-two"
                  onChange={(e) => {
                    convertCoin(
                      fromSelected.amount,
                      fromSelected.coin_id,
                      e.target.value
                    ).then((data) => {
                      setToSelected({
                        ...toSelected,
                        coin_id: data?.to_wallet?.id,
                        selected: data?.to_wallet?.coin_type,
                        balamce: data?.to_wallet?.balance,
                        amount: data?.convert_rate,
                      });
                    });
                  }}
                >
                  <option value="" selected disabled hidden>
                    {toSelected.selected ? toSelected.selected : "Select"}
                  </option>
                  {walletLists?.map((item: any, index: number) => (
                    <option
                      key={index}
                      value={item.id}
                      selected={toSelected.coin_id == item.id}
                    >
                      {item.coin_type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {!loading ? (
              <ul className=" tradex-space-y-4 tradex-px-5 tradex-py-4 tradex-rounded-lg tradex-border tradex-border-background-primary">
                <li className="tradex-flex tradex-justify-between tradex-gap-6 tradex-items-center tradex-text-base">
                  <span className=" !tradex-text-body !tradex-font-semibold">
                    {t("Price")}
                  </span>

                  <span id="rate" className=" !tradex-text-body">
                    1 {rate.from_wallet} = {rate.rate ? rate.rate : "0"}{" "}
                    {rate.to_wallet}
                  </span>
                </li>
                <li className="tradex-flex tradex-justify-between tradex-gap-6 tradex-items-center tradex-text-base">
                  <span className=" !tradex-text-body !tradex-font-semibold">
                    {t("You will get")}
                  </span>

                  <span className=" !tradex-text-body">
                    {parseFloat(rate.convert_rate)} {rate.to_wallet}
                  </span>
                </li>
              </ul>
            ) : (
              <SmallLoading />
            )}

            <button
              className="tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-primary tradex-text-white"
              disabled={
                !fromSelected.amount ||
                !fromSelected.coin_id ||
                !toSelected.amount ||
                !toSelected.coin_id
              }
              data-toggle="modal"
              data-target="#exampleModal"
            >
              {t("Convert")}
            </button>
          </div>
        </div>
      </WalletLayout>
      <div
        className="modal fade"
        id="exampleModal"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content tradex-p-5 tradex-space-y-4">
            <h5 className="modal-title tradex-text-2xl" id="exampleModalLabel">
              {t("Are You sure?")}
            </h5>

            <div className=" tradex-flex tradex-gap-4 tradex-items-center">
              <button
                type="button"
                className="tradex-w-fit tradex-px-9 tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[36px] tradex-h-9 tradex-py-4 tradex-rounded tradex-bg-red-600 tradex-text-white"
                data-dismiss="modal"
              >
                {t("No")}
              </button>
              <button
                type="button"
                className="tradex-w-fit tradex-px-9 tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[36px] tradex-h-9 tradex-py-4 tradex-rounded tradex-bg-primary tradex-text-white"
                onClick={() => {
                  swapCoinAction(
                    fromSelected.amount,
                    fromSelected.coin_id,
                    toSelected.coin_id,
                    setLoading
                  );
                }}
                data-dismiss="modal"
              >
                {t("Yes")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/swap-history");
  const cookies = parseCookies(ctx);
  const walletLists = await getUserCoinForSwapAction(null, ctx);
  if (walletLists === false) {
    return {
      redirect: {
        destination: "/user/my-wallet",
        permanent: false,
      },
    };
  }

  if (walletLists?.length <= 1) {
    const query = new URLSearchParams({
      errorMessage: "Two coins are required to swap",
    });
    return {
      redirect: {
        destination: `/user/my-wallet?${query.toString()}`,
        permanent: false,
      },
    };
  }
  let data;
  if (ctx.query.coin_id) {
    data = await getRateSsr(
      ctx.query.coin_id,
      walletLists[1].id,
      1,
      cookies.token
    );
  } else {
    data = await getRateSsr(
      walletLists[0].id,
      walletLists[1].id,
      1,
      cookies.token
    );
  }

  if (data.success === false) {
    return {
      redirect: {
        destination: "/user/my-wallet",
        permanent: false,
      },
    };
  }

  const { wallet_rate, convert_rate, rate, from_wallet, to_wallet } = data;

  return {
    props: {
      walletLists,
      convert_rate,
      ssrRate: rate,
      from_wallet: from_wallet?.coin_type,
      to_wallet: to_wallet?.coin_type,
      from_wallet_details: from_wallet,
      to_wallet_details: to_wallet,
      wallet_rate,
    },
  };
};

export default SwapCoin;
