---
title: "Trying to beat analytical models with LLMs in the stock market"
description: "A trading-agent experiment that started with FINSABER, wrapped ARIMA-style signals in Mercury 2, and ended with the analytical baseline winning."
published: "2026-08-23T16:00:00.000Z"
updated: "2026-08-23T16:29:33.000Z"
tags: [Projects, AI, Trading, Research]
draft: false
featured: false
hero:
  src: "/images/aitrader-mercury-arima/llms-vs-analytical-models.webp"
  alt: "Bar chart comparing average return, Sharpe ratio, and drawdown for ARIMA, buy and hold, and a Mercury 2 LLM strategy"
  width: 1600
  height: 900
project: "aitrader"
disclosure: "AI-Assisted"
---

The stock-market version of “can an LLM reason better?” is nastier than the demo version.

A language model can sound plausible about a chart. A backtest asks a colder question: if the model had made decisions one day at a time, using only information available up to that day, would the portfolio have made more money with less risk than a simpler analytical strategy?

In this experiment, the answer was no.

The saved `aitrader` run compared three strategies over five stocks from 2021-01-01 to 2024-01-01: AAPL, MSFT, GOOGL, AMZN, and JPM. The analytical baseline used ARIMA, a classical time-series forecasting model. The LLM strategy used Mercury 2, a diffusion language model from Inception Labs, but gave it ARIMA-derived state plus technical indicators at each decision step. Buy and hold was there as the boring market-exposure check.

| Strategy | Avg total return | Avg Sharpe | Avg max drawdown |
| --- | ---: | ---: | ---: |
| [ARIMA baseline](/blog/evidence/aitrader/baseline-results.json) | 109.40% | 0.937 | 14.04% |
| [Buy and hold](/blog/evidence/aitrader/baseline-results.json) | 46.84% | 0.367 | 41.34% |
| [Mercury 2 neuro-symbolic](/blog/evidence/aitrader/mercury-parsed-summary.json) | 12.77% | 0.003 | 24.41% |

So did the project finish? Yes, in the useful sense: it produced a saved historical comparison and an answer. Did it finish as a successful trading result? No. On this run, [ARIMA beat Mercury 2 on return, Sharpe, and drawdown](/blog/evidence/aitrader/experiment-results.md).

This is an engineering note about a historical backtest, not investment advice.

## The pieces

ARIMA stands for autoregressive integrated moving average. The plain-English version: it is a statistical model that looks at a time series, tries to separate trend-like structure from noise, and forecasts what comes next from past values and past errors. The implementation here used `statsmodels.tsa.arima.model.ARIMA`; the statsmodels docs describe it as the [basic interface for ARIMA-type models](https://www.statsmodels.org/stable/generated/statsmodels.tsa.arima.model.ARIMA.html).

An LLM is doing something different. It is not fitting a small, named statistical model to a price series. It is reading a structured prompt and producing a decision. That makes it flexible, but also suspicious. It can invent confidence. It can overreact to stale context. It can sound better than it trades.

Mercury 2 is the LLM I used. It comes from Inception Labs, which describes Mercury 2 as a [diffusion language model](https://www.inceptionlabs.ai/blog/introducing-mercury-2). Diffusion is more familiar from image generation, but the relevant claim for this project is not aesthetics; it is speed. Inception Labs says Mercury 2 uses parallel refinement instead of standard left-to-right token generation, advertises high throughput, low token cost, long context, tool use, and schema-aligned JSON. The [Inception API](https://www.inceptionlabs.ai/blog/introducing-inception-api) also exposes an OpenAI-compatible interface, so it was straightforward to put Mercury 2 behind a normal trading-agent call.

FINSABER is the research context. The paper [“Can LLM-based Financial Investing Strategies Outperform the Market in Long Run?”](https://arxiv.org/abs/2505.07078), by Weixian Waylon Li, Hyeonjun Kim, Mihai Cucuringu, and Tiejun Ma, argues that many LLM investing evaluations look good because they are too narrow, too short, or too vulnerable to survivorship and data-snooping bias. The authors built [FINSABER](https://github.com/waylonli/FINSABER) to make that harder to hide. Its current docs describe [FINSABER-2](https://waylonli.github.io/FINSABER/) as a package-oriented framework with explicit execution timing, price adjustment, slippage, liquidity, structured results, and LLM cost accounting.

That was the setup. A classical model makes a forecast. A language model reads the forecast plus other indicators. A backtest decides whether the extra reasoning helped or just added theatrical machinery.

## Why try it

The naive version of an LLM trading system is: send the model market context and ask whether to buy, sell, or hold. That is too easy to fool yourself with. The prompt can smuggle in future information. The benchmark can be too small. The agent can look intelligent while mostly reducing exposure.

The less naive version is neuro-symbolic: let deterministic code compute a state, then ask the model to reason over that state. In `aitrader`, the state included ARIMA direction, MACD, RSI, and ATR. The model did not need to hallucinate those indicators from prose. It received them as structured inputs and returned a trading decision.

That was my attempt to outdo the sober FINSABER lesson instead of denying it. If LLM-only strategies degrade under stricter evaluation, maybe an LLM constrained by analytical signals could still add something.

## What I built

The project became a neuro-symbolic trading adapter around FINSABER. The strategy gathered historical price data up to the current date, calculated heuristic state, sent that state to Mercury 2, and converted the model decision into buy, sell, or hold actions. The baseline script used `yfinance` to download historical prices; the library documents itself as a way to [download market data from Yahoo Finance’s API](https://ranaroussi.github.io/yfinance/), and the script pulled a 2018-01-01 to 2024-01-01 window so ARIMA had training history before the 2021-01-01 test start.

In the committed heuristic code, ARIMA is fit on the rolling close-price history and forecasts one step ahead. The key detail is in the code: [_calculate_arima fits inside the decision step](/blog/evidence/aitrader/rolling-arima-snippet.py.txt).

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
