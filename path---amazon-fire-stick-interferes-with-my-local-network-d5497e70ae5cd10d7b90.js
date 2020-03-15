webpackJsonp([8453109918064],{785:function(A,e){A.exports={data:{post:{id:"/root/project/content/posts/2018-04-03--amazon-fire-stick-interferes-with-my-local-network/index.md absPath of file >>> MarkdownRemark",html:'<p>Last weekend I hosted a webpage on my machine at <a href="http://192.168.1.249">http://192.168.1.249</a> over port 80. This webpage was to be used by another machine on my network. Unfortunately, that day I was unable to access the webpage from the other machine.</p>\n<p>After exhaustively checking firewalls, ports and the router settings, It turned out to be the presence of the Amazon Fire Stick on the local network that was screwing things up for me. I could not believe it! Not only does this junk slow down my WiFi by silently transmitting a new SSID on the same channel as my router, but it blocks local traffic on my network.</p>\n<p>I am not an expert on networking, so my current solution to this problem is just to unplug my non-essential Amazon Fire Stick and chuck it across the room.</p>\n<blockquote>\n<p>If anybody can shine a light on this, please reply in the comments. It would be much appreciated.</p>\n</blockquote>\n<p>Check out the two lines below captured in Wireshark. It seems that the presence of the Amazon Fire Stick causes confusion between who is hosting 192.168.1.249.</p>\n<div class="gatsby-highlight">\n      <pre class="language-csv"><code class="language-csv">7\t4.92872\tEdimaxTe_62:e9:8f\tAmazonTe_45:59:71\tARP\t42\tWho has 192.168.1.249? Tell 192.168.1.160\n8\t4.99225\tAmazonTe_45:59:71\tEdimaxTe_62:e9:8f\tARP\t42\t192.168.1.249 is at 38:f7:3d:45:59:71</code></pre>\n      </div>\n<p>Check out the <a href="/wireshark-firestick-issue-e0e6c3cf4a93f0080ff493cc75813a3d.pcapng">wireshark packet dump file</a> and <a href="/packets-during-session-a6f0fc53d4876760282de3d78584b1a2.csv">CSV</a>. Also a screengrab below:\n\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/wireshark-4c88fcc6223977461ac4ebd094ab80e8-a5313.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 800px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 52.560646900269546%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAQF/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhADEAAAAddQidQP/8QAFhABAQEAAAAAAAAAAAAAAAAAEwAg/9oACAEBAAEFAjjjx//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8BP//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8BP//EABgQAAMBAQAAAAAAAAAAAAAAAAIykQAg/9oACAEBAAY/AnO5zuc7x//EABYQAQEBAAAAAAAAAAAAAAAAABEAIP/aAAgBAQABPyF1ebv/2gAMAwEAAgADAAAAEE8//8QAFhEAAwAAAAAAAAAAAAAAAAAAAAER/9oACAEDAQE/EKys/8QAFREBAQAAAAAAAAAAAAAAAAAAABH/2gAIAQIBAT8QiP/EABoQAAIDAQEAAAAAAAAAAAAAAAARAdHwweH/2gAIAQEAAT8QjwFGBQ+3Bjkcn//Z\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px transparent;"\n        alt="WireShark screengrab"\n        title=""\n        src="/static/wireshark-4c88fcc6223977461ac4ebd094ab80e8-78f2b.jpg"\n        srcset="/static/wireshark-4c88fcc6223977461ac4ebd094ab80e8-dce19.jpg 200w,\n/static/wireshark-4c88fcc6223977461ac4ebd094ab80e8-c1413.jpg 400w,\n/static/wireshark-4c88fcc6223977461ac4ebd094ab80e8-78f2b.jpg 800w,\n/static/wireshark-4c88fcc6223977461ac4ebd094ab80e8-ab4c4.jpg 1200w,\n/static/wireshark-4c88fcc6223977461ac4ebd094ab80e8-bc99b.jpg 1600w,\n/static/wireshark-4c88fcc6223977461ac4ebd094ab80e8-a5313.jpg 1855w"\n        sizes="(max-width: 800px) 100vw, 800px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>',fields:{slug:"/amazon-fire-stick-interferes-with-my-local-network/",prefix:"2018-04-03"},frontmatter:{title:"Amazon Fire Stick interferes with local network traffic",subTitle:"Serious interference from the Amazon Fire Stick, preventing intranet websites from loading. With Wireshark captures and analysis.",cover:{childImageSharp:{resize:{src:"/static/fire-stick-18cd7f5d599b7a8690811c975c0b0fa7-ada8c.jpg"}}}}},author:{id:"/root/project/content/parts/author.md absPath of file >>> MarkdownRemark",html:"<p><strong>Paul S. Ness</strong> Software engineer with ten years of experience in a variety of industries such travel, payments, medical and publishing.</p>"},footnote:{id:"/root/project/content/parts/footnote.md absPath of file >>> MarkdownRemark",html:""},site:{siteMetadata:{facebook:{appId:""}}}},pathContext:{slug:"/amazon-fire-stick-interferes-with-my-local-network/"}}}});
//# sourceMappingURL=path---amazon-fire-stick-interferes-with-my-local-network-d5497e70ae5cd10d7b90.js.map