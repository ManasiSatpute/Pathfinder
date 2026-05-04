class FibonacciNode {
  constructor(node, priority) {
    this.node = node
    this.priority = priority
    this.degree = 0
    this.marked = false
    this.parent = null
    this.child = null
    this.left = this
    this.right = this
  }
}

export default class FibonacciHeap {
  constructor() {
    this.min = null
    this.nodeCount = 0
    this.nodeMap = new Map()
  }

  isEmpty() {
    return this.min === null
  }

  insert(node, priority) {
    const existing = this.nodeMap.get(node)
    if (existing) {
      this.decreaseKey(node, priority)
      return
    }

    const fibNode = new FibonacciNode(node, priority)
    this.min = this.mergeLists(this.min, fibNode)
    this.nodeCount += 1
    this.nodeMap.set(node, fibNode)
  }

  extractMin() {
    const z = this.min
    if (!z) return null

    if (z.child) {
      const children = this.getCircularList(z.child)
      for (const child of children) {
        child.parent = null
        child.marked = false
      }
      this.min = this.mergeLists(this.min, z.child)
    }

    this.removeFromList(z)

    if (z === z.right) {
      this.min = null
    } else {
      this.min = z.right
      this.consolidate()
    }

    this.nodeCount -= 1
    this.nodeMap.delete(z.node)
    return { node: z.node, priority: z.priority }
  }

  decreaseKey(node, newPriority) {
    const x = this.nodeMap.get(node)
    if (!x) {
      this.insert(node, newPriority)
      return
    }
    if (newPriority >= x.priority) return

    x.priority = newPriority
    const y = x.parent
    if (y && x.priority < y.priority) {
      this.cut(x, y)
      this.cascadingCut(y)
    }
    if (!this.min || x.priority < this.min.priority) {
      this.min = x
    }
  }

  cut(x, y) {
    if (y.child === x) {
      y.child = x.right !== x ? x.right : null
    }
    y.degree -= 1
    this.removeFromList(x)
    x.parent = null
    x.marked = false
    x.left = x
    x.right = x
    this.min = this.mergeLists(this.min, x)
  }

  cascadingCut(y) {
    const z = y.parent
    if (!z) return

    if (!y.marked) {
      y.marked = true
    } else {
      this.cut(y, z)
      this.cascadingCut(z)
    }
  }

  consolidate() {
    const roots = this.getCircularList(this.min)
    const maxDegree = Math.ceil(Math.log2(this.nodeCount || 1)) + 5
    const degreeTable = new Array(maxDegree).fill(null)

    for (const root of roots) {
      let x = root
      let d = x.degree

      while (degreeTable[d]) {
        let y = degreeTable[d]
        if (x.priority > y.priority) {
          const temp = x
          x = y
          y = temp
        }
        this.link(y, x)
        degreeTable[d] = null
        d += 1
      }
      degreeTable[d] = x
    }

    this.min = null
    for (const node of degreeTable) {
      if (node) {
        node.left = node
        node.right = node
        this.min = this.mergeLists(this.min, node)
      }
    }
  }

  link(y, x) {
    this.removeFromList(y)
    y.parent = x
    y.marked = false
    y.left = y
    y.right = y
    x.child = this.mergeLists(x.child, y)
    x.degree += 1
  }

  mergeLists(a, b) {
    if (!a) return b
    if (!b) return a

    const aRight = a.right
    const bLeft = b.left

    a.right = b
    b.left = a
    aRight.left = bLeft
    bLeft.right = aRight

    return a.priority <= b.priority ? a : b
  }

  removeFromList(node) {
    node.left.right = node.right
    node.right.left = node.left
  }

  getCircularList(start) {
    if (!start) return []
    const list = []
    let current = start
    do {
      list.push(current)
      current = current.right
    } while (current !== start)
    return list
  }
}
