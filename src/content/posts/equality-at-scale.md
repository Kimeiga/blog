---
title: "Is Japan unusually equal for its scale?"
description: "I started with an intuition about Tokyo, built an index to test it, and ended up with a more interesting answer than the one I expected."
published: "2026-08-20T11:24:49-04:00"
tags: [Projects, Research, Urbanism, Japan]
draft: false
featured: false
project: "easi"
projectUrl: "https://hakanalpay.com/easi/"
disclosure: "AI-Assisted"
hero:
  src: "/images/equality-at-scale/tokyo-rail-lines.webp"
  alt: "Rail lines running through dense Tokyo neighborhoods"
  caption: "Railway lines cutting through Tokyo's dense urban fabric."
  width: 1600
  height: 900
  credit:
    name: "Manish Tulaskar"
    url: "https://unsplash.com/@manish_tulaskar"
    source: "Unsplash"
    sourceUrl: "https://unsplash.com/photos/aerial-view-of-city-buildings-during-daytime-SAx2VzJ_1rM"
    license: "Unsplash License"
    licenseUrl: "https://unsplash.com/license"
---

The question started with a feeling. Tokyo can be enormously rich without constantly advertising class. A salaryman, a student, a service worker and a wealthy professional can ride the same train, eat on the same narrow commercial street, shop at the same convenience store and occupy the same safe public realm. At the same time, Japan is not especially equal by the conventional after-tax income Gini. Nordic countries and several Central European countries do better.

That made me wonder whether the comparison was unfair in another direction. Denmark has around six million people. Japan has roughly 124 million, one of the world's largest metropolitan systems, and a deep industrial economy spanning advanced manufacturing, logistics, finance and services. Is maintaining equality simply harder at that scale?

## Why “equality divided by population” is the wrong metric

The obvious formula would be some version of equality per capita. It is also a bad formula. Dividing an equality score by population automatically punishes every large country even if population has no real relationship with inequality.

Instead, I used a residual approach: estimate the level of human equality we would expect from a country's population, income and industrial complexity, then ask how far the actual country sits above or below that expectation.

> **EASI v1.0**
>
> **50%** Human Equality percentile<br />
> **30%** Shared Development percentile<br />
> **20%** Scale Overperformance percentile

**Human Equality** is 100 minus the UNDP coefficient of human inequality. The underlying UNDP measure averages inequality in health, education and income, which makes it broader than income alone. **Shared Development** is the percentile rank of the Inequality-adjusted Human Development Index, preventing the index from rewarding a country simply because everyone is equally deprived.

For the scale model, I used population and GNI per capita alongside an industrial-complexity measure constructed from the dimensions used in UNIDO's industrial classification: manufacturing value added per capita, manufacturing employment intensity and medium/high-tech manufactured exports.

## The first surprise: the population intuition is partly real

Across the 169 countries with enough data to score, a doubling of population is associated with roughly **half a Human Equality point less**, holding income and industrial complexity constant. Japan is about **1.8 points more equal than that global model predicts**.

So the idea that scale creates some difficulty was not imaginary. Japan does look better once the comparison acknowledges its size.

## The second surprise: Germany breaks the simple story

Then I repeated the model only among the 44 high-income industrial economies. The population effect became small and statistically insignificant. Japan was almost exactly where the rich-industrial model expected it to be.

That changes the conclusion. A large, complicated industrial society *can* sustain substantially higher measured equality. Germany, with more than 80 million people and a very sophisticated manufacturing economy, is the clearest counterexample to the idea that Japan's size explains the gap with Northern Europe.

<figure class="article-photo">
  <img src="/blog/images/equality-at-scale/copenhagen-street.webp" width="1600" height="1067" loading="lazy" decoding="async" alt="Pedestrians and cyclists sharing a Copenhagen street" />
  <figcaption>Vesterbro, Copenhagen: one version of egalitarian urban life.<br />Photo by <a href="https://unsplash.com/@alainr">Alain Rouiller</a> on <a href="https://unsplash.com/photos/red-building-on-a-city-street-with-people-and-bicycles-RfIjwLCx7uM">Unsplash</a> · <a href="https://unsplash.com/license">Unsplash License</a></figcaption>
</figure>

| Rank | Country | EASI |
|---:|---|---:|
| #1 | Slovenia | 92.3 |
| #2 | Czechia | 92.2 |
| #5 | Finland | 89.9 |
| #15 | Germany | 85.0 |
| #26 | Japan | 81.1 |
| #50 | United States | 68.5 |

## But I still think the Tokyo intuition points to something real

