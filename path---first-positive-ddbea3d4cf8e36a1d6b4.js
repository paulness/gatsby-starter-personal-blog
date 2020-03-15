webpackJsonp([0xbb178a13b120],{793:function(n,s){n.exports={data:{post:{id:"/root/project/content/posts/2020-03-14--first-positive/index.md absPath of file >>> MarkdownRemark",html:'<p>Given an array full of integers, find the first missing positive integer in the list. This tutorial goes over how you can do this in O(n) without using any additional space for hashtables or anything. This is avaliable for practice on <a href="https://leetcode.com/problems/first-missing-positive/">LeetCode</a>.</p>\n<h2>Example lists</h2>\n<p>Example of missing 5</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">1,2,3,4,6</code></pre>\n      </div>\n<p>Example of missing 1</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">-1,4,8,6,2</code></pre>\n      </div>\n<h2>Algorithm</h2>\n<p>If the array has 4 elements and we are looking for the first missing positive. We can look at it this way, we expect <code class="language-text">1,2,3,4</code> to be there.</p>\n<table>\n<thead>\n<tr>\n<th>index</th>\n<th>0</th>\n<th>1</th>\n<th>2</th>\n<th>3</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>expected values</td>\n<td>1</td>\n<td>2</td>\n<td>3</td>\n<td>4</td>\n</tr>\n<tr>\n<td>actual values</td>\n<td>-1</td>\n<td>8</td>\n<td>6</td>\n<td>1</td>\n</tr>\n<tr>\n<td>values after algorithm</td>\n<td>1</td>\n<td>0</td>\n<td>0</td>\n<td>0</td>\n</tr>\n</tbody>\n</table>\n<p>You’ll have to scan the entire list once to find out that <code class="language-text">1</code> is not missing of course and that <code class="language-text">2</code> is the first missing positive.</p>\n<ol>\n<li>\n<p>Iterate the array once - O(n)</p>\n<ol>\n<li>Get the value of the slot and <code class="language-text">-1</code> from this value, so that it is in the same zero-index range as the slots</li>\n<li>Throw away any value you encounter outside of the range of the indexes of the array <code class="language-text">0 between len(array)-1</code></li>\n<li>If the value you find is the same as the expected value for the slot overwrite the slot value with <code class="language-text">1</code> to denote the value exists</li>\n<li>If you find a value that is less than the index, set the index of that slot to <code class="language-text">1</code> and the current slot value to <code class="language-text">0</code></li>\n<li>If you find a value that is greater than the current index, then swap the value in the current slot with the value in the expected future slot as it will be evaluated later anyway. Repeat this iteration once without progressing to the next slot so that you can evaluate the new value in this slot.</li>\n</ol>\n</li>\n</ol>\n<p>In the end, you’ll have an array of zeros and ones. Where <code class="language-text">1</code> denotes the existence of the value and <code class="language-text">0</code> means the value does not exist. The first occurrence of zero is your first positive missing value.</p>\n<h3>Python Code</h3>\n<p>This Python code <a href="https://leetcode.com/submissions/detail/312533966/">passes all tests in Leetcode</a></p>\n<div class="gatsby-highlight">\n      <pre class="language-python"><code class="language-python"><span class="token triple-quoted-string string">"""\nhttps://leetcode.com/problems/first-missing-positive/\n"""</span>\n\n<span class="token keyword">class</span> <span class="token class-name">Solution</span><span class="token punctuation">:</span>\n    <span class="token triple-quoted-string string">""" Wrapper for LeetCode solution """</span>\n\n    <span class="token keyword">def</span> <span class="token function">firstMissingPositive</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> nums<span class="token punctuation">:</span> <span class="token builtin">list</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">int</span><span class="token punctuation">:</span>\n        <span class="token triple-quoted-string string">"""\n        Finds the first MISSING positive value in an array\n        """</span>\n\n        <span class="token comment"># Simplify the problem so that the array is just full of 0 or 1</span>\n        <span class="token comment"># Where 1 indicates the presence of the value</span>\n        self<span class="token punctuation">.</span>_update_arr_to_just_flags<span class="token punctuation">(</span>nums<span class="token operator">=</span>nums<span class="token punctuation">)</span>\n\n        <span class="token comment"># The first occurrence of 0 is the first missing value</span>\n        <span class="token keyword">try</span><span class="token punctuation">:</span>\n            first_missing_positive_integer <span class="token operator">=</span> nums<span class="token punctuation">.</span>index<span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span>\n        <span class="token keyword">except</span> ValueError<span class="token punctuation">:</span>\n            first_missing_positive_integer <span class="token operator">=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token operator">+</span><span class="token number">1</span>\n\n        <span class="token keyword">print</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span>\n        <span class="token keyword">print</span><span class="token punctuation">(</span>first_missing_positive_integer<span class="token punctuation">)</span>\n        <span class="token keyword">return</span> first_missing_positive_integer\n\n\n    @<span class="token builtin">classmethod</span>\n    <span class="token keyword">def</span> <span class="token function">_update_arr_to_just_flags</span><span class="token punctuation">(</span>cls<span class="token punctuation">,</span> nums<span class="token punctuation">:</span> <span class="token builtin">list</span><span class="token punctuation">)</span><span class="token punctuation">:</span>\n        <span class="token triple-quoted-string string">"""\n        Updates an entire array so that instead of storing values it stores either 0 or 1\n\n        1 indicates the presence of a value, the index indicates the value\n        """</span>\n\n        last_index <span class="token operator">=</span> <span class="token builtin">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token operator">-</span><span class="token number">1</span>\n        i <span class="token operator">=</span> <span class="token number">0</span>\n        <span class="token keyword">while</span> i <span class="token operator">&lt;=</span> last_index<span class="token punctuation">:</span>\n            <span class="token keyword">print</span><span class="token punctuation">(</span>f<span class="token string">"\\nRunning iteration index {i}"</span><span class="token punctuation">)</span>\n            <span class="token keyword">print</span><span class="token punctuation">(</span>f<span class="token string">"Current state of array {nums}"</span><span class="token punctuation">)</span>\n            current_value_target_index <span class="token operator">=</span> nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">-</span> <span class="token number">1</span>\n            target_index_out_of_bounds <span class="token operator">=</span> <span class="token punctuation">(</span>current_value_target_index <span class="token operator">&lt;</span> <span class="token number">0</span> <span class="token operator">or</span>\n                                          current_value_target_index <span class="token operator">></span> last_index<span class="token punctuation">)</span>\n\n            <span class="token keyword">if</span> target_index_out_of_bounds<span class="token punctuation">:</span>\n                <span class="token keyword">print</span><span class="token punctuation">(</span>f<span class="token string">"threw away value at {i} aka {nums[i]} as it was outside the range"</span><span class="token punctuation">)</span>\n                nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">0</span>\n            <span class="token keyword">elif</span> current_value_target_index <span class="token operator">&lt;</span> i<span class="token punctuation">:</span>\n                <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token punctuation">(</span>f<span class="token string">"already visited value {current_value_target_index}"</span>\n                       <span class="token string">"aka {nums[current_value_target_index]}"</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n                nums<span class="token punctuation">[</span>current_value_target_index<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">1</span>\n                nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">0</span>\n            <span class="token keyword">elif</span> current_value_target_index <span class="token operator">==</span> i<span class="token punctuation">:</span>\n                nums<span class="token punctuation">[</span>current_value_target_index<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">1</span>\n            <span class="token keyword">elif</span> current_value_target_index <span class="token operator">></span> i<span class="token punctuation">:</span>\n                <span class="token comment"># the value is ahead and has not been considered yet</span>\n                <span class="token comment"># swap it with current and re-evaluate current</span>\n                are_same <span class="token operator">=</span> nums<span class="token punctuation">[</span>current_value_target_index<span class="token punctuation">]</span> <span class="token operator">==</span> nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span>\n                <span class="token keyword">if</span> <span class="token operator">not</span> are_same<span class="token punctuation">:</span>\n                    cls<span class="token punctuation">.</span>_arr_swap<span class="token punctuation">(</span>nums<span class="token punctuation">,</span> current_value_target_index<span class="token punctuation">,</span> i<span class="token punctuation">)</span>\n                    <span class="token keyword">continue</span>\n\n                <span class="token comment"># The current value will be evaluated later</span>\n                nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">0</span>\n\n            i <span class="token operator">+=</span> <span class="token number">1</span>\n\n    @<span class="token builtin">classmethod</span>\n    <span class="token keyword">def</span> <span class="token function">_arr_swap</span><span class="token punctuation">(</span>cls<span class="token punctuation">,</span> nums<span class="token punctuation">:</span> <span class="token builtin">list</span><span class="token punctuation">,</span> i<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">,</span> j<span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span><span class="token punctuation">:</span>\n        temp <span class="token operator">=</span> nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span>\n        nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> nums<span class="token punctuation">[</span>j<span class="token punctuation">]</span>\n        nums<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">=</span> temp\n        <span class="token keyword">print</span><span class="token punctuation">(</span>f<span class="token string">"swapped slots {i} with {j} aka {nums[i]} with {nums[j]}"</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<h3>Sample run code for experimentation and debugging</h3>\n<div class="gatsby-highlight">\n      <pre class="language-python"><code class="language-python"><span class="token keyword">def</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>\n    <span class="token triple-quoted-string string">""" The entry point of the Python script """</span>\n\n    sln <span class="token operator">=</span> Solution<span class="token punctuation">(</span><span class="token punctuation">)</span>\n    sln<span class="token punctuation">.</span>firstMissingPositive<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n\n<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">"__main__"</span><span class="token punctuation">:</span>\n    main<span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<h2>Useful learning materials</h2>\n<p><a href="https://www.youtube.com/watch?v=Q-o4mtw1zJM">https://www.youtube.com/watch?v=Q-o4mtw1zJM</a></p>',fields:{slug:"/first-positive/",prefix:"2020-03-14"},frontmatter:{title:"First missing positive",subTitle:"Find the first missing positive integer in an array in O(n) time from LeetCode",cover:{childImageSharp:{resize:{src:"/static/first-missing-positive-87dc3ff39a061aa57b4982e15a5ba408-160fa.png"}}}}},author:{id:"/root/project/content/parts/author.md absPath of file >>> MarkdownRemark",html:"<p><strong>Paul S. Ness</strong> Software engineer with ten years of experience in a variety of industries such travel, payments, medical and publishing.</p>"},footnote:{id:"/root/project/content/parts/footnote.md absPath of file >>> MarkdownRemark",html:""},site:{siteMetadata:{facebook:{appId:""}}}},pathContext:{slug:"/first-positive/"}}}});
//# sourceMappingURL=path---first-positive-ddbea3d4cf8e36a1d6b4.js.map