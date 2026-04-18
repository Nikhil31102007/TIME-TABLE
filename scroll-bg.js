const CONFIG = {
  frameCount: 240,
  // Update this path to wherever your frames are stored
  framePath: './ezgif-2963a7e722fb4d66-jpg/',
  framePrefix: 'ezgif-frame-',
  // Using .jpg per your downloaded folder, change to .webp if you convert them later
  frameSuffix: '.jpg',
  zeroPad: 3,                   // 001 to 240
  scrollHeight: '500vh',        // Total scroll distance for full animation
  lerpSpeed: 0.12,              // Smoothing factor (lower = smoother but slower)
  startOnLoad: true
};

(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d', { alpha: false }); // alpha false can boost performance
  const loader = document.getElementById('frame-loader');
  const loadingBar = document.getElementById('loading-bar-progress');
  const wrapper = document.getElementById('scroll-anim-wrapper');
  
  if (!canvas || !wrapper) {
      console.warn('Scroll Animation: Missing canvas or wrapper elements.');
      return;
  }
  
  wrapper.style.minHeight = CONFIG.scrollHeight;
  
  const frames = [];
  let loadedCount = 0;
  
  let currentFrame = 0;
  let targetFrame = 0;
  
  // Format filename with zero padding
  function getFramePath(index) {
    const paddedIndex = String(index).padStart(CONFIG.zeroPad, '0');
    return `${CONFIG.framePath}${CONFIG.framePrefix}${paddedIndex}${CONFIG.frameSuffix}`;
  }
  
  // Resize canvas to fill window
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(Math.round(currentFrame));
  }
  
  window.addEventListener('resize', resizeCanvas);
  
  // Preload all 240 images into memory
  function preloadImages() {
    for (let i = 1; i <= CONFIG.frameCount; i++) {
        const img = new Image();
        img.src = getFramePath(i);
        
        img.onload = () => {
            loadedCount++;
            const progress = (loadedCount / CONFIG.frameCount) * 100;
            if (loadingBar) loadingBar.style.width = `${progress}%`;
            
            if (loadedCount === CONFIG.frameCount) {
                // Done loading
                setTimeout(() => {
                    if (loader) {
                        loader.style.opacity = '0';
                        setTimeout(() => loader.style.display = 'none', 500);
                    }
                    initAnimation();
                }, 300);
            }
        };
        
        img.onerror = () => {
            console.error(`Failed to load image: ${img.src}`);
            // Increment loaded count anyway to prevent hanging on a missing image
            loadedCount++;
            if (loadedCount === CONFIG.frameCount) {
                if (loader) {
                    loader.style.opacity = '0';
                    setTimeout(() => loader.style.display = 'none', 500);
                }
                initAnimation();
            }
        };
        
        frames.push(img);
    }
  }
  
  // Cover calculation for rendering frames
  function drawFrame(frameIndex) {
    if (frames.length === 0 || !frames[0].complete) return;
    
    // Clamp frame index between 0 and frameCount - 1
    let idx = Math.min(CONFIG.frameCount - 1, Math.max(0, frameIndex));
    const img = frames[idx];
    
    if (!img || !img.complete || img.naturalWidth === 0) return;
    
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    
    // Calculate scale to "cover" the canvas
    const scale = Math.max(cw / iw, ch / ih);
    const width = iw * scale;
    const height = ih * scale;
    
    // Center the image
    const x = (cw - width) / 2;
    const y = (ch - height) / 2;
    
    // Clear canvas and draw
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, width, height);
  }
  
  // RAF loop for smooth playback
  function loop() {
    // Lerp smoothing between current and target frame
    currentFrame += (targetFrame - currentFrame) * CONFIG.lerpSpeed;
    
    // Draw the rounded current frame
    drawFrame(Math.round(currentFrame));
    
    requestAnimationFrame(loop);
  }
  
  // Initialize scrolling and animation loop
  function initAnimation() {
    resizeCanvas();
    
    // Scroll handler - strictly maps scroll position to targetFrame
    function onScroll() {
       const scrollTop = window.scrollY;
       const maxScroll = wrapper.scrollHeight - window.innerHeight;
       let scrollProgress = scrollTop / maxScroll;
       
       // Handle case where body height isn't fully calculated yet or user scrolls past limits
       scrollProgress = Math.max(0, Math.min(1, scrollProgress));
       
       // frameIndex is 0 to frameCount - 1
       targetFrame = scrollProgress * (CONFIG.frameCount - 1);
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initial calculation
    onScroll();
    
    // Start RAF loop
    requestAnimationFrame(loop);
  }
  
  if (CONFIG.startOnLoad) {
    window.addEventListener('DOMContentLoaded', preloadImages);
  } else {
    preloadImages();
  }
})();
