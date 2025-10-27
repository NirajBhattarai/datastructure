"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Plus, Minus } from "lucide-react";
import { generateRandomValue, sleep } from "@/lib/utils";

interface StackItem {
  id: string;
  value: number;
}

export default function StackVisualizer() {
  const [stack, setStack] = useState<StackItem[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [operation, setOperation] = useState<string>("");
  const [inputValue, setInputValue] = useState<number>(generateRandomValue());
  const stackRef = useRef<HTMLDivElement>(null);

  const push = async () => {
    if (isAnimating || stack.length >= 10) return;
    
    setIsAnimating(true);
    setOperation("Pushing...");
    
    const newItem: StackItem = {
      id: `item-${Date.now()}`,
      value: inputValue,
    };

    // Add item to stack with animation
    setStack(prev => [...prev, newItem]);
    
    await sleep(animationSpeed);
    
    setOperation("");
    setIsAnimating(false);
    setInputValue(generateRandomValue());
  };

  const pop = async () => {
    if (isAnimating || stack.length === 0) return;
    
    setIsAnimating(true);
    setOperation("Popping...");
    
    await sleep(animationSpeed / 2);
    
    // Remove last item from stack
    setStack(prev => prev.slice(0, -1));
    
    await sleep(animationSpeed / 2);
    
    setOperation("");
    setIsAnimating(false);
  };

  const clear = () => {
    if (isAnimating) return;
    setStack([]);
    setOperation("");
  };

  const reset = () => {
    if (isAnimating) return;
    setStack([]);
    setOperation("");
    setInputValue(generateRandomValue());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Stack Data Structure</h1>
          <p className="text-slate-600">LIFO (Last In, First Out) - Elements are added and removed from the top</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Operations</h2>
            
            {/* Input Value */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Value to Push
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                onClick={push}
                disabled={isAnimating || stack.length >= 10}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Push ({stack.length}/10)</span>
              </button>

              <button
                onClick={pop}
                disabled={isAnimating || stack.length === 0}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Minus className="w-5 h-5" />
                <span>Pop</span>
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
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
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
                className="mt-4 p-3 bg-blue-100 text-blue-800 rounded-lg text-center font-medium"
              >
                {operation}
              </motion.div>
            )}
          </div>

          {/* Stack Visualization */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Stack Visualization</h2>
            
            <div className="flex flex-col items-center space-y-4">
              {/* Stack Container */}
              <div
                ref={stackRef}
                className="w-32 h-96 border-2 border-dashed border-slate-300 rounded-lg flex flex-col-reverse justify-start items-center p-2 bg-slate-50"
              >
                <AnimatePresence>
                  {stack.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.8, y: 50 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1, 
                        y: 0,
                        transition: { delay: index * 0.1 }
                      }}
                      exit={{ 
                        opacity: 0, 
                        scale: 0.8, 
                        y: 50,
                        transition: { duration: 0.3 }
                      }}
                      whileHover={{ scale: 1.05 }}
                      className="w-24 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold shadow-lg mb-2 cursor-pointer"
                    >
                      {item.value}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Stack Info */}
              <div className="text-center space-y-2">
                <div className="text-sm text-slate-600">
                  Stack Size: <span className="font-semibold">{stack.length}</span>
                </div>
                <div className="text-sm text-slate-600">
                  Top Element: <span className="font-semibold">
                    {stack.length > 0 ? stack[stack.length - 1].value : "None"}
                  </span>
                </div>
                <div className="text-sm text-slate-600">
                  Status: <span className={`font-semibold ${
                    stack.length === 0 ? "text-red-600" : 
                    stack.length >= 10 ? "text-yellow-600" : "text-green-600"
                  }`}>
                    {stack.length === 0 ? "Empty" : 
                     stack.length >= 10 ? "Full" : "Available"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stack Properties */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Stack Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">LIFO</div>
              <div className="text-sm text-slate-600">Last In, First Out</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">O(1)</div>
              <div className="text-sm text-slate-600">Push/Pop Time</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">O(n)</div>
              <div className="text-sm text-slate-600">Space Complexity</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">Top</div>
              <div className="text-sm text-slate-600">Access Point</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
