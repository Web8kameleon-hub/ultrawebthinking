/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LazyPageWrapperProps {
  children: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

const LazyPageWrapper: React.FC<LazyPageWrapperProps> = ({
  children,
  title,
  description,
  gradient
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`inline-block p-6 rounded-full bg-gradient-to-r ${gradient} shadow-xl`}
        >
          <Loader2 className="w-8 h-8 text-white" />
        </motion.div>
        <div>
          <h2 className={`text-2xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {title}
          </h2>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
        <div className="flex space-x-2 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient}`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </Suspense>
  );
};

export default LazyPageWrapper;
