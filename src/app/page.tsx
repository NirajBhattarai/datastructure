"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Layers3, Link, TreePine, Layers, GitBranch, Database } from "lucide-react";
import StackVisualizer from "@/components/StackVisualizer";
import LinkedListVisualizer from "@/components/LinkedListVisualizer";
import HeapVisualizer from "@/components/HeapVisualizer";

const dataStructures = [
  {
    id: "stack",
    name: "Stack",
    description: "LIFO (Last In, First Out) data structure",
    icon: Layers3,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "linkedlist",
    name: "Linked List",
    description: "Linear data structure with nodes",
    icon: Link,
    color: "from-green-500 to-green-600",
  },
  {
    id: "heap",
    name: "Heap",
    description: "Complete binary tree data structure",
    icon: TreePine,
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "queue",
    name: "Queue",
    description: "FIFO (First In, First Out) data structure",
    icon: Layers,
    color: "from-orange-500 to-orange-600",
  },
  {
    id: "tree",
    name: "Binary Tree",
    description: "Hierarchical data structure",
    icon: GitBranch,
    color: "from-red-500 to-red-600",
  },
  {
    id: "graph",
    name: "Graph",
    description: "Non-linear data structure",
    icon: Database,
    color: "from-teal-500 to-teal-600",
  },
];

export default function Home() {
  const [selectedDS, setSelectedDS] = useState<string | null>(null);

  const renderVisualizer = () => {
    switch (selectedDS) {
      case "stack":
        return <StackVisualizer />;
      case "linkedlist":
        return <LinkedListVisualizer />;
      case "heap":
        return <HeapVisualizer />;
      default:
        return null;
    }
  };

  if (selectedDS) {
    return (
      <div className="min-h-screen">
        <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => setSelectedDS(null)}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <motion.div
                  whileHover={{ x: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  ← Back
                </motion.div>
              </button>
              <h1 className="text-xl font-semibold text-slate-900">
                {dataStructures.find(ds => ds.id === selectedDS)?.name} Visualizer
              </h1>
              <div className="w-20" /> {/* Spacer for centering */}
            </div>
          </div>
        </nav>
        {renderVisualizer()}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
            Data Structure
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Visualizer
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Learn data structures through interactive animations and visualizations. 
            Perfect for students and educators.
          </p>
        </motion.div>

        {/* Data Structure Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataStructures.map((ds, index) => {
            const Icon = ds.icon;
            const isImplemented = ["stack", "linkedlist", "heap"].includes(ds.id);
            
            return (
              <motion.div
                key={ds.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={`relative group cursor-pointer ${
                  isImplemented ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                }`}
                onClick={() => isImplemented && setSelectedDS(ds.id)}
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${ds.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {ds.name}
                  </h3>
                  
                  <p className="text-slate-600 mb-4">
                    {ds.description}
                  </p>
                  
                  {!isImplemented && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-full">
                        Coming Soon
                      </span>
                    </div>
                  )}
                  
                  {isImplemented && (
                    <motion.div
                      className="text-blue-600 font-medium group-hover:text-blue-700"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      Start Learning →
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            Why Choose Our Visualizer?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  ⚡
                </motion.div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Interactive Animations
              </h3>
              <p className="text-slate-600">
                Watch data structures come to life with smooth, educational animations.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                🎯
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Step-by-Step Learning
              </h3>
              <p className="text-slate-600">
                Control animation speed and step through operations at your own pace.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                📱
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Responsive Design
              </h3>
              <p className="text-slate-600">
                Works perfectly on desktop, tablet, and mobile devices.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}