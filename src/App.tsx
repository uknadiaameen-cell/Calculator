/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, Divide, Minus, Plus, X, Equal, RotateCcw } from 'lucide-react';

type Operation = '+' | '-' | '*' | '/' | null;

export default function App() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const handleNumber = (num: string) => {
    if (display === '0' || shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleDecimal = () => {
    if (shouldResetDisplay) {
      setDisplay('0.');
      setShouldResetDisplay(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const performCalculation = (nextValue: number) => {
    if (previousValue === null || operation === null) return nextValue;

    switch (operation) {
      case '+': return previousValue + nextValue;
      case '-': return previousValue - nextValue;
      case '*': return previousValue * nextValue;
      case '/': return nextValue !== 0 ? previousValue / nextValue : 0;
      default: return nextValue;
    }
  };

  const handleOperation = (op: Operation) => {
    const currentValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operation) {
      const result = performCalculation(currentValue);
      setPreviousValue(result);
      setDisplay(String(result));
    }

    setOperation(op);
    setShouldResetDisplay(true);
  };

  const handleEqual = () => {
    const currentValue = parseFloat(display);
    if (previousValue === null || operation === null) return;

    const result = performCalculation(currentValue);
    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(true);
  };

  const buttons = [
    { label: 'AC', action: handleClear, type: 'special', icon: <RotateCcw size={20} /> },
    { label: 'DEL', action: handleBackspace, type: 'special', icon: <Delete size={20} /> },
    { label: '/', action: () => handleOperation('/'), type: 'operator', icon: <Divide size={20} /> },
    { label: '7', action: () => handleNumber('7'), type: 'number' },
    { label: '8', action: () => handleNumber('8'), type: 'number' },
    { label: '9', action: () => handleNumber('9'), type: 'number' },
    { label: '*', action: () => handleOperation('*'), type: 'operator', icon: <X size={20} /> },
    { label: '4', action: () => handleNumber('4'), type: 'number' },
    { label: '5', action: () => handleNumber('5'), type: 'number' },
    { label: '6', action: () => handleNumber('6'), type: 'number' },
    { label: '-', action: () => handleOperation('-'), type: 'operator', icon: <Minus size={20} /> },
    { label: '1', action: () => handleNumber('1'), type: 'number' },
    { label: '2', action: () => handleNumber('2'), type: 'number' },
    { label: '3', action: () => handleNumber('3'), type: 'number' },
    { label: '+', action: () => handleOperation('+'), type: 'operator', icon: <Plus size={20} /> },
    { label: '0', action: () => handleNumber('0'), type: 'number', className: 'col-span-2' },
    { label: '.', action: handleDecimal, type: 'number' },
    { label: '=', action: handleEqual, type: 'equal', icon: <Equal size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[360px] bg-white rounded-[32px] shadow-2xl shadow-black/5 overflow-hidden border border-black/5"
      >
        {/* Display Area */}
        <div className="p-8 pt-12 text-right">
          <div className="h-6 text-sm text-black/40 font-medium mb-1 overflow-hidden">
            {previousValue !== null && `${previousValue} ${operation || ''}`}
          </div>
          <div className="text-6xl font-light tracking-tighter text-black truncate">
            {display}
          </div>
        </div>

        {/* Keypad */}
        <div className="p-6 grid grid-cols-4 gap-3">
          {buttons.map((btn, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.95 }}
              onClick={btn.action}
              className={`
                h-16 flex items-center justify-center rounded-2xl text-xl font-medium transition-colors
                ${btn.className || ''}
                ${btn.type === 'number' ? 'bg-[#f8f8f8] text-black hover:bg-black/5' : ''}
                ${btn.type === 'operator' ? 'bg-black text-white hover:bg-black/80' : ''}
                ${btn.type === 'special' ? 'bg-black/5 text-black hover:bg-black/10' : ''}
                ${btn.type === 'equal' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : ''}
              `}
            >
              {btn.icon || btn.label}
            </motion.button>
          ))}
        </div>
      </motion.div>
      
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50" />
      </div>
    </div>
  );
}
