"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Search, RotateCcw, ArrowRight } from "lucide-react";
import { generateRandomValue, sleep } from "@/lib/utils";

interface ListNode {
  id: string;
  value: number;
  next: ListNode | null;
}

export default function LinkedListVisualizer() {
  const [head, setHead] = useState<ListNode | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [operation, setOperation] = useState<string>("");
  const [inputValue, setInputValue] = useState<number>(generateRandomValue());
  const [searchValue, setSearchValue] = useState<number>(generateRandomValue());
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);

  const createNode = (value: number): ListNode => ({
    id: `node-${Date.now()}-${Math.random()}`,
    value,
    next: null,
  });

  const insertAtBeginning = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setOperation("Inserting at beginning...");
    
    const newNode = createNode(inputValue);
    
    await sleep(animationSpeed / 2);
    
    setHead(prev => {
      newNode.next = prev;
      return newNode;
    });
    
    await sleep(animationSpeed / 2);
    
    setOperation("");
    setIsAnimating(false);
    setInputValue(generateRandomValue());
  };

  const insertAtEnd = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setOperation("Inserting at end...");
    
    const newNode = createNode(inputValue);
    
    if (!head) {
      setHead(newNode);
    } else {
      let current = head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    
    await sleep(animationSpeed);
    
    setOperation("");
    setIsAnimating(false);
    setInputValue(generateRandomValue());
  };

  const deleteNode = async (value: number) => {
    if (isAnimating || !head) return;
    
    setIsAnimating(true);
    setOperation(`Deleting node with value ${value}...`);
    
    await sleep(animationSpeed / 2);
    
    if (head.value === value) {
      setHead(head.next);
    } else {
      let current = head;
      while (current.next && current.next.value !== value) {
        current = current.next;
      }
      if (current.next) {
        current.next = current.next.next;
      }
    }
    
    await sleep(animationSpeed / 2);
    
    setOperation("");
    setIsAnimating(false);
  };

  const searchNode = async (value: number) => {
    if (isAnimating || !head) return;
    
    setIsAnimating(true);
    setOperation(`Searching for ${value}...`);
    setHighlightedNode(null);
    
    let current = head;
    let found = false;
    
    while (current) {
      setHighlightedNode(current.id);
      await sleep(animationSpeed / 2);
      
      if (current.value === value) {
        found = true;
        break;
      }
      
      current = current.next;
    }
    
    await sleep(animationSpeed);
    
    setOperation(found ? `Found ${value}!` : `${value} not found`);
    setHighlightedNode(null);
    
    setTimeout(() => {
      setOperation("");
      setIsAnimating(false);
    }, 1000);
  };

  const clear = () => {
    if (isAnimating) return;
    setHead(null);
    setOperation("");
    setHighlightedNode(null);
  };

  const reset = () => {
    if (isAnimating) return;
    setHead(null);
    setOperation("");
    setHighlightedNode(null);
    setInputValue(generateRandomValue());
    setSearchValue(generateRandomValue());
  };

  const getListAsArray = (): ListNode[] => {
    const result: ListNode[] = [];
    let current = head;
    while (current) {
      result.push(current);
      current = current.next;
    }
    return result;
  };

  const listArray = getListAsArray();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Linked List Data Structure</h1>
          <p className="text-slate-600">Linear data structure where elements are stored in nodes with pointers</p>
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
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

            {/* Search Value */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Value to Search/Delete
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={searchValue}
                  onChange={(e) => setSearchValue(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={isAnimating}
                />
                <button
                  onClick={() => setSearchValue(generateRandomValue())}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  disabled={isAnimating}
                >
                  Random
                </button>
              </div>
            </div>

            {/* Operation Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={insertAtBeginning}
                  disabled={isAnimating}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Insert Start</span>
                </button>

                <button
                  onClick={insertAtEnd}
                  disabled={isAnimating}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Insert End</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => searchNode(searchValue)}
                  disabled={isAnimating || !head}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>

                <button
                  onClick={() => deleteNode(searchValue)}
                  disabled={isAnimating || !head}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>

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
                className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center font-medium"
              >
                {operation}
              </motion.div>
            )}
          </div>

          {/* Linked List Visualization */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Linked List Visualization</h2>
            
            <div className="flex flex-col items-center space-y-6">
              {/* Head Pointer */}
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-slate-600">Head:</div>
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  {head ? "→" : "∅"}
                </div>
              </div>

              {/* Linked List Nodes */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <AnimatePresence>
                  {listArray.map((node, index) => (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, scale: 0.8, x: -50 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1, 
                        x: 0,
                        transition: { delay: index * 0.1 }
                      }}
                      exit={{ 
                        opacity: 0, 
                        scale: 0.8, 
                        x: 50,
                        transition: { duration: 0.3 }
                      }}
                      className={`flex items-center space-x-2 ${
                        highlightedNode === node.id ? "ring-4 ring-yellow-400 ring-opacity-50" : ""
                      }`}
                    >
                      {/* Node */}
                      <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-white font-semibold shadow-lg transition-all duration-300 ${
                        highlightedNode === node.id 
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-600 scale-110" 
                          : "bg-gradient-to-r from-green-500 to-green-600"
                      }`}>
                        {node.value}
                      </div>
                      
                      {/* Arrow (except for last node) */}
                      {index < listArray.length - 1 && (
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="text-slate-400"
                        >
                          <ArrowRight className="w-6 h-6" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* List Info */}
              <div className="text-center space-y-2">
                <div className="text-sm text-slate-600">
                  List Length: <span className="font-semibold">{listArray.length}</span>
                </div>
                <div className="text-sm text-slate-600">
                  First Node: <span className="font-semibold">
                    {listArray.length > 0 ? listArray[0].value : "None"}
                  </span>
                </div>
                <div className="text-sm text-slate-600">
                  Last Node: <span className="font-semibold">
                    {listArray.length > 0 ? listArray[listArray.length - 1].value : "None"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Linked List Properties */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Linked List Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">Dynamic</div>
              <div className="text-sm text-slate-600">Size can change</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">O(1)</div>
              <div className="text-sm text-slate-600">Insertion at start</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">O(n)</div>
              <div className="text-sm text-slate-600">Search/Delete</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">Sequential</div>
              <div className="text-sm text-slate-600">Access pattern</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
