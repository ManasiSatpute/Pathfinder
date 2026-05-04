class BinomialNode {
    constructor(id, dist) {
        this.id = id;
        this.dist = dist;
        this.degree = 0;
        this.parent = null;
        this.child = null;
        this.sibling = null;
    }
}

class BinomialHeap {
    constructor() {
        this.head = null;
        this.nodeMap = new Map();
        this.stats = { insert: 0, extractMin: 0, decreaseKey: 0 };
    }

    isEmpty() {
        return this.head === null;
    }

    insert(id, dist) {
        this.stats.insert++;
        const node = new BinomialNode(id, dist);
        this.nodeMap.set(id, node);
        
        const tempHeap = new BinomialHeap();
        tempHeap.head = node;
        this._union(tempHeap);
    }

    extractMin() {
        this.stats.extractMin++;
        if (this.head === null) return null;

        let minNode = this.head;
        let minPrev = null;
        let curr = minNode.sibling;
        let prev = minNode;

        // Find the root with the minimum key
        while (curr !== null) {
            if (curr.dist < minNode.dist) {
                minNode = curr;
                minPrev = prev;
            }
            prev = curr;
            curr = curr.sibling;
        }

        // Remove the min node from the root list
        if (minPrev === null && minNode.sibling === null) {
            this.head = null;
        } else if (minPrev === null) {
            this.head = minNode.sibling;
        } else {
            minPrev.sibling = minNode.sibling;
        }

        // Add min node's children back to the heap
        let child = minNode.child;
        let revChild = null;

        // Reverse the child list because degree increases sequentially in the original child list
        while (child !== null) {
            let next = child.sibling;
            child.sibling = revChild;
            child.parent = null;
            revChild = child;
            child = next;
        }

        let tempHeap = new BinomialHeap();
        tempHeap.head = revChild;
        this._union(tempHeap);

        this.nodeMap.delete(minNode.id);
        return { id: minNode.id, dist: minNode.dist };
    }

    decreaseKey(id, newDist) {
        this.stats.decreaseKey++;
        let node = this.nodeMap.get(id);
        if (!node || newDist >= node.dist) return;

        node.dist = newDist;
        let current = node;
        let parent = current.parent;

        // Bubble up
        while (parent !== null && current.dist < parent.dist) {
            // Swap distances and IDs
            let tempDist = current.dist;
            let tempId = current.id;
            
            current.dist = parent.dist;
            current.id = parent.id;
            
            parent.dist = tempDist;
            parent.id = tempId;

            // Update map references after swap
            this.nodeMap.set(current.id, current);
            this.nodeMap.set(parent.id, parent);

            current = parent;
            parent = current.parent;
        }
    }

    _union(otherHeap) {
        let newHead = this._mergeRootLists(this, otherHeap);
        this.head = null;
        otherHeap.head = null;

        if (newHead === null) return;

        let prevX = null;
        let x = newHead;
        let nextX = x.sibling;

        while (nextX !== null) {
            if ((x.degree !== nextX.degree) || 
                (nextX.sibling !== null && nextX.sibling.degree === x.degree)) {
                prevX = x;
                x = nextX;
            } else {
                if (x.dist <= nextX.dist) {
                    x.sibling = nextX.sibling;
                    this._linkTree(nextX, x);
                } else {
                    if (prevX === null) {
                        newHead = nextX;
                    } else {
                        prevX.sibling = nextX;
                    }
                    this._linkTree(x, nextX);
                    x = nextX;
                }
            }
            nextX = x.sibling;
        }
        this.head = newHead;
    }

    _mergeRootLists(heap1, heap2) {
        let a = heap1.head;
        let b = heap2.head;
        let newHead = null;
        let tail = null;

        if (!a) return b;
        if (!b) return a;

        if (a.degree <= b.degree) {
            newHead = a;
            a = a.sibling;
        } else {
            newHead = b;
            b = b.sibling;
        }

        tail = newHead;

        while (a !== null && b !== null) {
            if (a.degree <= b.degree) {
                tail.sibling = a;
                a = a.sibling;
            } else {
                tail.sibling = b;
                b = b.sibling;
            }
            tail = tail.sibling;
        }

        if (a !== null) tail.sibling = a;
        if (b !== null) tail.sibling = b;

        return newHead;
    }

    _linkTree(minNodeChild, minNodeRoot) {
        minNodeChild.parent = minNodeRoot;
        minNodeChild.sibling = minNodeRoot.child;
        minNodeRoot.child = minNodeChild;
        minNodeRoot.degree++;
    }
}
