import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { HiOutlineHome } from "react-icons/hi";
import { RiPagesLine } from "react-icons/ri";
export default function P2PGiftCardNavbar() {
  const { t } = useTranslation("common");

  return (
    <div>
      <div className="py-3 border-bottom primary-border-color p2p-gift-card-navbar-margin-top">
        <div className="container-4xl">
          <div className="row">
            <div className="col-12">
              <ul className="d-flex justify-content-between topBarList">
                <div className="p2p-gift-card-navbar-lists gap-28">
                  <li>
                    <Link href="/p2p/gift-card">
                      <a>
                        <HiOutlineHome />
                        {t("Home")}
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/p2p/gift-card/ads/orders">
                      <a>
                        <RiPagesLine />
                        {t("Orders")}
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/p2p/gift-card/lists">
                      <a>
                        <AiOutlineGift />
                        {t("Gift Card Lists")}
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/p2p/gift-card/my-adds">
                      <a>
                        <AiOutlineGift />
                        {t("My Gift Card Ads")}
                      </a>
                    </Link>
                  </li>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
