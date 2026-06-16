import React from "react";

export default function HighestSearchedItem({ item }: any) {
  return (
    <div className="d-flex justify-content-between">
      <div>
        <h6 className="d-inline-block text-14 text-primary mr-2">
          {item.child_coin_name}/{item.parent_coin_name}
        </h6>
        <span className="text-12 text-primary">Prepetual</span>
      </div>
      <p
        className={
          Number(item.price_change) >= 0 ? "text-0ecb81" : "text-f6465d"
        }
      >
        {parseFloat(item.price_change).toFixed(4)}%
      </p>
    </div>
  );
}
