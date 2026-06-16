import React, { Fragment } from "react";

export default function RangeSlider({
  items,
  handleFunc,
  idPrefix = "buy",
}: any) {
  return (
    <div className="exchange-dashboard-slider-range-cls mt-3 mb-5">
      {items?.map((data: any, index: any) => (
        <Fragment key={index}>
          <input
            type="radio"
            name="debt-amount"
            id={`${idPrefix}${index}`}
            onClick={() => handleFunc(data?.percent)}
          />
          <label
            htmlFor={`${idPrefix}${index}`}
            data-debt-amount={`${data?.percent * 100}%`}
          />
        </Fragment>
      ))}
    </div>
  );
}
