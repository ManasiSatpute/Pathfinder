class FibonacciNode {
    constructor(id, dist) {
        this.id = id;
        this.dist = dist;
        this.degree = 0;
        this.parent = null;
        this.child = null;
        this.left = this;
        this.right = this;
        this.marked = false;
    }
}

class FibonacciHeap {
    constructor() {
        this.minNode = null;
        this.nodeCount = 0;
        this.nodeMap = new Map();
        this.stats = { insert: 0, extractMin: 0, decreaseKey: 0 };
    }

    isEmpty() {
        return this.minNode === null;
    }

    insert(id, dist) {
        this.stats.insert++;
        const node = new FibonacciNode(id, dist);
        this.nodeMap.set(id, node);

        if (this.minNode) {
            // Add node to root list right before the min node
            node.left = this.minNode;
            node.right = this.minNode.right;
            this.minNode.right.left = node;
            this.minNode.right = node;

            if (node.dist < this.minNode.dist) {
                this.minNode = node;
            }
        } else {
            this.minNode = node;
        }

        this.nodeCount++;
    }

    extractMin() {
        this.stats.extractMin++;
        let z = this.minNode;
        if (z !== null) {
            let x = z.child;
            if (x !== null) {
                let current = x;
                let children = [];
                // Collect all children securely before modifying their pointers
                do {
                    children.push(current);
                    current = current.right;
                } while (current !== x);

                for (let child of children) {
                    // Add child to root list
                    child.left = this.minNode;
                    child.right = this.minNode.right;
                    this.minNode.right.left = child;
                    this.minNode.right = child;
                    child.parent = null;
                }
            }

            // Remove z from root list
            z.left.right = z.right;
            z.right.left = z.left;

            if (z === z.right) {
                this.minNode = null;
            } else {
                this.minNode = z.right;
                this._consolidate();
            }

            this.nodeCount--;
            this.nodeMap.delete(z.id);
            return { id: z.id, dist: z.dist };
        }
        return null;
    }

    decreaseKey(id, newDist) {
        this.stats.decreaseKey++;
        let x = this.nodeMap.get(id);
        if (!x || newDist >= x.dist) return;

        x.dist = newDist;
        let y = x.parent;

        if (y !== null && x.dist < y.dist) {
            this._cut(x, y);
            this._cascadingCut(y);
        }

        if (x.dist < this.minNode.dist) {
            this.minNode = x;
        }
    }

    _consolidate() {
        let maxDegree = Math.floor(Math.log2(this.nodeCount) * 2) + 2; // Approximation bound
        let A = new Array(maxDegree).fill(null);

        let roots = [];
        let x = this.minNode;
        if (x !== null) {
            do {
                roots.push(x);
                x = x.right;
            } while (x !== this.minNode);
        }

        for (let root of roots) {
            let w = root;
            let d = w.degree;

            while (A[d] !== null) {
                let y = A[d]; // another node with the same degree
                // Ensure w has the smaller key
                if (w.dist > y.dist) {
                    let temp = w;
                    w = y;
                    y = temp;
                }
                this._link(y, w);
                A[d] = null;
                d++;
            }
            A[d] = w;
        }

        // Reconstruct the root list
        this.minNode = null;
        for (let i = 0; i < A.length; i++) {
            if (A[i] !== null) {
                if (this.minNode === null) {
                    this.minNode = A[i];
                    this.minNode.left = this.minNode;
                    this.minNode.right = this.minNode;
                } else {
                    A[i].left = this.minNode;
                    A[i].right = this.minNode.right;
                    this.minNode.right.left = A[i];
                    this.minNode.right = A[i];
                    if (A[i].dist < this.minNode.dist) {
                        this.minNode = A[i];
                    }
                }
            }
        }
    }

    _link(y, x) {
        // remove y from root list
        y.left.right = y.right;
        y.right.left = y.left;

        // make y a child of x
        y.parent = x;
        if (x.child === null) {
            x.child = y;
            y.right = y;
            y.left = y;
        } else {
            y.left = x.child;
            y.right = x.child.right;
            x.child.right.left = y;
            x.child.right = y;
        }
        x.degree++;
        y.marked = false;
    }

    _cut(x, y) {
        // remove x from child list of y
        if (x.right === x) {
            y.child = null; // Only child
        } else {
            x.left.right = x.right;
            x.right.left = x.left;
            if (y.child === x) {
                y.child = x.right;
            }
        }
        y.degree--;

        // add x to root list
        x.left = this.minNode;
        x.right = this.minNode.right;
        this.minNode.right.left = x;
        this.minNode.right = x;

        x.parent = null;
        x.marked = false;
    }

    _cascadingCut(y) {
        let z = y.parent;
        if (z !== null) {
            if (y.marked === false) {
                y.marked = true;
            } else {
                this._cut(y, z);
                this._cascadingCut(z); // recursive cut
            }
        }
    }
}
