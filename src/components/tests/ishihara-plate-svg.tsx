"use client";

import React, { useMemo } from 'react';

// Color palettes based on the provided Python script
const COLORS_ON = [ // "Number" colors, harder for CVD to see
    '#C48A86', '#B97C78', '#D09A96', '#E2A8A4', '#D88A83', '#EC9A93'
];
const COLORS_OFF = [ // "Background" colors
    '#9E9B85', '#868875', '#767D6F', '#6A7163', '#A09C71', '#8D8A67', '#D1CABD', '#BDBA99'
];

// SVG path data for digits 0-9
const numberPaths: { [key: string]: string } = {
    '0': "M 50,30 a 15,20 0 1,0 0,40 a 15,20 0 1,0 0,-40",
    '1': "M 45,25 L 50,20 L 50,80",
    '2': "M 35,35 a 15,15 0 1,1 30,0 L 35,80 H 65",
    '3': "M 35,25 a 15,15 0 1,1 30,0 a 10,10 0 0,1 -10,10 H 45 a 15,15 0 1,1 20,20 L 65,75",
    '4': "M 60,20 L 60,80 M 35,60 H 65",
    '5': "M 65,20 H 35 V 50 a 15,15 0 1,0 30,0",
    '6': "M 60,20 a 15,20 0 1,0 -10,40 a 15,15 0 1,0 0,-30",
    '7': "M 35,20 H 65 L 40,80",
    '8': "M 50,50 a 15,15 0 1,0 0,-0.1 M 50,50 a 15,15 0 1,1 0,0.1",
    '9': "M 40,80 a 15,20 0 1,0 10,-40 a 15,15 0 1,0 0,30"
};

export interface IshiharaPlateData {
    numberToDisplay: number;
    options: number[];
}

interface IshiharaPlateSVGProps {
  numberToDisplay: number;
  width: number;
  height: number;
}

// Helper to check if a point is near a path.
// This is a simplified simulation since a true SVG `isPointInStroke` is not available in React's virtual DOM.
const isPointNearPath = (pathElement: SVGPathElement, x: number, y: number, strokeWidth: number): boolean => {
    try {
        const svgPoint = (pathElement.ownerSVGElement as SVGSVGElement).createSVGPoint();
        svgPoint.x = x;
        svgPoint.y = y;
        return pathElement.isPointInStroke(svgPoint);
    } catch (e) {
        // Fallback for environments where isPointInStroke is not supported (like during server rendering tests)
        const bbox = pathElement.getBBox();
        const buffer = strokeWidth / 2;
        return (
            x >= bbox.x - buffer &&
            x <= bbox.x + bbox.width + buffer &&
            y >= bbox.y - buffer &&
            y <= bbox.y + bbox.height + buffer
        );
    }
}

export const IshiharaPlateSVG = ({ numberToDisplay, width, height }: IshiharaPlateSVGProps) => {

    const dots = useMemo(() => {
        const generatedDots: { cx: number; cy: number; r: number; fill: string; }[] = [];
        const numDots = 1800;
        const numberStr = String(numberToDisplay);
        const [digit1, digit2] = numberStr.padStart(2, '0');

        // Create temporary SVG elements in memory to measure path geometry.
        // This avoids rendering them to the actual DOM.
        const svgNs = "http://www.w3.org/2000/svg";
        const tempSvg = document.createElementNS(svgNs, "svg");
        tempSvg.setAttribute('style', 'position:absolute; top:-9999px; left:-9999px;');
        
        const path1 = document.createElementNS(svgNs, "path");
        path1.setAttribute("d", numberPaths[digit1]);
        path1.setAttribute("stroke-width", "25");
        path1.setAttribute("fill", "none");

        const path2 = document.createElementNS(svgNs, "path");
        path2.setAttribute("d", numberPaths[digit2]);
        path2.setAttribute("stroke-width", "25");
        path2.setAttribute("fill", "none");
        
        // Position the two digits side-by-side
        const transform1 = `translate(${width / 2 - 25}, ${height / 2}) scale(0.8)`;
        const transform2 = `translate(${width / 2 + 25}, ${height / 2}) scale(0.8)`;
        path1.setAttribute('transform', transform1);
        path2.setAttribute('transform', transform2);

        tempSvg.appendChild(path1);
        tempSvg.appendChild(path2);
        document.body.appendChild(tempSvg);

        for (let i = 0; i < numDots; i++) {
            // Generate circles within a circular area
            const angle = Math.random() * 2 * Math.PI;
            // Use sqrt to ensure uniform distribution
            const radius = Math.sqrt(Math.random()) * (width / 2);
            
            const x = width / 2 + radius * Math.cos(angle);
            const y = height / 2 + radius * Math.sin(angle);
            
            // Ensure dots are not too close to the edge
            if (Math.hypot(x - width / 2, y - height / 2) > (width / 2 - 10)) continue;

            const dotRadius = Math.random() * 5 + 2.5; // Slightly larger dots
            
            const isOnDigit1 = isPointNearPath(path1, x, y, 25);
            const isOnDigit2 = isPointNearPath(path2, x, y, 25);
            
            generatedDots.push({
                cx: x,
                cy: y,
                r: dotRadius,
                fill: (isOnDigit1 || isOnDigit2)
                    ? COLORS_ON[Math.floor(Math.random() * COLORS_ON.length)]
                    : COLORS_OFF[Math.floor(Math.random() * COLORS_OFF.length)],
            });
        }
        
        document.body.removeChild(tempSvg); // Clean up the temporary SVG

        return generatedDots;
    }, [numberToDisplay, width, height]);


    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <defs>
                 <clipPath id="ishihara-clip">
                    <circle cx={width/2} cy={height/2} r={width/2 - 2} />
                 </clipPath>
            </defs>
            <g clipPath="url(#ishihara-clip)">
                 <rect x="0" y="0" width={width} height={height} fill="#EBEAE5" />
                 {dots.map((dot, i) => (
                    <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.fill} />
                ))}
            </g>
        </svg>
    );
};
