"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CONFIG = {
  frameCount: 240, // Update if you end up with 220 frames as mentioned in your other note
  framePath: "/frames/",
  framePrefix: "ezgif-frame-",
  frameSuffix: ".webp",
  zeroPad: 3,
  scrollHeight: "500vh",
  lerpSpeed: 0.10,
  scrubSpeed: 1.5,
} as const;

export default function ScrollCanvas() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loadingBarRef = useRef<HTMLDivElement>(null);
  const loadingTextRef = useRef<HTMLDivElement>(null);

  const frames = useRef<HTMLImageElement[]>([]);
  const currentFrame = useRef<number>(0);
  const targetFrame = useRef<number>(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    let ctx: CanvasRenderingContext2D | null = null;
    let loadedCount = 0;
    let isUnmounted = false;

    if (canvasRef.current) {
      // { alpha: false } improves rendering performance since the canvas doesn't need to compute transparency behind it
      ctx = canvasRef.current.getContext("2d", { alpha: false });
    }

    const getFramePath = (index: number) => {
      const paddedIndex = String(index).padStart(CONFIG.zeroPad, "0");
      return `${CONFIG.framePath}${CONFIG.framePrefix}${paddedIndex}${CONFIG.frameSuffix}`;
    };

    // 5. RESIZE — recalculate canvas dimensions on window resize
    const resizeCanvas = () => {
      if (!canvasRef.current || !ctx) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      // Force an immediate redraw of the current frame on resize to prevent flicker
      drawFrame(Math.round(currentFrame.current));
    };

    // 3. DRAW — cover-fit frame onto canvas
    const drawFrame = (frameIndex: number) => {
      if (!canvasRef.current || !ctx || frames.current.length === 0) return;

      const img = frames.current[Math.max(0, Math.min(CONFIG.frameCount - 1, frameIndex))];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const cw = canvasRef.current.width;
      const ch = canvasRef.current.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Cover math
      const scale = Math.max(cw / iw, ch / ih);
      const width = iw * scale;
      const height = ih * scale;
      const x = (cw - width) / 2;
      const y = (ch - height) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, x, y, width, height);
    };

    // 2. RAF LOOP — lerp currentFrame toward targetFrame, draw
    const animate = () => {
      if (isUnmounted) return;

      // Lerp smoothing formula
      currentFrame.current += (targetFrame.current - currentFrame.current) * CONFIG.lerpSpeed;

      // Draw rounded frame
      drawFrame(Math.round(currentFrame.current));

      rafId.current = requestAnimationFrame(animate);
    };

    // 4. SCROLLTRIGGER — map scroll progress to targetFrame
    const initAnimation = () => {
      if (isUnmounted) return;
      resizeCanvas();

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: CONFIG.scrubSpeed,
        onUpdate: (self) => {
          // targetFrame goes from 0 to frameCount - 1
          targetFrame.current = self.progress * (CONFIG.frameCount - 1);
        },
      });

      rafId.current = requestAnimationFrame(animate);
      window.addEventListener("resize", resizeCanvas);
    };

    // 1. PRELOAD — load all Image() objects into frames[] ref
    const preloadFrames = () => {
      for (let i = 1; i <= CONFIG.frameCount; i++) {
        const img = new Image();
        img.src = getFramePath(i);

        img.onload = () => {
          if (isUnmounted) return;
          loadedCount++;
          const progress = Math.round((loadedCount / CONFIG.frameCount) * 100);

          // Bypass React state to update the loader DOM to satisfy strict performance instructions
          if (loadingBarRef.current) {
            loadingBarRef.current.style.width = `${progress}%`;
          }
          if (loadingTextRef.current) {
            loadingTextRef.current.innerText = `LOADING... ${progress}%`;
          }

          if (loadedCount === CONFIG.frameCount) {
            if (loaderRef.current) {
              loaderRef.current.style.opacity = "0";
              setTimeout(() => {
                if (loaderRef.current) loaderRef.current.style.display = "none";
              }, 500); // fade out wait
            }
            // Once all frames loaded, boot scroll trigger and animate loop
            initAnimation();
          }
        };

        img.onerror = () => {
          console.error(`Failed to load image: ${img.src}`);
          // Fallback increment so it doesn't hang infinitely if 1 frame crashes
          loadedCount++;
          if (loadedCount === CONFIG.frameCount && !isUnmounted) {
            if (loaderRef.current) {
               loaderRef.current.style.opacity = "0";
               setTimeout(() => {
                 if (loaderRef.current) loaderRef.current.style.display = "none";
               }, 500);
            }
            initAnimation();
          }
        };

        frames.current.push(img);
      }
    };

    preloadFrames();

    // 6. CLEANUP — kill triggers, cancel RAF on unmount
    return () => {
      isUnmounted = true;
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
      window.removeEventListener("resize", resizeCanvas);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} style={{ height: CONFIG.scrollHeight }} className="relative w-full bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Render Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ willChange: "transform" }}
        />

        {/* Loading Overlay */}
        <div
          ref={loaderRef}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-500"
        >
          <div
            ref={loadingTextRef}
            className="mb-4 text-xs tracking-widest text-white/50 uppercase"
          >
            LOADING... 0%
          </div>
          <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              ref={loadingBarRef}
              className="h-full bg-white transition-all duration-100 w-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
