import React, { useEffect, useState } from "react";
import TradeOrder from "./tradeOrder";
import { useDispatch } from "react-redux";
import { tradesHistoryDashboard } from "service/exchange";
import { setTradeOrderHistory } from "state/reducer/exchange";
import SectionLoading from "components/common/SectionLoading";

export default function UserTradeOrder({ tradeOrder }: any) {
  const dispatch = useDispatch();
  const [tradeOrderHistories, setTradeOrderHistories] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const base: any = localStorage.getItem("base_coin_id");
  const trade: any = localStorage.getItem("trade_coin_id");

  useEffect(() => {
    if (!tradeOrder) return;

    if (!trade || !base) {
      return;
    }
    getTradeOrder();
    const intervalId = setInterval(async () => {
      getTradeOrder();
    }, 5000);

    return () => {
      setTradeOrderHistories([]);
      setLoading(true);
      clearInterval(intervalId);
    };
  }, [base, trade, tradeOrder]);

  const getTradeOrder = async () => {
    setLoading(true);
    const tradeOrderHistoryResponse = await tradesHistoryDashboard(
      base,
      trade,
      "dashboard"
    );
    dispatch(
      setTradeOrderHistory(tradeOrderHistoryResponse?.data?.transactions)
    );
    setTradeOrderHistories(tradeOrderHistoryResponse?.data?.transactions);
    setLoading(false);
  };

  //   if (loading && tradeOrder) return <SectionLoading />;

  return (
    <TradeOrder
      tradeOrder={tradeOrder}
      tradeOrderHistory={tradeOrderHistories}
    />
  );
}
