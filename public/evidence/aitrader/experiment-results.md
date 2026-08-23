# Experiment Results

## Question

Would the Mercury 2 neuro-symbolic diffusion model, using ARIMA-derived heuristic state at each decision step, outperform the ARIMA baseline on historical data?

## Saved Runs Reviewed

Period: 2021-01-01 to 2024-01-01

Tickers: AAPL, MSFT, GOOGL, AMZN, JPM

Baseline file: `results/3year_comparison_20260311_013523.json`

Mercury file: `results/mercury2_backtest_20260311_101440.json`

## Results

| Strategy | Avg Total Return | Avg Sharpe | Avg Max Drawdown |
| --- | ---: | ---: | ---: |
| ARIMA baseline | 109.40% | 0.937 | 14.04% |
| Buy and hold | 46.84% | 0.367 | 41.34% |
| Mercury 2 neuro-symbolic | 12.77% | 0.003 | 24.41% |

## Conclusion

No. The saved historical run does not show Mercury 2 outperforming ARIMA. ARIMA beat the Mercury 2 neuro-symbolic strategy on average return, Sharpe ratio, and drawdown.

There are also implementation caveats:

- The Mercury summary extractor missed metrics because `FINSABERBt.run_iterative_tickers` returned metrics directly, not an `analyzers` object.
- The heuristic code fits ARIMA inside each decision step. There is no committed precomputed ARIMA cache used by the Mercury strategy.
- The final Mercury log includes many HTTP 429 rate-limit responses, although the run eventually produced nonzero per-ticker raw results.
