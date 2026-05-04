import BinaryHeap from "../dataStructures/BinaryHeap";
import BinomialHeap from "../dataStructures/BinomialHeap";
import FibonacciHeap from "../dataStructures/FibonacciHeap";

export const createHeap = (type) => {
  switch (type) {
    case "binary":
      return new BinaryHeap();
    case "binomial":
      return new BinomialHeap();
    case "fibonacci":
      return new FibonacciHeap();
    default:
      return new BinaryHeap();
  }
};