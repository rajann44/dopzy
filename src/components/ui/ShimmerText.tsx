import React from 'react';

interface ShimmerTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ShimmerText({ text, className = '', style }: ShimmerTextProps) {
  return (
    <span 
      className={`t-shimmer ${className}`} 
      data-text={text} 
      style={style}
    >
      {text}
    </span>
  );
}
