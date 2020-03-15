---
title: Find the median in a data stream
subTitle: Adding incoming data in a way that it's optimized to always knowing the median
cover: median-in-data-stream.png
category: algorithms
---

Knowing the median allows you to split data in half equally. It can be very useful when processing data.

This [algorithm from LeetCode](https://leetcode.com/problems/find-median-from-data-stream/) is about saving new incoming data in such a way where the median is easily known. There are only two public operations which you must provide.

- Ability to add new numbers
- Ability to find the median

Assume that both operations will be frequent and develop your solution accordingly.

## Solution using one max heap and one min heap

Since you need to know the median at any given moment, in this exercise we will use two data structures. One will hold all the values lower than the median and one will store all the values higher than the median. Both data structures must have an equal number of elements or at most 1 element more to handle an odd length array.

For the left side of the median, the value we are most interested in is the highest/largest value. This value we need to access frequently. We will use a max heap for this as the largest element is always at the top of the heap.

```
  8
 / \
4   5
```

For the right side of the median, the value we are most interested in is the lowest/smallest value. This value we need to access frequently as well. We will use a min-heap for this as the smallest element is always at the top of the heap.

```
  9
 / \
15  11
```

When we add a number we either will add to the left heap or the right heap. If the value is higher than the top value of the left heap we will add it to the right heap.

If we add a number to either heap we must check if we need to rebalance the heap. The heap must be balanced otherwise there is no way to determine the median. To rebalance the heap we do the following

> If either heap becomes has more than 1 element more than the other, pluck/pop off the top element and move it to the other heap.

### An example of the rebalancing

The left tree has become too large

```
    8       9
   / \     / \
  5   3   15  15
 / \
4   4
```

After rebalancing the `8` has been moved to become part of the right tree

```

    5         8
   / \       / \
  4   3     9  15
 /         /
4         15
```

Since either side has 4 elements the number that divides all the numbers into equal portions is a number between 5 and 8. We can work this easily `(5 + 8) / 2 = 6.5`

## Python code

This code [passes all tests in Leetcode](https://leetcode.com/submissions/detail/312809894/). It does not go into detail about how max and min heaps work, instead using an inbuilt library `heapq`.

```python
"""
https://leetcode.com/problems/find-median-from-data-stream/
"""

import heapq

class MedianFinder:
    """ Wrapper for LeetCode solution """

    def __init__(self):
        """
        Data structure initialization
        """

        # Stores values that are less than the median
        self.left_heap = MaxHeap()

        # Stores values that are greater than the median
        self.right_heap = MinHeap()

    def addNum(self, num: int) -> None:
        """
        Adds the incoming number to the correct underlying data structure
        """

        largest_element_on_left = self.left_heap.peek()
        if largest_element_on_left and num < largest_element_on_left:
            self.left_heap.push(num)
        else:
            self.right_heap.push(num)

        self._rebalance_heap()

    def _rebalance_heap(self):
        """
        Neither heap should have more than one element more than the other
        This is essential so that the median can be determined
        """

        heap_size_left = self.left_heap.length()
        heap_size_right = self.right_heap.length()

        if heap_size_left > heap_size_right + 1:
            largest_element_on_left = self.left_heap.pop()
            self.right_heap.push(largest_element_on_left)
        elif heap_size_right > heap_size_left + 1:
            smallest_element_on_right = self.right_heap.pop()
            self.left_heap.push(smallest_element_on_right)

    def findMedian(self) -> float:
        """
        Gets the median by calculating the value based on the top of each heap
        """

        heap_size_left = self.left_heap.length()
        heap_size_right = self.right_heap.length()
        is_even = (heap_size_left + heap_size_right) % 2 == 0
        if is_even:
            # Both sides have equal number of elements
            # The median is the mean of the largest element on the left and smallest element on the right
            median = (self.left_heap.peek() + self.right_heap.peek()) / 2
        else:
            # Whichever heap has 1 extra element that element IS the median!!
            median = self.left_heap.peek() if heap_size_left > heap_size_right else self.right_heap.peek()

        return median

class MaxHeapObj(object):
    def __init__(self, val): self.val = val
    def __lt__(self, other): return self.val > other.val
    def __eq__(self, other): return self.val == other.val
    def __str__(self): return str(self.val)

class MinHeap(object):
    def __init__(self): self.h = []
    def push(self,x): heapq.heappush(self.h,x)
    def pop(self): return heapq.heappop(self.h)
    def peek(self): return self.h[0] if self.h else None
    def __getitem__(self,i): return self.h[i]
    def length(self): return len(self.h)

class MaxHeap(MinHeap):
    def push(self, x): heapq.heappush(self.h, MaxHeapObj(x))
    def pop(self): return heapq.heappop(self.h).val
    def peek(self): return self.h[0].val if self.h else None
    def __getitem__(self,i): return self.h[i].val
```

### Code used for debugging and running locally

```python
def main():
    """ The entry point of the python script """
    obj = MedianFinder()
    obj.addNum(8)
    obj.addNum(15)
    obj.addNum(17)
    obj.addNum(20)
    median = obj.findMedian()
    print(median)

if __name__ == "__main__":
    main()
```

## Useful learning material

https://kanaka.github.io/rbt_cfs/trees.html
https://www.cs.usfca.edu/~galles/visualization/Heap.html
https://www.youtube.com/watch?v=1CxyVdA_654
