---
title: Linking in-text citations to numbered references on a page
subTitle: In this post we will be adding a usability feature by adding hover functionality to citations. When hovering over a citation, we will show the corresponding reference text. In this example we are dealing with unstructured HTML and using a set of business rules to link the citations to references.
cover: AdobeStock_118566974.jpeg
category: javascript
---

Imagine you are a software developer for an online academic publisher. You have been asked to make an enhancement to the existing site:

<b>Requirement</b>

<i>When hovering over any given in-text citation, show a tooltip with the actual corresponding reference text.</i>



An example of in-text citations and references:


<blockquote>
<div style="font-size:65%">
<div>Finding treatments for breast cancer is a major goal for scientists.<sup>1,2</sup> Some classes of drugs show more promise than others. Gradishar evaluated taxanes as a class.<sup>3</sup> Other scientists have investigated individual drugs within this class, including Andre and Zielinski <sup>2</sup> and Joensuu and Gligorov. <sup>4</sup> Mita et al's investigation of cabazitaxel <sup>5</sup> seems to indicate a new role for this class of drugs.</div>
<div><br/>
  <div><b>References</b></div>
<p>1. Cancer Research Funding. National Cancer Institute. http://www.cancer.gov.offcampus.lib.washington.edu/cancertopics/factsheet/NCI/research-funding. Publication date unavailable. Updated June 6, 2011. Accessed November 3, 2012.</p>
<p>2. Andre F, Zielinski CC. Optimal strategies for the treatment of metastatic triple-negative breast cancer with currently approved agents. Ann Oncol. 2012;23(Suppl 2):vi46-vi51.</p>
<p>3. Gradishar WJ. Taxanes for the treatment of metastatic breast cancer. Breast Cancer (Auckl.). 2012;6:159-171.</p>
<p>4. Joensuu H, Gligorov J. Adjuvant treatments for triple-negative breast cancers. Ann Oncol. 2012;Suppl 6:vi40-45.</p>
<p>5. Mita AC, Figlin R, Mita MM. Cabazitaxel: more than a new taxane for metastatic castrate-resistant prostate cancer? Clin Cancer Res. 2012;18(24):OF1-OF</p>
</div>
</div>
</blockquote>

<b>Explanation of the problem</b>

Online readers are well aware that

* 1 refers to \[reference 1\]

* 1,3,5 refers to \[1, 3 and 5\]

* 1-3 refers to \[1, 2 and 3\]

Unfortunately there is no concrete relationship between the superscript in-text citation and its corresponding reference. The publisher has no desire to update thousands of online papers by hand either. The HTML code is as follows.

In text citation

`<sup>1</sup>`

Reference

`<p>1. Cancer Research Funding. National Cancer Institute. http://www.cancer.gov.offcampus.lib.washington.edu/cancertopics/factsheet/NCI/research-funding. Publication date unavailable. Updated June 6, 2011. Accessed November 3, 2012.</p>`

<b>Solution</b>

We must create a concrete "one to one" relationship, between these two HTML elements. Once this relationship has been created, it will create a reliable way to show the correct tooltip.

First we must ‘define the relationship’ in concise terms/rules/exceptions:

<ol>
<li>Any superscripted text inside the academic paper body is considered to be an ‘in-text citation’, if the text is of the form of:
  <ul>
    <li>Digit</li>
    <li>Digit comma digit …</li>
    <li>Digit hyphen digit …</li>
  </ul>
  </li>
  <li>Much like a book, where the references come after the citations. The corresponding reference must be appear below the in-text citation on the page</li>
  <li>The citation must refer to an actual reference on the page</li>
  <li>The citation must find the closest reference within the same page, since multiple papers can exist on the same page</li>
</ol>

### Source code

For brevity a JavaScript alert is used to show the reference text on hover, please modify this to a tooltip of your liking.

<script async src="http://jsfiddle.net/paulness15/1hxg629k/embed/js,html,result/dark/"></script>