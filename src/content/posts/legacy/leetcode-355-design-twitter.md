---
title: "355. Design Twitter"
description: "Leetcode Link Problem Design a simplified version of Twitter where users can post tweets, follow/unfollow another user, and is able to see the 10 most recent tweets in the user's news feed. Implement the Twitter class:…"
published: "2023-09-12T12:00:00-04:00"
tags: ["Software", "Algorithms", "Python"]
draft: false
featured: false
legacySource: "https://github.com/Kimeiga/leetcode/blob/main/_posts/2023-09-12-355-design-twitter.md"
---

<a href="https://leetcode.com/problems/design-twitter/description/" target="_blank">Leetcode Link</a>

## Problem

<p>Design a simplified version of Twitter where users can post tweets, follow/unfollow another user, and is able to see the <code>10</code> most recent tweets in the user's news feed.</p>

<p>Implement the <code>Twitter</code> class:</p>

<ul>
	<li><code>Twitter()</code> Initializes your twitter object.</li>
	<li><code>void postTweet(int userId, int tweetId)</code> Composes a new tweet with ID <code>tweetId</code> by the user <code>userId</code>. Each call to this function will be made with a unique <code>tweetId</code>.</li>
	<li><code>List&lt;Integer&gt; getNewsFeed(int userId)</code> Retrieves the <code>10</code> most recent tweet IDs in the user's news feed. Each item in the news feed must be posted by users who the user followed or by the user themself. Tweets must be <strong>ordered from most recent to least recent</strong>.</li>
	<li><code>void follow(int followerId, int followeeId)</code> The user with ID <code>followerId</code> started following the user with ID <code>followeeId</code>.</li>
	<li><code>void unfollow(int followerId, int followeeId)</code> The user with ID <code>followerId</code> started unfollowing the user with ID <code>followeeId</code>.</li>
</ul>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<pre><strong>Input</strong>
["Twitter", "postTweet", "getNewsFeed", "follow", "postTweet", "getNewsFeed", "unfollow", "getNewsFeed"]
[[], [1, 5], [1], [1, 2], [2, 6], [1], [1, 2], [1]]
<strong>Output</strong>
[null, null, [5], null, null, [6, 5], null, [5]]

<strong>Explanation</strong>
Twitter twitter = new Twitter();
twitter.postTweet(1, 5); // User 1 posts a new tweet (id = 5).
twitter.getNewsFeed(1);  // User 1's news feed should return a list with 1 tweet id -&gt; [5]. return [5]
twitter.follow(1, 2);    // User 1 follows user 2.
twitter.postTweet(2, 6); // User 2 posts a new tweet (id = 6).
twitter.getNewsFeed(1);  // User 1's news feed should return a list with 2 tweet ids -&gt; [6, 5]. Tweet id 6 should precede tweet id 5 because it is posted after tweet id 5.
twitter.unfollow(1, 2);  // User 1 unfollows user 2.
twitter.getNewsFeed(1);  // User 1's news feed should return a list with 1 tweet id -&gt; [5], since user 1 is no longer following user 2.
</pre>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= userId, followerId, followeeId &lt;= 500</code></li>
	<li><code>0 &lt;= tweetId &lt;= 10<sup>4</sup></code></li>
	<li>All the tweets have <strong>unique</strong> IDs.</li>
	<li>At most <code>3 * 10<sup>4</sup></code> calls will be made to <code>postTweet</code>, <code>getNewsFeed</code>, <code>follow</code>, and <code>unfollow</code>.</li>
</ul>


---

## Solution

```python
from collections import defaultdict

class Twitter:

  def __init__(self):
    # Initialize a dictionary to keep track of which users each user follows.
    # Default value for each user (key) is an empty set.
    self.userId2Followees = defaultdict(set)

    # Initialize a list to store all tweets as pairs (userId, tweetId).
    self.posts = []

  def postTweet(self, userId: int, tweetId: int) -> None:
    # Append a new tweet as a tuple (userId, tweetId) to the posts list.
    self.posts.append((userId, tweetId))

  def getNewsFeed(self, userId: int):
    # Initialize a counter to keep track of the number of tweets added to the news feed.
    count = 0

    # Initialize an empty list to store the tweets that will be returned as the user's news feed.
    feed = []

    # Loop backwards through the posts list (from most recent to least recent).
    # 
    #      [(1, 5), (2, 6),   ...,     (7323, 4323)]
    #  -1     0        1            len(self.posts) - 1
    #  ( ) <-------<--------<------<----------^
    for i in range(len(self.posts) - 1, -1, -1):
      # Break out of the loop if 10 tweets have already been added to the news feed.
      if count >= 10:
        break
      
      # Fetch the current tweet.
      post = self.posts[i]
      
      if (
        post[0] == userId                               # If the tweet was posted by the user
        or post[0] in self.userId2Followees[userId]     # or by someone the user follows
      ):
        # then add it to the news feed.
        feed.append(post[1])
        count += 1

    # Return the news feed.
    return feed

  def follow(self, followerId: int, followeeId: int) -> None:
    # Add the followeeId to the set of users that the followerId user is following.
    self.userId2Followees[followerId].add(followeeId)

  def unfollow(self, followerId: int, followeeId: int) -> None:
    # If the followerId user is following the followeeId user, remove the followeeId from the set.
    if followeeId in self.userId2Followees[followerId]:
      self.userId2Followees[followerId].remove(followeeId)
```

Let's analyze the time and space complexity for each method:

1. **`__init__`**:
   - Time Complexity: \(O(1)\)
   - Space Complexity: \(O(1)\) 
   (Although we're initializing a dictionary and a list, they start empty, so the initialization is constant time and space.)

2. **`postTweet`**:
   - Time Complexity: \(O(1)\) 
   (Appending to a list is a constant-time operation on average.)
   - Space Complexity: \(O(1)\) 
   (We're only adding one item to the list.)

3. **`getNewsFeed`**:
   - Time Complexity: \(O(N)\) 
   (Where \(N\) is the number of posts. In the worst case, we'd iterate through all the posts, but this is bounded by the condition that at most 10 tweets are added to the feed.)
   - Space Complexity: \(O(1)\) 
   (We're only using a fixed amount of extra space for variables `count`, `feed`, and `post`. The space required for the `feed` list is bounded by 10.)

4. **`follow`**:
   - Time Complexity: \(O(1)\) 
   (Adding to a set is a constant-time operation on average.)
   - Space Complexity: \(O(1)\)

5. **`unfollow`**:
   - Time Complexity: \(O(1)\) 
   (Checking membership in a set and removing an element from it are both constant-time operations on average.)
   - Space Complexity: \(O(1)\)

Considering the overall data structures:

- `userId2Followees`: The space complexity grows with the number of users and the number of followee relationships. In the worst case (each user follows every other user), it becomes \(O(U^2)\) where \(U\) is the number of users.
- `posts`: The space complexity grows with the number of tweets, \(O(T)\) where \(T\) is the number of tweets.

So, the overall space complexity considering all data structures and methods can be thought of as \(O(U^2 + T)\), but for the specific methods listed above, the space complexities mentioned apply.
