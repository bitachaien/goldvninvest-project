import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state/store";

import {
  EXCHANGE_LAYOUT_ONE,
  EXCHANGE_LAYOUT_THREE,
  EXCHANGE_LAYOUT_TWO,
} from "helpers/core-constants";
import LayoutOne from "./layouts/layout-one";
import LayoutTwo from "./layouts/layout-two";
import LayoutThree from "./layouts/layout-three";
import { setOpenBookBuy, setOpenBooksell } from "state/reducer/exchange";
import { useRandomPercentages } from "state/actions/exchange";

const DashboardBody = ({ ThemeColor, layout }: any) => {
  const { settings } = useSelector((state: RootState) => state.common);
  const { OpenBookBuy, OpenBooksell, marketTrades, currentPair, dashboard } =
    useSelector((state: RootState) => state.exchange);

  // useRandomPercentages(OpenBookBuy, setOpenBookBuy, dashboard, settings);
  // useRandomPercentages(OpenBooksell, setOpenBooksell, dashboard, settings);

  return (
    <>
      {layout === EXCHANGE_LAYOUT_ONE && <LayoutOne ThemeColor={ThemeColor} />}
      {layout === EXCHANGE_LAYOUT_TWO && <LayoutTwo ThemeColor={ThemeColor} />}
      {layout === EXCHANGE_LAYOUT_THREE && (
        <LayoutThree ThemeColor={ThemeColor} />
      )}
    </>
  );
};

export default DashboardBody;
