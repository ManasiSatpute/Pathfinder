class BinomialNode {
  constructor(node, priority) {
    this.node = node
    this.priority = priority
    this.degree = 0
    this.parent = null
    this.child = null
    this.sibling = null
  }
}

export default class BinomialHeap {
  constructor() {
    this.head = null
    this.nodeMap = new Map()
  }

  isEmpty() {
    return this.head === null
  }

  insert(node, priority) {
    const existing = this.nodeMap.get(node)
    if (existing) {
      this.decreaseKey(node, priority)
      return
    }

    const singleHeap = new BinomialHeap()
    const newNode = new BinomialNode(node, priority)
    singleHeap.head = newNode
    singleHeap.nodeMap.set(node, newNode)
    this.union(singleHeap)
  }

  extractMin() {
    if (!this.head) return null

    let minNode = this.head
    let minPrev = null
    let prev = null
    let current = this.head

    while (current) {
      if (current.priority < minNode.priority) {
        minNode = current
        minPrev = prev
      }
      prev = current
      current = current.sibling
    }

    if (minPrev) {
      minPrev.sibling = minNode.sibling
    } else {
      this.head = minNode.sibling
    }

    let child = minNode.child
    let reversed = null
    while (child) {
      const next = child.sibling
      child.parent = null
      child.sibling = reversed
      reversed = child
      child = next
    }

    const childHeap = new BinomialHeap()
    childHeap.head = reversed
    this.union(childHeap)
    this.nodeMap.delete(minNode.node)

    return { node: minNode.node, priority: minNode.priority }
  }

  decreaseKey(node, newPriority) {
    const heapNode = this.nodeMap.get(node)
    if (!heapNode) {
      this.insert(node, newPriority)
      return
    }
    if (newPriority >= heapNode.priority) return

    heapNode.priority = newPriority
    let current = heapNode
    let parent = current.parent

    while (parent && current.priority < parent.priority) {
      const currentData = { node: current.node, priority: current.priority }
      current.node = parent.node
      current.priority = parent.priority
      parent.node = currentData.node
      parent.priority = currentData.priority
      this.nodeMap.set(current.node, current)
      this.nodeMap.set(parent.node, parent)
      current = parent
      parent = current.parent
    }
  }

  union(otherHeap) {
    for (const [node, heapNode] of otherHeap.nodeMap.entries()) {
      this.nodeMap.set(node, heapNode)
    }

    this.head = this.mergeRootLists(this.head, otherHeap.head)
    if (!this.head) return

    let prev = null
    let curr = this.head
    let next = curr.sibling

    while (next) {
      const hasDifferentDegree = curr.degree !== next.degree
      const nextHasSameDegreeAsNextSibling =
        next.sibling && next.sibling.degree === curr.degree

      if (hasDifferentDegree || nextHasSameDegreeAsNextSibling) {
        prev = curr
        curr = next
      } else if (curr.priority <= next.priority) {
        curr.sibling = next.sibling
        this.linkTrees(next, curr)
      } else {
        if (!prev) {
          this.head = next
        } else {
          prev.sibling = next
        }
        this.linkTrees(curr, next)
        curr = next
      }
      next = curr.sibling
    }
  }

  mergeRootLists(headA, headB) {
    if (!headA) return headB
    if (!headB) return headA

    let mergedHead = null
    let tail = null
    let a = headA
    let b = headB

    while (a && b) {
      let selected
      if (a.degree <= b.degree) {
        selected = a
        a = a.sibling
      } else {
        selected = b
        b = b.sibling
      }

      if (!mergedHead) {
        mergedHead = selected
        tail = selected
      } else {
        tail.sibling = selected
        tail = selected
      }
    }

    tail.sibling = a || b
    return mergedHead
  }

  linkTrees(childTree, parentTree) {
    childTree.parent = parentTree
    childTree.sibling = parentTree.child
    parentTree.child = childTree
    parentTree.degree += 1
  }
}
