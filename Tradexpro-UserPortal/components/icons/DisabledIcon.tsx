import React from "react";

export default function DisabledIcon() {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className=" tradex-max-w-[60px] tradex-max-h-[60px]"
    >
      <rect width="100" height="100" rx="50" className=" tradex-fill-primary" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M61.8647 67.7925L32.2243 38.1521C30.5919 36.52 30.5919 33.8571 32.2243 32.2247C33.8568 30.5922 36.52 30.5919 38.1521 32.2243L67.7925 61.8647C69.4249 63.4968 69.4249 66.1597 67.7925 67.7921C66.16 69.4246 63.4968 69.4249 61.8647 67.7925Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32.2243 61.8647L61.8647 32.2243C63.4968 30.5919 66.1597 30.5919 67.7921 32.2243C69.4246 33.8568 69.4249 36.52 67.7925 38.1521L38.1521 67.7925C36.52 69.4249 33.8571 69.4249 32.2247 67.7925C30.5922 66.16 30.5919 63.4968 32.2243 61.8647Z"
        fill="white"
      />
    </svg>
  );
}
