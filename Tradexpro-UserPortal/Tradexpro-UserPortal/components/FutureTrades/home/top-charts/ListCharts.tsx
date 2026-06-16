import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Label } from "recharts";

const COLORS = ["#f6465d", "#0ecb81"];
export default function ListCharts({ tradeDatas }: any) {
  const data02 = [
    {
      name: "Group A",
      value: tradeDatas?.getHighestVolumePair?.short_account * 100,
    },
    {
      name: "Group B",
      value: tradeDatas?.getHighestVolumePair?.long_account * 100,
    },
  ];
  return (
    <div className="tradex-h-full tradex-bg-background-primary tradex-rounded-md">
      <div className="p-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="text-12 text-primary">
              Highest/Lowest PNL{"  "}
              <span className="ml-1 px-1 rounded text-F0B90B bg-3C2601">
                24 hour
              </span>
            </span>
          </div>
        </div>

        <div className="row">
          <div className="col-6 pl-3 pr-1">
            <div>
              <div className="d-flex align-items-center">
                <h5 className="text-14 text-primary mr-1">
                  {tradeDatas?.profit_loss_by_coin_pair?.highest_PNL?.symbol}
                </h5>
                <span className="text-12 text-primary">Perpetual</span>
              </div>
              <p className="text-16 text-primary">
                {tradeDatas?.profit_loss_by_coin_pair?.highest_PNL
                  ?.total_amount || 0}
                {tradeDatas?.profit_loss_by_coin_pair?.highest_PNL?.coin_type}
              </p>
            </div>
            <div>
              <div className="d-flex align-items-center">
                <h5 className="text-14 text-primary mr-1">
                  {tradeDatas?.profit_loss_by_coin_pair?.lowest_PNL?.symbol}
                </h5>
                <span className="text-12 text-primary">Perpetual</span>
              </div>
              <p className="text-16 text-primary text-F6465D">
                {tradeDatas?.profit_loss_by_coin_pair?.lowest_PNL
                  ?.total_amount || 0}
                {tradeDatas?.profit_loss_by_coin_pair?.lowest_PNL?.coin_type}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
