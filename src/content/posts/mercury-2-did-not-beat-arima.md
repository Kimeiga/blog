---
title: "Mercury 2 did not beat ARIMA"
description: "I tried to improve a FINSABER-style ARIMA baseline with a Mercury 2 neuro-symbolic trading agent. The saved run made the old baseline look better."
published: "2026-08-23T16:00:00.000Z"
tags: [Projects, AI, Trading, Research]
draft: false
featured: false
hero:
  src: "/images/aitrader-mercury-arima/metrics.webp"
  alt: "Bar chart comparing average return, Sharpe ratio, and drawdown for ARIMA, buy and hold, and Mercury 2"
  width: 1600
  height: 900
project: "aitrader"
disclosure: "AI-Assisted"
---

The interesting result is not that the diffusion model won. It did not.

The saved `aitrader` run compared a FINSABER-style ARIMA baseline, buy and hold, and a Mercury 2 neuro-symbolic strategy over five tickers from 2021-01-01 to 2024-01-01: AAPL, MSFT, GOOGL, AMZN, and JPM. The baseline averaged 109.40% total return, 0.937 Sharpe, and 14.04% max drawdown. The Mercury 2 strategy averaged 12.77% total return, 0.003 Sharpe, and 24.41% max drawdown. Buy and hold landed between them on return and below both on drawdown.

| Strategy | Avg total return | Avg Sharpe | Avg max drawdown |
| --- | ---: | ---: | ---: |
| [ARIMA baseline](/blog/evidence/aitrader/baseline-results.json) | 109.40% | 0.937 | 14.04% |
| [Buy and hold](/blog/evidence/aitrader/baseline-results.json) | 46.84% | 0.367 | 41.34% |
| [Mercury 2 neuro-symbolic](/blog/evidence/aitrader/mercury-parsed-summary.json) | 12.77% | 0.003 | 24.41% |

So did the project finish? Yes, in the useful sense: it produced a saved historical comparison and an answer. Did it finish as a successful trading result? No. On this run, [ARIMA beat Mercury 2 on return, Sharpe, and drawdown](/blog/evidence/aitrader/experiment-results.md).

This is an engineering note about a historical backtest, not investment advice.

## The paper that started it

