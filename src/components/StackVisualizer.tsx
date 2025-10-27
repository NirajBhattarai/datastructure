"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Minus, 
  Eye, 
  Settings, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Clock,
  Target,
  BookOpen,
  Coffee,
  Utensils,
  Shirt,
  Gamepad2,
  Lightbulb,
  Users,
  Home
} from "lucide-react";
import { generateRandomValue, sleep } from "@/lib/utils";

interface StackItem {
  id: string;
  value: number;
  timestamp: number;
  realLifeItem?: string;
}

interface OperationLog {
  id: string;
  operation: string;
  value?: number;
  timestamp: number;
  success: boolean;
  message: string;
}

interface RealLifeExample {
  id: string;
  title: string;
  description: string;
  icon: any;
  items: string[];
  color: string;
  bgColor: string;
  explanation: string;
}

const realLifeExamples: RealLifeExample[] = [
  {
    id: "clothes",
    title: "Wardrobe Drawer",
    description: "Clothes folded in a drawer",
    icon: Shirt,
    items: ["T-Shirt", "Jeans", "Sweater", "Jacket", "Hat", "Socks", "Underwear", "Pajamas"],
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
    explanation: "Clothes folded in a drawer. You typically wear the top item first or add clean clothes to the top. Bottom clothes are harder to reach until you remove the ones above."
  },
  {
    id: "pancakes",
    title: "Breakfast Table",
    description: "Stack of pancakes on plate",
    icon: Coffee,
    items: ["Top Pancake", "Second Pancake", "Third Pancake", "Fourth Pancake", "Bottom Pancake", "Extra Pancake", "Syrup Pancake", "Butter Pancake"],
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50",
    explanation: "Pancakes served in a delicious stack. You eat from the top down, and the chef adds new pancakes to the top of the stack. The bottom pancake is the last to be eaten."
  }
];

