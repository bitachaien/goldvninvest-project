import React from "react";
import QRCode from "react-qr-code";

const PlayStoreQr = ({ storeUrl = "/" }: any) => {
  return (
    <div className=" tradex-bg-white tradex-border-4 tradex-border-white">
      <QRCode
        value={storeUrl}
        size={100}
        className="tradex-max-w-[100px] tradex-max-h-[100px] tradex-w-full tradex-h-full tradex-object-cover tradex-object-center"
      />
    </div>
  );
};

export default PlayStoreQr;
