---
title: Median of two arrays
subTitle: Getting the median of two sorted arrays in O(log(len(small_array))).
cover: median-of-two-arrays.png
category: algorithms
---

Did you know that it's possible to get the median of two separate arrays of different lengths, even or odd, without ever merging them or sorting them? It's something that is often asked in interviews and is also listed on Leetcode.com.

> Median = the value that splits the array into two equal length partitions

## The premise

Given two separate arrays that can have different lengths, overlapping values. There exists a solution to find the median across both arrays without sorting or merging the arrays.

### Example 1 - an array that when combined has an odd length of 11

```python
small_array = [1, 3, 8, 9, 15]
large_array = [7, 11, 18, 19, 21, 25]
```

The solution should find the same median `11` as if this array was merged and sorted

```python
merged_sorted_array = [1, 3, 7, 8, 9, 11, 15, 18, 19, 21, 25]
```

Search for the first two partition points which satisfy the following conditions

1. All elements to the left of the partition on `small_array` are smaller or equal to all elements on the right of the partition of `large_array`
2. All elements to the left of the partition on `large_array` are smaller or equal to all elements on the right of the partition of `small_array`

Since both arrays are ordered in ascending order, checking all elements is unnecessary. The partition that satisfies the above on `small_array` and `large_array` is as follows.

```
1 3 8 9 | 15
7 11 | 18 19 21 25
```

9 is less than 18 and 11 is less than 15

Since the total number of elements in the combined array is odd we simply use the larger of the two numbers to the left of either partition as the median. This is `11`.

### Example 2 - an array that when combined has an even length of 10

> In an even array the median is the mean of the two middle numbers

```python
small_array = [23, 26, 31, 35]
large_array = [3, 5, 7, 9, 11, 16]
```

The solution should find the same median `13.5` derived from `(11 + 16) / 2` as if this array was merged and sorted

```python
merged_sorted_array = [3, 5, 7, 9, 11,   16, 23, 26, 31, 35]
```

The partition points of these arrays are

```
-∞ | 23 26 31 35
3 5 7 9 11 | 16
```

Nothing exists on the left of partition in the `small_array`, therefore we have substituted this with negative infinity `-∞`. This effectively means that all values of concern to the median are only in the `large_array` and we need both a left and right value in this array to compare.

We still satisfy the conditions earlier

1. All elements to the left of the partition on `small_array` are smaller or equal to all elements on the right of the partition of `large_array`
   1. -∞ is less than all elements
2. All elements to the left of the partition on `large_array` are smaller or equal to all elements on the right of the partition of `small_array`
   1. 11 is less than 23
   2. 16 is also less than 23 but we satisfied both conditions already

Now the next step is to compare the 4 numbers next to the partition points

|               | left | right |
| ------------- | ---- | ----- |
| `small_array` | -∞   | 23    |
| `large_array` | 11   | 16    |

We will use the following formula `(max(small_array_left_val, large_array_right_val) + min(small_array_right_val, large_array_right_val)) / 2` or `(11 + 16) / 2 = 13.15`

### Example 3 - an array that when combined has an odd length of 3

```python
small_array = [3]
large_array = [-2, -1]
```

There are only a few ways that tiny arrays can be partitioned and the first way gets the correct result

|             | left | right |
| ----------- | ---- | ----- |
| small_array | -∞   | 3     |
| large_array | -1   | +∞    |

Since the combined array is of an odd length we just use the larger of the two numbers to the left of either partition as the median this is `-1` as `-1 > -∞`

## Python Code

