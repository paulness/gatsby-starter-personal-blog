webpackJsonp([65233129712165],{783:function(n,s){n.exports={data:{post:{id:"/home/paul-ssd/Git Repositories/gatsby-starter-personal-blog/content/posts/2018-04-03--cherry-pickup-leetcode/index.md absPath of file >>> MarkdownRemark",html:'<p>One of the harder questions on Leetcode.com is the <a href="https://leetcode.com/problems/cherry-pickup/description/">Cherry Pickup</a>. I hope this post shines light on this problem for many people struggling with the solution.</p>\n<h2>Problem description by Leetcode.com</h2>\n<p>The problem as described by Leetcode is as follows:</p>\n<blockquote>\n<p>In a N x N  grid representing a field of cherries, each cell is one of three possible integers.</p>\n<ul>\n<li>0 means the cell is empty, so you can pass through;</li>\n<li>1 means the cell contains a cherry, that you can pick up and pass through;</li>\n<li>-1 means the cell contains a thorn that blocks your way.</li>\n</ul>\n<p>Your task is to collect maximum number of cherries possible by following the rules below:</p>\n<ul>\n<li>Starting at the position (0, 0) and reaching (N-1, N-1) by moving right or down through valid path cells (cells with value 0 or 1);</li>\n<li>After reaching (N-1, N-1), returning to (0, 0) by moving left or up through valid path cells;</li>\n<li>When passing through a path cell containing a cherry, you pick it up and the cell becomes an empty cell (0);</li>\n<li>If there is no valid path between (0, 0) and (N-1, N-1), then no cherries can be collected.</li>\n</ul>\n</blockquote>\n<h2>Symbols we will use to describe the problem</h2>\n<p>This post aims to simplify the problem and we will be using different symbols. These are outlined below.</p>\n<ul>\n<li>[[],[]] / Matrix of matrixes - Field of cherries</li>\n<li>1 - 🍓 - Cherry</li>\n<li>0 - No cherry (possibly already collected)</li>\n<li>-1 - ᚦ (thorn that blocks the cherry collector)</li>\n<li>\n<p>🚶 - Cherry collector</p>\n<ul>\n<li>Can one make one round-trip collection</li>\n<li>Can only move down or right on his way to x=N-1, y=N-1</li>\n<li>Can only move up or left on his way to x=0, y=0</li>\n</ul>\n</li>\n</ul>\n<h2>Quiz</h2>\n<p>A few quiz questions below will help to understand the problem by example.</p>\n<hr>\n<p><strong>Question 1</strong> What is the maximum number of cherries, the collector can collect in the following field?</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">[</span><span class="token punctuation">[</span>🍓<span class="token punctuation">,</span> ᚦ<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n <span class="token punctuation">[</span>🍓<span class="token punctuation">,</span> ᚦ<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n <span class="token punctuation">[</span>🍓<span class="token punctuation">,</span> ᚦ<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n <span class="token punctuation">[</span>🍓<span class="token punctuation">,</span> ᚦ<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n <span class="token punctuation">[</span>🍓<span class="token punctuation">,</span> ᚦ<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n <span class="token punctuation">[</span>🍓<span class="token punctuation">,</span> ᚦ<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">]</span>\n</code></pre>\n      </div>\n<p><strong>Answer</strong> = none because he can never reach his target.</p>\n<hr>\n<p><strong>Question 2</strong> What about for this field?</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  🍓<span class="token punctuation">]</span><span class="token punctuation">,</span>\n <span class="token punctuation">[</span>🍓<span class="token punctuation">,</span>  ᚦ<span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n <span class="token punctuation">[</span>🍓<span class="token punctuation">,</span>  🍓<span class="token punctuation">,</span> 🍓<span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n <span class="token punctuation">[</span>🍓<span class="token punctuation">,</span>  ᚦ<span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n <span class="token punctuation">[</span>🍓<span class="token punctuation">,</span>  ᚦ<span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  🍓<span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n <span class="token punctuation">[</span>🍓<span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">]</span>\n</code></pre>\n      </div>\n<p>Lets find out!</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token comment">//On the way down - 5 cherries</span>\n<span class="token punctuation">[</span><span class="token punctuation">[</span>🚶<span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  🍓<span class="token punctuation">]</span><span class="token punctuation">,</span>\n <span class="token punctuation">[</span>🚶<span class="token punctuation">,</span>  ᚦ<span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n <span class="token punctuation">[</span>🚶<span class="token punctuation">,</span>  🍓<span class="token punctuation">,</span> 🍓<span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n <span class="token punctuation">[</span>🚶<span class="token punctuation">,</span>  ᚦ<span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n <span class="token punctuation">[</span>🚶<span class="token punctuation">,</span>  ᚦ<span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  🍓<span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n <span class="token punctuation">[</span>🚶<span class="token punctuation">,</span>  🚶<span class="token punctuation">,</span>  🚶<span class="token punctuation">,</span>  🚶<span class="token punctuation">,</span>  🚶<span class="token punctuation">,</span>  🚶<span class="token punctuation">]</span><span class="token punctuation">]</span>\n\n<span class="token comment">//Return journey - 3 cherries</span>\n<span class="token punctuation">[</span><span class="token punctuation">[</span>🚶<span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  🍓<span class="token punctuation">]</span><span class="token punctuation">,</span>\n <span class="token punctuation">[</span>🚶<span class="token punctuation">,</span>  ᚦ<span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n <span class="token punctuation">[</span>🚶<span class="token punctuation">,</span>  🚶<span class="token punctuation">,</span>  🚶<span class="token punctuation">,</span>  🚶<span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">,</span>  ᚦ<span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  🚶<span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">,</span>  ᚦ<span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  🚶<span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  <span class="token number">0</span><span class="token punctuation">,</span>  🚶<span class="token punctuation">]</span><span class="token punctuation">]</span>\n</code></pre>\n      </div>\n<p><strong>Answer</strong> = 8</p>\n<hr>\n<p>Notice one cherry is still left in the field, in the top right corner. Picking up that cherry would have meant leaving more cherries unpicked in the field, because we can only move in a down/right on the way down, then up/left on the return journey.</p>\n<p>Let us think about this further and come up with some other truths that may later help us, before writing any code</p>\n<ul>\n<li>Cherries can only be picked up once. They are gone once picked up</li>\n<li>You cannot hit a thorn and continue. You must avoid thorns</li>\n<li>You may cross over a path you have already traveled. Sometimes this is wise to avoid thorns and/or get to other cherries</li>\n<li>\n<p>Every path that can be travelled by going up/left from the destination (N-1, N-1) can also be identically\ntravelled by going down and right from the origin (0,0).</p>\n<ul>\n<li><strong>Optimization alert</strong>. Therefore two people travelling down/right ‘one way’ can make the cherry pickups as one person doing a ‘round-trip’</li>\n</ul>\n</li>\n</ul>\n<h2>Source code</h2>\n<p>Source code in JavaScript for working out the max number of cherries you can pick up with two people, starting at the origin 0,0 and ending at the destination N-1, N-1 both with the restriction of only being able to move down or right.</p>\n<ul>\n<li>\n<p>The recursion ensures all viable paths are explored</p>\n</li>\n<li>\n<p>The Math.Max ensures that the best two paths are chosen</p>\n</li>\n</ul>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> <span class="token function-variable function">cherryPickup</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>grid<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> maxY <span class="token operator">=</span> grid<span class="token punctuation">.</span>length<span class="token punctuation">;</span>\n    <span class="token keyword">var</span> maxX <span class="token operator">=</span> grid<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>length<span class="token punctuation">;</span>\n    <span class="token keyword">var</span> memo <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>\n    <span class="token keyword">function</span> <span class="token function">dp</span><span class="token punctuation">(</span>yPersonA<span class="token punctuation">,</span> xPersonA<span class="token punctuation">,</span> xPersonB<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">//work out corrosponding Y variable for personB. (works since personA and personB have made the same number of moves)</span>\n        <span class="token keyword">var</span> yPersonB <span class="token operator">=</span> yPersonA <span class="token operator">+</span> xPersonA <span class="token operator">-</span> xPersonB<span class="token punctuation">;</span>\n\n        <span class="token comment">//key for the current state</span>\n        <span class="token keyword">var</span> memoKey <span class="token operator">=</span> yPersonA <span class="token operator">+</span> <span class="token string">"_"</span> <span class="token operator">+</span> xPersonA <span class="token operator">+</span> <span class="token string">"_"</span> <span class="token operator">+</span> xPersonB<span class="token punctuation">;</span>\n\n        <span class="token comment">//work out if we are out of bounds</span>\n        <span class="token keyword">var</span> overTheEdge <span class="token operator">=</span> maxY <span class="token operator">==</span> yPersonA <span class="token operator">||</span> maxY <span class="token operator">==</span> yPersonB <span class="token operator">||</span> maxX <span class="token operator">==</span> xPersonA <span class="token operator">||</span> maxX <span class="token operator">==</span> xPersonB<span class="token punctuation">;</span> <span class="token comment">//we are actually over the edge HERE!!</span>\n        <span class="token keyword">if</span> <span class="token punctuation">(</span>overTheEdge<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">999999</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n\n        <span class="token keyword">var</span> personAHitAThorn <span class="token operator">=</span> grid<span class="token punctuation">[</span>yPersonA<span class="token punctuation">]</span><span class="token punctuation">[</span>xPersonA<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>\n        <span class="token keyword">var</span> personBHitAThorn <span class="token operator">=</span> grid<span class="token punctuation">[</span>yPersonB<span class="token punctuation">]</span><span class="token punctuation">[</span>xPersonB<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>\n        <span class="token keyword">if</span> <span class="token punctuation">(</span>personAHitAThorn <span class="token operator">||</span> personBHitAThorn<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token comment">//impossible move, either over the edge or directly on a thorn</span>\n            <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">999999</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>yPersonA <span class="token operator">==</span> maxY <span class="token operator">-</span> <span class="token number">1</span> <span class="token operator">&amp;&amp;</span> xPersonA <span class="token operator">==</span> maxX <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token comment">//reached the target finally</span>\n            <span class="token keyword">return</span> grid<span class="token punctuation">[</span>yPersonA<span class="token punctuation">]</span><span class="token punctuation">[</span>xPersonA<span class="token punctuation">]</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>memo<span class="token punctuation">[</span>memoKey<span class="token punctuation">]</span> <span class="token operator">!==</span> undefined<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token comment">//already visited</span>\n            <span class="token keyword">return</span> memo<span class="token punctuation">[</span>memoKey<span class="token punctuation">]</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n\n            <span class="token keyword">var</span> personAHasCherry <span class="token operator">=</span> grid<span class="token punctuation">[</span>yPersonA<span class="token punctuation">]</span><span class="token punctuation">[</span>xPersonA<span class="token punctuation">]</span> <span class="token operator">===</span> <span class="token number">1</span><span class="token punctuation">;</span>\n            <span class="token keyword">var</span> personBHasCherry <span class="token operator">=</span>\n                yPersonB <span class="token operator">!==</span> yPersonA <span class="token operator">&amp;&amp;</span> xPersonB <span class="token operator">!==</span> xPersonA <span class="token operator">&amp;&amp;</span> <span class="token comment">//if personA didn\'t take it first!</span>\n                grid<span class="token punctuation">[</span>yPersonB<span class="token punctuation">]</span><span class="token punctuation">[</span>xPersonB<span class="token punctuation">]</span> <span class="token operator">===</span> <span class="token number">1</span><span class="token punctuation">;</span>\n\n            <span class="token keyword">var</span> cherriesCollectedByBothPeopleThisTurn <span class="token operator">=</span>\n                <span class="token punctuation">(</span>personAHasCherry <span class="token operator">?</span> <span class="token number">1</span> <span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token operator">+</span>\n                <span class="token punctuation">(</span>personBHasCherry <span class="token operator">?</span> <span class="token number">1</span> <span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n            <span class="token comment">//both people make all possible single moves they can make (down and right)</span>\n            <span class="token comment">//personB by definition will likely always be on a different path than personA since:</span>\n            <span class="token comment">//   *   it will generate more COMBINED cherries (see above cherriesCollectedByBothPeopleThisTurn)</span>\n            <span class="token keyword">var</span> maxCherriesCollectedByBothPeopleForRemainingTurns <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">max</span><span class="token punctuation">(</span>\n                Math<span class="token punctuation">.</span><span class="token function">max</span><span class="token punctuation">(</span>\n                    <span class="token function">dp</span><span class="token punctuation">(</span>yPersonA<span class="token punctuation">,</span> xPersonA <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span> xPersonB <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token comment">//personA right personB right</span>\n                    <span class="token function">dp</span><span class="token punctuation">(</span>yPersonA <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span> xPersonA<span class="token punctuation">,</span> xPersonB <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token comment">//personA down personB right</span>\n                Math<span class="token punctuation">.</span><span class="token function">max</span><span class="token punctuation">(</span>\n                    <span class="token function">dp</span><span class="token punctuation">(</span>yPersonA<span class="token punctuation">,</span> xPersonA <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span> xPersonB<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token comment">//personA right personB down</span>\n                    <span class="token function">dp</span><span class="token punctuation">(</span>yPersonA <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span> xPersonA<span class="token punctuation">,</span> xPersonB<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">//personA down personB down</span>\n                <span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n            <span class="token keyword">var</span> cherriesCollectedRecursive <span class="token operator">=</span> cherriesCollectedByBothPeopleThisTurn <span class="token operator">+</span> maxCherriesCollectedByBothPeopleForRemainingTurns<span class="token punctuation">;</span>\n            memo<span class="token punctuation">[</span>memoKey<span class="token punctuation">]</span> <span class="token operator">=</span> cherriesCollectedRecursive<span class="token punctuation">;</span>\n            <span class="token keyword">return</span> cherriesCollectedRecursive<span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">return</span> Math<span class="token punctuation">.</span><span class="token function">max</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token function">dp</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>',fields:{slug:"/cherry-pickup-leetcode/",prefix:"2018-04-03"},frontmatter:{title:"Cherry pickup algorithm",subTitle:"An in-depth look into the Cherry Pickup problem on Leetcode.com.",cover:{childImageSharp:{resize:{src:"/static/berry-pickup-two-people-same-time-2d5ed4329f97aea00461368e3be62dbb-ada8c.jpg"}}}}},author:{id:"/home/paul-ssd/Git Repositories/gatsby-starter-personal-blog/content/parts/author.md absPath of file >>> MarkdownRemark",html:"<p><strong>Paul S. Ness</strong> Software engineer with seven years of experience in a variety of industries such travel, payments, medical and publishing.</p>"},footnote:{id:"/home/paul-ssd/Git Repositories/gatsby-starter-personal-blog/content/parts/footnote.md absPath of file >>> MarkdownRemark",html:""},site:{siteMetadata:{facebook:{appId:""}}}},pathContext:{slug:"/cherry-pickup-leetcode/"}}}});
//# sourceMappingURL=path---cherry-pickup-leetcode-3a3a4f5ce6a93cb66532.js.map