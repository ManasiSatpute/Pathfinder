class BinaryHeap {
    constructor() {
        this.heap = [];
        this.nodeIndexMap = new Map(); // Fast lookup to find nodes for decreaseKey
        this.stats = { insert: 0, extractMin: 0, decreaseKey: 0 };
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    insert(id, dist) {
        this.stats.insert++;
        const node = { id, dist };
        this.heap.push(node);
        const index = this.heap.length - 1;
        this.nodeIndexMap.set(id, index);
        this._bubbleUp(index);
    }

    extractMin() {
        this.stats.extractMin++;
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) {
            const min = this.heap.pop();
            this.nodeIndexMap.delete(min.id);
            return { id: min.id, dist: min.dist }; // Ensure consistent object return matching other heaps
        }

        const min = { ...this.heap[0] };
        this.nodeIndexMap.delete(min.id);
        
        const end = this.heap.pop();
        this.heap[0] = end;
        this.nodeIndexMap.set(end.id, 0);
        this._sinkDown(0);

        return min;
    }

    decreaseKey(id, newDist) {
        this.stats.decreaseKey++;
        const index = this.nodeIndexMap.get(id);
        if (index === undefined) return;
        
        if (newDist >= this.heap[index].dist) return; // Should only decrease
        
        this.heap[index].dist = newDist;
        this._bubbleUp(index);
    }

    _bubbleUp(index) {
        let current = index;
        const element = this.heap[current];

        while (current > 0) {
            let parentIndex = Math.floor((current - 1) / 2);
            let parent = this.heap[parentIndex];

            if (element.dist >= parent.dist) break;

            // Swap
            this.heap[parentIndex] = element;
            this.heap[current] = parent;
            
            // Update map
            this.nodeIndexMap.set(element.id, parentIndex);
            this.nodeIndexMap.set(parent.id, current);

            current = parentIndex;
        }
    }

    _sinkDown(index) {
        let current = index;
        const length = this.heap.length;
        const element = this.heap[current];

        while (true) {
            let leftChildIdx = 2 * current + 1;
            let rightChildIdx = 2 * current + 2;
            let leftChild, rightChild;
            let swapIdx = null;

            if (leftChildIdx < length) {
                leftChild = this.heap[leftChildIdx];
                if (leftChild.dist < element.dist) {
                    swapIdx = leftChildIdx;
                }
            }

            if (rightChildIdx < length) {
                rightChild = this.heap[rightChildIdx];
                if (
                    (swapIdx === null && rightChild.dist < element.dist) || 
                    (swapIdx !== null && rightChild.dist < leftChild.dist)
                ) {
                    swapIdx = rightChildIdx;
                }
            }

            if (swapIdx === null) break;

            const swapNode = this.heap[swapIdx];
            this.heap[current] = swapNode;
            this.heap[swapIdx] = element;

            this.nodeIndexMap.set(swapNode.id, current);
            this.nodeIndexMap.set(element.id, swapIdx);

            current = swapIdx;
        }
    }
}
