---
title: Autocomplete with static files [1/4] - Introduction
subTitle: An introduction to static files and the benefits of generating static files for your autocomplete implementation.
cover: filelist.png
---

> Why would anybody even want to use static files? When they have access to a perfectly fine queryable database, it seems totally crazy.
>
>Or does it?

Below are some pros and cons of using static files for autocomplete searches:

Pros | Cons
---------|----------
<span style="cursor:help" title="No server side logic.">Much much faster!</span> | <span style="cursor:help" title="More space used on the server, one file for each letter sequence that results. For example: A -> { Andrew, Adam, Anthony }, AN -> { Andrew } etc...">More space required on the server</span>
<span style="cursor:help" title="Less points of failure, no database issues, files can be served from any server.">Reliability</span> | <span style="cursor:help" title="Generating the static files must be done upfront.">Data is not real time</span>

In this series I will walk through the following topics, step by step:

1. [Learning from a visualization of the trie data structure](/autocomplete-with-static-files-part-2)
- Typing our own words into the visualization
- Downloading sample CSV's
1. [Building an autocomplete static file generator](/autocomplete-with-static-files-part-3)
- Understanding a trie data structure for storing words in relation
- Covering recursive trie traversal algorithms
- Using the generator with a CSV
1. [Building a basic autocomplete implementation that consumes and works with the static files](/autocomplete-with-static-files-part-4)
- Using the demo