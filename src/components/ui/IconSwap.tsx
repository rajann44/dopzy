import React from 'react';

interface IconSwapProps {
  state: 'a' | 'b';
  iconA: React.ReactNode;
  iconB: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function IconSwap({ state, iconA, iconB, className = '', style }: IconSwapProps) {
  return (
    <div className={`t-icon-swap ${className}`} data-state={state} style={style}>
      <span className="t-icon" data-icon="a" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        {iconA}
      </span>
      <span className="t-icon" data-icon="b" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        {iconB}
      </span>
    </div>
  );
}
