"use client";

import React from 'react';

// Helper functions for color manipulation
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const interpolateColor = (color1: string, color2: string, factor: number) => {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  if (!c1 || !c2) return "#000000";
  const result = {
    r: Math.round(c1.r + factor * (c2.r - c1.r)),
    g: Math.round(c1.g + factor * (c2.g - c1.g)),
    b: Math.round(c1.b + factor * (c2.b - c1.b)),
  };
  return rgbToHex(result.r, result.g, result.b);
};

// Colors that are confusing for red-green deficiency
const protan_normal = "#6A9A3E"; // A green visible to normal vision
const protan_confuse = "#9A8D3E"; // A yellow-green confusing for protanopes

const deutan_normal = "#D44C4E"; // A red visible to normal vision
const deutan_confuse = "#A48E4E"; // A brownish-red confusing for deuteranopes

interface IshiharaPlateSVGProps {
  numberToDisplay: number;
  difficulty: number; // 1 to 10
}

export const IshiharaPlateSVG: React.FC<IshiharaPlateSVGProps> = ({ numberToDisplay, difficulty }) => {
  const svgSize = 256;
  const numDots = 1000;
  const dots = [];

  const numberStr = numberToDisplay.toString();

  // Create a temporary canvas to determine where the number is
  const canvas = document.createElement('canvas');
  canvas.width = svgSize;
  canvas.height = svgSize;
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, svgSize, svgSize);
  ctx.fillStyle = 'black';
  ctx.font = `bold ${svgSize * 0.6}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(numberStr, svgSize / 2, svgSize / 2);

  for (let i = 0; i < numDots; i++) {
    const x = Math.random() * svgSize;
    const y = Math.random() * svgSize;
    const radius = Math.random() * 4 + 2;

    const pixelData = ctx.getImageData(x, y, 1, 1).data;
    const isNumberPart = pixelData[0] === 0; // Black color on canvas

    let color;
    const rand = Math.random();
    
    // Difficulty affects how similar the colors are
    const colorFactor = (10 - difficulty) / 10; // 0.9 for difficulty 1, 0 for difficulty 10

    if (isNumberPart) {
        // Use colors that are easily visible for normal vision
        color = rand > 0.5 ? protan_normal : deutan_normal;
    } else {
        // Use colors that are confusing
        color = rand > 0.5 
            ? interpolateColor(protan_confuse, protan_normal, colorFactor) 
            : interpolateColor(deutan_confuse, deutan_normal, colorFactor);
    }
    
    // Add slight random variations to the color
    const c = hexToRgb(color);
    if(c) {
        c.r = Math.max(0, Math.min(255, c.r + Math.floor((Math.random() - 0.5) * 40)));
        c.g = Math.max(0, Math.min(255, c.g + Math.floor((Math.random() - 0.5) * 40)));
        c.b = Math.max(0, Math.min(255, c.b + Math.floor((Math.random() - 0.5) * 40)));
        color = rgbToHex(c.r, c.g, c.b);
    }

    dots.push(<circle key={i} cx={x} cy={y} r={radius} fill={color} />);
  }

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${svgSize} ${svgSize}`}>
      {dots}
    </svg>
  );
};
