---
title: Representing numbers, using sticks and stones.
subTitle: In this post, we will be experimenting with storing a list of numbers in a data structure, underpinned by linked lists. We determine the value for each given number by its distance from the puddle (0), sticks will represent the presence of a number. An interactive demonstration built in React JS will allow you to play around with this.
cover: AdobeStock_80967783.jpeg
category: data structures
---

> Can you represent numbers with just sticks and stones? Decimal numbers, negative numbers? What kind of weird 'stone age' data structure is this?

In this blog post, I will be touching on subjects in fun and different way. We will be investigating a strange data structure, for learning purposes, we will be using sticks and stones.

* Numbers can indeed be represented using sticks and stones *
* All numbers in this strange formation are by definition 'in order', no need for sorting algorithms here

_* This demonstration only supports decimal values with one digit of precision. It is possible to modify this code yourself later and leverage the positional nature of the lists to provide additional precision._

Before continuing, I recommend that you fiddle around with the numbers in the following demonstration:

<iframe src="https://rawgit.com/paulness/UnaryNumeral-DoublyLinkedList/master/representing-numbers-with-rocks-and-sticks-in-react/build/index.html" style="width:100%; height: 1000px; border:0; border-radius: 4px; overflow:scroll;"></iframe>

## Rules of play

Assuming you have fiddled around with the above demonstration, you will understand:

* The puddle is zero
* Sticks directly under the puddle represent occurrences of zero in the list
* Rocks directly under the puddle may represent, 0.1, 0.11, etc..
* Upper rocks signify whole numbers
* Lower rocks signify decimal/remaining numbers
* As you move further to the left of the puddle, you are discovering negative numbers
* Sticks represent the existence/occurrence count of numbers
* Rocks without sticks underneath do not represent the occurrence of numbers

## Getting the numbers back out of the rock formation 'in order'

The simple algorithm described below:

```
Move from the puddle rock to the first rock on the left
    If there are 'n' stick(s) under that rock, we have a 'n' occurrences of -1 so add those to the list of numbers
    If that rock has rocks underneath, look for the one that has sticks underneath
    If the third rock has one stick underneath we have found -1.3, so add that to the list of numbers found
etc.

Reverse the numbers found so far.

Try the puddle
    If there are 3 sticks under the puddle add 3 occurrences of 0 to the list of numbers found so far
    If there are 2 rocks under the puddle and 1 stick under those rocks add 0.2 to the list of numbers found so far

Move from the puddle rock to the first rock on the right
    If there are 'n' stick(s) under that rock, we have 'n' occurrences of 1 so add those to the list of numbers
    If that rock has rocks underneath, look for the one that has sticks underneath
    If the eleventh rock has one stick underneath we have found one occurrence of 1.11, so add that to the list of numbers found
etc.
```

## What kind of data structure are we using here?

The data structure used for this is a doubly linked list representing numbers in unary numeral system. 

* The numeric whole number value is determined by the node position from the zero position node
* Each node is capable of starting a new list of decimal nodes
* The numeric remaining/decimal value is also determined by its position from the head node in its own list
* Each node has an occurrence value which is zero by default
* If the occurrence is zero, that number does not exist

Unary numeral doubly linked list with additional lists for decimal numbers

```
Assuming all nodes here have an occurrence count of 1 and the middle node is zero.

[-1.2, 0, 1.1]

is

O<->O<->O
|       |
O       O
|
O


```

``` javascript
class UnaryNumeralNode {
    constructor() {
        this.next = undefined;
        this.prev = undefined;
        this.decimalNode = undefined;
        this.occurrenceCount = 0;
    }
}

class UnaryDecimalNode {
    constructor() {
        this.next = undefined;
        this.occurrenceCount = 0;
    }
}
```

## What is the unary numeral system?

The unary numeral system is the simplest numeral system to represent natural numbers. The [unary numeral system](https://en.wikipedia.org/wiki/Unary_numeral_system), is often the first numeric system taught to babies and it was widely used in ancient times. You may use the unary numeric system today in darts, also known as tallying.

3 is represented as:
|||

4 is represented as:
||||

## Optimizing this data structure

You would not use this data structure to solve cutting-edge problems in computer science. It uses a lot of memory! Adding more and more numbers to the above demonstration would almost certainly result in a JavaScript heap out of memory exception.

How can we make this more efficient? Please look into skip lists next, to see how you can add a skip to each node in the above tree structure. This optimization would remove the need to add empty nodes in the list purely for positional reasons, thereby alleviating the memory issues.

[Academic paper on skip trees by Xavier Messeguer](http://webdiis.unizar.es/asignaturas/TAP/material/skiptrees.pdf)

[GeeksForGeeks article on skip lists](http://www.geeksforgeeks.org/skip-list/)

[Wikipedia article on skip lists](https://en.wikipedia.org/wiki/Skip_list)

## Source code

You can find the source code for this on my [GitHub repository](https://github.com/paulness/UnaryNumeral-DoublyLinkedList)
