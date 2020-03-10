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

You want to merge the following 3 linked lists 

```text
1 -> 2 -> 3 -> 4
4 -> 5 -> 6 -> 7 -> 8
20
```

So that you have the following flattened final linked list

```text
1 -> 2 -> 3 -> 4 -> 4 -> 5 -> 6 -> 7 -> 8 -> 20
```

You'll need to compare the head of each list with each iteration. The head with the smallest value is what you are looking for

```text
1 vs 4 vs 20 = 1
2 vs 4 vs 20 = 2
4 vs 4 vs 20 = 3
4 vs 4 vs 20 = 4
4 vs 20 = 4
5 vs 20 = 5
6 vs 20 = 6
7 vs 20 = 7
8 vs 20 = 8
20 = 20
```

### Steps

1. Evaluate each head node of each input list to find the head with the lowest value
2. Attach this head node to the tail of your flattened output list
3. Make the head of the input list point the next node if one exists otherwise you've exhuasted this list. You just remove the node, so that you won't see it again in the next iteration
4. Repeat until there are no lists with nodes left

## Code


```python
# Definition for singly-linked list.
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution:
    def mergeKLists(self, lists: [ListNode]) -> ListNode:
        """
        Returns a single sorted list from multiple sorted lists
        """

        # Ignore empty lists
        if lists:
            lists = [l for l in lists if l]
        if not lists:
            return None

        # Get the list which has the lowest value, keep that value for later
        list_with_lowest_value = min(lists, key=lambda l: l.val)

        # Progress that list to the next value
        self._progress_to_next_item_in_list(lists=lists, item=list_with_lowest_value)

        # Keep references to the HEAD of the new flattened list and the current
        merged_list_head = list_with_lowest_value
        merged_list_cur = merged_list_head
        
        # While at least one input list isn't exhausted
        while lists:
            list_with_lowest_value = min(lists, key=lambda l: l.val)
            merged_list_cur.next = list_with_lowest_value
            merged_list_cur = merged_list_cur.next
            self._progress_to_next_item_in_list(lists=lists, item=list_with_lowest_value)
        return merged_list_head

    @classmethod
    def _progress_to_next_item_in_list(cls, lists: [ListNode], item: ListNode):
        """
        Either changes the list to reference the new item or removes the item from the list if it's at the end
        """

        if item.next:
            index = lists.index(item)
            lists[index] = item.next
        else:
            lists.remove(item)

        
sln = Solution()

# test data
list1_item1 = ListNode(8)
list1_item2 = ListNode(9)
list1_item3 = ListNode(9)
list1_item1.next = list1_item2
list1_item2.next = list1_item3

list2_item1 = ListNode(3)

# Run application with test data
sln.mergeKLists([list1_item1, list2_item1])
```

## Useful links

- https://www.youtube.com/watch?v=ptYUCjfNhJY
- https://medium.com/better-programming/a-gentle-explanation-of-logarithmic-time-complexity-79842728a702