"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Layers3, 
  Link, 
  TreePine, 
  Layers, 
  GitBranch, 
  Database, 
  Play, 
  BookOpen, 
  Zap,
  Sparkles,
  ArrowRight,
  Code,
  Brain,
  Target
} from "lucide-react";
import StackVisualizer from "@/components/StackVisualizer";
import LinkedListVisualizer from "@/components/LinkedListVisualizer";
import HeapVisualizer from "@/components/HeapVisualizer";

const dataStructures = [
  {
    id: "stack",
    name: "Stack",
    description: "LIFO (Last In, First Out) data structure",
    icon: Layers3,
    color: "from-blue-500 via-blue-600 to-indigo-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-indigo-100",
    borderColor: "border-blue-200",
    difficulty: "Beginner",
    operations: ["Push", "Pop", "Peek"],
  },
  {
    id: "linkedlist",
    name: "Linked List",
    description: "Linear data structure with nodes",
    icon: Link,
    color: "from-emerald-500 via-green-600 to-teal-600",
    bgColor: "bg-gradient-to-br from-emerald-50 to-teal-100",
    borderColor: "border-emerald-200",
    difficulty: "Intermediate",
    operations: ["Insert", "Delete", "Search"],
  },
  {
    id: "heap",
    name: "Heap",
    description: "Complete binary tree data structure",
    icon: TreePine,
    color: "from-purple-500 via-violet-600 to-purple-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-violet-100",
    borderColor: "border-purple-200",
    difficulty: "Advanced",
    operations: ["Insert", "Extract Max", "Heapify"],
  },
  {
    id: "queue",
    name: "Queue",
    description: "FIFO (First In, First Out) data structure",
    icon: Layers,
    color: "from-orange-500 via-red-500 to-pink-600",
    bgColor: "bg-gradient-to-br from-orange-50 to-pink-100",
    borderColor: "border-orange-200",
    difficulty: "Beginner",
    operations: ["Enqueue", "Dequeue", "Front"],
  },
  {
    id: "tree",
    name: "Binary Tree",
    description: "Hierarchical data structure",
    icon: GitBranch,
    color: "from-rose-500 via-pink-600 to-rose-600",
    bgColor: "bg-gradient-to-br from-rose-50 to-pink-100",
    borderColor: "border-rose-200",
    difficulty: "Intermediate",
    operations: ["Insert", "Delete", "Traverse"],
  },
  {
    id: "graph",
    name: "Graph",
    description: "Non-linear data structure",
    icon: Database,
    color: "from-cyan-500 via-teal-600 to-blue-600",
    bgColor: "bg-gradient-to-br from-cyan-50 to-blue-100",
    borderColor: "border-cyan-200",
    difficulty: "Advanced",
    operations: ["DFS", "BFS", "Shortest Path"],
  },
];

const features = [
  {
    icon: Play,
    title: "Interactive Learning",
    description: "Hands-on experience with real-time animations",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Brain,
    title: "Visual Understanding",
    description: "See algorithms in action with beautiful visualizations",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Target,
    title: "Step-by-Step",
    description: "Control animation speed and follow each operation",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Code,
    title: "Real Code",
    description: "Learn with actual implementation examples",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

export default function Home() {
  const [selectedDS, setSelectedDS] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <motion.button
                onClick={() => setSelectedDS(null)}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-all duration-300 group"
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowRight className="w-4 h-4 rotate-180 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Back to Dashboard</span>
              </motion.button>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h1 className="text-xl font-bold text-slate-900">
                  {dataStructures.find(ds => ds.id === selectedDS)?.name} Visualizer
                </h1>
                <p className="text-sm text-slate-500">
                  Interactive Learning Experience
                </p>
              </motion.div>
              <div className="w-32" />
            </div>
          </div>
        </nav>
        {renderVisualizer()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-full px-4 py-2 mb-8 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">Interactive Data Structure Learning</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Master Data Structures
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Through Visualization
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Learn data structures with interactive animations, step-by-step visualizations, 
              and hands-on coding experiences. Perfect for students and developers.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-700 px-8 py-4 rounded-2xl font-semibold shadow-sm hover:shadow-md transition-all duration-300 flex items-center space-x-2"
              >
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>View Documentation</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Data Structures Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Choose Your Data Structure
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Interactive visualizations for every major data structure
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dataStructures.map((ds, index) => {
            const Icon = ds.icon;
            const isImplemented = ["stack", "linkedlist", "heap"].includes(ds.id);
            
            return (
              <motion.div
                key={ds.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative cursor-pointer ${
                  isImplemented ? "cursor-pointer" : "cursor-not-allowed"
                }`}
                onClick={() => isImplemented && setSelectedDS(ds.id)}
                onHoverStart={() => setHoveredCard(ds.id)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <div className={`relative overflow-hidden rounded-3xl p-8 h-full transition-all duration-500 ${
                  hoveredCard === ds.id ? 'shadow-2xl' : 'shadow-lg'
                } ${ds.bgColor} border ${ds.borderColor} backdrop-blur-sm`}>
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-4 right-4 w-20 h-20 bg-current rounded-full" />
                    <div className="absolute bottom-4 left-4 w-16 h-16 bg-current rounded-full" />
                  </div>
                  
                  {/* Difficulty Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      ds.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                      ds.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {ds.difficulty}
                    </span>
                  </div>
                  
                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${ds.color} flex items-center justify-center mb-6 shadow-lg`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-slate-800 transition-colors">
                      {ds.name}
                    </h3>
                    
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {ds.description}
                    </p>
                    
                    {/* Operations */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Operations:</h4>
                      <div className="flex flex-wrap gap-2">
                        {ds.operations.map((op, opIndex) => (
                          <span
                            key={opIndex}
                            className="px-2 py-1 bg-white/60 backdrop-blur-sm rounded-lg text-xs font-medium text-slate-600"
                          >
                            {op}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    {isImplemented ? (
                      <motion.div
                        className="flex items-center space-x-2 text-blue-600 font-semibold group-hover:text-blue-700 transition-colors"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <span>Start Learning</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    ) : (
                      <div className="flex items-center space-x-2 text-slate-400">
                        <span>Coming Soon</span>
                        <Zap className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  
                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                    initial={false}
                    animate={{ opacity: hoveredCard === ds.id ? 1 : 0 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-slate-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience the future of data structure education
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 h-full">
                    <motion.div
                      className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 5 }}
                    >
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {feature.title}
                    </h3>
                    
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-4">Ready to Master Data Structures?</h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Join thousands of students learning data structures through interactive visualizations
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}