export default class BinaryHeap {
  constructor() {
    this.heap = []
    this.nodeIndexMap = new Map()
  }

  insert(node, priority) {
    if (this.nodeIndexMap.has(node)) {
      this.decreaseKey(node, priority)
      return
    }

    this.heap.push({ node, priority })
    const index = this.heap.length - 1
    this.nodeIndexMap.set(node, index)
    this.bubbleUp(index)
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2)
      if (this.heap[parent].priority <= this.heap[index].priority) break
      this.swap(parent, index)
      index = parent
    }
  }

  extractMin() {
    if (this.heap.length === 0) return null
    if (this.heap.length === 1) {
      const min = this.heap.pop()
      this.nodeIndexMap.delete(min.node)
      return min
    }

    const min = this.heap[0]
    const last = this.heap.pop()
    this.nodeIndexMap.delete(min.node)
    this.heap[0] = last
    this.nodeIndexMap.set(last.node, 0)
    this.bubbleDown(0)
    return min
  }

  decreaseKey(node, newPriority) {
    const index = this.nodeIndexMap.get(node)
    if (index === undefined) {
      this.insert(node, newPriority)
      return
    }
    if (newPriority >= this.heap[index].priority) return

    this.heap[index].priority = newPriority
    this.bubbleUp(index)
  }

  bubbleDown(index) {
    const length = this.heap.length

    while (true) {
      const left = 2 * index + 1
      const right = 2 * index + 2
      let smallest = index

      if (left < length && this.heap[left].priority < this.heap[smallest].priority)
        smallest = left

      if (right < length && this.heap[right].priority < this.heap[smallest].priority)
        smallest = right

      if (smallest === index) break

      this.swap(index, smallest)
      index = smallest
    }
  }

  swap(i, j) {
    const temp = this.heap[i]
    this.heap[i] = this.heap[j]
    this.heap[j] = temp
    this.nodeIndexMap.set(this.heap[i].node, i)
    this.nodeIndexMap.set(this.heap[j].node, j)
  }

  isEmpty() {
    return this.heap.length === 0
  }
}