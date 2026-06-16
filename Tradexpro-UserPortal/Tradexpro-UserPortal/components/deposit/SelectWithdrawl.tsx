import React, { useEffect } from "react";

export default function SelectWithdrawl({
  setSelectedMethod,
  depositInfo,
  selectedMethod,
}: any) {
  useEffect(() => {
    if (!depositInfo || depositInfo?.length === 0) return;
    setSelectedMethod({
      method: depositInfo[0] && depositInfo[0].payment_method,
      method_id: depositInfo[0] && depositInfo[0].id,
    });
  }, [depositInfo]);

  if (depositInfo?.length === 0) return <></>;

  return (
    <div className="tradex-w-full tradex-flex tradex-gap-6 tradex-items-center tradex-pb-4 tradex-border-b tradex-border-background-primary ">
      {depositInfo?.map((payment: any, index: number) => (
        <button
          key={index}
          onClick={() => {
            setSelectedMethod({
              method: payment.payment_method,
              method_id: payment?.id,
            });
          }}
          className={` tradex-text-base tradex-leading-6 tradex-text-title tradex-relative ${
            selectedMethod.method_id === payment.id &&
            " !tradex-text-primary tradex-font-semibold after:-tradex-bottom-[8px] after:tradex-absolute md:after:-tradex-bottom-[16px] after:tradex-left-0 after:tradex-w-full after:tradex-h-[4px] after:tradex-bg-primary after:tradex-inline-block"
          }`}
        >
          {payment.title}
        </button>
      ))}
    </div>
  );
}
