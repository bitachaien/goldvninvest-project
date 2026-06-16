import useTranslation from "next-translate/useTranslation";

export const NoItemFound = ({ message, width = 200 }: any) => {
  const { t } = useTranslation("common");
  return (
    <div className="text-center py-5 no-item-found-border tradex-flex tradex-flex-col tradex-justify-center tradex-items-center tradex-gap-y-4">
      <img width={width} className="mb-3" src="/../noItem.svg" alt="" />
      <h3 className=" tradex-text-xl sm:tradex-text-2xl">
        {message ? message : t("No Item Found")}
      </h3>
    </div>
  );
};
