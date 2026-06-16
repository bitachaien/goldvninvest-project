import { getChartData, getChartDataWithoutTime } from "service/trading-chart";

const history: any = {};
let previousBase: string | null = null;
let previousTrade: string | null = null;
let previousURL: string | null = null;
let previousResolution: string | null = null;
let previousFrom: string | null = null;
let previousTo: string | null = null;
export default {
  history: history,
  hitted: false,

  //@ts-ignore
  getBars: function (symbolInfo, resolution, from, to, first, limit) {
    const base = localStorage.getItem("base_coin_id");
    const trade = localStorage.getItem("trade_coin_id");

    const currentURL = window.location.href;

    if (
      base !== previousBase ||
      trade !== previousTrade ||
      resolution != previousResolution ||
      previousFrom != from ||
      previousTo != previousResolution ||
      currentURL !== to
    ) {
      // Reset the 'hitted' flag if base, trade, or URL has changed
      this.hitted = false;
      previousBase = base;
      previousTrade = trade;
      previousURL = currentURL;
      previousResolution = resolution;
      previousFrom = from;
      previousTo = to;
    }

    let interval = resolution === "1D" ? 1440 : resolution;

    if (!this.hitted) {
      this.hitted = true;
      return getChartDataWithoutTime(interval, from, to, base, trade).then(
        (data: any) => {
          if (data.data.data.length) {
            const myBars = data.data.data;
            // let klines4800 = [...myBars, ...myBars];
            const bars = myBars.map((el: any) => ({
              time: el.time * 1000,
              low: parseFloat(el.low),
              high: parseFloat(el.high),
              open: parseFloat(el.open),
              close: parseFloat(el.close),
              volume: parseFloat(el.volume),
            }));

            if (first) {
              history[symbolInfo.name] = { lastBar: bars[bars.length - 1] };
            }
            return bars;
          }
          return [];
        }
      );
    } else {
      this.hitted = false;
      return Promise.resolve([]);
    }
  },
};
