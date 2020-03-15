---
title: First missing positive
subTitle: Find the first missing positive integer in an array in O(n) time from LeetCode
cover: first-missing-positive.png
category: algorithms
---

Given an array full of integers, find the first missing positive integer in the list. This tutorial goes over how you can do this in O(n) without using any additional space for hashtables or anything. This is avaliable for practice on [LeetCode](https://leetcode.com/problems/first-missing-positive/).

## Example lists

Example of missing 5

```
1,2,3,4,6
```

Example of missing 1

```
-1,4,8,6,2
```

## Algorithm

If the array has 4 elements and we are looking for the first missing positive. We can look at it this way, we expect `1,2,3,4` to be there.

| index                  | 0   | 1   | 2   | 3   |
| ---------------------- | --- | --- | --- | --- |
| expected values        | 1   | 2   | 3   | 4   |
| actual values          | -1  | 8   | 6   | 1   |
| values after algorithm | 1   | 0   | 0   | 0   |

You'll have to scan the entire list once to find out that `1` is not missing of course and that `2` is the first missing positive.

1. Iterate the array once - O(n)
   1. Get the value of the slot and `-1` from this value, so that it is in the same zero-index range as the slots
   2. Throw away any value you encounter outside of the range of the indexes of the array `0 between len(array)-1`
   3. If the value you find is the same as the expected value for the slot overwrite the slot value with `1` to denote the value exists
   4. If you find a value that is less than the index, set the index of that slot to `1` and the current slot value to `0`
   5. If you find a value that is greater than the current index, then swap the value in the current slot with the value in the expected future slot as it will be evaluated later anyway. Repeat this iteration once without progressing to the next slot so that you can evaluate the new value in this slot.

In the end, you'll have an array of zeros and ones. Where `1` denotes the existence of the value and `0` means the value does not exist. The first occurrence of zero is your first positive missing value.

### Python Code

This Python code [passes all tests in Leetcode](https://leetcode.com/submissions/detail/312533966/)

```python
"""
https://leetcode.com/problems/first-missing-positive/
"""

class Solution:
    """ Wrapper for LeetCode solution """

    def firstMissingPositive(self, nums: list) -> int:
        """
        Finds the first MISSING positive value in an array
        """

        # Simplify the problem so that the array is just full of 0 or 1
        # Where 1 indicates the presence of the value
        self._update_arr_to_just_flags(nums=nums)

        # The first occurrence of 0 is the first missing value
        try:
            first_missing_positive_integer = nums.index(0) + 1
        except ValueError:
            first_missing_positive_integer = len(nums)+1

        print(nums)
        print(first_missing_positive_integer)
        return first_missing_positive_integer


    @classmethod
    def _update_arr_to_just_flags(cls, nums: list):
        """
        Updates an entire array so that instead of storing values it stores either 0 or 1

        1 indicates the presence of a value, the index indicates the value
        """

        last_index = len(nums)-1
        i = 0
        while i <= last_index:
            print(f"\nRunning iteration index {i}")
            print(f"Current state of array {nums}")
            current_value_target_index = nums[i] - 1
            target_index_out_of_bounds = (current_value_target_index < 0 or
                                          current_value_target_index > last_index)

            if target_index_out_of_bounds:
                print(f"threw away value at {i} aka {nums[i]} as it was outside the range")
                nums[i] = 0
            elif current_value_target_index < i:
                print((f"already visited value {current_value_target_index}"
                       "aka {nums[current_value_target_index]}"))
                nums[current_value_target_index] = 1
                nums[i] = 0
            elif current_value_target_index == i:
                nums[current_value_target_index] = 1
            elif current_value_target_index > i:
                # the value is ahead and has not been considered yet
                # swap it with current and re-evaluate current
                are_same = nums[current_value_target_index] == nums[i]
                if not are_same:
                    cls._arr_swap(nums, current_value_target_index, i)
                    continue

                # The current value will be evaluated later
                nums[i] = 0

            i += 1

    @classmethod
    def _arr_swap(cls, nums: list, i: int, j: int):
        temp = nums[i]
        nums[i] = nums[j]
        nums[j] = temp
        print(f"swapped slots {i} with {j} aka {nums[i]} with {nums[j]}")
```

### Sample run code for experimentation and debugging

```python
def main():
    """ The entry point of the Python script """

    sln = Solution()
    sln.firstMissingPositive([2, 2])

if __name__ == "__main__":
    main()
```

## Useful learning materials

https://www.youtube.com/watch?v=Q-o4mtw1zJM
