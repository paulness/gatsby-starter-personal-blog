---
title: Autocomplete with static files [2/4] - Visualization of words in a Trie
subTitle: An interactive visualization of how autocomplete would be implemented with static files. This post will help with understanding the underpinnings of autocomplete using a Trie data structure.
cover: json.png
category: autocomplete
---

This post allows you to visualize how autocomplete data would be arranged within a Prefix Trie data structure. If you would like an introduction to Trie data structures before continuing, please check out [Julia's article on Medium](https://medium.freecodecamp.org/trie-prefix-tree-algorithm-ee7ab3fe3413).

### Using the visualization

- The words can be changed on the fly, this will adjust the Trie diagram
- Sentences may be used instead of words
- The letters constituting each of the words are represented in the tree as nodes
- The end of each full word is marked on the node with the text "endWord"
- Clicking on any of the nodes will trace down from that node. You will be shown the words and have an option to download them.
  - _This is the basis, we will expand on when we implement our autocomplete static file generator_

<iframe src="https://rawgit.com/paulness/AutocompletePrefixTrieReact/master/build/index.html" style="width:100%; height:1000px; border:0; border-radius: 4px; overflow:hidden;"></iframe>

### Source code

I created this visualization with the React framework, to the availability of [ReactD3](http://www.reactd3.org) and [ReactD3 Tree](https://www.npmjs.com/package/react-d3-tree).

[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/vqj8v17875)
[Edit on GitHub](https://github.com/paulness/AutocompletePrefixTrieReact)
