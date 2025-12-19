
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface AnimatedEyeModelProps {
  condition?: 'normal' | 'glaucoma' | 'diabetic_retinopathy' | 'amd' | 'cataract';
  interactive?: boolean;
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
}

export default function AnimatedEyeModel({ 
  condition = 'normal', 
  interactive = true, 
  size = 'medium',
  showLabels = false 
}: AnimatedEyeModelProps) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const controls = useAnimation();

  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48',
    large: 'w-64 h-64'
  };

  const eyeParts = [
    { id: 'cornea', name: 'Cornea', color: '#e0f2fe', opacity: 0.8 },
    { id: 'iris', name: 'Iris', color: '#3b82f6', opacity: 0.9 },
    { id: 'pupil', name: 'Pupil', color: '#000000', opacity: 1 },
    { id: 'lens', name: 'Lens', color: '#f0f9ff', opacity: 0.6 },
    { id: 'retina', name: 'Retina', color: '#fef3c7', opacity: 0.8 },
    { id: 'optic_nerve', name: 'Optic Nerve', color: '#fbbf24', opacity: 0.9 },
    { id: 'macula', name: 'Macula', color: '#f59e0b', opacity: 0.7 }
  ];

  const getConditionEffects = () => {
    switch (condition) {
      case 'glaucoma':
        return {
          optic_nerve: { color: '#ef4444', opacity: 0.9 },
          retina: { color: '#fca5a5', opacity: 0.8 }
        };
      case 'diabetic_retinopathy':
        return {
          retina: { color: '#dc2626', opacity: 0.9 },
          macula: { color: '#b91c1c', opacity: 0.8 }
        };
      case 'amd':
        return {
          macula: { color: '#7f1d1d', opacity: 0.9 },
          retina: { color: '#fca5a5', opacity: 0.7 }
        };
      case 'cataract':
        return {
          lens: { color: '#9ca3af', opacity: 0.9 },
          cornea: { color: '#d1d5db', opacity: 0.8 }
        };
      default:
        return {};
    }
  };

  const conditionEffects = getConditionEffects();

  useEffect(() => {
    if (condition !== 'normal') {
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      });
    }
  }, [condition, controls]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateX = (e.clientY - centerY) / 10;
    const rotateY = (e.clientX - centerX) / 10;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setRotation({ x: 0, y: 0 });
      setHoveredPart(null);
    }
  };

  return (
    <div className={`relative ${sizeClasses[size]} mx-auto`}>
      <motion.div
        className="w-full h-full relative cursor-pointer"
        animate={controls}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
      >
        {/* Eye SVG */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sclera (white of eye) */}
          <ellipse
            cx="100"
            cy="100"
            rx="90"
            ry="60"
            fill="#ffffff"
            stroke="#e5e7eb"
            strokeWidth="2"
          />
          
          {/* Cornea */}
          <ellipse
            cx="100"
            cy="100"
            rx="35"
            ry="35"
            fill={conditionEffects.cornea?.color || eyeParts.find(p => p.id === 'cornea')?.color}
            opacity={conditionEffects.cornea?.opacity || eyeParts.find(p => p.id === 'cornea')?.opacity}
            onMouseEnter={() => setHoveredPart('cornea')}
            className="transition-all duration-300 hover:brightness-110"
          />
          
          {/* Iris */}
          <circle
            cx="100"
            cy="100"
            r="25"
            fill={(conditionEffects as any).iris?.color || eyeParts.find(p => p.id === 'iris')?.color}
            opacity={(conditionEffects as any).iris?.opacity || eyeParts.find(p => p.id === 'iris')?.opacity}
            onMouseEnter={() => setHoveredPart('iris')}
            className="transition-all duration-300 hover:brightness-110"
          />
          
          {/* Pupil */}
          <motion.circle
            cx="100"
            cy="100"
            r="8"
            fill={eyeParts.find(p => p.id === 'pupil')?.color}
            animate={{
              r: condition === 'normal' ? [8, 10, 8] : [8, 6, 8]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            onMouseEnter={() => setHoveredPart('pupil')}
          />
          
          {/* Lens (behind iris) */}
          <ellipse
            cx="100"
            cy="100"
            rx="20"
            ry="15"
            fill={conditionEffects.lens?.color || eyeParts.find(p => p.id === 'lens')?.color}
            opacity={conditionEffects.lens?.opacity || eyeParts.find(p => p.id === 'lens')?.opacity}
            onMouseEnter={() => setHoveredPart('lens')}
            className="transition-all duration-300"
          />
          
          {/* Retina (back of eye) */}
          <ellipse
            cx="100"
            cy="100"
            rx="85"
            ry="55"
            fill={conditionEffects.retina?.color || eyeParts.find(p => p.id === 'retina')?.color}
            opacity={conditionEffects.retina?.opacity || eyeParts.find(p => p.id === 'retina')?.opacity}
            onMouseEnter={() => setHoveredPart('retina')}
            className="transition-all duration-300"
          />
          
          {/* Macula */}
          <circle
            cx="105"
            cy="100"
            r="8"
            fill={conditionEffects.macula?.color || eyeParts.find(p => p.id === 'macula')?.color}
            opacity={conditionEffects.macula?.opacity || eyeParts.find(p => p.id === 'macula')?.opacity}
            onMouseEnter={() => setHoveredPart('macula')}
            className="transition-all duration-300 hover:brightness-110"
          />
          
          {/* Optic Nerve */}
          <ellipse
            cx="130"
            cy="100"
            rx="6"
            ry="12"
            fill={conditionEffects.optic_nerve?.color || eyeParts.find(p => p.id === 'optic_nerve')?.color}
            opacity={conditionEffects.optic_nerve?.opacity || eyeParts.find(p => p.id === 'optic_nerve')?.opacity}
            onMouseEnter={() => setHoveredPart('optic_nerve')}
            className="transition-all duration-300 hover:brightness-110"
          />
          
          {/* Blood vessels */}
          <g stroke="#dc2626" strokeWidth="1" fill="none" opacity="0.6">
            <path d="M 130 100 Q 120 90 110 95 Q 100 100 95 110" />
            <path d="M 130 100 Q 120 110 110 105 Q 100 100 95 90" />
            <path d="M 130 100 Q 115 85 105 90" />
            <path d="M 130 100 Q 115 115 105 110" />
          </g>
          
          {/* Condition-specific effects */}
          {condition === 'diabetic_retinopathy' && (
            <g>
              {/* Microaneurysms */}
              <circle cx="95" cy="95" r="1" fill="#dc2626" />
              <circle cx="110" cy="105" r="1" fill="#dc2626" />
              <circle cx="105" cy="90" r="1" fill="#dc2626" />
              {/* Hemorrhages */}
              <ellipse cx="90" cy="110" rx="2" ry="1" fill="#7f1d1d" />
              <ellipse cx="115" cy="95" rx="1.5" ry="2" fill="#7f1d1d" />
            </g>
          )}
          
          {condition === 'glaucoma' && (
            <g>
              {/* Enlarged cup */}
              <circle cx="130" cy="100" r="8" fill="#fbbf24" opacity="0.3" />
              <circle cx="130" cy="100" r="4" fill="#ffffff" />
            </g>
          )}
          
          {condition === 'amd' && (
            <g>
              {/* Drusen deposits */}
              <circle cx="105" cy="100" r="2" fill="#fbbf24" opacity="0.7" />
              <circle cx="108" cy="103" r="1.5" fill="#f59e0b" opacity="0.7" />
              <circle cx="102" cy="97" r="1" fill="#d97706" opacity="0.7" />
            </g>
          )}
        </svg>
        
        {/* Hover tooltip */}
        {hoveredPart && showLabels && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-medium z-10"
          >
            {eyeParts.find(p => p.id === hoveredPart)?.name}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Condition indicator */}
      {condition !== 'normal' && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            condition === 'glaucoma' ? 'bg-red-100 text-red-800' :
            condition === 'diabetic_retinopathy' ? 'bg-orange-100 text-orange-800' :
            condition === 'amd' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {condition.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}
