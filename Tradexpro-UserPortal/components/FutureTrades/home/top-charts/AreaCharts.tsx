import React from "react";
import { FaBtc } from "react-icons/fa";
import { IoLogoUsd } from "react-icons/io";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";
const data = [
  {
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default function AreaCharts({ tradeDatas }: any) {
  return (
    <div className="tradex-h-full tradex-bg-background-primary tradex-rounded-md tradex-flex tradex-flex-col tradex-justify-between">
      <div className="p-3">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <span className="text-12 text-primary">Open Interest</span>
            <div className="d-flex align-items-center">
              <h5 className="text-14 mr-1 text-primary">
                {tradeDatas?.coins[0]?.child_coin_name}
                {tradeDatas?.coins[0]?.parent_coin_name}
              </h5>
              <span className="text-12 text-primary">Perpetual</span>
            </div>
          </div>
        </div>
        <div className="mt-3 mb-2">
          <h4 className="text-16 text-primary">
            {tradeDatas?.coins[0]?.volume || 0}
            {tradeDatas?.coins[0]?.parent_coin_name}
          </h4>
        </div>
        <div>
          <span
            className={`text-16 d-inline-block mr-2 px-2 py-1 ${
              tradeDatas?.coins[0]?.price_change >= 0
                ? "bg-183e2f text-0ecb81"
                : "bg-35141D text-F6465D"
            }`}
          >
            {parseFloat(tradeDatas?.coins[0]?.price_change || 0).toFixed(4)}%
          </span>
          <span className="text-14 text-primary">24H Change</span>
        </div>
      </div>
      <div className="overflow-hidden w-full rounded-8 h-77">
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <Tooltip />
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#dea83d"
              fill="#281a00"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
