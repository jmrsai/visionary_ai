"use client";

import React, { useMemo } from 'react';

interface IshiharaPlateSVGProps {
  numberToDisplay: number;
  width: number;
  height: number;
  difficulty?: 'normal' | 'hard';
}

const numberPaths: { [key: string]: string } = {
    '0': "M 50,20 a 20,30 0 1,0 0,60 a 20,30 0 1,0 0,-60",
    '1': "M 40,20 L 50,10 L 50,90",
    '2': "M 30,30 a 20,20 0 1,1 40,0 L 30,90 H 70",
    '3': "M 30,20 a 20,20 0 1,1 40,0 a 10,10 0 0,1 -10,10 H 40 a 20,20 0 1,1 20,20 L 70,80",
    '4': "M 60,10 L 60,90 M 30,60 H 70",
    '5': "M 70,10 H 30 L 30,50 a 20,20 0 1,0 40,0",
    '6': "M 60,10 a 20,30 0 1,0 -10,50 a 20,20 0 1,0 0,-40",
    '7': "M 30,10 H 70 L 40,90",
    '8': "M 50,50 a 20,20 0 1,0 0,-0.1 M 50,50 a 20,20 0 1,1 0,0.1", // Two circles
    '9': "M 40,90 a 20,30 0 1,0 10,-50 a 20,20 0 1,0 0,40"
};

const backgroundColors = [
    '#9E9B85', '#868875', '#767D6F', '#6A7163', '#A09C71', '#8D8A67', '#D1CABD', '#BDBA99'
];
const numberColors = [
    '#C48A86', '#B97C78', '#D09A96', '#E2A8A4', '#D88A83', '#EC9A93'
];


const getPointInPath = (path: SVGPathElement, pathLength: number) => {
    const point = path.getPointAtLength(Math.random() * pathLength);
    return { x: point.x, y: point.y };
};

const isPointInPath = (path: SVGPathElement, x: number, y: number, strokeWidth: number) => {
    const svgPoint = (path.ownerSVGElement as SVGSVGElement).createSVGPoint();
    svgPoint.x = x;
    svgPoint.y = y;
    // Check distance to the path
    try {
        // isPointInStroke is not widely supported, so we use a bounding box check as a fallback idea
        // A more robust method involves checking distance to the path manually, but that's complex.
        // For this visual effect, we'll check if the point is inside a generously stroked version of the path.
        return path.isPointInStroke(svgPoint)
    } catch(e) {
        // Fallback for browsers that don't support isPointInStroke
        const bbox = path.getBBox();
        const buffer = strokeWidth;
        return x >= bbox.x - buffer && x <= bbox.x + bbox.width + buffer &&
               y >= bbox.y - buffer && y <= bbox.y + bbox.height + buffer;
    }
}


export const IshiharaPlateSVG = ({ numberToDisplay, width, height }: IshiharaPlateSVGProps) => {

    const pathRef = React.useRef<SVGPathElement>(null);

    const dots = useMemo(() => {
        const generatedDots = [];
        const numDots = 1500;
        const numberStr = String(numberToDisplay);
        
        // This is a trick to measure the path without rendering it first
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const digit1Path = numberPaths[numberStr[0]];
        const digit2Path = numberPaths[numberStr[1]];
        
        // Simple positioning for two digits
        const combinedPathD = `M ${-15} 0 ${digit1Path} M 15 0 ${digit2Path}`;
        path.setAttribute("d", combinedPathD);
        path.setAttribute("stroke-width", "25");
        path.setAttribute("fill", "none");
        svg.appendChild(path);
        document.body.appendChild(svg); // Needs to be in DOM to have geometry
        
        for (let i = 0; i < numDots; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const radius = Math.sqrt(Math.random()) * (width / 2);
            const x = width / 2 + radius * Math.cos(angle);
            const y = height / 2 + radius * Math.sin(angle);
            
            // Ensure dots are not too close to the edge
            if (Math.hypot(x-width/2, y-height/2) > width/2 - 10) continue;

            const dotRadius = Math.random() * 5 + 2;
            
            const pointIsOnNumber = isPointInPath(path, x, y, 25);
            
            generatedDots.push({
                cx: x,
                cy: y,
                r: dotRadius,
                fill: pointIsOnNumber
                    ? numberColors[Math.floor(Math.random() * numberColors.length)]
                    : backgroundColors[Math.floor(Math.random() * backgroundColors.length)],
            });
        }
        
        document.body.removeChild(svg); // Clean up the measurement SVG

        return generatedDots;
    }, [numberToDisplay, width, height]);


    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <defs>
                 <clipPath id="circle-clip">
                    <circle cx={width/2} cy={height/2} r={width/2 - 2} />
                 </clipPath>
            </defs>
            <g clipPath="url(#circle-clip)">
                 <rect x="0" y="0" width={width} height={height} fill="#EBEAE5" />
                 {dots.map((dot, i) => (
                    <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.fill} />
                ))}
            </g>
        </svg>
    );
};
