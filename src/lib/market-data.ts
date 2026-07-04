export type Bias = "bullish" | "bearish" | "neutral";

export type TimeframeBias = {
  label: string;
  resolution: string;
  bias: Bias;
  changePercent: number;
};

export type BiasResult = {
  symbol: string;
  source: "twelvedata" | "sample";
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

// Twelve Data uses its own ticker conventions rather than the OANDA-style
// symbols used elsewhere in the UI, so requests are mapped through this table.
const TWELVEDATA_SYMBOL_MAP: Record<string, string> = {
  "OANDA:EUR_USD": "EUR/USD",
  "OANDA:GBP_USD": "GBP/USD",
  "OANDA:XAU_USD": "XAU/USD",
  "OANDA:WTICO_USD": "WTI/USD",
  "OANDA:NAS100_USD": "NDX",
  "OANDA:USD_JPY": "USD/JPY",
};

const TIMEFRAMES: { label: string; resolution: string }[] = [
  { label: "5m", resolution: "5min" },
  { label: "15m", resolution: "15min" },
  { label: "1H", resolution: "1h" },
  { label: "4H", resolution: "4h" },
  { label: "1D", resolution: "1day" },
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

async function fetchTwelveDataCloses(
  symbol: string,
  interval: string,
  apiKey: string
): Promise<number[]> {
  const url = new URL("https://api.twelvedata.com/time_series");
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("interval", interval);
  url.searchParams.set("outputsize", "20");
  url.searchParams.set("apikey", apiKey);

  const res = await fetch(url, { next: { revalidate: 30 } });
  const data = (await res.json().catch(() => null)) as {
    status?: string;
    message?: string;
    values?: { close: string }[];
  } | null;

  if (!res.ok || !data || data.status !== "ok" || !data.values || data.values.length < 5) {
    throw new Error(
      `Twelve Data ${symbol}/${interval} failed: ${res.status} ${data?.message ?? "no message"}`
    );
  }

  // Twelve Data returns bars newest-first; reverse to chronological order
  // so the last element is the most recent close, as biasFromCloses expects.
  return data.values.map((v) => Number(v.close)).reverse();
}

export async function getMultiTimeframeBias(symbol = "OANDA:EUR_USD"): Promise<BiasResult> {
  const apiKey = process.env.TWELVEDATA_API_KEY;
  const providerSymbol = TWELVEDATA_SYMBOL_MAP[symbol];

  if (!apiKey || !providerSymbol) {
    return { symbol, source: "sample", timeframes: sampleTimeframesFor(symbol) };
  }

  try {
    const results = await Promise.all(
      TIMEFRAMES.map(async (tf) => {
        const closes = await fetchTwelveDataCloses(providerSymbol, tf.resolution, apiKey);
        const { bias, changePercent } = biasFromCloses(closes);
        return { label: tf.label, resolution: tf.resolution, bias, changePercent };
      })
    );
    return { symbol, source: "twelvedata", timeframes: results };
  } catch {
    return { symbol, source: "sample", timeframes: sampleTimeframesFor(symbol) };
  }
}
