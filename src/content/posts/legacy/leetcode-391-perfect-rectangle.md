---
title: "391. Perfect Rectangle"
description: "Leetcode Link Problem Given an array rectangles where rectangles[i] = [x i , y i , a i , b i ] represents an axis aligned rectangle. The bottom left point of the rectangle is (x i , y i ) and the top right point of it…"
published: "2023-09-12T13:00:00-04:00"
tags: ["Software", "Algorithms", "Python"]
draft: false
featured: false
hero:
  src: "/images/legacy/leetcode-391-perfect-rectangle/example-valid.svg"
  alt: "Five colored rectangles fitting together into one rectangle."
  width: 510
  height: 500
legacySource: "https://github.com/Kimeiga/leetcode/blob/main/_posts/2023-09-12-391-perfect-rectangle.md"
---

<a href="https://leetcode.com/problems/perfect-rectangle/description/" target="_blank">Leetcode Link</a>

## Problem

<p>Given an array <code>rectangles</code> where <code>rectangles[i] = [x<sub>i</sub>, y<sub>i</sub>, a<sub>i</sub>, b<sub>i</sub>]</code> represents an axis-aligned rectangle. The bottom-left point of the rectangle is <code>(x<sub>i</sub>, y<sub>i</sub>)</code> and the top-right point of it is <code>(a<sub>i</sub>, b<sub>i</sub>)</code>.</p>

<p>Return <code>true</code> <em>if all the rectangles together form an exact cover of a rectangular region</em>.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>
<img alt="Five rectangles fitting together into one rectangle." src="/blog/images/legacy/leetcode-391-perfect-rectangle/example-valid.svg" width="510" height="500" loading="lazy" style="width: 300px; height: 294px;">
<pre><strong>Input:</strong> rectangles = [[1,1,3,3],[3,1,4,2],[3,2,4,4],[1,3,2,4],[2,3,3,4]]
<strong>Output:</strong> true
<strong>Explanation:</strong> All 5 rectangles together form an exact cover of a rectangular region.
</pre>

<p><strong class="example">Example 2:</strong></p>
<img alt="Four rectangles leaving a gap inside their bounding rectangle." src="/blog/images/legacy/leetcode-391-perfect-rectangle/example-gap.svg" width="510" height="500" loading="lazy" style="width: 300px; height: 294px;">
<pre><strong>Input:</strong> rectangles = [[1,1,2,3],[1,3,2,4],[3,1,4,2],[3,2,4,4]]
<strong>Output:</strong> false
<strong>Explanation:</strong> Because there is a gap between the two rectangular regions.
</pre>

<p><strong class="example">Example 3:</strong></p>
<img alt="Four rectangles overlapping inside their bounding rectangle." src="/blog/images/legacy/leetcode-391-perfect-rectangle/example-overlap.svg" width="510" height="500" loading="lazy" style="width: 300px; height: 294px;">
<pre><strong>Input:</strong> rectangles = [[1,1,3,3],[3,1,4,2],[1,3,2,4],[2,2,4,4]]
<strong>Output:</strong> false
<strong>Explanation:</strong> Because two of the rectangles overlap with each other.
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= rectangles.length &lt;= 2 * 10<sup>4</sup></code></li>
	<li><code>rectangles[i].length == 4</code></li>
	<li><code>-10<sup>5</sup> &lt;= x<sub>i</sub>, y<sub>i</sub>, a<sub>i</sub>, b<sub>i</sub> &lt;= 10<sup>5</sup></code></li>
</ul>


---

## Solution

### Problem Insight:

1. The combined area of all small rectangles should equal the area of the large rectangle.

