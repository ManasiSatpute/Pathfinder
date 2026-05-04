# Pathfinder

## Overview
Pathfinder is a visualization-based project that demonstrates how different data structures influence the performance of pathfinding algorithms in a maze environment. The project focuses on implementing **Dijkstra’s Shortest Path Algorithm** using multiple **priority queue structures** to study their efficiency in graph traversal problems.

The maze is represented as a **graph**, where each cell acts as a node and edges connect neighboring cells. The algorithm computes the shortest path from a start node to a target node while different heap implementations manage the priority queue operations.

## Motivation
Pathfinding algorithms are widely used in areas such as **robot navigation, GPS routing systems, network optimization, and game AI**. While Dijkstra’s algorithm guarantees the shortest path, its practical performance depends heavily on how efficiently the priority queue operations are implemented.

This project explores that relationship by comparing different heap structures in the same environment, helping understand how theoretical time complexity affects real-world performance.

## Features
- Maze represented as a graph structure
- Visualization of path traversal
- Implementation of Dijkstra’s shortest path algorithm
- Comparison of different priority queue implementations
- Interactive maze-based pathfinding environment

## Data Structures Implemented
The project experiments with multiple heap-based priority queues:

- **Binary Heap** – A simple and widely used priority queue implementation.
- **Binomial Heap** – Supports efficient heap merging operations.
- **Fibonacci Heap** – Provides improved amortized complexity for decrease-key operations.

These structures help analyze how different implementations affect the efficiency of Dijkstra’s algorithm.

## How It Works
1. A maze grid is generated and modeled as a graph.
2. Each cell acts as a node with connections to its neighboring nodes.
3. Dijkstra’s algorithm is applied to find the shortest path.
4. Priority queues implemented using different heap structures manage node selection.
5. The algorithm visualizes visited nodes and the final shortest path.

## Technologies Used
- **JavaScript**
- **HTML**
- **CSS**
- Graph algorithms and heap-based data structures

## Learning Outcomes
This project helps in understanding:

- Graph representations of real-world problems
- Implementation of shortest path algorithms
- Priority queue and heap data structures
- Performance differences between theoretical data structures

## Future Improvements
- Add additional algorithms such as **A\*** and **Bellman-Ford**
- Add performance benchmarking for different heaps
- Improve visualization and user interaction
- Add larger maze environments for testing

## Applications
Concepts demonstrated in this project are relevant to:

- Autonomous robot navigation
- GPS and route optimization
- Game AI pathfinding systems
- Network routing algorithms
