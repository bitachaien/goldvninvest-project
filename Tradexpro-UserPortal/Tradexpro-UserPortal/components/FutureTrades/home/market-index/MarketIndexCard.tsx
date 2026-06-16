import React from "react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

const lineChart = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
export default function MarketIndexCard({ item }: any) {
  return (
    <div className="tradex-h-full tradex-bg-background-card tradex-rounded-md  tradex-py-3 tradex-px-4 tradex-space-y-2">
      <h4 className=" tradex-text-sm !tradex-text-title tradex-font-bold">Perpetual</h4>
      <div className=" tradex-grid tradex-grid-cols-3">
        <div>
          <p
            className={`text-16 ${
              Number(item.price_change) >= 0
                ? " tradex-text-green-600"
                : "tradex-text-red-600"
            }`}
          >
            {parseFloat(item.price_change).toFixed(4)}%
          </p>
        </div>
        <div>
          <p className="tradex-text-xs tradex-text-title">Up 1 down 19</p>
        </div>
        <div>
          <ResponsiveContainer height={20}>
            <LineChart data={lineChart}>
              <Line
                type="monotone"
                dataKey="pv"
                dot={false}
                stroke={Number(item.price_change) >= 0 ? "#0ecb81" : "#f6465d"}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <h4 className=" tradex-text-xs !tradex-text-title">
        {item.child_coin_name}/{item.parent_coin_name}
      </h4>
    </div>
  );
}
