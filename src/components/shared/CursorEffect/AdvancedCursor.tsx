// components/AdvancedCursor.tsx
import { useState, useEffect } from 'react';
import './CursorEffect.css';

const AdvancedCursor = () => {
  const [mainCursor, setMainCursor] = useState({ x: 0, y: 0 });
  const [trailCursors, setTrailCursors] = useState<Array<{x: number, y: number, size: number}>>([]);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setMainCursor({ x: e.clientX, y: e.clientY });
      
      // Update trail with staggered delays
      const delays = [50,70, 90, 110, 130 ]; // Different delays for each trail circle
      delays.forEach((delay, index) => {
        setTimeout(() => {
          setTrailCursors(prev => {
            const newTrail = [...prev];
            newTrail[index] = { 
              x: e.clientX, 
              y: e.clientY,
              size: 16 - (index * 2) // Gradually decrease size
            };
            return newTrail.slice(0, 5); // Keep only 5 trail elements
          });
        }, delay);
      });
      
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).getPropertyValue('cursor') === 'pointer'
      );
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <>
      <div 
        className={`cursor-main ${isPointer ? 'cursor-pointer' : ''}`}
        style={{
          left: `${mainCursor.x}px`,
          top: `${mainCursor.y}px`,
        }}
      />
      {trailCursors.map((pos, index) => (
        <div
          key={index}
          className="cursor-trail"
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            width: `${pos.size}px`,
            height: `${pos.size}px`,
            opacity: 0.8 - (index * 0.15),
            transform: `translate(-50%, -50%) scale(${1 - (index * 0.1)})`
          }}
        />
      ))}
    </>
  );
};

export default AdvancedCursor;