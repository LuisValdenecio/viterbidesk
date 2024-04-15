'use client';

import React from 'react';
import { useEffect, useState, useContext } from 'react';
import ReactConfetti from 'react-confetti';
import { PopoverGuideContext } from '@/app/dashboard/popoverGuideProvider';
import { useSearchParams } from 'next/navigation';

const CompletionAnimation = () => {
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [stopAnim, setAnim] = useState(false);
  const [confettiCount, setConfettiCount] = useState(200); // Initial confetti count
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const detectSize = () => {
    setWindowDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    const startGuide = params.get('start-guide');
    let animationTimer = null;

    if (startGuide) {
      setAnim(true);
      animationTimer = setInterval(() => {
        // Decrease confetti count gradually until it reaches 0
        setConfettiCount((prevCount) => Math.max(prevCount - 20, 0));
      }, 1000);
    } else {
      // Stop the animation and reset confetti count when not animating
      setAnim(false);
      clearInterval(animationTimer);
      setConfettiCount(0);
    }

    window.addEventListener('resize', detectSize);
    return () => {
      window.removeEventListener('resize', detectSize);
      clearInterval(animationTimer);
    };
  }, [params]);

  return (
    <>
      {true && (
        <div className="z-50">
          <ReactConfetti
            width={windowDimension.width}
            height={windowDimension.height}
            numberOfPieces={confettiCount}
          />
        </div>
      )}
    </>
  );
};

export default CompletionAnimation;