This started with the FINSABER paper, [“Can LLM-based Financial Investing Strategies Outperform the Market in Long Run?”](https://arxiv.org/abs/2505.07078), by Weixian Waylon Li, Hyeonjun Kim, Mihai Cucuringu, and Tiejun Ma. The paper’s claim was exactly the kind of claim that makes a small trading-agent project feel both tempting and dangerous: many LLM investing evaluations look good because they are too narrow, too short, or too vulnerable to survivorship and data-snooping bias.

The authors built [FINSABER](https://github.com/waylonli/FINSABER) to make that harder to hide. The project frames itself as a backtesting framework for traditional technical strategies, machine learning strategies, and LLM agents. Its current docs describe [FINSABER-2](https://waylonli.github.io/FINSABER/) as a package-oriented framework with explicit execution timing, price adjustment, slippage, liquidity, structured results, and LLM cost accounting. The accompanying [FINSABER V2 dataset](https://huggingface.co/datasets/finsaber-team/FINSABER-V2-Data) is broad enough to make a five-stock toy experiment feel a little embarrassed: years of S&P 500 price data, millions of news rows, SEC filings, and metadata.

That paper made the challenge clear. If LLM strategies often lose their shine under wider, longer, stricter evaluation, maybe the model should not be asked to invent the whole strategy. Give it a mechanical state: ARIMA direction, MACD, RSI, ATR. Let a fast reasoning model decide whether the state is actionable. Keep the deterministic parts deterministic.

Mercury 2 was attractive for that role because Inception Labs presents it as a [diffusion language model](https://www.inceptionlabs.ai/blog/introducing-mercury-2), using parallel refinement instead of standard left-to-right token generation. The product post advertises very high throughput, low token cost, a 128K context window, native tool use, and schema-aligned JSON. The [Inception API](https://www.inceptionlabs.ai/blog/introducing-inception-api) also uses an OpenAI-compatible interface, which made it easy to plug into a normal agent loop.

That was the bet: maybe a fast diffusion LLM, fed with ARIMA and technical indicators at every decision point, could improve on a plain ARIMA baseline without becoming a vibes machine in a suit.

## What I built

The project became a neuro-symbolic trading adapter around FINSABER. The strategy gathered historical price data up to the current date, calculated heuristic state, sent that state to Mercury 2, and converted the model decision into buy, sell, or hold actions. The baseline script used `yfinance` to download historical prices; the library documents itself as a way to [download market data from Yahoo Finance’s API](https://ranaroussi.github.io/yfinance/), and the script pulled a 2018-01-01 to 2024-01-01 window so ARIMA had training history before the 2021-01-01 test start.

The ARIMA piece used `statsmodels.tsa.arima.model.ARIMA`; the official statsmodels docs describe that class as the [basic interface for ARIMA-type models](https://www.statsmodels.org/stable/generated/statsmodels.tsa.arima.model.ARIMA.html). In the committed heuristic code, the model is fit on the rolling close-price history and forecasts one step ahead. The key detail is in the code: [_calculate_arima fits inside the decision step](/blog/evidence/aitrader/rolling-arima-snippet.py.txt).

That matters because I had been describing the experiment as “precomputed ARIMA at each step.” The saved code does not show a committed precomputed ARIMA cache. It computes ARIMA-derived state at each step, but it does so by fitting on the available rolling window. That is still time-correct in intent, but it is not the same operational design. “Precomputed” would mean a feature table generated once under strict no-look-ahead rules, then reused by the Mercury strategy and the ARIMA ablation. This repo did not get there.

There was another practical bend in the road. FINSABER’s higher-level experiment runner pulled in heavier dependencies, so the comparison used a standalone script that directly invoked `FINSABERBt` with buy-and-hold and ARIMA strategies. That workaround is visible in the [standalone baseline script snippet](/blog/evidence/aitrader/standalone-baseline-snippet.py.txt). It was good enough to get numbers, but it is also a reminder that the harness is part of the experiment.

## What happened

The baseline run saved clean summary metrics. The Mercury run saved raw per-ticker metrics too, but the printed summary said “No results available.” That was not because there were no results. It was because the extraction function expected each FINSABER result to contain an `analyzers` object, while this path returned metrics directly. The mismatch is in the [Mercury metric extractor snippet](/blog/evidence/aitrader/mercury-metric-extractor-snippet.py.txt), and the raw saved output is in [the Mercury result file](/blog/evidence/aitrader/mercury-raw-results.json).

Parsing those raw per-ticker metrics gives the Mercury row in the table above: AAPL at 2.77% total return, MSFT at 25.18%, GOOGL at 3.96%, AMZN at 38.52%, and JPM at -6.58%. The average Sharpe across the five was essentially flat at 0.003. That parsed summary is public here: [mercury-parsed-summary.json](/blog/evidence/aitrader/mercury-parsed-summary.json).

The final Mercury log also shows the operational cost of pushing an LLM into a daily backtest loop. The summarized logs contain 5,610 lines mentioning successful HTTP 200 responses and 3,531 lines mentioning HTTP 429 responses in the final run, while still ending with a completed backtest marker and an empty printed summary marker. I am linking the [log summary](/blog/evidence/aitrader/mercury-log-summary.json), not the full log, because the count is what matters and I do not want to publish a giant API transcript for no reason.

The strongest version of the result is therefore narrow:

On the saved five-ticker, 2021-2024 run, this Mercury 2 neuro-symbolic strategy did not outperform the ARIMA baseline.

The weaker versions are not justified. It does not prove Mercury 2 cannot help trading systems. It does not prove FINSABER’s broader claims by itself. It does not even prove this exact strategy would lose under a clean FINSABER-2 run with cached features, rate-limit-aware inference, and one result schema.

It proves enough to kill the easy story.

## The learning

The first lesson is that “LLM plus indicator stack” is not automatically better than the indicator stack. In this run, the extra reasoning layer appears to have dampened or mistimed signals that ARIMA handled better alone. A fast model can make a loop cheaper and more ergonomic; speed is not a trading thesis.

The second lesson is that result plumbing deserves the same suspicion as model output. The Mercury file looked empty at the summary layer and non-empty at the raw-result layer. If I had stopped at the console, I would have called the run invalid. If I had ignored the empty summary bug, I could have overtrusted a hand-parsed result. The correct posture is uglier and better: expose both.

The third lesson is that the word “precomputed” has to be earned. In a backtest, caching is not just a performance optimization. It defines what information existed at what time. A proper next run should build a dated feature table, verify that every row only uses prior data, and then feed the exact same ARIMA feature into both the LLM strategy and an ARIMA-only ablation.

The fourth lesson is basically the FINSABER paper whispering “I told you so” from the corner. Five famous stocks over three years is not enough. It is fine for a debug run. It is not enough for a claim about long-run investing ability. The authors’ broader point about longer horizons, bigger universes, explicit timing, and regime behavior is the part that survived contact with my tiny experiment.

## The next honest test

If I continue this, I would not start by changing the prompt. I would fix the experiment.

I would run on the current [FINSABER-2](https://waylonli.github.io/FINSABER/) package and data format, generate a no-look-ahead ARIMA feature table, cache Mercury decisions, respect rate limits, and write exactly one metrics reader that all strategies share. Then I would test at least four strategies: buy and hold, ARIMA only, Mercury without ARIMA features, and Mercury with ARIMA features. Only the last comparison tells us whether the model added anything.

And I would widen the universe before getting excited. The whole point of reading the paper was to avoid building a charming little machine that wins only because the backtest is small enough to flatter it.

The project did not produce alpha. It produced a better nose for how alpha claims go stale: a narrow universe, a slightly messy harness, a powerful model, a baseline that quietly wins, and a result that is more useful because it refused to become a victory lap.

## Receipts

- [Project result memo](/blog/evidence/aitrader/experiment-results.md)
- [Baseline ARIMA and buy-and-hold JSON](/blog/evidence/aitrader/baseline-results.json)
- [Mercury 2 raw result JSON](/blog/evidence/aitrader/mercury-raw-results.json)
- [Parsed Mercury summary](/blog/evidence/aitrader/mercury-parsed-summary.json)
- [Rolling ARIMA implementation snippet](/blog/evidence/aitrader/rolling-arima-snippet.py.txt)
- [Mercury metrics extractor snippet](/blog/evidence/aitrader/mercury-metric-extractor-snippet.py.txt)
- [Mercury log summary](/blog/evidence/aitrader/mercury-log-summary.json)
- [FINSABER paper on arXiv](https://arxiv.org/abs/2505.07078)
- [FINSABER repository](https://github.com/waylonli/FINSABER)
- [FINSABER docs](https://waylonli.github.io/FINSABER/)
- [FINSABER V2 dataset](https://huggingface.co/datasets/finsaber-team/FINSABER-V2-Data)
- [Mercury 2 announcement](https://www.inceptionlabs.ai/blog/introducing-mercury-2)
- [Inception API announcement](https://www.inceptionlabs.ai/blog/introducing-inception-api)
