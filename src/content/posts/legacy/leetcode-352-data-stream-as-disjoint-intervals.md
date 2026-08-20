---
title: "352. Data Stream as Disjoint Intervals"
description: "352. Data Stream as Disjoint Intervals Solved Hard Topics Companies Given a data stream input of non negative integers a 1 , a 2 , ..., a n , summarize the numbers seen so far as a list of disjoint intervals. Implement…"
published: "2023-09-13T12:00:00-04:00"
tags: ["Software", "Algorithms", "Python"]
draft: false
featured: false
legacySource: "https://github.com/Kimeiga/leetcode/blob/main/_posts/2023-09-13-352-data-stream-as-disjoint-intervals.md"
---

<div class="flex w-full flex-1 flex-col gap-4 overflow-y-auto px-4 py-5"><div class="flex items-start justify-between gap-4"><div class="flex items-start gap-2"><div class="text-title-large font-semibold text-text-primary dark:text-text-primary">352. Data Stream as Disjoint Intervals<div class="text-body ml-2 inline-flex items-center gap-2 py-1"><div class="inline-flex items-center space-x-2"></div></div></div></div><div class="text-body flex flex-none items-center gap-1 py-1.5 text-text-secondary dark:text-text-secondary">Solved<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="1em" height="1em" fill="currentColor" class="fill-none stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M12.598 7a5.6 5.6 0 11-3.15-5.037m2.1 1.537l-4.9 4.9-1.4-1.4"></path></svg></div></div><div class="flex gap-1"><div class="relative inline-flex items-center justify-center text-caption px-2 py-1 gap-1 rounded-full bg-fill-secondary text-difficulty-hard dark:text-difficulty-hard">Hard</div><div class="relative inline-flex items-center justify-center text-caption px-2 py-1 gap-1 rounded-full bg-fill-secondary text-text-secondary cursor-pointer transition-colors hover:bg-fill-primary hover:text-text-primary"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 14" width="1em" height="1em" fill="currentColor" class="h-3.5 w-3.5 fill-none stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M10.038 4.464h-.004m1.853-2.8l-3.384-.261a1.03 1.03 0 00-.808.299L2.2 7.197a1.03 1.03 0 000 1.457l3.644 3.644a1.03 1.03 0 001.458 0l5.495-5.495a1.03 1.03 0 00.298-.808l-.26-3.383a1.03 1.03 0 00-.948-.949z"></path></svg>Topics</div><div class="relative inline-flex items-center justify-center text-caption px-2 py-1 gap-1 rounded-full bg-fill-secondary text-text-secondary cursor-pointer transition-colors hover:bg-fill-primary hover:text-text-primary"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 14" width="1em" height="1em" fill="currentColor" class="h-3.5 w-3.5 fill-none stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M1.668 12.25h11.667m-7-.584V7a.583.583 0 00-.584-.583H3.418A.583.583 0 002.835 7v4.666c0 .323.26.584.583.584h2.333a.583.583 0 00.584-.584zm0 0c0 .323.26.584.583.584h4.667a.583.583 0 00.583-.584V1.75a.583.583 0 00-.583-.583H6.918a.583.583 0 00-.583.583v9.916zm2.333-2.33h1.167M8.668 6.71h1.167M8.668 4.086h1.167"></path></svg>Companies</div></div><p>Given a data stream input of non-negative integers <code>a<sub>1</sub>, a<sub>2</sub>, ..., a<sub>n</sub></code>, summarize the numbers seen so far as a list of disjoint intervals.</p>

<p>Implement the <code>SummaryRanges</code> class:</p>

<ul>
	<li><code>SummaryRanges()</code> Initializes the object with an empty stream.</li>
	<li><code>void addNum(int value)</code> Adds the integer <code>value</code> to the stream.</li>
	<li><code>int[][] getIntervals()</code> Returns a summary of the integers in the stream currently as a list of disjoint intervals <code>[start<sub>i</sub>, end<sub>i</sub>]</code>. The answer should be sorted by <code>start<sub>i</sub></code>.</li>
</ul>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre><strong>Input</strong>
["SummaryRanges", "addNum", "getIntervals", "addNum", "getIntervals", "addNum", "getIntervals", "addNum", "getIntervals", "addNum", "getIntervals"]
[[], [1], [], [3], [], [7], [], [2], [], [6], []]
<strong>Output</strong>
[null, null, [[1, 1]], null, [[1, 1], [3, 3]], null, [[1, 1], [3, 3], [7, 7]], null, [[1, 3], [7, 7]], null, [[1, 3], [6, 7]]]

