---
title: "Meta for easy full stack web app"
description: "I learned about react hooks today, about a year late I know, and I got really excited. Especially about useReducer()! See this video: why I love use reducer Ok but I noticed a problem. One of my friends was using react hooks with a…"
published: "2020-02-20T06:34:00+00:00"
tags: ["Uncategorized"]
draft: false
featured: false
hero:
  src: "/images/imported/wordpress/meta-for-easy-full-stack-web-app/15f95-img_20200213_174855.live.webp"
  alt: "UCLA campus buildings under a pink sunset."
  width: 640
  height: 480
legacySource: "https://kimeiga.wordpress.com/2020/02/20/meta-for-easy-full-stack-web-app/"
---
<!-- Imported from https://kimeiga.wordpress.com/2020/02/20/meta-for-easy-full-stack-web-app/. Original article HTML is retained below. -->

<div class="separator" style="clear:both;text-align:center;"><a href="/blog/images/imported/wordpress/meta-for-easy-full-stack-web-app/462f2-img_20200213_174855.jpg" style="margin-left:1em;margin-right:1em;"><img loading="lazy" border="0" height="480" src="/blog/images/imported/wordpress/meta-for-easy-full-stack-web-app/15f95-img_20200213_174855.live.webp" width="640" /></a></div>
<p>I learned about react hooks today, about a year late I know, and I got really excited. Especially about useReducer()! See this video:</p>
<div></p>
<div><a href="https://youtu.be/o-nCM1857AQ" target="_blank">why I love use reducer</a></div>
</div>
<div></div>
<div>Ok but I noticed a problem. One of my friends was using react hooks with a state that was a json object. When the values of it were updated (not the keys), it wouldn&#8217;t trigger a rerender. He needed the state to be like this because it was the object that mapbox expected for their map pins, and his team was using mapbox. </div>
<div></div>
<div>See this issue:</div>
<div></div>
<div><a href="https://stackoverflow.com/questions/56033178/usestate-not-re-rendering-when-updating-nested-object" target="_blank">https://stackoverflow.com/questions/56033178/usestate-not-re-rendering-when-updating-nested-object</a></div>
<div></div>
<div>Doesn&#8217;t look like a good solution to me. 😦</div>
<div></div>
<div>This is actually significant because this paradigm that mapbox uses is rather common among commonly used packages. I wouldn&#8217;t want to be using react or Preact and have to switch back to the unintuitive class syntax after running in to an issue here (that&#8217;s what my friend had to do).</div>
<div></div>
<div>So as usual, I come back to Vue.js.</div>
<div></div>
<div>The question becomes, which Vue framework is best? Bento, VuePress, Nuxt, etc?</div>
<div></div>
<div>Bento has a bunch of firebase stuff already set up like authentication, firestore, etc. Probably perfect for hackathons. The only reason I am not using it right now is it seems like Nuxt has more support and maturity. </div>
<div></div>
<div><a href="https://bento-starter.netlify.com/" target="_blank">https://bento-starter.netlify.com/</a></div>
<div></div>
<div>VuePress is perfect for blogs because it converts Markdown directly into html, has a search page, etc. You might want a static site if all you want was a simple blog, but if you want a blog with extra dynamic features, than VuePress sounds good. </div>
<div></div>
<div><a href="https://vuepress.vuejs.org/" target="_blank">https://vuepress.vuejs.org/</a></div>
<div></div>
<div>Nuxt seems like the most mature of all the Vue frameworks. It has automatic routing and dynamic routing by filename in pages/. It has vuex. It has static site rendering and vue-meta. It has like pretty much everything you need. </div>
<div></div>
<div><a href="https://nuxtjs.org/" target="_blank">https://nuxtjs.org/</a></div>
<div></div>
<div>I feel like if you want to build a web app, you want a lightweight JavaScript framework with the easiest developer experience. That&#8217;s Vue.js pretty much. Then you want a wrapper around it because by itself it doesn&#8217;t have an opinionated development style and doesn&#8217;t have all the packages you need set up. </div>
<div></div>
<div>So conclusion: Nuxt is pretty much the meta. Let&#8217;s learn it and make something with it and hopefully I can stop worrying about which framework to use now. </div>
