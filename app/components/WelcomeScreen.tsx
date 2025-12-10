"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [rotX, setRotX] = useState(-20);
  const [rotY, setRotY] = useState(30);
  const [phase, setPhase] = useState("shuffling");
  const [tick, setTick] = useState(0);
  const animRef = useRef<number | undefined>(undefined);
  const controls = useAnimation();

  useEffect(() => {
    let x = -20, y = 30;
    const spin = () => {
      y += 1.5;
      x += 0.5;
      setRotX(x);
      setRotY(y);
      animRef.current = requestAnimationFrame(spin);
    };
    spin();

    const t1 = setInterval(() => setTick(t => t + 1), 300);
    const t2 = setTimeout(() => { clearInterval(t1); setPhase("solving"); }, 2500);
    const t3 = setTimeout(() => setPhase("complete"), 4000);
    const t4 = setTimeout(async () => {
      await controls.start({ opacity: 0, scale: 0.9, transition: { duration: 0.5 } });
      setIsVisible(false);
      onComplete();
    }, 4500);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      clearInterval(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [controls, onComplete]);
  if (!isVisible) return null;

  const cubeStyle = {
    transformStyle: "preserve-3d" as const,
    transform: "rotateX(" + rotX + "deg) rotateY(" + rotY + "deg)"
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black"
        initial={{ opacity: 1 }}
        animate={controls}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-black to-purple-900/20" />
        
        <div style={{ perspective: "1200px" }}>
          <div className="relative w-60 h-60 md:w-72 md:h-72" style={cubeStyle}>
            <CubeFace rot="rotateY(0deg)" tr="translateZ(120px)" phase={phase} tick={tick} idx={0} />
            <CubeFace rot="rotateY(180deg)" tr="translateZ(120px)" phase={phase} tick={tick} idx={1} />
            <CubeFace rot="rotateY(90deg)" tr="translateZ(120px)" phase={phase} tick={tick} idx={2} />
            <CubeFace rot="rotateY(-90deg)" tr="translateZ(120px)" phase={phase} tick={tick} idx={3} />
            <CubeFace rot="rotateX(90deg)" tr="translateZ(120px)" phase={phase} tick={tick} idx={4} />
            <CubeFace rot="rotateX(-90deg)" tr="translateZ(120px)" phase={phase} tick={tick} idx={5} />
          </div>
        </div>

        <motion.div
          className="absolute bottom-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-white">
            <span className="text-pink-500">BURN</span>BOX PRINTING
          </h2>
          <p className="text-neutral-400 text-sm mt-2 tracking-widest uppercase">
            {phase === "shuffling" ? "Loading..." : phase === "solving" ? "Assembling..." : "Welcome"}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};



interface FaceProps {
  rot: string;
  tr: string;
  phase: string;
  tick: number;
  idx: number;
}

const CubeFace: React.FC<FaceProps> = ({ rot, tr, phase, tick, idx }) => {
  const style = {
    transform: rot + " " + tr,
    backfaceVisibility: "visible" as const,
    transformStyle: "preserve-3d" as const
  };

  return (
    <div className="absolute inset-0" style={style}>
      <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-1 p-1 bg-neutral-900/10 rounded-lg">
        {[0,1,2,3,4,5,6,7,8].map(i => (
          <Cell key={i} cellIdx={i} phase={phase} tick={tick} faceIdx={idx} />
        ))}
      </div>
    </div>
  );
};

interface CellProps {
  cellIdx: number;
  phase: string;
  tick: number;
  faceIdx: number;
}

const Cell: React.FC<CellProps> = ({ cellIdx, phase, tick, faceIdx }) => {
  const row = Math.floor(cellIdx / 3);
  const col = cellIdx % 3;
  const correctX = col * 50;
  const correctY = row * 50;
  
  const getPos = () => {
    if (phase === "complete" || phase === "solving") {
      return { x: correctX, y: correctY };
    }
    const seed = tick + cellIdx + faceIdx;
    return { x: (seed % 3) * 50, y: ((seed + cellIdx) % 3) * 50 };
  };
  
  const getOffset = () => {
    if (phase === "complete") return { x: 0, y: 0, r: 0 };
    if (phase === "solving") return { x: 0, y: 0, r: 0 };
    const seed = tick + cellIdx + faceIdx;
    const dir = seed % 2 === 0 ? 1 : -1;
    const mag = 60 + (seed % 30);
    return {
      x: seed % 3 === 0 ? dir * mag : 0,
      y: seed % 3 !== 0 ? dir * mag : 0,
      r: dir * (5 + (seed % 15))
    };
  };

  const pos = getPos();
  const off = getOffset();
  const bgPos = pos.x + "% " + pos.y + "%";

  return (
    <motion.div
      className="relative overflow-hidden rounded-sm bg-black/70 border border-pink-500/30"
      animate={{ x: off.x, y: off.y, rotate: off.r, scale: phase === "complete" ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ boxShadow: phase === "complete" ? "0 0 15px rgba(236,72,153,0.5)" : "none" }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ backgroundPosition: bgPos }}
        transition={{ duration: phase === "solving" ? 0.5 : 0.1 }}
        style={{
          backgroundImage: "url(/bbbbblogo.png)",
          backgroundSize: "300% 300%",
          backgroundRepeat: "no-repeat"
        }}
      />
    </motion.div>
  );
};

export default WelcomeScreen;