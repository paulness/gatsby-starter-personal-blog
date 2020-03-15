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
