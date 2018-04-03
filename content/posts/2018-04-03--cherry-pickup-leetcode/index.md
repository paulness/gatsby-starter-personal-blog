---
title: Cherry pickup algorithm
subTitle: An in-depth look into the Cherry Pickup problem on Leetcode.com.
cover: berry-pickup-two-people-same-time.jpg
category: algorithms
---

One of the harder questions on Leetcode.com is the [Cherry Pickup](https://leetcode.com/problems/cherry-pickup/description/). I hope this post shines light on this problem for many people struggling with the solution.

## Problem description by Leetcode.com

The problem as described by Leetcode is as follows:

> In a N x N  grid representing a field of cherries, each cell is one of three possible integers.
> 
> -   0 means the cell is empty, so you can pass through;
> -   1 means the cell contains a cherry, that you can pick up and pass through;
> -   -1 means the cell contains a thorn that blocks your way.
> 
> Your task is to collect maximum number of cherries possible by following the rules below:
> 
> -   Starting at the position (0, 0) and reaching (N-1, N-1) by moving right or down through valid path cells (cells with value 0 or 1);
> -   After reaching (N-1, N-1), returning to (0, 0) by moving left or up through valid path cells;
> -   When passing through a path cell containing a cherry, you pick it up and the cell becomes an empty cell (0);
> -   If there is no valid path between (0, 0) and (N-1, N-1), then no cherries can be collected.

## Symbols we will use to describe the problem

This post aims to simplify the problem and we will be using different symbols. These are outlined below.
 - [[],[]] / Matrix of matrixes - Field of cherries
 - 1 - 🍓 - Cherry
 - 0 - No cherry (possibly already collected)
 - -1 - ᚦ (thorn that blocks the cherry collector)
 - 🚶 - Cherry collector
    - Can one make one round-trip collection
	- Can only move down or right on his way to x=N-1, y=N-1
	- Can only move up or left on his way to x=0, y=0

## Quiz

A few quiz questions below will help to understand the problem by example.

----------

**Question 1** What is the maximum number of cherries, the collector can collect in the following field?
``` javascript
[[🍓, ᚦ, 0, 0, 0, 0],
 [🍓, ᚦ, 0, 0, 0, 0],
 [🍓, ᚦ, 0, 0, 0, 0],
 [🍓, ᚦ, 0, 0, 0, 0],
 [🍓, ᚦ, 0, 0, 0, 0],
 [🍓, ᚦ, 0, 0, 0, 0]]
```
**Answer** = none because he can never reach his target.

----------

**Question 2** What about for this field?
``` javascript
[[0,  0,  0,  0,  0,  🍓],
 [🍓,  ᚦ,  0,  0,  0,  0],
 [🍓,  🍓, 🍓,  0,  0,  0],
 [🍓,  ᚦ,  0,  0,  0,  0],
 [🍓,  ᚦ,  0,  0,  🍓,  0],
 [🍓,  0,  0,  0,  0,  0]]
```
Lets find out!
``` javascript
//On the way down - 5 cherries
[[🚶,  0,  0,  0,  0,  🍓],
 [🚶,  ᚦ,  0,  0,  0,  0],
 [🚶,  🍓, 🍓,  0,  0,  0],
 [🚶,  ᚦ,  0,  0,  0,  0],
 [🚶,  ᚦ,  0,  0,  🍓,  0],
 [🚶,  🚶,  🚶,  🚶,  🚶,  🚶]]

//Return journey - 3 cherries
[[🚶,  0,  0,  0,  0,  🍓],
 [🚶,  ᚦ,  0,  0,  0,  0],
 [🚶,  🚶,  🚶,  🚶,  0,  0],
 [0,  ᚦ,  0,  🚶,  0,  0],
 [0,  ᚦ,  0,  0,  🚶,  0],
 [0,  0,  0,  0,  0,  🚶]]
```
**Answer** = 8

----------

Notice one cherry is still left in the field, in the top right corner. Picking up that cherry would have meant leaving more cherries unpicked in the field, because we can only move in a down/right on the way down, then up/left on the return journey.

Let us think about this further and come up with some other truths that may later help us, before writing any code

  - Cherries can only be picked up once. They are gone once picked up
  - You cannot hit a thorn and continue. You must avoid thorns
  - You may cross over a path you have already traveled. Sometimes this is wise to avoid thorns and/or get to other cherries
  - Every path that can be travelled by going up/left from the destination (N-1, N-1) can also be identically
   travelled by going down and right from the origin (0,0).
	  - **Optimization alert**. Therefore two people travelling down/right 'one way' can make the cherry pickups as one person doing a 'round-trip'

## Source code
Source code in JavaScript for working out the max number of cherries you can pick up with two people, starting at the origin 0,0 and ending at the destination N-1, N-1 both with the restriction of only being able to move down or right.

- The recursion ensures all viable paths are explored
- The Math.Max ensures that the best two paths are chosen
    
``` javascript
var cherryPickup = function (grid) {
    var maxY = grid.length;
    var maxX = grid[0].length;
    var memo = {};
    function dp(yPersonA, xPersonA, xPersonB) {
        //work out corrosponding Y variable for personB. (works since personA and personB have made the same number of moves)
        var yPersonB = yPersonA + xPersonA - xPersonB;

        //key for the current state
        var memoKey = yPersonA + "_" + xPersonA + "_" + xPersonB;

        //work out if we are out of bounds
        var overTheEdge = maxY == yPersonA || maxY == yPersonB || maxX == xPersonA || maxX == xPersonB; //we are actually over the edge HERE!!
        if (overTheEdge) {
            return -999999;
        }

        var personAHitAThorn = grid[yPersonA][xPersonA] == -1;
        var personBHitAThorn = grid[yPersonB][xPersonB] == -1;
        if (personAHitAThorn || personBHitAThorn) {
            //impossible move, either over the edge or directly on a thorn
            return -999999;
        } else if (yPersonA == maxY - 1 && xPersonA == maxX - 1) {
            //reached the target finally
            return grid[yPersonA][xPersonA];
        } else if (memo[memoKey] !== undefined) {
            //already visited
            return memo[memoKey];
        } else {

            var personAHasCherry = grid[yPersonA][xPersonA] === 1;
            var personBHasCherry =
                yPersonB !== yPersonA && xPersonB !== xPersonA && //if personA didn't take it first!
                grid[yPersonB][xPersonB] === 1;

            var cherriesCollectedByBothPeopleThisTurn =
                (personAHasCherry ? 1 : 0) +
                (personBHasCherry ? 1 : 0);

            //both people make all possible single moves they can make (down and right)
            //personB by definition will likely always be on a different path than personA since:
            //   *   it will generate more COMBINED cherries (see above cherriesCollectedByBothPeopleThisTurn)
            var maxCherriesCollectedByBothPeopleForRemainingTurns = Math.max(
                Math.max(
                    dp(yPersonA, xPersonA + 1, xPersonB + 1), //personA right personB right
                    dp(yPersonA + 1, xPersonA, xPersonB + 1)), //personA down personB right
                Math.max(
                    dp(yPersonA, xPersonA + 1, xPersonB), //personA right personB down
                    dp(yPersonA + 1, xPersonA, xPersonB)) //personA down personB down
                );

            var cherriesCollectedRecursive = cherriesCollectedByBothPeopleThisTurn + maxCherriesCollectedByBothPeopleForRemainingTurns;
            memo[memoKey] = cherriesCollectedRecursive;
            return cherriesCollectedRecursive;
        }
    }

    return Math.max(0, dp(0, 0, 0));
}
```