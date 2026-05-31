import React, { useRef, useEffect, useState } from 'react';

interface Option {
  value: string;
  label: React.ReactNode;
}

interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

export function SegmentedControl({ options, value, onChange, style, className = '' }: SegmentedControlProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [pillStyle, setPillStyle] = useState<React.CSSProperties>({
    transform: 'translateX(0px)',
    width: '0px',
    transition: 'none'
  });

  const updatePill = (animate: boolean) => {
    const activeBtn = buttonRefs.current[value];
    if (activeBtn && pillRef.current && containerRef.current) {
      const offsetLeft = activeBtn.offsetLeft;
      const offsetWidth = activeBtn.offsetWidth;
      
      if (!animate) {
        setPillStyle({
          transform: `translateX(${offsetLeft}px)`,
          width: `${offsetWidth}px`,
          transition: 'none'
        });
      } else {
        setPillStyle({
          transform: `translateX(${offsetLeft}px)`,
          width: `${offsetWidth}px`
        });
      }
    }
  };

  useEffect(() => {
    updatePill(false);
    const timer = requestAnimationFrame(() => {
      if (pillRef.current) {
        pillRef.current.style.transition = '';
      }
    });
    return () => cancelAnimationFrame(timer);
  }, [value, options]);

  useEffect(() => {
    const handleResize = () => {
      updatePill(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [value]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      updatePill(false);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div
      ref={containerRef}
      className={`t-tabs segmented-control ${className}`}
      role="tablist"
      style={{
        display: 'flex',
        position: 'relative',
        width: '100%',
        ...style
      }}
    >
      <span
        ref={pillRef}
        className="t-tabs-pill segmented-control-pill"
        aria-hidden="true"
        style={{
          ...pillStyle,
          position: 'absolute',
          top: '2px',
          height: 'calc(100% - 4px)',
        }}
      />
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            ref={(el) => { buttonRefs.current[opt.value] = el; }}
            type="button"
            className={`t-tab segmented-control-btn ${isActive ? 'active' : ''}`}
            role="tab"
            aria-selected={isActive}
            onClick={() => {
              if (!isActive) {
                const activeBtn = buttonRefs.current[opt.value];
                if (activeBtn) {
                  setPillStyle({
                    transform: `translateX(${activeBtn.offsetLeft}px)`,
                    width: `${activeBtn.offsetWidth}px`,
                  });
                }
                onChange(opt.value);
              }
            }}
            style={{
              flex: 1,
              zIndex: 1,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
