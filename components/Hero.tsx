'use client';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col items-center justify-center px-6">
      <motion.h1 
        className="text-4xl sm:text-6xl font-extrabold text-center mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Ultrawebthinking
      </motion.h1>
      <motion.p 
        className="text-xl sm:text-2xl text-gray-300 text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Beyond imagination. Built with purpose. Driven by intelligence.
      </motion.p>
      <motion.div 
        className="flex gap-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <button className="bg-white text-black px-6 py-3 rounded-2xl font-semibold shadow-lg hover:bg-gray-200 transition">
          Start Now
        </button>
        <button className="border border-white px-6 py-3 rounded-2xl text-white hover:bg-white hover:text-black transition">
          Learn More
        </button>
      </motion.div>
    </section>
  );
}