What EASI v1 measures well is the distribution of human development. What it barely measures is the distribution of *access to a city*.

Income is only one input into a life. Location determines how many jobs, friends, restaurants, doctors, schools, parks and cultural spaces are realistically available. Transit determines how much geography costs you. Zoning and housing construction determine whether desirable locations are rationed by price. Small lots and permissive mixed use determine whether ordinary neighborhoods can support an enormous variety of small businesses.

Tokyo is unusual because all of these systems reinforce one another. Dense population supports rail. Rail creates many centers rather than one scarce downtown. Permissive redevelopment allows housing supply to respond. Tiny commercial spaces lower the scale at which a business can exist. The result is a huge quantity of urban life shared through the same public network.

<figure class="article-photo">
  <img src="/blog/images/equality-at-scale/tokyo-alley.webp" width="1600" height="2400" loading="lazy" decoding="async" style="object-position:center 62%" alt="People walking through a narrow Tokyo alley lined with shops" />
  <figcaption>Tokyo: a fine-grained commercial street where tiny premises support dense everyday variety.<br />Photo by <a href="https://unsplash.com/@tsuyoshikozu">Tsuyoshi Kozu</a> on <a href="https://unsplash.com/photos/pedestrians-walk-through-an-alley-with-shops-NJQrxYz940U">Unsplash</a> · <a href="https://unsplash.com/license">Unsplash License</a></figcaption>
</figure>

## EASI Urban β: a deliberately incomplete second index

I built a beta version rather than pretending the urban data are ready for a clean global leaderboard. It combines base EASI with two reasonably comparable OECD measures: the share of people in midsize and large functional urban areas who can reach public transport within a ten-minute walk, and housing security for the bottom income quintile.

> **EASI Urban β0.1**
>
> **50%** Base EASI<br />
> **30%** Transit access<br />
> **20%** Housing security

<figure class="article-photo">
  <img src="/blog/images/equality-at-scale/tokyo-station.webp" width="1600" height="1067" loading="lazy" decoding="async" style="object-position:center 58%" alt="Two trains stopped at a Tokyo station platform" />
  <figcaption>Public transport changes the opportunity set available at a given income.<br />Photo by <a href="https://unsplash.com/@matamatairfan">Muhammad Irfan</a> on <a href="https://unsplash.com/photos/two-trains-at-a-station-platform-in-black-and-white-K0CQPXtRYqA">Unsplash</a> · <a href="https://unsplash.com/license">Unsplash License</a></figcaption>
</figure>

The result is useful mainly because of what it *doesn't* establish. Japan's OECD transit sample contains only two functional urban areas in the country-level figure, so I exclude it from the default robust ranking. More importantly, this beta still cannot measure the characteristics I suspect matter most: small-lot mixed use, housing-construction responsiveness, commercial amenity density, residential income mixing, car independence, and the number of opportunities reachable in 30 or 45 minutes.

Those omissions are not a footnote. They may be the entire reason Tokyo feels different.

## The revised hypothesis

I would no longer say, “Japan is the most equal country for the number of people it has.” The data do not support that.

I would say something narrower and, I think, more interesting: **Japan may be exceptionally good at distributing access to high-quality urban life at enormous scale, even though it is not exceptionally equal in disposable income.**

A Nordic welfare state compresses differences in money. Japanese urbanism can compress differences in distance, housing scarcity and access to everyday amenities. They are complementary technologies. An ideal society might borrow from both.

The EASI project is open and intentionally provisional. The full ranking, methodology, and Urban beta are available on the interactive page, and I plan to revise the urban component as better comparable data become available.

- [Explore EASI →](https://hakanalpay.com/easi/)
- [EASI CSV ↓](https://hakanalpay.com/easi/data/easi-v1.csv)
- [Urban β CSV ↓](https://hakanalpay.com/easi/data/easi-urban-beta.csv)

## Primary sources

[UNDP Human Development Report data](https://hdr.undp.org/data-center/documentation-and-downloads) — HDI, IHDI and inequality measures.

[UNIDO Statistics](https://stat.unido.org/) — industrial structure and classification inputs.

[OECD Regions and Cities at a Glance 2024](https://www.oecd.org/en/publications/oecd-regions-and-cities-at-a-glance-2024_f42db3bf-en/full-report/quality-public-transport-in-cities_81190bcf.html) — transit-access data used in Urban β.

[OECD Affordable Housing Database](https://www.oecd.org/en/data/datasets/oecd-affordable-housing-database.html) — housing-cost overburden data used in Urban β.
