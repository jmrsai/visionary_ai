
"use client";

import React, { useMemo } from 'react';

// Color palettes
const COLORS_ON = [ // "Number" colors, harder for CVD to see
    '#C48A86', '#B97C78', '#D09A96', '#E2A8A4', '#D88A83', '#EC9A93'
];
const COLORS_OFF = [ // "Background" colors
    '#9E9B85', '#868875', '#767D6F', '#6A7163', '#A09C71', '#8D8A67', '#D1CABD', '#BDBA99'
];

// SVG path data for digits 0-9, centered in a 100x100 box
const numberPaths: { [key: string]: string } = {
    '0': "M 50,20 A 20,30 0 1 0 50,80 A 20,30 0 1 0 50,20 Z",
    '1': "M 40,20 L 55,20 L 55,80 L 40,80",
    '2': "M 35,30 A 15,15 0 0 1 65,30 L 65,45 L 35,80 L 65,80",
    '3': "M 35,25 A 15,20 0 1 1 50,45 L 45,45 A 15,20 0 1 1 35,75",
    '4': "M 60,20 L 35,60 L 65,60 M 60,20 L 60,80",
    '5': "M 65,20 L 35,20 L 35,50 A 15,15 0 1 0 65,50",
    '6': "M 65,35 A 20,20 0 1 1 35,55 L 35,70 A 15,15 0 1 0 65,70 Z",
    '7': "M 35,20 L 65,20 L 45,80",
    '8': "M 50,35 A 15,15 0 1 0 50,34.9 M 50,65 A 15,15 0 1 0 50,64.9",
    '9': "M 35,65 A 20,20 0 1 1 65,45 L 65,30 A 15,15 0 1 0 35,30 Z"
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


// Check if a point is inside the stroke of a path
const isPointNearPath = (pathElement: SVGPathElement, x: number, y: number): boolean => {
    try {
        const svgPoint = (pathElement.ownerSVGElement as SVGSVGElement).createSVGPoint();
        svgPoint.x = x;
        svgPoint.y = y;
        // isPointInStroke is the key function here
        return pathElement.isPointInStroke(svgPoint);
    } catch (e) {
        return false;
    }
}

// Check for circle collision
const checkCollision = (circle: any, existingCircles: any[]) => {
    for (const other of existingCircles) {
        const dx = other.cx - circle.cx;
        const dy = other.cy - circle.cy;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < other.r + circle.r) {
            return true;
        }
    }
    return false;
}

export const IshiharaPlateSVG = ({ numberToDisplay, width, height }: IshiharaPlateSVGProps) => {

    const dots = useMemo(() => {
        const plateRadius = width / 2;
        const center = { x: width / 2, y: height / 2 };
        const generatedDots: { cx: number; cy: number; r: number; fill: string; }[] = [];
        
        const numberStr = String(numberToDisplay).padStart(2, '0');
        const [digit1, digit2] = numberStr;

        // Setup temporary paths to test against
        const svgNs = "http://www.w3.org/2000/svg";
        const tempSvg = document.createElementNS(svgNs, "svg");
        tempSvg.setAttribute('style', 'position:absolute; top:-9999px; left:-9999px;');
        
        const path1 = document.createElementNS(svgNs, "path");
        path1.setAttribute("d", numberPaths[digit1]);
        path1.setAttribute("stroke-width", "28"); // Wider stroke for better dot catching
        path1.setAttribute("fill", "none");
        path1.setAttribute('transform', `translate(${center.x - 45}, 0) scale(1.1)`);

        const path2 = document.createElementNS(svgNs, "path");
        path2.setAttribute("d", numberPaths[digit2]);
        path2.setAttribute("stroke-width", "28");
        path2.setAttribute("fill", "none");
        path2.setAttribute('transform', `translate(${center.x + 45}, 0) scale(1.1)`);
        
        tempSvg.appendChild(path1);
        tempSvg.appendChild(path2);
        document.body.appendChild(tempSvg);

        const minRadius = 2.5;
        const maxRadius = 8;
        const totalDots = 1200;

        for (let i = 0; i < totalDots; i++) {
            let newCircle;
            let attempts = 0;
            const maxAttempts = 50;

            do {
                const angle = Math.random() * 2 * Math.PI;
                const r = Math.sqrt(Math.random()) * plateRadius;
                const circleRadius = Math.random() * (maxRadius - minRadius) + minRadius;
                
                newCircle = {
                    cx: center.x + r * Math.cos(angle),
                    cy: center.y + r * Math.sin(angle),
                    r: circleRadius,
                };
                attempts++;
            } while (
                checkCollision(newCircle, generatedDots) &&
                attempts < maxAttempts
            );

            if (attempts < maxAttempts) {
                 const isOnDigit1 = isPointNearPath(path1, newCircle.cx, newCircle.cy);
                 const isOnDigit2 = isPointNearPath(path2, newCircle.cx, newCircle.cy);
                
                const colorPalette = (isOnDigit1 || isOnDigit2) ? COLORS_ON : COLORS_OFF;
                
                 generatedDots.push({
                    ...newCircle,
                    fill: colorPalette[Math.floor(Math.random() * colorPalette.length)],
                });
            }
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
