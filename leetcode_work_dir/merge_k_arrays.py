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
