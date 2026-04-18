"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CONFIG = {
  frameCount: 220,
  framePath: "/frames/",
  framePrefix: "ezgif-frame-",
  frameSuffix: ".webp",
  zeroPad: 3,
  scrollHeight: "500vh",
  sourceFrameStart: 1,
  playbackFrameStart: 0,
  playbackFrameEnd: 219,
  maxDevicePixelRatio: 2,
} as const;

export default function ScrollCanvas() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) {
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      return;
    }

    const totalPlaybackFrames =
      CONFIG.playbackFrameEnd - CONFIG.playbackFrameStart + 1;
    if (CONFIG.frameCount !== totalPlaybackFrames) {
      console.warn(
        "ScrollCanvas: frameCount does not match playback range. Ensure config values are aligned.",
      );
    }
    const totalFramesToLoad = totalPlaybackFrames;
    const frames: Array<HTMLImageElement | null> = Array.from(
      { length: totalFramesToLoad },
      () => null,
    );

    let isUnmounted = false;
    let activeFrame = CONFIG.playbackFrameStart;
    let trigger: ScrollTrigger | undefined;
    let resizeRaf: number | null = null;

    const frameUrl = (logicalFrameIndex: number) => {
      const sourceFrame = CONFIG.sourceFrameStart + logicalFrameIndex;
      const padded = String(sourceFrame).padStart(CONFIG.zeroPad, "0");
      return `${CONFIG.framePath}${CONFIG.framePrefix}${padded}${CONFIG.frameSuffix}`;
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxDevicePixelRatio);
      const width = Math.floor(window.innerWidth * dpr);
      const height = Math.floor(window.innerHeight * dpr);
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      drawFrame(activeFrame);
    };

    const pickFrame = (frameIndex: number) => {
      const clamped = Math.max(
        CONFIG.playbackFrameStart,
        Math.min(CONFIG.playbackFrameEnd, frameIndex),
      );
      const offset = clamped - CONFIG.playbackFrameStart;
      const exact = frames[offset];
      if (exact?.complete && exact.naturalWidth > 0) {
        return exact;
      }

      for (let delta = 1; delta < totalFramesToLoad; delta += 1) {
        const next = frames[offset + delta];
        if (next?.complete && next.naturalWidth > 0) return next;
        const prev = frames[offset - delta];
        if (prev?.complete && prev.naturalWidth > 0) return prev;
      }

      return null;
    };

    const drawFrame = (frameIndex: number) => {
      const image = pickFrame(frameIndex);
      if (!image) {
        return;
      }

      activeFrame = frameIndex;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = image.naturalWidth;
      const ih = image.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const width = iw * scale;
      const height = ih * scale;
      const x = (cw - width) * 0.5;
      const y = (ch - height) * 0.5;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(image, x, y, width, height);
    };

    const onResize = () => {
      if (resizeRaf !== null) return;
      resizeRaf = window.requestAnimationFrame(() => {
        resizeRaf = null;
        resizeCanvas();
      });
    };

    const loadFrame = async (frameIndex: number) => {
      const image = new Image();
      image.decoding = "async";
      image.src = frameUrl(frameIndex);

      try {
        if ("decode" in image) {
          await image.decode();
        } else {
          await new Promise<void>((resolve, reject) => {
            image.onload = () => resolve();
            image.onerror = () => reject(new Error("Failed to load frame"));
          });
        }
      } catch {
        return null;
      }

      return image;
    };

    const initialize = async () => {
      resizeCanvas();
      const firstFrame = await loadFrame(0);
      if (isUnmounted) return;
      frames[0] = firstFrame;

      if (firstFrame?.naturalWidth) {
        drawFrame(CONFIG.playbackFrameStart);
      }

      await Promise.all(
        frames.map(async (_, logicalIndex) => {
          if (logicalIndex === 0) return;
          const image = await loadFrame(logicalIndex);
          if (isUnmounted) return;
          frames[logicalIndex] = image;
        }),
      );

      if (isUnmounted) return;
      if (!frames.some((image) => image?.naturalWidth)) {
        console.error(
          "ScrollCanvas: Failed to load any frame images. Check CONFIG path/prefix/suffix.",
        );
        if (fallbackRef.current) {
          fallbackRef.current.style.opacity = "1";
        }
        return;
      }

      if (fallbackRef.current) {
        fallbackRef.current.style.opacity = "0";
      }
      drawFrame(CONFIG.playbackFrameStart);
      const playbackRange = CONFIG.playbackFrameEnd - CONFIG.playbackFrameStart;

      trigger = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const frame = Math.round(
            self.progress * playbackRange + CONFIG.playbackFrameStart,
          );
          drawFrame(frame);
        },
      });

      window.addEventListener("resize", onResize);
      ScrollTrigger.refresh();
    };

    const gsapCtx = gsap.context(() => {
      void initialize();
    }, container);

    return () => {
      isUnmounted = true;
      window.removeEventListener("resize", onResize);
      if (resizeRaf !== null) {
        window.cancelAnimationFrame(resizeRaf);
      }
      trigger?.kill();
      gsapCtx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-black"
      style={{ height: CONFIG.scrollHeight }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden={true}
        />
        <div
          ref={fallbackRef}
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm tracking-[0.2em] text-white/45 uppercase opacity-0 transition-opacity"
        >
          Frames unavailable
        </div>
      </div>
    </section>
  );
}
