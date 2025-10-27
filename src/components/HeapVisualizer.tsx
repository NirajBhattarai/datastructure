"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, RotateCcw, ArrowUp, ArrowDown } from "lucide-react";
import { generateRandomValue, sleep } from "@/lib/utils";

interface HeapNode {
  id: string;
  value: number;
  index: number;
}

export default function HeapVisualizer() {
  const [heap, setHeap] = useState<HeapNode[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [operation, setOperation] = useState<string>("");
  const [inputValue, setInputValue] = useState<number>(generateRandomValue());
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);

  const createNode = (value: number, index: number): HeapNode => ({
    id: `node-${Date.now()}-${Math.random()}`,
    value,
    index,
  });

  const getParentIndex = (index: number): number => Math.floor((index - 1) / 2);
  const getLeftChildIndex = (index: number): number => 2 * index + 1;
  const getRightChildIndex = (index: number): number => 2 * index + 2;

  const heapifyUp = async (index: number, currentHeap: HeapNode[]) => {
    if (index === 0) return currentHeap;
    
    const parentIndex = getParentIndex(index);
    
    if (currentHeap[index] && currentHeap[parentIndex] && currentHeap[index].value > currentHeap[parentIndex].value) {
      // Highlight nodes being compared
      setHighlightedNodes([currentHeap[index].id, currentHeap[parentIndex].id]);
      await sleep(animationSpeed / 2);
      
      // Swap
      [currentHeap[index], currentHeap[parentIndex]] = [currentHeap[parentIndex], currentHeap[index]];
      currentHeap[index].index = index;
      currentHeap[parentIndex].index = parentIndex;
      
      setHeap([...currentHeap]);
      await sleep(animationSpeed / 2);
      
      setHighlightedNodes([]);
      return await heapifyUp(parentIndex, currentHeap);
    }
    
    return currentHeap;
  };

  const heapifyDown = async (index: number, currentHeap: HeapNode[]) => {
    const leftChildIndex = getLeftChildIndex(index);
    const rightChildIndex = getRightChildIndex(index);
    
    let largestIndex = index;
    
    if (leftChildIndex < currentHeap.length && currentHeap[leftChildIndex] && currentHeap[leftChildIndex].value > currentHeap[largestIndex].value) {
      largestIndex = leftChildIndex;
    }
    
    if (rightChildIndex < currentHeap.length && currentHeap[rightChildIndex] && currentHeap[rightChildIndex].value > currentHeap[largestIndex].value) {
      largestIndex = rightChildIndex;
    }
    
    if (largestIndex !== index) {
      // Highlight nodes being compared
      setHighlightedNodes([currentHeap[index].id, currentHeap[largestIndex].id]);
      await sleep(animationSpeed / 2);
      
      // Swap
      [currentHeap[index], currentHeap[largestIndex]] = [currentHeap[largestIndex], currentHeap[index]];
      currentHeap[index].index = index;
      currentHeap[largestIndex].index = largestIndex;
      
      setHeap([...currentHeap]);
      await sleep(animationSpeed / 2);
      
      setHighlightedNodes([]);
      await heapifyDown(largestIndex, currentHeap);
    }
  };

  const insert = async () => {
    if (isAnimating || heap.length >= 15) return;
    
    setIsAnimating(true);
    setOperation("Inserting and heapifying...");
    
    const newNode = createNode(inputValue, heap.length);
    const newHeap = [...heap, newNode];
    setHeap(newHeap);
    
    await sleep(animationSpeed / 2);
    
    await heapifyUp(heap.length, newHeap);
    
    setOperation("");
    setIsAnimating(false);
    setInputValue(generateRandomValue());
  };

  const extractMax = async () => {
    if (isAnimating || heap.length === 0) return;
    
    setIsAnimating(true);
    setOperation("Extracting max and heapifying...");
    
    const currentHeap = [...heap];
    const maxValue = currentHeap[0].value;
    
    // Move last element to root
    currentHeap[0] = currentHeap[currentHeap.length - 1];
    currentHeap[0].index = 0;
    currentHeap.pop();
    
    setHeap(currentHeap);
    await sleep(animationSpeed / 2);
    
    if (currentHeap.length > 0) {
      await heapifyDown(0, currentHeap);
    }
    
    setOperation(`Extracted max: ${maxValue}`);
    setTimeout(() => {
      setOperation("");
      setIsAnimating(false);
    }, 1000);
  };

  const clear = () => {
    if (isAnimating) return;
    setHeap([]);
    setOperation("");
    setHighlightedNodes([]);
  };

  const reset = () => {
    if (isAnimating) return;
    setHeap([]);
    setOperation("");
    setHighlightedNodes([]);
    setInputValue(generateRandomValue());
  };

  const buildHeap = async () => {
    if (isAnimating || heap.length === 0) return;
    
    setIsAnimating(true);
    setOperation("Building heap...");
    
    const currentHeap = [...heap];
    
    // Start from the last non-leaf node
    for (let i = Math.floor(currentHeap.length / 2) - 1; i >= 0; i--) {
      await heapifyDown(i, currentHeap);
    }
    
    setOperation("");
    setIsAnimating(false);
  };

  const renderHeapTree = () => {
    if (heap.length === 0) return null;

    const levels: HeapNode[][] = [];
    let currentLevel = 0;
    let nodesInLevel = 1;
    let currentIndex = 0;

    while (currentIndex < heap.length) {
      const levelNodes: HeapNode[] = [];
      for (let i = 0; i < nodesInLevel && currentIndex < heap.length; i++) {
        levelNodes.push(heap[currentIndex]);
        currentIndex++;
      }
      levels.push(levelNodes);
      currentLevel++;
      nodesInLevel *= 2;
    }

    return (
      <div className="flex flex-col items-center space-y-4">
        {levels.map((level, levelIndex) => (
          <div key={levelIndex} className="flex items-center space-x-4">
            {level.map((node, nodeIndex) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { delay: nodeIndex * 0.1 }
                }}
                className={`relative ${
                  highlightedNodes.includes(node.id) ? "ring-4 ring-yellow-400 ring-opacity-50" : ""
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold shadow-lg transition-all duration-300 ${
                  highlightedNodes.includes(node.id) 
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 scale-110" 
                    : "bg-gradient-to-r from-purple-500 to-purple-600"
                }`}>
                  {node.value}
                </div>
                
                {/* Connection lines */}
                {levelIndex < levels.length - 1 && (
                  <>
                    {/* Left child connection */}
                    {nodeIndex * 2 < levels[levelIndex + 1].length && (
                      <div className="absolute top-12 left-1/2 w-px h-8 bg-slate-300 transform -translate-x-1/2"></div>
                    )}
                    {/* Right child connection */}
                    {nodeIndex * 2 + 1 < levels[levelIndex + 1].length && (
                      <div className="absolute top-12 left-1/2 w-px h-8 bg-slate-300 transform -translate-x-1/2"></div>
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Max Heap Data Structure</h1>
          <p className="text-slate-600">Complete binary tree where parent nodes are greater than or equal to their children</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Operations</h2>
            
            {/* Input Value */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Value to Insert
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isAnimating}
                />
                <button
                  onClick={() => setInputValue(generateRandomValue())}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  disabled={isAnimating}
                >
                  Random
                </button>
              </div>
            </div>

            {/* Operation Buttons */}
            <div className="space-y-4">
              <button
                onClick={insert}
                disabled={isAnimating || heap.length >= 15}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Insert ({heap.length}/15)</span>
              </button>

              <button
                onClick={extractMax}
                disabled={isAnimating || heap.length === 0}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <ArrowUp className="w-5 h-5" />
                <span>Extract Max</span>
              </button>

              <button
                onClick={buildHeap}
                disabled={isAnimating || heap.length === 0}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <ArrowDown className="w-5 h-5" />
                <span>Build Heap</span>
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={clear}
                  disabled={isAnimating}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Clear</span>
                </button>
                
                <button
                  onClick={reset}
                  disabled={isAnimating}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Animation Speed Control */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Animation Speed: {animationSpeed}ms
              </label>
              <input
                type="range"
                min="200"
                max="2000"
                step="100"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                className="w-full"
                disabled={isAnimating}
              />
            </div>

            {/* Current Operation */}
            {operation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-3 bg-purple-100 text-purple-800 rounded-lg text-center font-medium"
              >
                {operation}
              </motion.div>
            )}
          </div>

          {/* Heap Visualization */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Heap Tree Visualization</h2>
            
            <div className="flex flex-col items-center space-y-6">
              {/* Heap Tree */}
              <div className="min-h-96 flex items-center justify-center">
                {renderHeapTree()}
              </div>

              {/* Heap Info */}
              <div className="text-center space-y-2">
                <div className="text-sm text-slate-600">
                  Heap Size: <span className="font-semibold">{heap.length}</span>
                </div>
                <div className="text-sm text-slate-600">
                  Max Element: <span className="font-semibold">
                    {heap.length > 0 ? heap[0].value : "None"}
                  </span>
                </div>
                <div className="text-sm text-slate-600">
                  Height: <span className="font-semibold">
                    {heap.length > 0 ? Math.floor(Math.log2(heap.length)) + 1 : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Heap Properties */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Heap Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">Max Heap</div>
              <div className="text-sm text-slate-600">Parent ≥ Children</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">O(log n)</div>
              <div className="text-sm text-slate-600">Insert/Extract</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">O(n)</div>
              <div className="text-sm text-slate-600">Build Heap</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">Complete</div>
              <div className="text-sm text-slate-600">Binary Tree</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