export default function StackVisualizer() {
  const [stack, setStack] = useState<StackItem[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [operation, setOperation] = useState<string>("");
  const [inputValue, setInputValue] = useState<number>(generateRandomValue());
  const [operationLogs, setOperationLogs] = useState<OperationLog[]>([]);
  const [stackCapacity, setStackCapacity] = useState(10);
  const [showSettings, setShowSettings] = useState(false);
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);
  const [autoMode, setAutoMode] = useState(false);
  const [autoInterval, setAutoInterval] = useState<NodeJS.Timeout | null>(null);
  const [selectedExample, setSelectedExample] = useState<RealLifeExample>(realLifeExamples[0]);
  const [showRealLifeMode, setShowRealLifeMode] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const stackRef = useRef<HTMLDivElement>(null);

  // Auto mode functionality
  useEffect(() => {
    if (autoMode && !isAnimating) {
      const interval = setInterval(() => {
        const operations = ['push', 'pop'];
        const randomOp = operations[Math.floor(Math.random() * operations.length)];
        
        if (randomOp === 'push' && stack.length < stackCapacity) {
          push();
        } else if (randomOp === 'pop' && stack.length > 0) {
          pop();
        }
      }, 2000);
      
      setAutoInterval(interval);
    } else {
      if (autoInterval) {
        clearInterval(autoInterval);
        setAutoInterval(null);
      }
    }
    
    return () => {
      if (autoInterval) {
        clearInterval(autoInterval);
      }
    };
  }, [autoMode, isAnimating, stack.length, stackCapacity]);

  const addOperationLog = (operation: string, value?: number, success: boolean = true, message: string = "") => {
    const log: OperationLog = {
      id: `log-${Date.now()}`,
      operation,
      value,
      timestamp: Date.now(),
      success,
      message: message || `${operation} operation ${success ? 'completed' : 'failed'}`
    };
    setOperationLogs(prev => [log, ...prev.slice(0, 9)]); // Keep last 10 logs
  };

  const push = async () => {
    if (isAnimating || stack.length >= stackCapacity) {
      addOperationLog('push', inputValue, false, stack.length >= stackCapacity ? 'Stack overflow!' : 'Animation in progress');
      return;
    }
    
    setIsAnimating(true);
    setOperation(showRealLifeMode ? `Adding ${selectedExample.items[currentItemIndex]}...` : "Pushing element...");
    setHighlightedItem(null);
    
    const newItem: StackItem = {
      id: `item-${Date.now()}`,
      value: showRealLifeMode ? currentItemIndex + 1 : inputValue,
      timestamp: Date.now(),
      realLifeItem: showRealLifeMode ? selectedExample.items[currentItemIndex] : undefined,
    };

    // Add item to stack with animation
    setStack(prev => [...prev, newItem]);
    const message = showRealLifeMode 
      ? `Added ${selectedExample.items[currentItemIndex]} to the stack`
      : `Pushed ${inputValue} onto stack`;
    addOperationLog('push', showRealLifeMode ? currentItemIndex + 1 : inputValue, true, message);
    
    await sleep(animationSpeed);
    
    setOperation("");
    setIsAnimating(false);
    if (showRealLifeMode) {
      setCurrentItemIndex(prev => (prev + 1) % selectedExample.items.length);
    } else {
      setInputValue(generateRandomValue());
    }
  };

  const pop = async () => {
    if (isAnimating || stack.length === 0) {
      addOperationLog('pop', undefined, false, stack.length === 0 ? 'Stack underflow!' : 'Animation in progress');
      return;
    }
    
    setIsAnimating(true);
    const topItem = stack[stack.length - 1];
    setOperation(showRealLifeMode ? `Removing ${topItem.realLifeItem || 'item'}...` : "Popping element...");
    
    setHighlightedItem(topItem.id);
    
    await sleep(animationSpeed / 2);
    
    // Remove last item from stack
    setStack(prev => prev.slice(0, -1));
    const message = showRealLifeMode 
      ? `Removed ${topItem.realLifeItem || 'item'} from the stack`
      : `Popped ${topItem.value} from stack`;
    addOperationLog('pop', topItem.value, true, message);
    
    await sleep(animationSpeed / 2);
    
    setOperation("");
    setIsAnimating(false);
    setHighlightedItem(null);
  };

  const peek = async () => {
    if (isAnimating || stack.length === 0) {
      addOperationLog('peek', undefined, false, stack.length === 0 ? 'Stack is empty!' : 'Animation in progress');
      return;
    }
    
    setIsAnimating(true);
    setOperation("Peeking at top element...");
    
    const topItem = stack[stack.length - 1];
    setHighlightedItem(topItem.id);
    
    await sleep(animationSpeed);
    
    addOperationLog('peek', topItem.value, true, `Top element is ${topItem.value}`);
    
    setOperation("");
    setIsAnimating(false);
    setHighlightedItem(null);
  };

  const clear = () => {
    if (isAnimating) return;
    setStack([]);
    setOperation("");
    setHighlightedItem(null);
    addOperationLog('clear', undefined, true, 'Stack cleared');
  };

  const reset = () => {
    if (isAnimating) return;
    setStack([]);
    setOperation("");
    setHighlightedItem(null);
    setOperationLogs([]);
    setInputValue(generateRandomValue());
    addOperationLog('reset', undefined, true, 'Visualizer reset');
  };

  const getStackStatus = () => {
    if (stack.length === 0) return { status: 'Empty', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (stack.length >= stackCapacity) return { status: 'Full', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    if (stack.length >= stackCapacity * 0.8) return { status: 'Near Full', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    return { status: 'Available', color: 'text-green-600', bgColor: 'bg-green-50' };
  };

  const stackStatus = getStackStatus();

  // Environment helper functions
  const getEnvironmentBackground = (exampleId: string) => {
    switch (exampleId) {
      case 'clothes':
        return 'bg-gradient-to-b from-emerald-100 via-teal-50 to-emerald-200'; // Wardrobe drawer
      case 'pancakes':
        return 'bg-gradient-to-b from-amber-100 via-yellow-50 to-orange-200'; // Breakfast table
      default:
        return 'bg-gradient-to-b from-slate-50 to-slate-100';
    }
  };

  const getEnvironmentLabel = (exampleId: string) => {
    switch (exampleId) {
      case 'clothes':
        return 'DRAWER';
      case 'pancakes':
        return 'PLATE';
      default:
        return 'TOP';
    }
  };

  const renderEnvironmentDecorations = (exampleId: string) => {
    switch (exampleId) {
      case 'clothes':
        return (
          <>
            {/* Wardrobe drawer decorations */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-emerald-300 opacity-40 rounded-b-2xl"></div>
            <div className="absolute top-8 left-2 w-3 h-3 bg-emerald-400 rounded-full opacity-30"></div>
            <div className="absolute top-16 right-2 w-2 h-2 bg-teal-500 rounded-full opacity-30"></div>
            <div className="absolute top-24 left-4 w-2 h-2 bg-emerald-500 rounded-full opacity-20"></div>
            {/* Drawer handle */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-emerald-600 rounded-full opacity-60"></div>
          </>
        );
      case 'pancakes':
        return (
          <>
            {/* Breakfast table decorations */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-amber-300 opacity-40 rounded-b-2xl"></div>
            <div className="absolute top-6 left-3 w-3 h-3 bg-amber-400 rounded-full opacity-30"></div>
            <div className="absolute top-12 right-3 w-2 h-2 bg-orange-500 rounded-full opacity-30"></div>
            <div className="absolute top-20 left-5 w-2 h-2 bg-yellow-500 rounded-full opacity-20"></div>
            {/* Plate edge */}
            <div className="absolute bottom-1 left-2 right-2 h-1 bg-amber-600 rounded-full opacity-50"></div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-blue-200/50 rounded-full px-4 py-2 mb-4 shadow-sm"
          >
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Interactive Stack Visualizer</span>
          </motion.div>
          
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Stack Data Structure</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            LIFO (Last In, First Out) - Experience stack operations with real-time animations and detailed logs
          </p>
        </div>

        {/* Real-Life Examples Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Real-Life Examples</h2>
                <p className="text-slate-600">Choose a real-world scenario to understand how stacks work</p>
              </div>
              <button
                onClick={() => setShowRealLifeMode(!showRealLifeMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showRealLifeMode ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showRealLifeMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {realLifeExamples.map((example, index) => {
                const Icon = example.icon;
                return (
                  <motion.button
                    key={example.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => {
                      setSelectedExample(example);
                      setCurrentItemIndex(0);
                      setStack([]);
                      setOperationLogs([]);
                    }}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                      selectedExample.id === example.id
                        ? 'border-blue-500 bg-blue-50 shadow-xl scale-105'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${example.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{example.title}</h3>
                        <p className="text-slate-600 mb-3">{example.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {example.items.slice(0, 3).map((item, itemIndex) => (
                            <span
                              key={itemIndex}
                              className="px-2 py-1 bg-white/60 rounded-lg text-xs font-medium text-slate-600"
                            >
                              {item}
                            </span>
                          ))}
                          {example.items.length > 3 && (
                            <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-500">
                              +{example.items.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {showRealLifeMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 pt-6 border-t border-slate-200"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${selectedExample.color} flex items-center justify-center flex-shrink-0`}>
                    {React.createElement(selectedExample.icon, { className: "w-8 h-8 text-white" })}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{selectedExample.title}</h3>
                    <p className="text-slate-600 mb-4">{selectedExample.explanation}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedExample.items.map((item, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            index === currentItemIndex
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Enhanced Controls Panel */}
          <div className="xl:col-span-1 space-y-6">
            {/* Main Operations */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Operations</h2>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              
              {/* Input Value */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {showRealLifeMode ? 'Next Item to Add' : 'Value to Push'}
                </label>
                {showRealLifeMode ? (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${selectedExample.color} flex items-center justify-center`}>
                        {React.createElement(selectedExample.icon, { className: "w-4 h-4 text-white" })}
                      </div>
                      <span className="font-medium text-slate-900">
                        {selectedExample.items[currentItemIndex]}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(Number(e.target.value))}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={isAnimating}
                    />
                    <button
                      onClick={() => setInputValue(generateRandomValue())}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      disabled={isAnimating}
                    >
                      <Zap className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Operation Buttons */}
              <div className="space-y-3">
                <button
                  onClick={push}
                  disabled={isAnimating || stack.length >= stackCapacity}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  <span>{showRealLifeMode ? 'Add Item' : 'Push'} ({stack.length}/{stackCapacity})</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={pop}
                    disabled={isAnimating || stack.length === 0}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Minus className="w-4 h-4" />
                    <span>{showRealLifeMode ? 'Remove' : 'Pop'}</span>
                  </button>

                  <button
                    onClick={peek}
                    disabled={isAnimating || stack.length === 0}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{showRealLifeMode ? 'Look' : 'Peek'}</span>
                  </button>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={clear}
                    disabled={isAnimating}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                  
                  <button
                    onClick={reset}
                    disabled={isAnimating}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Auto Mode Toggle */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700">Auto Mode</h3>
                    <p className="text-xs text-slate-500">Automatically perform operations</p>
                  </div>
                  <button
                    onClick={() => setAutoMode(!autoMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoMode ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50"
                >
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Stack Capacity: {stackCapacity}
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="20"
                        value={stackCapacity}
                        onChange={(e) => setStackCapacity(Number(e.target.value))}
                        className="w-full"
                        disabled={isAnimating}
                      />
                    </div>

                    <div>
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stack Status */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Stack Status</h3>
              
              <div className="space-y-4">
                <div className={`p-3 rounded-lg ${stackStatus.bgColor}`}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${stackStatus.color.replace('text-', 'bg-')}`} />
                    <span className={`font-semibold ${stackStatus.color}`}>
                      {stackStatus.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Size:</span>
                    <span className="font-semibold">{stack.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Capacity:</span>
                    <span className="font-semibold">{stackCapacity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Top Element:</span>
                    <span className="font-semibold">
                      {stack.length > 0 ? stack[stack.length - 1].value : "None"}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Usage</span>
                    <span>{Math.round((stack.length / stackCapacity) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        stack.length >= stackCapacity ? 'bg-red-500' :
                        stack.length >= stackCapacity * 0.8 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(stack.length / stackCapacity) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stack Visualization */}
          <div className="xl:col-span-2 space-y-6">
            {/* Stack Container */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">
                  {showRealLifeMode ? `${selectedExample.title} Visualization` : 'Stack Visualization'}
                </h2>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>Real-time</span>
                </div>
              </div>

              {/* Contextual Environment Description */}
              {showRealLifeMode && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${selectedExample.color} flex items-center justify-center flex-shrink-0`}>
                      {React.createElement(selectedExample.icon, { className: "w-5 h-5 text-white" })}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{selectedExample.title}</h3>
                      <p className="text-sm text-slate-600">{selectedExample.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div className="flex flex-col items-center space-y-6">
                {/* Stack Container */}
                <div
                  ref={stackRef}
                  className={`w-40 h-96 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col-reverse justify-start items-center p-4 relative overflow-hidden ${
                    showRealLifeMode ? getEnvironmentBackground(selectedExample.id) : 'bg-gradient-to-b from-slate-50 to-slate-100'
                  }`}
                >
                  {/* Environment-specific decorations */}
                  {showRealLifeMode && renderEnvironmentDecorations(selectedExample.id)}
                  
                  {/* Stack Label */}
                  <div className="absolute top-2 left-2 text-xs font-semibold text-slate-500">
                    {showRealLifeMode ? getEnvironmentLabel(selectedExample.id) : 'TOP'}
                  </div>
                  
                  <AnimatePresence>
                    {stack.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: -90 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1, 
                          y: 0,
                          rotateX: 0,
                          transition: { 
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                          }
                        }}
                        exit={{ 
                          opacity: 0, 
                          scale: 0.8, 
                          y: 50,
                          rotateX: 90,
                          transition: { duration: 0.3 }
                        }}
                        whileHover={{ scale: 1.05, rotateY: 5 }}
                        className={`w-40 h-16 rounded-xl flex items-center justify-center text-white font-bold shadow-lg mb-2 cursor-pointer transition-all duration-300 relative ${
                          highlightedItem === item.id 
                            ? 'ring-4 ring-yellow-400 ring-opacity-50 scale-110' 
                            : ''
                        } ${
                          index === stack.length - 1 
                            ? `bg-gradient-to-r ${selectedExample.color}` 
                            : 'bg-gradient-to-r from-slate-400 to-slate-500'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {showRealLifeMode && (
                            <div className="w-8 h-8 flex items-center justify-center">
                              {React.createElement(selectedExample.icon, { className: "w-5 h-5" })}
                            </div>
                          )}
                          <span className="text-sm font-semibold">
                            {showRealLifeMode ? item.realLifeItem : item.value}
                          </span>
                        </div>
                        
                        {/* Top element indicator */}
                        {index === stack.length - 1 && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                            <ArrowUp className="w-2 h-2 text-white" />
                          </div>
                        )}
                        
                        {/* Index indicator */}
                        <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-slate-600 rounded-full flex items-center justify-center text-xs">
                          {index}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {/* Empty state */}
                  {stack.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-slate-400"
                    >
                      <div className="w-16 h-16 mx-auto mb-2 bg-slate-200 rounded-xl flex items-center justify-center">
                        <Minus className="w-8 h-8" />
                      </div>
                      <p className="text-sm">Stack is empty</p>
                    </motion.div>
                  )}
                </div>

                {/* Current Operation */}
                {operation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-blue-100 text-blue-800 rounded-xl text-center font-medium shadow-sm"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Target className="w-4 h-4" />
                      <span>{operation}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Operation Logs */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Operation Log</h3>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>Live Updates</span>
                </div>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <AnimatePresence>
                  {operationLogs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 rounded-lg border-l-4 ${
                        log.success 
                          ? 'bg-green-50 border-green-400 text-green-800' 
                          : 'bg-red-50 border-red-400 text-red-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {log.success ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <AlertTriangle className="w-4 h-4" />
                          )}
                          <span className="font-medium capitalize">{log.operation}</span>
                          {log.value !== undefined && (
                            <span className="px-2 py-1 bg-white/60 rounded text-xs font-semibold">
                              {log.value}
                            </span>
                          )}
                        </div>
                        <span className="text-xs opacity-75">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{log.message}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {operationLogs.length === 0 && (
                  <div className="text-center text-slate-400 py-8">
                    <Info className="w-8 h-8 mx-auto mb-2" />
                    <p>No operations performed yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stack Properties */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center">Stack Properties & Complexity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">LIFO</div>
              <div className="text-sm text-slate-600">Last In, First Out</div>
              <div className="text-xs text-slate-500 mt-1">Access Pattern</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-green-600 mb-2">O(1)</div>
              <div className="text-sm text-slate-600">Push/Pop Time</div>
              <div className="text-xs text-slate-500 mt-1">Constant Time</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-purple-600 mb-2">O(n)</div>
              <div className="text-sm text-slate-600">Space Complexity</div>
              <div className="text-xs text-slate-500 mt-1">Linear Space</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-orange-600 mb-2">Top</div>
              <div className="text-sm text-slate-600">Access Point</div>
              <div className="text-xs text-slate-500 mt-1">Single Entry</div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
