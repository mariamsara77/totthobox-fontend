import { NextResponse } from "next/server";

export const revalidate = 60; // Cache for 60 seconds

// Reliable fallback rates in case third-party APIs fail or rate limit
const FALLBACK_DATA = {
  timestamp: Date.now(),
  crypto: {
    BTC: { name: "Bitcoin", priceUsd: 87500, change24h: 2.4, symbol: "₿" },
    ETH: { name: "Ethereum", priceUsd: 3150, change24h: 1.8, symbol: "Ξ" },
    USDT: { name: "Tether USD", priceUsd: 1.0, change24h: 0.01, symbol: "₮" },
    BNB: { name: "BNB", priceUsd: 620, change24h: -0.5, symbol: "BNB" },
    SOL: { name: "Solana", priceUsd: 175, change24h: 4.2, symbol: "SOL" },
    XRP: { name: "XRP", priceUsd: 0.65, change24h: 1.1, symbol: "XRP" },
    ADA: { name: "Cardano", priceUsd: 0.55, change24h: -1.2, symbol: "ADA" },
    DOGE: { name: "Dogecoin", priceUsd: 0.16, change24h: 3.5, symbol: "Ð" },
  },
  forex: {
    USD: 1.0,
    BDT: 122.5,
    EUR: 0.92,
    GBP: 0.79,
    SAR: 3.75,
    AED: 3.67,
    INR: 84.5,
    CAD: 1.38,
    AUD: 1.52,
    JPY: 154.0,
    MYR: 4.45,
    SGD: 1.34,
  },
};

export async function GET() {
  try {
    // Try fetching live rates from CoinGecko open API
    const cryptoRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,solana,ripple,cardano,dogecoin&vs_currencies=usd&include_24hr_change=true",
      {
        next: { revalidate: 60 },
        headers: { Accept: "application/json" },
      }
    );

    let cryptoData = FALLBACK_DATA.crypto;

    if (cryptoRes.ok) {
      const data = await cryptoRes.json();
      cryptoData = {
        BTC: { name: "Bitcoin", priceUsd: data.bitcoin?.usd || 87500, change24h: data.bitcoin?.usd_24h_change || 0, symbol: "₿" },
        ETH: { name: "Ethereum", priceUsd: data.ethereum?.usd || 3150, change24h: data.ethereum?.usd_24h_change || 0, symbol: "Ξ" },
        USDT: { name: "Tether USD", priceUsd: data.tether?.usd || 1.0, change24h: data.tether?.usd_24h_change || 0, symbol: "₮" },
        BNB: { name: "BNB", priceUsd: data.binancecoin?.usd || 620, change24h: data.binancecoin?.usd_24h_change || 0, symbol: "BNB" },
        SOL: { name: "Solana", priceUsd: data.solana?.usd || 175, change24h: data.solana?.usd_24h_change || 0, symbol: "SOL" },
        XRP: { name: "XRP", priceUsd: data.ripple?.usd || 0.65, change24h: data.ripple?.usd_24h_change || 0, symbol: "XRP" },
        ADA: { name: "Cardano", priceUsd: data.cardano?.usd || 0.55, change24h: data.cardano?.usd_24h_change || 0, symbol: "ADA" },
        DOGE: { name: "Dogecoin", priceUsd: data.dogecoin?.usd || 0.16, change24h: data.dogecoin?.usd_24h_change || 0, symbol: "Ð" },
      };
    }

    // Try fetching live fiat rates from open exchange API
    let forexData = FALLBACK_DATA.forex;
    try {
      const forexRes = await fetch(
        "https://open.er-api.com/v6/latest/USD",
        { next: { revalidate: 3600 } }
      );
      if (forexRes.ok) {
        const fData = await forexRes.json();
        if (fData.rates) {
          forexData = {
            USD: 1.0,
            BDT: fData.rates.BDT || 122.5,
            EUR: fData.rates.EUR || 0.92,
            GBP: fData.rates.GBP || 0.79,
            SAR: fData.rates.SAR || 3.75,
            AED: fData.rates.AED || 3.67,
            INR: fData.rates.INR || 84.5,
            CAD: fData.rates.CAD || 1.38,
            AUD: fData.rates.AUD || 1.52,
            JPY: fData.rates.JPY || 154.0,
            MYR: fData.rates.MYR || 4.45,
            SGD: fData.rates.SGD || 1.34,
          };
        }
      }
    } catch {}

    return NextResponse.json(
      {
        success: true,
        timestamp: Date.now(),
        crypto: cryptoData,
        forex: forexData,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          "CDN-Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          "Cloudflare-CDN-Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: true,
        timestamp: Date.now(),
        crypto: FALLBACK_DATA.crypto,
        forex: FALLBACK_DATA.forex,
        fallback: true,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          "CDN-Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          "Cloudflare-CDN-Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  }
}
