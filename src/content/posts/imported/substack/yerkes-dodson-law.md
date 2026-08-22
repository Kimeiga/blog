---
title: "Yerkes-Dodson Law"
description: "https://people.duke.edu/~dandan/webfiles/PapersUpside/Large%20Stakes%20Big%20Mistakes.pdf"
published: "2025-07-10T22:58:56.596Z"
tags: []
draft: false
featured: false
hero:
  src: "/images/editorial/yerkes-dodson-law/hero.webp"
  alt: "Psychologist Robert Yerkes seated at his desk at Harvard University."
  width: 1600
  height: 900
  credit:
    name: "Unknown photographer"
    source: "Wikimedia Commons"
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Robert-Yerkes.jpg"
    license: "Public domain (US)"
    licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/"
  objectPosition: "center 35%"
legacySource: "https://deltastar.substack.com/p/yerkes-dodson-law"
---
<!-- Imported verbatim from https://deltastar.substack.com/p/yerkes-dodson-law. -->

<p><a href="https://people.duke.edu/~dandan/webfiles/PapersUpside/Large%20Stakes%20Big%20Mistakes.pdf">https://people.duke.edu/~dandan/webfiles/PapersUpside/Large%20Stakes%20Big%20Mistakes.pdf</a></p><p></p><p>I think it’s important to chill out at work. According to the Yerkes Dodson law there’s an optimal amount of stress (negative and eustress) to perform optimally, too little and you’re bored, too much and you’re likely to choke under pressure. </p><p>in my job I’ve had a hard time with the self imposed pressure causing me to fix issues that come up but only halfway. For instance i got pinged about an incident last last night that needed to be “fixed immediately”. I went into panic mode and tried fixing it last night and tried talking to people all the next day trying to agree on the correct type script types since i was writing a complicated code library. That kind of pressure caused me to be too narrow minded to realize that there was more than one callsite that i needed to consume this new utility in. I also forgot to test the horizontal pagination which would have revealed that i forgot to use it in this case. I got it merged and was going to roll out today when i tested and realized that i didn’t handle the infinite scroll case and i had to tell my team that i didn’t handle it and we had to delay launch. I was very embarrassed since it’s not the first time I’ve had to delay this launch. The amount of pressure i put on myself was mounting. I made another pr and fixed the issue and tried to get it out asap but a flaky e2e suite blocked my merge and i had to tell my tl that i need to roll out Monday which is embarrassing. I am so emotionally drained from that experience today that i don’t have energy left for this hackathon that i have to do that ends tomorrow which is also another source of pressure. </p><p>in general all of these sources of pressure are basically reducing my ability to actually output work because they are causing me to associate my work with lots of negative emotional stimulus and also cause me to burn out for that reason and also for the reason of all of the failures that i experience being internalized as me being a sloppy engineer so why should i even try. Probably this is too much pressure and ironically if i didn’t really care so much or didn’t internalize so much of my performance as indicative of my salt as an engineer i would be able to perform better. </p><p>Sometimes i think about why I’m able to churn out so much more code for my side projects, and kind of gleefully, whereas for DoorDash i can barely get myself to get started when it’s basically the same difficulty. I think it’s a combination of a lack of fear of failure with my personal projects and also just lack of associations with bad vibes like thoughts of being unworthy and etc. but in theory i should be able to be as productive in my day job as in my personal projects if i try to create the same mental state that I’m in with the latter with the former. </p><p></p><p>I’m going to practice trying to be in the goldilocks zone in the center of the yerkes dodson curve and see what happens. To implement this I’m going to try to not really be emotionally present in the outcome of the work and see if this paradoxically improves my ability to come up with edge cases or improvements that i wouldn’t have found if i was only paying attention to if it succeeded or not. Maybe it will be my own personal psychological experiment. </p>
