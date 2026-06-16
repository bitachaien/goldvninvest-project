import { DepthChart } from "pennant";
import "pennant/dist/style.css";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";

export default function DepthChartView() {
  const { OpenBookBuy, OpenBooksell } = useSelector(
    (state: RootState) => state.exchange
  );

  const [depthCartData, setDepthCartData] = useState<any>({
    buy: [],
    sell: [],
  });

  const theme = localStorage.getItem("theme");

  useEffect(() => {
    if (!OpenBookBuy || OpenBookBuy?.length <= 0) {
      return;
    }
    const results = OpenBookBuy.map((buy: any) => ({
      price: parseFloat(buy.price),
      volume: parseFloat(buy.amount),
    }));

    setDepthCartData((prev: any) => ({
      ...prev,
      buy: results,
    }));
  }, [OpenBookBuy]);

  useEffect(() => {
    if (!OpenBooksell || OpenBooksell?.length <= 0) {
      return;
    }
    const results = OpenBooksell.map((buy: any) => ({
      price: parseFloat(buy.price),
      volume: parseFloat(buy.amount),
    }));

    setDepthCartData((prev: any) => ({
      ...prev,
      sell: results,
    }));
  }, [OpenBooksell]);

  const isDataAvailable =
    depthCartData.buy.length > 0 && depthCartData.sell.length > 0;

  return (
    <div className="w-full h-570">
      {isDataAvailable && (
        <DepthChart
          data={depthCartData}
          theme={theme == "dark" ? "dark" : "light"}
        />
      )}
    </div>
  );
}
