webpackJsonp([0xa5a3f45ba6ba],{781:function(e,t){e.exports={data:{post:{id:"/home/paul-ssd/Git Repositories/gatsby-starter-personal-blog/content/posts/2017-11-20--autocomplete-with-static-files-part-1/index.md absPath of file >>> MarkdownRemark",html:'<blockquote>\n<p>Why would anybody even want to use static files? When they have access to a perfectly fine queryable database, it seems totally crazy.</p>\n<p>Or does it?</p>\n</blockquote>\n<p>Below are some pros and cons of using static files for autocomplete searches:</p>\n<p><em>Pros</em></p>\n<ul>\n<li>No server side logic == much much faster!</li>\n<li>Reliability, less points of failure, no database issues, files can be served from any server.</li>\n</ul>\n<p><em>Cons</em></p>\n<ul>\n<li>More space used on the server, one file for each letter sequence that results. For example: A -> { Andrew, Adam, Anthony }, AN -> { Andrew } etc…</li>\n<li>Data is not real time. Generating the static files must be done upfront during build time.</li>\n</ul>\n<h4>In this series I will walk through the following topics, step by step:</h4>\n<ol>\n<li><a href="/autocomplete-with-static-files-part-2">Learning from a visualization of the trie data structure</a></li>\n<li>Typing our own words into the visualization</li>\n<li>Downloading sample CSV’s</li>\n<li><a href="/autocomplete-with-static-files-part-3">Building an autocomplete static file generator</a></li>\n<li>Understanding a trie data structure for storing words in relation</li>\n<li>Covering recursive trie traversal algorithms</li>\n<li>Using the generator with a CSV</li>\n<li><a href="/autocomplete-with-static-files-part-4">Building a basic autocomplete implementation utilizing static files</a></li>\n<li>Using the demo</li>\n</ol>',fields:{slug:"/autocomplete-with-static-files-part-1/",prefix:"2017-11-20"},frontmatter:{title:"Autocomplete with static files [1/4] - Introduction",subTitle:"An introduction to static files and the benefits of generating static files for your autocomplete implementation.",cover:{childImageSharp:{resize:{src:"/static/filelist-1930b1646968f05549c8efae2771b780-160fa.png"}}}}},author:{id:"/home/paul-ssd/Git Repositories/gatsby-starter-personal-blog/content/parts/author.md absPath of file >>> MarkdownRemark",html:"<p><strong>Paul S. Ness</strong> Software engineer with seven years of experience in a variety of industries such travel, payments, medical and publishing.</p>"},footnote:{id:"/home/paul-ssd/Git Repositories/gatsby-starter-personal-blog/content/parts/footnote.md absPath of file >>> MarkdownRemark",html:""},site:{siteMetadata:{facebook:{appId:""}}}},pathContext:{slug:"/autocomplete-with-static-files-part-1/"}}}});
//# sourceMappingURL=path---autocomplete-with-static-files-part-1-4c529bca6211232e82a4.js.map