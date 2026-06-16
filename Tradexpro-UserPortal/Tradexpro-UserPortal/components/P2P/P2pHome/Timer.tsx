import React, { useState, useEffect } from "react";

const Timer = ({ seconds, getDetails }: any) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    let interval: any = null;

    const countdown = () => {
      if (seconds > 0) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        setTimeLeft(
          `${hours < 10 ? "0" + hours : hours}:${
            minutes < 10 ? "0" + minutes : minutes
          }:${
            remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds
          }`
        );
        interval = setTimeout(() => {
          countdown();
        }, 1000);
        seconds--;
      } else {
        setTimeLeft("Expired");
        clearTimeout(interval);
        getDetails();
      }
    };

    countdown();
    return () => clearTimeout(interval);
  }, [seconds]);

  return (
    <div className="tradex-flex tradex-justify-between tradex-items-center tradex-gap-6">
      <h3 className="tradex-text-xl tradex-leading-6 tradex-font-bold tradex-text-title">
        Time left:
      </h3>
      <h4 className="tradex-text-xl tradex-leading-6 tradex-font-bold tradex-text-title">
        {timeLeft}
      </h4>
    </div>
  );
};

export default Timer;
