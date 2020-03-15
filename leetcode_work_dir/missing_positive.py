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

def main():
    """ The entry point of the Python script """

    sln = Solution()
    sln.firstMissingPositive([2, 2])

if __name__ == "__main__":
    main()
