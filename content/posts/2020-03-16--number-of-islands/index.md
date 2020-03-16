---
title: Find the number of contiguous islands in a 2d matrix world
subTitle: Using recursion and depth-first search to find all islands in a given 2d matrix world
cover: find-islands.jpg
category: algorithms
---

A really common algorithm asked in interviews is [finding islands in a 2-dimensional matrix](https://leetcode.com/problems/number-of-islands/) such as below.

```python
# World with 2 islands, 1 huge and 1 tiny
world_1 = [
    ["1","1","1","1","0"],
    ["1","1","0","1","0"],
    ["1","1","0","0","0"],
    ["0","0","0","0","1"]
]
```

You can find the number of islands with the following algorithm

- Scan the world, the easy solution is just column by column, row by row
- If an island is encountered there is likely to be more land next to it in the directions `N,S,E,W`. Destroy the landmass by marking the contiguous elements as `"0"`. Once the entire island is destroyed tally this island as one new island found.
- Repeat
- Return the number of new islands found in the tally

> Hint: By destroying each island you arrive at, you never accidentally count parts of the same island as a new island

## Python code

This code [passes all tests in LeetCode](https://leetcode.com/submissions/detail/312860478/)

```python
"""
https://leetcode.com/problems/number-of-islands/
"""

class Solution:
    """ Wrapper for LeetCode Solution """

    def numIslands(self, grid: [[str]]) -> int:
        """
        Determines the number of islands in a matrix, before destroying them
        """

        # World is empty, no land or water
        if not grid or not grid[0]:
            return 0

        islands_found = 0

        for row_index, row in enumerate(grid):
            for col_index, _col in enumerate(row):
                # if the current position is an island
                if grid[row_index][col_index] == "1":

                    # Mark island as found
                    islands_found += 1

                    # Destory entire island
                    self._destroy_island(grid, row_index, col_index)

        return islands_found


    def _destroy_island(self, grid: [[str]], row_index: int, col_index: int):
        """ Destroys the entire island """

        out_of_bounds_longitude = col_index < 0 or col_index >= len(grid[0])
        out_of_bounds_latitude = row_index < 0 or row_index >= len(grid)

        if out_of_bounds_longitude or out_of_bounds_latitude:
            return

        current_position = grid[row_index][col_index]
        if current_position == "0":
            return

        # Destroy island underneath the current position
        grid[row_index][col_index] = "0"

        # Destroy contigious island landmass to the north, south, east and west
        self._destroy_island(grid, row_index-1, col_index)
        self._destroy_island(grid, row_index+1, col_index)
        self._destroy_island(grid, row_index, col_index-1)
        self._destroy_island(grid, row_index, col_index+1)
```

### Debugging and run code

```python
def main():
    """ The entry point of the python script """

    world_1 = [
        ["1","1","1","1","0"],
        ["1","1","0","1","0"],
        ["1","1","0","0","0"],
        ["0","0","0","0","1"]
    ]

    sln = Solution()
    number_of_islands_world_1 = sln.numIslands(world_1)
    print(f"Number of islands destroyed in world_1: {number_of_islands_world_1}")

if __name__ == "__main__":
    main()
```
