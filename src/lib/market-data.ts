export type Bias = "bullish" | "bearish" | "neutral";

export type TimeframeBias = {
  label: string;
  resolution: string;
  bias: Bias;
  changePercent: number;
};

export type BiasResult = {
  symbol: string;
  source: "finnhub" | "sample";
  timeframes: TimeframeBias[];
};

export type Instrument = {
  symbol: string;
  display: string;
};

export const INSTRUMENTS: Instrument[] = [
  { symbol: "OANDA:EUR_USD", display: "EUR/USD" },
  { symbol: "OANDA:GBP_USD", display: "GBP/USD" },
  { symbol: "OANDA:XAU_USD", display: "Gold" },
  { symbol: "OANDA:WTICO_USD", display: "Oil (WTI)" },
  { symbol: "OANDA:NAS100_USD", display: "Nasdaq 100" },
  { symbol: "OANDA:USD_JPY", display: "USD/JPY" },
];

const TIMEFRAMES: { label: string; resolution: string }[] = [
  { label: "5m", resolution: "5" },
  { label: "15m", resolution: "15" },
  { label: "1H", resolution: "60" },
  { label: "4H", resolution: "240" },
  { label: "1D", resolution: "D" },
];

// Deterministic per-symbol hash so sample bias varies believably when
// switching instruments in the UI, without an API key configured.
function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return (index: number) => {
    const x = Math.sin(h + index * 104729) * 43758.5453;
    return x - Math.floor(x);
  };
}

function sampleTimeframesFor(symbol: string): TimeframeBias[] {
  const rand = seededRandom(symbol);
  return TIMEFRAMES.map((tf, i) => {
    const r = rand(i);
    const changePercent = (r - 0.5) * 1.6;
    const bias: Bias =
      Math.abs(changePercent) < 0.05 ? "neutral" : changePercent > 0 ? "bullish" : "bearish";
    return { label: tf.label, resolution: tf.resolution, bias, changePercent };
  });
}

function biasFromCloses(closes: number[]): { bias: Bias; changePercent: number } {
  const last = closes[closes.length - 1];
  const sma = closes.reduce((a, b) => a + b, 0) / closes.length;
  const changePercent = ((last - sma) / sma) * 100;

  if (Math.abs(changePercent) < 0.02) return { bias: "neutral", changePercent };
  return { bias: changePercent > 0 ? "bullish" : "bearish", changePercent };
}

async function fetchFinnhubCandles(symbol: string, resolution: string, apiKey: string) {
  const to = Math.floor(Date.now() / 1000);
  const barsNeeded = 20;
  const secondsPerBar =
    resolution === "D" ? 86400 : Number(resolution) * 60;
  const from = to - secondsPerBar * (barsNeeded + 5);

  // Note: Finnhub routes different asset classes through different
  // endpoints (forex/candle, stock/candle, crypto/candle). OANDA-prefixed
  // forex and CFD-style symbols (majors, gold, oil, indices) work here;
  // crypto symbols would need /crypto/candle instead.
  const url = new URL("https://finnhub.io/api/v1/forex/candle");
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("resolution", resolution);
  url.searchParams.set("from", String(from));
  url.searchParams.set("to", String(to));
  url.searchParams.set("token", apiKey);

  const res = await fetch(url, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error(`Finnhub request failed: ${res.status}`);

  const data = (await res.json()) as { s: string; c?: number[] };
  if (data.s !== "ok" || !data.c || data.c.length < 5) {
    throw new Error("Finnhub returned insufficient candle data");
  }
  return data.c;
}

export async function getMultiTimeframeBias(symbol = "OANDA:EUR_USD"): Promise<BiasResult> {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return { symbol, source: "sample", timeframes: sampleTimeframesFor(symbol) };
  }

  try {
    const results = await Promise.all(
      TIMEFRAMES.map(async (tf) => {
        const closes = await fetchFinnhubCandles(symbol, tf.resolution, apiKey);
        const { bias, changePercent } = biasFromCloses(closes);
        return { label: tf.label, resolution: tf.resolution, bias, changePercent };
      })
    );
    return { symbol, source: "finnhub", timeframes: results };
  } catch {
    return { symbol, source: "sample", timeframes: sampleTimeframesFor(symbol) };
  }
}
