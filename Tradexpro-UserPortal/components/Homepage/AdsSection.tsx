import Link from "next/link";
import React from "react";

export default function AdsSection({ landing }: any) {
  return (
    <div className="tradex-container tradex-pt-[120px]">
      {Number(landing?.landing_advertisement_section_status) === 1 && (
        <Link href={`${landing?.landing_advertisement_url ?? "#"}`}>
          <img
            src={
              landing?.landing_advertisement_image
                ? landing?.landing_advertisement_image
                : "/ads-image.png"
            }
            className=" tradex-rounded-lg tradex-max-h-[490px] tradex-w-full tradex-object-cover tradex-object-center cursor-pointer mt-0"
          />
        </Link>
      )}
    </div>
  );
}
