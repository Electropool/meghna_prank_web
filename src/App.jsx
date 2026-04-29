import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const STICKER_COUNT = 12;
const SPAWN_INTERVAL = 800; // Faster spawn
const ANGRY_BIRD_CHANCE = 0.4;

const STICKER_IMAGES = [
  '/assets/meghna_image_1.png',
  '/assets/meghna_image_2.png',
  '/assets/meghna_image_3.png',
  '/assets/meghna_image_4.png',
  '/assets/meghna_image_5.png',
  '/assets/meghna_image_6.png',
  '/assets/meghna_image_7.png',
  '/assets/meghna_image_8.png',
  '/assets/meghna_image_9.png',
  '/assets/meghna_image_10.png',
];

const ANGRY_BIRD = '/assets/angry_bird.png';

const getRandomSticker = () => {
  if (Math.random() < ANGRY_BIRD_CHANCE) return ANGRY_BIRD;
  return STICKER_IMAGES[Math.floor(Math.random() * STICKER_IMAGES.length)];
};

function App() {
  const [isPressed, setIsPressed] = useState(false);
  const [stickers, setStickers] = useState([]);
  const audioRef = useRef(null);
  const requestRef = useRef();

  const createSticker = () => {
    const size = window.innerWidth < 768 ? 120 : 180;
    return {
      id: Math.random(),
      src: getRandomSticker(),
      x: Math.random() * (window.innerWidth - size),
      y: Math.random() * (window.innerHeight - size),
      dx: (Math.random() - 0.5) * 5,
      dy: (Math.random() - 0.5) * 5,
      opacity: Math.random() * 0.3 + 0.4,
      spawnedAt: Date.now(),
      lifetime: 10000 + Math.random() * 5000,
      isFadingOut: false,
    };
  };

  const animate = () => {
    setStickers((prev) => 
      prev.map((s) => {
        const size = window.innerWidth < 768 ? 120 : 180;
        let { x, y, dx, dy } = s;

        x += dx;
        y += dy;

        if (x <= 0 || x >= window.innerWidth - size) {
          dx = -dx;
          x = x <= 0 ? 0 : window.innerWidth - size;
        }
        if (y <= 0 || y >= window.innerHeight - size) {
          dy = -dy;
          y = y <= 0 ? 0 : window.innerHeight - size;
        }

        return { ...s, x, y, dx, dy };
      })
    );
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStickers((prev) => {
        const now = Date.now();
        const active = prev.filter(s => !s.isFadingOut || (now - s.fadeStart < 500));
        
        const updated = active.map(s => {
          if (!s.isFadingOut && now - s.spawnedAt > s.lifetime) {
            return { ...s, isFadingOut: true, fadeStart: now };
          }
          return s;
        });

        if (updated.filter(s => !s.isFadingOut).length < STICKER_COUNT) {
          updated.push(createSticker());
        }

        return updated;
      });
    }, SPAWN_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const clickCountRef = useRef(0);

  const handleButtonClick = () => {
    if (isPressed) return;
    
    setIsPressed(true);
    
    if (audioRef.current) {
      const audio = audioRef.current;
      
      // Randomize speed after the first click
      if (clickCountRef.current > 0) {
        const speeds = [0.5, 0.75, 1.5, 1.75, 2, 3, 5];
        const randomSpeed = speeds[Math.floor(Math.random() * speeds.length)];
        audio.playbackRate = randomSpeed;
        // Pitch correction (keep pitch same despite speed)
        audio.preservesPitch = true;
      } else {
        audio.playbackRate = 1.0;
        audio.preservesPitch = true;
      }
      
      audio.currentTime = 0;
      audio.play().catch(console.error);
      clickCountRef.current += 1;
    }
  };

  return (
    <div className="container">
      {stickers.map((s) => (
        <div
          key={s.id}
          className="sticker"
          style={{
            transform: `translate3d(${s.x}px, ${s.y}px, 0)`,
            opacity: s.isFadingOut ? 0 : 1,
          }}
        >
          <img src={s.src} className="sticker-image" alt="" />
        </div>
      ))}

      <div className="button-container">
        <div className="click-me-indicator">
          <span className="indicator-text">Click me</span>
          <span className="indicator-arrow">↓</span>
        </div>

        <img
          src={isPressed ? '/assets/button_pressed.png' : '/assets/button_unpressed.png'}
          className="prank-button"
          alt="Prank Button"
          onClick={handleButtonClick}
          draggable="false"
        />
      </div>

      <a 
        href="https://discord.gg/QbCcpKCZPF" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="discord-community"
      >
        <svg className="discord-logo" viewBox="0 0 127.14 96.36" xmlns="http://www.w3.org/2000/svg">
          <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.71,32.65-1.82,56.6.4,80.21a105.73,105.73,0,0,0,32.17,16.15,77.7,77.7,0,0,0,6.89-11.11,64.62,64.62,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a64.59,64.59,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14C129.58,50.67,124.4,26.83,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5.07-12.73,11.41-12.73S54,46,53.86,53,48.79,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5.07-12.73,11.44-12.73S96.23,46,96.08,53,91,65.69,84.69,65.69Z" fill="currentColor"/>
        </svg>
        <span>Join Community</span>
      </a>

      <audio
        ref={audioRef}
        src="/assets/ouch_ouch_sound.mp3"
        onEnded={() => setIsPressed(false)}
      />
    </div>
  );
}

export default App;