<strong>Explanation</strong>
SummaryRanges summaryRanges = new SummaryRanges();
summaryRanges.addNum(1);      // arr = [1]
summaryRanges.getIntervals(); // return [[1, 1]]
summaryRanges.addNum(3);      // arr = [1, 3]
summaryRanges.getIntervals(); // return [[1, 1], [3, 3]]
summaryRanges.addNum(7);      // arr = [1, 3, 7]
summaryRanges.getIntervals(); // return [[1, 1], [3, 3], [7, 7]]
summaryRanges.addNum(2);      // arr = [1, 2, 3, 7]
summaryRanges.getIntervals(); // return [[1, 3], [7, 7]]
summaryRanges.addNum(6);      // arr = [1, 2, 3, 6, 7]
summaryRanges.getIntervals(); // return [[1, 3], [6, 7]]
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>0 &lt;= value &lt;= 10<sup>4</sup></code></li>
	<li>At most <code>3 * 10<sup>4</sup></code> calls will be made to <code>addNum</code> and <code>getIntervals</code>.</li>
	<li>At most <code>10<sup>2</sup></code>&nbsp;calls will be made to&nbsp;<code>getIntervals</code>.</li>
</ul>

<p>&nbsp;</p>
<p><strong>Follow up:</strong> What if there are lots of merges and the number of disjoint intervals is small compared to the size of the data stream?</p>
</div><div class="mt-6 flex flex-col gap-3"><div class="flex h-full flex-wrap items-center"><div class="mr-4 flex items-center space-x-2.5"><div class="text-label-2 dark:text-dark-label-2 text-xs">Accepted</div><div class="text-label-1 dark:text-dark-label-1 text-sm font-medium">101.6K</div></div><div class="bg-divider-2 dark:bg-dark-divider-2 h-full w-px border-divider-1 dark:border-dark-divider-1 mr-4 max-h-[14px]"></div><div class="mr-4 flex items-center space-x-2.5"><div class="text-label-2 dark:text-dark-label-2 text-xs">Submissions</div><div class="text-label-1 dark:text-dark-label-1 text-sm font-medium">169.7K</div></div><div class="bg-divider-2 dark:bg-dark-divider-2 h-full w-px border-divider-1 dark:border-dark-divider-1 mr-4 max-h-[14px]"></div><div class="mr-4 flex items-center space-x-2.5"><div class="text-label-2 dark:text-dark-label-2 text-xs">Acceptance Rate</div><div class="text-label-1 dark:text-dark-label-1 text-sm font-medium"><span class="text-md font-medium">59.8%</span></div></div></div><hr class="border-divider-3 dark:border-dark-divider-3"><div><div class="mb-2 flex items-center space-x-4"><div class="text-label-2 dark:text-dark-label-2 text-md">Seen this question in a real interview before?</div><div class="text-label-3 dark:text-dark-label-3 text-md font-medium">1/4</div></div><div class="flex"><div class="py-1 px-2 cursor-pointer text-xs mr-3 rounded-[12px] text-label-2 dark:text-dark-label-2 bg-fill-3 dark:bg-dark-fill-3 hover:bg-fill-2 dark:hover:bg-dark-fill-2" data-has-seen="true">Yes</div><div class="py-1 px-2 cursor-pointer text-xs mr-3 rounded-[12px] text-label-2 dark:text-dark-label-2 bg-fill-3 dark:bg-dark-fill-3 hover:bg-fill-2 dark:hover:bg-dark-fill-2">No</div></div></div><hr class="border-divider-3 dark:border-dark-divider-3"><div class="flex flex-col"><div class="group flex cursor-pointer items-center transition-colors text-label-2 dark:text-dark-label-2 hover:text-label-1 dark:hover:text-dark-label-1"><div class="flex-1 text-sm leading-[22px]">Discussion (55)</div><div class="text-[24px] transition-colors text-gray-4 dark:text-dark-gray-4 group-hover:text-gray-5 dark:group-hover:text-dark-gray-5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="origin-center transition-transform"><path fill-rule="evenodd" d="M16.293 9.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L12 13.586l4.293-4.293z" clip-rule="evenodd"></path></svg></div></div><div style="height: 0px; transition-duration: 0.25s;" class="overflow-hidden transition-all"><div class="mt-2 flex flex-col"></div></div></div><hr class="border-divider-3 dark:border-dark-divider-3"><div class="flex flex-col"><div class="group flex cursor-pointer items-center transition-colors text-label-2 dark:text-dark-label-2 hover:text-label-1 dark:hover:text-dark-label-1"><div class="flex-1 text-sm leading-[22px]">Similar Questions</div><div class="text-[24px] transition-colors text-gray-4 dark:text-dark-gray-4 group-hover:text-gray-5 dark:group-hover:text-dark-gray-5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="origin-center transition-transform"><path fill-rule="evenodd" d="M16.293 9.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L12 13.586l4.293-4.293z" clip-rule="evenodd"></path></svg></div></div><div style="height: 0px; transition-duration: 0.25s;" class="overflow-hidden transition-all"><div class="mt-2 flex flex-col"><div class="flex w-full items-center justify-between py-2"><div class="flex flex-1 items-center gap-2 overflow-hidden"><div class="overflow-hidden"><div class="truncate text-label-1 dark:text-dark-label-1 hover:text-blue-s dark:hover:text-dark-blue-s"><a class="text-sm font-medium transition-none text-label-1 dark:text-dark-label-1 hover:text-blue-s dark:hover:text-dark-blue-s" href="/problems/summary-ranges/">Summary Ranges</a></div></div></div><div class="ml-4 flex-none"><div class="text-xs font-medium text-olive dark:text-dark-olive">Easy</div></div></div><div class="flex w-full items-center justify-between py-2"><div class="flex flex-1 items-center gap-2 overflow-hidden"><div class="overflow-hidden"><div class="truncate text-label-1 dark:text-dark-label-1 hover:text-blue-s dark:hover:text-dark-blue-s"><a class="text-sm font-medium transition-none text-label-1 dark:text-dark-label-1 hover:text-blue-s dark:hover:text-dark-blue-s" href="/problems/find-right-interval/">Find Right Interval</a></div></div></div><div class="ml-4 flex-none"><div class="text-xs font-medium text-yellow dark:text-dark-yellow">Medium</div></div></div><div class="flex w-full items-center justify-between py-2"><div class="flex flex-1 items-center gap-2 overflow-hidden"><div class="overflow-hidden"><div class="truncate text-label-1 dark:text-dark-label-1 hover:text-blue-s dark:hover:text-dark-blue-s"><a class="text-sm font-medium transition-none text-label-1 dark:text-dark-label-1 hover:text-blue-s dark:hover:text-dark-blue-s" href="/problems/range-module/">Range Module</a></div></div></div><div class="ml-4 flex-none"><div class="text-xs font-medium text-pink dark:text-dark-pink">Hard</div></div></div><div class="flex w-full items-center justify-between py-2"><div class="flex flex-1 items-center gap-2 overflow-hidden"><div class="overflow-hidden"><div class="truncate text-label-1 dark:text-dark-label-1 hover:text-blue-s dark:hover:text-dark-blue-s"><a class="text-sm font-medium transition-none text-label-1 dark:text-dark-label-1 hover:text-blue-s dark:hover:text-dark-blue-s" href="/problems/count-integers-in-intervals/">Count Integers in Intervals</a></div></div></div><div class="ml-4 flex-none"><div class="text-xs font-medium text-pink dark:text-dark-pink">Hard</div></div></div></div></div></div></div><div class="mt-8"><div class="text-label-2 dark:text-dark-label-2 text-xs">Copyright ©️ 2023 LeetCode All rights reserved</div></div></div>

