export const P2pWorkCard = ({ discription, icon, title }: any) => {
  return (
    <div className="tradex-max-w-[331px] tradex-flex tradex-flex-col tradex-justify-center tradex-items-center tradex-gap-10">
      <div className=" tradex-min-w-20 tradex-min-h-20 tradex-flex tradex-justify-center tradex-items-center">
        <img
          className=" tradex-max-w-[80px] tradex-max-h-[80px] tradex-w-full tradex-object-cover tradex-object-center"
          src={icon}
          height={150}
          alt=""
        />
      </div>
      <div className=" tradex-space-y-6 tradex-text-center">
        <h4 className=" tradex-text-lg md:tradex-text-2xl tradex-leading-6 !tradex-text-title">
          {title}
        </h4>
        <p className=" tradex-text-sm md:tradex-text-base tradex-leading-[22px] tradex-text-body">
          {discription}
        </p>
      </div>
    </div>
  );
};
