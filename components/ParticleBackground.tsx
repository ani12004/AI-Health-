import React, { useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const PARTICLE_DENSITY = 0.00007; // Particles per pixel
const CONNECTION_DISTANCE = 120; // Max distance to connect particles

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    
    const setCanvasSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    setCanvasSize();

    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;

      constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx!.fillStyle = this.color;
        ctx!.fill();
      }

      update() {
        if (this.x > canvas!.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas!.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    const init = () => {
      particles = [];
      const numberOfParticles = (canvas.height * canvas.width) * PARTICLE_DENSITY;
      const particleColor = theme === 'dark' ? 'rgba(0, 191, 255, 0.4)' : 'rgba(10, 132, 255, 0.4)';

      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * (canvas.width - size * 2) + size;
        const y = Math.random() * (canvas.height - size * 2) + size;
        const directionX = (Math.random() * 0.4) - 0.2;
        const directionY = (Math.random() * 0.4) - 0.2;
        particles.push(new Particle(x, y, directionX, directionY, size, particleColor));
      }
    };

    const connect = () => {
        const lineColor = theme === 'dark' ? 'rgba(0, 191, 255, 0.08)' : 'rgba(10, 132, 255, 0.08)';

        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                               + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                if (distance < (CONNECTION_DISTANCE * CONNECTION_DISTANCE)) {
                    ctx!.strokeStyle = lineColor;
                    ctx!.lineWidth = 1;
                    ctx!.beginPath();
                    ctx!.moveTo(particles[a].x, particles[a].y);
                    ctx!.lineTo(particles[b].x, particles[b].y);
                    ctx!.stroke();
                }
            }
        }
    };

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      
      for (const particle of particles) {
        particle.update();
      }
      connect();
    };
    
    init();
    animate();

    const handleResize = () => {
        setCanvasSize();
        init();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]); // Rerun effect if theme changes

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10" />;
};
