---
title: Autocomplete with static files [3/4] - Building an autocomplete static file generator
subTitle: In this post we will be implementing an autocomplete static file generator, using the principles, learned in the past two articles in this series. Also within this post is a working demo which produces static autocomplete JSON files for a CSV.
cover: autocomplete-visualization.jpg
category: autocomplete
---

In this post, we will be building an autocomplete static file generator in JavaScript. With the following characteristics:

* Input: 1 x CSV
* Output: 1 x ZIP archive, containing many files
    - One .json file for every search term with results

## Transformation details

This application will be transforming the input CSV such that:

* One column in the CSV will be designated as the column to be searched on
* All partial search terms that lead to results will be saved as separate files. The name of each file will be the partial search term
* Within each of those files will contain the entire list of results for that search term

An example transformation is shown below:

**CSV**

``` csv
Andrew Smith, Basketball
Adam Smith, Netball
```

**JSON**

```
A.JSON
[{ name: Andrew Smith, Sport: Basketball }, { name: Adam Smith, Sport: Netball }]

AD.JSON
[{ name: Adam Smith, Sport: Netball }]
```

## Building the solution

### The data structure that will hold the information

We will be using a Trie to hold the words/result, any node of the tree can have children and therefore is capable of being the head of the Trie aka 'a Trie itself'. See the code below:

``` javascript
class PrefixTreeNode {
    constructor(value) {
        this.children = {};
        this.endWord = null;
        this.value = value;
        this.additionalInfo = null;
    }
}
```

### Adding methods

We will want to add two methods to the Trie. We could add them to the existing class, however, to keep the code cleaner we will extend the PrefixTreeNode class

``` javascript
class PrefixTree extends PrefixTreeNode {
    constructor() {
        super(null);
    }

    addWord(word, additionalInfo) {
        //adds a new word to the trie
    }

    getAllFullWords() {
        //gets all the words and associated data from the trie
    }
}
```

### Method that adds words to the trie data structure

The first method addWord will insert one word and its associated data into the Trie. The algorithm in Pseudocode is as follows:

Start with the head of the Trie.

```
:addWordToTrie
Does the next level of the trie contain the first letter of the word?
    If it doesn't, add the first letter of the word (as a new node) into that level.

Is the remaining word only one letter long?
    We have reached the endWord, please mark the node as such, save associated data
    DONE

Is the remaining word more than one letter long?
    :Add remaining portion of the word to the trie :addWordToTrie
    REPEAT/RECURSIVE
```

And in JavaScript

``` javascript
addWord(word, additionalInfo) {
    const addWordHelper = (node, str) => {
        if (!node.children[str[0]]) {
            node.children[str[0]] = new PrefixTreeNode(str[0]);
        }

        if (str.length === 1) {
            node.children[str[0]].endWord = 1; //set the end word, even if a longer word exists already
            node.children[str[0]].additionalInfo = additionalInfo;
        } else if (str.length > 1) {
            addWordHelper(node.children[str[0]], str.slice(1));
        }
    };
    addWordHelper(this, word);
}
```

### Method that gets all the information out of the Trie

We need a method that gets us all node paths (partial words) from the Trie that ultimately lead to full words. Pseudocode is as follows:

Start with the top of the trie. Once the method has completed, the hashTable allValidLettersCombinations should be full. Each hashKey would be a filename, and the file's contents would be full words.

```

Array savedLettersSoFar
Hashtable allValidLettersCombinations 

:currentNode
If there is a letter on currentNode
    Save that letter to the array savedLettersSoFar

If currentNode is an 'endWord'
    Get all previous letters and their sequential combinations/permutations
    For every combination, save that whole word into the hash allValidLettersCombinations

If the currentNode has children nodes
For every childnode
Create a new copy of Array savedLettersSoFar and REPEAT the above
```

And now in JavaScript

``` javascript
getAllFullWords() {
    const getAllSeqentialPermutations = (strArray) => {
        var permutations = [];
        var partialStringSoFar = '';
        strArray.forEach(s => {
            partialStringSoFar += s;
            permutations.push(partialStringSoFar.slice());
        });
        return permutations;
    }

    var nodePaths = {};
    const traverse = (n, nodesOnThisPath) => {
        if (n.value) {
            nodesOnThisPath.push(n.value);

            if (n.endWord) {
                var permutations = getAllSeqentialPermutations(nodesOnThisPath);
                permutations.forEach(p => {
                    if (nodePaths[p]) {
                        nodePaths[p].push({
                            results: nodesOnThisPath.join(''),
                            additionalInfo: n.additionalInfo
                        });
                    }
                    else {
                        nodePaths[p] = [{
                            results: nodesOnThisPath.join(''),
                            additionalInfo: n.additionalInfo
                        }];
                    }
                });
            }
        }

        if (n.children) {
            for (let k in n.children) {
                traverse(n.children[k], nodesOnThisPath.slice());
            }
        }
    };

    traverse(this, []);
    return nodePaths;
}
```

### Source code for the Trie class

<iframe style="width:100%; border:0; border-radius: 4px; overflow:hidden;" src="https://rawgit.com/paulness/AutocompleteStaticFileGeneratorHtml/master/js/prefixTrie.js"></iframe>

### Source code for saving the Trie data to files

<iframe style="width:100%; border:0; border-radius: 4px; overflow:hidden;" src="https://rawgit.com/paulness/AutocompleteStaticFileGeneratorHtml/master/js/index.js"></iframe>

### All source code

[Edit on GitHub](https://github.com/paulness/AutocompleteStaticFileGeneratorHtml)

## Demonstration

Usage:

* Upload any CSV with headers, one of the headers must be named "name" using the tool below
* Download the ZIP file of results
* Upload contents of ZIP file to a folder on your own web server

<iframe src="https://rawgit.com/paulness/AutocompleteStaticFileGeneratorHtml/master/index.htm" style="width:100%; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
