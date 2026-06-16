import React from "react";

import AreaCharts from "./AreaCharts";
import PieCharts from "./PieCharts";
import PieChartsWithNeddle from "./PieChartsWithNeddle";
import HighestSearchedLists from "./HighestSearchedLists";
import ListCharts from "./ListCharts";

export default function TopCharts({ tradeDatas }: any) {
  return (
    <div className=" tradex-grid md:tradex-grid-cols-2 lg:tradex-grid-cols-4 tradex-gap-4 tradex-relative tradex-z-10">
      <AreaCharts tradeDatas={tradeDatas} />

      <PieCharts tradeDatas={tradeDatas} />

      {/* <PieChartsWithNeddle /> */}

      <ListCharts tradeDatas={tradeDatas} />

      <HighestSearchedLists tradeDatas={tradeDatas} />
    </div>
  );
}
