import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import Footer from "components/common/footer";
import LaunchPad from "components/ico/LaunchPad";
import { SingleHero } from "components/ico/SingleHero";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getLaunchpadListPageAction } from "state/actions/launchpad";

export default function ViewAll() {
  const [launchpadList, setLaunchpadList]: any = useState([]);
  const router = useRouter();
  useEffect(() => {
    if (router.query.type) {
      getLaunchpadListPageAction(setLaunchpadList, router.query.type);
    }
  }, [router.query.type]);

  return (
    <div>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
              <div>
                <SingleHero type={router.query.type} />
              </div>
              <div className=" tradex-space-y-5">
                {launchpadList?.map((item: any, index: number) => (
                  <LaunchPad data={item} key={index} />
                ))}
              </div>
            </div>
          </div>
        </section>
        <StartTrending />
        <BottomLeftInnerPageCircle />
        <BottomRigtInnerPageCircle />
      </div>

      <Footer />
    </div>
  );
}
