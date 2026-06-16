import { BuyFrom } from "components/P2P/P2pHome/BuyFrom";
import Footer from "components/common/footer";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getAdsDetailsAction, p2pOrderRateAction } from "state/actions/p2p";
import BackButton from "../../../components/P2P/BackButton";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";

const Details = () => {
  const [details, setDetails] = useState();
  const [lastChanged, setlastChanged] = useState();
  const [rate, setRate] = useState({
    amount: 0,
    amount_price: 0,
    rate: 0,
  });

  const router = useRouter();
  const { adtype, uid } = router.query;

  const getRate = (amount: any, amount_price: any) => {
    p2pOrderRateAction(
      adtype,
      uid,
      amount ? amount : null,
      amount_price ? amount_price : null,
      setRate
    );
  };
  useEffect(() => {
    uid && adtype && getAdsDetailsAction(uid, adtype, setDetails);
  }, [router.query]);
  return (
    <>
      <div className=" tradex-relative">
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            {details && (
              <BuyFrom
                details={details}
                setRate={setRate}
                rate={rate}
                getRate={getRate}
                lastChanged={lastChanged}
                setlastChanged={setlastChanged}
                ads_type={adtype}
                ads_id={uid}
              />
            )}
          </div>
        </section>
        <StartTrending />
        <BottomLeftInnerPageCircle />
        <BottomRigtInnerPageCircle />
      </div>
      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/p2p");

  return {
    props: {},
  };
};
export default Details;