```python
import bisect

class SummaryRanges:

  def __init__(self):
    self.intervals = []

  def addNum(self, val: int) -> None:
    idx = bisect.bisect_left(self.intervals, [val, val])
    
    # Assign start and end to val initially
    start, end = val, val

    # Check and merge with the previous interval if possible
    # [1, 2] <- [3, 3] (val = 3) => [1, 3]
    if (
      idx > 0 # (val, val) isn't gonna be the left-most interval
      and self.intervals[idx - 1][1] + 1 >= val # [1, *2/3/4*] + 1 >= 3
    ):
      idx -= 1 
      start = self.intervals[idx][0] # [*1*, 2]  => 1
      end = max(self.intervals[idx][1], val) # [1, *2*] vs (val = 3)  => 3
      self.intervals.pop(idx)  # remove the merged interval

    # Check and merge with the next interval(s) if possible
    # [1, 3] -> [4, 5] => [1, 5]
    while (
      idx < len(self.intervals) # (val, val) isn't gonna be the right-most interval
      and end + 1 >= self.intervals[idx][0] # [1, *3/4/5*] + 1 >= [*4*, 5]
    ):
      end = max(end, self.intervals[idx][1]) # [1, 3] -> [1, 5]
      self.intervals.pop(idx) # del [4, 5]
    
    # Insert the merged interval
    self.intervals.insert(idx, [start, end]) # add [1, 5]

  def getIntervals(self) -> list[list[int]]:
    return self.intervals
```