![Group 8.jpg](https://assets.leetcode.com/users/images/c89c1ba0-dcba-4787-a40a-cc936e3a9c47_1694551363.5751398.jpeg)


2. The corners of the large rectangle should appear only once, while all other points where rectangles meet should appear an even number of times.

![Group 7.jpg](https://assets.leetcode.com/users/images/f93f7ed9-a3a5-4795-b0dc-944c4eca0ca8_1694551348.6423934.jpeg)


### Solution Breakdown:

1. **Initialization**:
   ```python
   x1, y1 = float('inf'), float('inf')
   x2, y2 = float('-inf'), float('-inf')
   corners = set()
   area = 0
   ```
   - `x1`, `y1`: Bottom-left corner of the large rectangle.
   - `x2`, `y2`: Top-right corner of the large rectangle.
   - `corners`: A set to store the corners of all rectangles.
   - `area`: To store the total area covered by all small rectangles.

2. **Iterate over each rectangle**:
   ```python
   for rect in rectangles:
   ```
   For each rectangle, the code does the following:

   a. **Updates the potential corners of the large rectangle**:
      ```python
      x1 = min(rect[0], x1)
      y1 = min(rect[1], y1)
      x2 = max(rect[2], x2)
      y2 = max(rect[3], y2)
      ```
      - This updates the minimum values for the bottom-left corner and the maximum values for the top-right corner.

   b. **Updates the total area**:
      ```python
      area += (rect[2] - rect[0]) * (rect[3] - rect[1])
      ```
      - Adds the area of the current rectangle to the total area.

   c. **Handles the corners of the current rectangle**:
      ```python
      for point in [(rect[0], rect[1]), (rect[0], rect[3]), (rect[2], rect[3]), (rect[2], rect[1])]:
          if point in corners:
              corners.remove(point)
          else:
              corners.add(point)
      ```
      - The four corners of the current rectangle are created as tuples.
      - The loop checks each corner: 
          - If the corner is already in the `corners` set, it is removed.
          - If it's not, it's added to the set. 
      - This ensures that corners appearing twice are eliminated from the set.

3. **Final Checks**:

   a. **Check the four corners of the large rectangle**:
      ```python
      if {(x1, y1), (x1, y2), (x2, y1), (x2, y2)} != corners:
          return False
      ```
      - This checks if the set contains only the four corners of the large rectangle. If there are other corners left in the set, or if any of these four corners are missing, it returns `False`.

   b. **Check the area**:
      ```python
      return area == (x2 - x1) * (y2 - y1)
      ```
      - Ensures that the combined area of all small rectangles equals the area of the large rectangle.

### Summary:

In this Python solution, we utilize the properties of sets and the efficiency and clarity of tuples to determine if the given rectangles can form a large rectangle without overlaps or gaps. The logic is similar to the Java solution, but the use of tuples makes the code more concise and readable.

# Code
```python
class Solution:
  def isRectangleCover(self, rectangles: List[List[int]]) -> bool:
    if not rectangles:
      return False

    x1, y1 = float('inf'), float('inf')
    x2, y2 = float('-inf'), float('-inf')
    corners = set()
    area = 0

    for rect in rectangles:
      x1 = min(rect[0], x1)
      y1 = min(rect[1], y1)
      x2 = max(rect[2], x2)
      y2 = max(rect[3], y2)
      
      area += (rect[2] - rect[0]) * (rect[3] - rect[1])
      
      for point in [(rect[0], rect[1]), (rect[0], rect[3]), (rect[2], rect[3]), (rect[2], rect[1])]:
        if point in corners:
          corners.remove(point)
        else:
          corners.add(point)

    if {(x1, y1), (x1, y2), (x2, y1), (x2, y2)} != corners:
      return False

    return area == (x2 - x1) * (y2 - y1)
```

### Time Complexity:

1. **Iterating over each rectangle**:
   ```python
   for rect in rectangles:
   ```
   This loop iterates `n` times, where `n` is the number of rectangles. Within this loop:

   a. **Updating the potential corners of the large rectangle and the total area**:
      These operations are \(O(1)\) for each rectangle.
      
   b. **Handling the corners of the current rectangle**:
      ```python
      for point in [(rect[0], rect[1]), (rect[0], rect[3]), (rect[2], rect[3]), (rect[2], rect[1])]:
      ```
      This loop iterates 4 times (a constant time). Inside this loop, adding a point to a set or removing a point from a set are both \(O(1)\) operations.

   Thus, the operations inside the main loop are \(O(1)\), making the overall time complexity of the main loop \(O(n)\).

2. **Final Checks**:
   Checking the four corners of the large rectangle and checking the area are both \(O(1)\) operations.

Combining the above, the overall time complexity is \(O(n)\).

### Space Complexity:

1. **Storing the corners**:
   ```python
   corners = set()
   ```
   In the worst case, if every rectangle is disjoint from the others, there would be 4 corners for each rectangle, so the space required would be \(O(4n)\) or \(O(n)\).

2. **Other variables**: `x1`, `x2`, `y1`, `y2`, and `area` all occupy constant space, \(O(1)\).

Thus, the overall space complexity is \(O(n)\).

In conclusion, both the time complexity and the space complexity of the Python solution are \(O(n)\).

### Acknowledgements

Thanks to [hu19](https://leetcode.com/hu19/) for his solution :)
