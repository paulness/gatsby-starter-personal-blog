---
title: Merge k sorted linked lists
subTitle: Disseminating the "merge k sorted linked lists" problem from Leetcode.com.
cover: merge-k-sorted-linked-lists.png
category: algorithms
---

A common question interview candidates are asked is to merge k sorted linked lists. This is available for practice on [Leetcode](https://leetcode.com/problems/merge-k-sorted-lists/).

> `k sorted linked lists` = just some number of sorted linked lists

## Problem description

Given `k` number of linked lists, create a new single linked list that is ordered. Analyze the time and space complexity.

A good solution for time complexity is `O(N log k)` where `O` is the number of operations `N` is the total number of items in the list and `k` is the number of linked lists. A good solution should also require no additional space/memory other than the memory already used e.g. constant `O(1)`.

## The algorithm

You want to merge the following 3 linked lists, `list1`, `list2` and `list3`

```text
2 -> 3 -> 4 -> 5
4 -> 5 -> 6 -> 7 -> 8
20
```

So that you have the following flattened final linked list

```text
2 -> 3 -> 4 -> 4 -> 5 -> 5 -> 6 -> 7 -> 8 -> 20
```

As you construct the newly merged linked list you'll be moving through the existing linked lists. Once an item has been added to the merged list there is no reason to return to this item. Therefore updating the head of the list as we construct a new merged list is an acceptable approach.

> With each iteration, 1 item from the front of `list1` or `list2` or `list3` will be plucked

| list1 Head | list2 Head | list3 Head | Lowest Value     |
| ---------- | ---------- | ---------- | ---------------- |
| 2          | 4          | 20         | 2                |
| 3          | 4          | 20         | 3                |
| 4          | 4          | 20         | 4 (from `list1`) |
| 5          | 4          | 20         | 4                |
| 5          | 5          | 20         | 5 (from `list1`) |
|            | 5          | 20         | 5                |
|            | 6          | 20         | 6                |
|            | 7          | 20         | 7                |
|            | 8          | 20         | 8                |
|            |            | 20         | 20               |

### Steps

1. Evaluate each head node of each input list to find the head with the lowest value
2. Attach this head node to the tail of your flattened output list
3. Make the head of the input list point the next node if one exists otherwise you've exhuasted this list. You just remove the node, so that you won't see it again in the next iteration
4. Repeat until there are no lists with nodes left

## Code

```python
#!/usr/bin/python3

"""
https://leetcode.com/problems/merge-k-sorted-lists/
"""

class ListNode:
    """
    Basic data structure for a singly-linked list.
    """

    def __init__(self, x):
        self.val = x
        self.next = None

class Solution:
    """
    Wrapper class for LeetCode solution
    """

    def mergeKLists(self, lists: [ListNode]) -> ListNode:
        """
        Parameters
        ----------
        lists: list of ListNode
            Multiple linked lists, each can be traversed using the next property

        Returns
        -------
        ListNode
            The head of a newly constructed ordered and flattened linked list
        """

        if lists:
            lists = [l for l in lists if l]

        if not lists:
            return None

        # Setup the head of the new ordered merged linked list
        list_with_lowest_value = min(lists, key=lambda l: l.val)
        self._update_list_head(lists=lists, head_to_update=list_with_lowest_value)
        merged_list_head = list_with_lowest_value
        merged_list_cur = merged_list_head

        # Build new ordered merged linked list
        while lists:
            list_with_lowest_value = min(lists, key=lambda l: l.val)
            merged_list_cur.next = list_with_lowest_value
            merged_list_cur = merged_list_cur.next
            self._update_list_head(lists=lists, head_to_update=list_with_lowest_value)
        return merged_list_head

    @classmethod
    def _update_list_head(cls, lists: [ListNode], head_to_update: ListNode):
        """
        Updates the head reference of one list to the next item in that list
        """

        if head_to_update.next:
            index = lists.index(head_to_update)
            lists[index] = head_to_update.next
        else:
            lists.remove(head_to_update)
```

### Sample run code for experimentation and debugging

```python
def main():
    """ The entry point of the python script """

    sln = Solution()

    # Test data 2 linked lists
    list1_item1 = ListNode(8)
    list1_item2 = ListNode(9)
    list1_item3 = ListNode(9)
    list1_item1.next = list1_item2
    list1_item2.next = list1_item3

    list2_item1 = ListNode(3)

    # Print out the flattened linked list
    merged_list = sln.mergeKLists([list1_item1, list2_item1])
    while (merged_list and merged_list.val):
        print(merged_list.val)
        merged_list = merged_list.next


if __name__ == "__main__":
    main()
```

## Useful links

- https://www.youtube.com/watch?v=ptYUCjfNhJY
- https://medium.com/better-programming/a-gentle-explanation-of-logarithmic-time-complexity-79842728a702
