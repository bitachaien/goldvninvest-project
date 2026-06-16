import React from "react";
import QRCode from "react-qr-code";

type DipositQrCode = {
  address: string;
};

export default function DipositQrCode({ address }: DipositQrCode) {
  return (
    <div className="qr-background">
      <QRCode className="qrCodeBg rounded" value={address} size={150} />
    </div>
  );
}
