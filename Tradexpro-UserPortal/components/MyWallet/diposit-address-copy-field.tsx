import { copyTextById } from "common";
import React, { useRef } from "react";

type DipositAddressCopyField = {
  address: string;
};

export default function DipositAddressCopyField({
  address,
}: DipositAddressCopyField) {
  const selectAddressCopy: any = useRef(null);
  return (
    <div className="tradex-input-field tradex-flex tradex-justify-between tradex-items-center">
      <input
        onClick={() => {
          copyTextById(address);
          selectAddressCopy?.current.select();
        }}
        className=" !tradex-border-none tradex-bg-transparent tradex-text-sm tradex-w-full"
        ref={selectAddressCopy}
        type="text"
        value={address}
      />

      <span
        className="tradex-inline-block tradex-min-w-[20px]"
        onClick={() => {
          copyTextById(address);
          selectAddressCopy?.current?.select();
        }}
      >
        <i className="fa fa-clone"></i>
      </span>
    </div>
  );
}
