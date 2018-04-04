---
title: ZigZag conversion algorithm
subTitle: A dive into the ZigZag letter conversion on Leetcode.com. Letters initially written in a zig-zag formation must be read back from left to right.
cover: zigzag.png
category: algorithms
---

The [ZigZag conversion problem](https://leetcode.com/problems/zigzag-conversion/) appears on Leetcode.com. In summary, letters are written in a ZigZag formation across multiple lines. You must know what letters are part of this formation and output them as you are reading them from left to right.

## Leetcode Requirement

The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of rows like this: (you may want to display this pattern in a fixed font for better legibility)

``` 
  P   A   H   N
   A P L S I I G
    Y   I   R
```

And then read line by line: "PAHNAPLSIIGYIR"
Write the code that will take a string and make this conversion given a number of rows:

```
string convert(string text, int nRows);
convert("PAYPALISHIRING", 3) should return "PAHNAPLSIIGYIR".
```

## Writing letters in ZigZag formation

To understand how to read letters that were written in ZigZag formation, it may also be helpful to know how to write letters in a ZigZag formation yourself. For example, if somebody tells you to write GEEKSFORGEEKS in ZigZag formation across three lines, you would output.

```
G   S   G   S
 E K F R E K
  E   O   E 
```

and across 10 lines

```
G
 E
  E
   K
    S
     F       S
      O     K
       R   E
        G E
         E
```

See below for some additional examples.

```
"ABC" with 2 rows = ACB
A C
 B

"ABCDE" with 2 rows = ACEBD
A C E
 B D

"ABCDE" with 3 rows = AEBDC
A   E
 B D
  C

Reading down to the bottom and then back up the zig-zag we get the values we inserted in order.
However, reading left to right then down we get the expected output: AEBDC
```

## Erroneous characters not part of the zig zig write

In the LeetCode exercise you've been asked to read the characters that have been written in a ZigZag formation. However, you are also being asked to ignore characters that are not in the right positions and should not be included in the output.

For example in the following example, read the characters left to right but only the characters that were written in the ZigZag formation.

```
"ABCDE" was originally written into 3 rows, the X should be ignored = 
A X E
 B D
  C
```

The correct output here is AEBDC, because the X was never part of the ZigZag pattern.

## Source Code - Accepted in LeetCode

``` javascript
/**
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */
var convert = function(s, numRows) {
    return flattenZigZagString(s, numRows);
};


function flattenZigZagString(s, numRows) {
    if (s.length == 0 || numRows == 1) {
        return s;
    }

    //initialize array
    var rowArray = new Array(numRows);
    for (var i = 0; i < numRows; i++) {
        rowArray[i] = [];
    }

    //initialize variables
    var row = 0;
    var itemsToSkipOnThisRow = row;
    var down;

    //read the string left to right, with each consecutive char considered on the next or previous row, scanning up and down each time
    for (var i = 0; i < s.length; i++) {
        var currentChar = s[i];

        //add the char at this index, ignore blank spots
        if (currentChar !== ' ') {
            rowArray[row].push(s[i]);
        }

        if (row == numRows-1) {
            down = false;
        } else if (row == 0) {
            down = true;
        }

        down ? row++ : row--;
    }

    return [].concat.apply([], rowArray).join("");
}
```