import React from "react";

const SellingSection = ({ data }: any) => {
  return (
    <section className=" tradex-pt-[80px]">
      <div className=" tradex-space-y-10">
        <div className=" tradex-text-center">
          <h1 className="tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] !tradex-text-title tradex-font-bold ">
            {data?.launchpad_why_choose_us_text}
          </h1>
        </div>
        <div className=" tradex-grid tradex-grid-cols-1 sm:tradex-grid-cols-2 lg:tradex-grid-cols-4 tradex-gap-6">
          {data?.feature_list?.map((item: any, index: number) => (
            <div
              key={index}
              className="tradex-group hover:tradex-shadow-[4px_4px_50px_0px_#8C8C8C30] tradex-rounded-lg tradex-border tradex-border-background-primary tradex-bg-background-main tradex-flex tradex-justify-center tradex-gap-3 tradex-py-8 tradex-px-2.5"
            >
              <a className=" tradex-flex tradex-flex-col tradex-gap-4 tradex-items-center">
                <div className="tradex-w-[60px] tradex-h-[60px] tradex-min-w-[60px] tradex-p-2.5 tradex-bg-background-main tradex-flex tradex-justify-center tradex-items-center tradex-rounded-[16px] tradex-border tradex-border-background-primary">
                  <img
                    className=""
                    src={item.image ? item.image : "/ico_why_default_icon.png"}
                    alt="icon"
                  />
                </div>
                <div className=" tradex-space-y-3 tradex-text-center">
                  <h3 className=" tradex-text-2xl tradex-leading-[30px] !tradex-text-title group-hover:!tradex-text-primary">
                    {item.title}
                  </h3>
                  <p className="tradex-text-base tradex-leading-[22px] !tradex-text-title">
                    {item.description}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SellingSection;