This code passes [all tests in LeetCode](https://leetcode.com/submissions/detail/312498996/). Print statements are added for tutorial purposes

```python
"""
https://leetcode.com/problems/median-of-two-sorted-arrays/
"""

import sys


class Solution:
    """
    Wrapper class for Leetcode solution
    """

    def findMedianSortedArrays(self, nums1: [int], nums2: [int]) -> float:
        """
        Parameters
        ----------
        nums1: [int]
            A sorted array of numbers
        nums2: [int]
            A sorted array of numbers

        Returns
        -------
        int
            Median number which partitions both arrays if they were already merged and sorted
        """

        if not nums1 and not nums2:
            raise "Invalid input"

        # Single array (trivial algorithm)
        if not nums1 and nums2:
            return self._get_median_single_array(nums2)
        if not nums2 and nums1:
            return self._get_median_single_array(nums1)

        # Get the median for two arrays, smallest array first
        if len(nums1) < len(nums2):
            return self._find_median_sorted_arrays(small_array=nums1, large_array=nums2)

        return self._find_median_sorted_arrays(small_array=nums2, large_array=nums1)

    @classmethod
    def _find_median_sorted_arrays(cls, small_array: [int], large_array: [int]) -> float:
        """
        Time complexity O(log(len(small_array)))

        Parameters
        ----------
        small_array: [int]
            A list of integers sorted
        large_array: [int]
            A list of integers sorted, must be larger or the same length as small_array

        Returns
        -------
        float
            The median that splits the two arrays equally as if they were sorted and merged
        """


        total_elements = len(small_array) + len(large_array)

        # Begin the search within the entire range of the smaller array
        start_x=0
        end_x = len(small_array)

        while (start_x <= end_x):

            # Try and find the partition points for the x and y array such that an equal number of elements appear on both sides
            partition_x = cls._get_partition_x(start_x, end_x)
            partition_y = cls._get_partition_y(total_elements, partition_x)

            # Find immediate element to the left and to the right of partition_x in the x array
            left_val_x = small_array[partition_x-1] if partition_x > 0 else -sys.maxsize
            right_val_x = small_array[partition_x] if partition_x < len(small_array) else sys.maxsize

            # Find immediate element to the left and to the right of partitionY in the y array
            left_val_y = large_array[partition_y-1] if partition_y > 0 else -sys.maxsize
            right_val_y = large_array[partition_y] if partition_y < len(large_array) else sys.maxsize

            # All values to the left on the x partition are less or equal to all the values on the right of the y partition
            left_x_less_eq_to_right_y = left_val_x <= right_val_y

            # All values to the left of the y partition are less or equal to all the values to the right of the x partition
            left_y_less_eq_to_right_x = left_val_y <= right_val_x

            # Print information about the current state
            print("-- INFORMATION---")
            print(f"start_x={start_x} end_x={end_x}")
            print(f"partition_x={partition_x} partitionY={partition_y}")
            print("-----------------")
            print("The 4 values hugging the 2 partition points")
            print(f"maxLeftX={left_val_x}   minRightX={right_val_x}")
            print(f"maxLeftY={left_val_y}   minRightY={right_val_y}")
            print(f"left_x_less_eq_to_right_y={left_x_less_eq_to_right_y}")
            print(f"left_y_less_eq_to_right_x={left_y_less_eq_to_right_x}")

            # Partition found where median can be calculated
            if left_x_less_eq_to_right_y and left_y_less_eq_to_right_x:
                print(f"Found the perfect partition indexes. partition_x={partition_x} partitionY={partition_y}")
                print(f"small_array_left={small_array[0:max(0, partition_x)]} small_array_right={small_array[partition_x::]}")
                print(f"large_array_left={large_array[0:max(0, partition_y)]} large_array_right={large_array[partition_y::]}")
                is_even = total_elements % 2 == 0
                if is_even:
                    median = (max(left_val_x, left_val_y) + min(right_val_x, right_val_y)) / 2
                else:
                    median = int(max(left_val_x, left_val_y))

                print(f"Found the perfect median {median}")
                return median

            # Move search space backward or forward
            if left_val_x > right_val_y:
                end_x = partition_x - 1
            else:
                start_x = partition_x + 1

    @classmethod
    def _get_partition_x(cls, start_x: int, end_x: int):
        """
        Parameters
        ----------
        start_x: int
            The current start_x
        end_x: int
            The current end_x

        Returns
        -------
        int
            The partition index for the x array, if > len(x) then the median of both arrays is in y
        """

        return int((start_x + end_x) / 2)

    @classmethod
    def _get_partition_y(cls, total_elements: int, partition_x: int):
        """
        Parameters
        ----------
        total_elements: int
            The total number of elements in both arrays
        partition_x: int
            The current partition_x

        Returns
        -------
        int
            The partition point of y
        """

        return int(((total_elements + 1) / 2) - partition_x)

    @classmethod
    def _get_median_single_array(cls, nums: list) -> float:
        """
        Gets the median of the sorted array

        Returns
        -------
        float
            Median number which partitions the array such that both sides have equal number of elements.
        """

        if len(nums) == 1:
            return nums[0]

        median = len(nums) / 2
        if not median.is_integer():
            # Odd number then return the middle
            return nums[int(median)]

        # Even so must split
        median = int(median) - 1
        return (nums[median] + nums[median+1]) / 2
```

### Sample run code for experimentation and debugging

```python
def main():
    """ The entry point of the Python script """

    # Trying to find the median of the combined arrays
    sln = Solution()

    # We know the median to this is 11
    # print(sln.findMedianSortedArrays(nums1=[1,3,8,9,15], nums2=[7,11,18,19,21,25]))

    # We know the median to this is between 11 and 16 so 13.5
    print(sln.findMedianSortedArrays(nums1=[23,26,31,35], nums2=[3,5,7,9,11,16]))

    # The median here is -1
    #print(sln.findMedianSortedArrays([3], [-2,-1]))

    # The median here is 3
    #print(sln.findMedianSortedArrays([1,2,5],[1,3,5,6]))

if __name__ == "__main__":
    main()
```

## Useful links

https://www.youtube.com/watch?v=LPFhl65R7ww
