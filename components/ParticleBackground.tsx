import React, { useRef, useEffect } from 'react';

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    // Parallax Scroll Factor
    let scrollY = window.scrollY;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
      speedY: number;
      vx: number;
      vy: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 2 + 0.5;
        this.density = (Math.random() * 20) + 1;
        this.speedY = Math.random() * 0.5 + 0.1;
        this.vx = (Math.random() - 0.5) * 0.5; // Horizontal drift
        this.vy = (Math.random() - 0.5) * 0.5; // Vertical drift
      }

      update() {
        const parallaxFactor = this.size * 0.5; 
        const scrollOffset = scrollY * parallaxFactor * 0.2;

        this.y -= this.speedY;
        this.x += this.vx;

        // Reset positions
        if (this.y < -scrollOffset - 50) {
            this.y = height + Math.abs(scrollOffset);
            this.x = Math.random() * width;
        }
        if (this.x > width || this.x < 0) {
            this.vx *= -1;
        }

        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = (mouseY + scrollY) - (this.y + scrollOffset);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;
        
        if (distance < maxDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * this.density;
            const directionY = forceDirectionY * force * this.density;
            this.x -= directionX;
            this.y -= directionY;
        }

        return this.y - scrollOffset; // Return visual Y for connection drawing
      }

      draw(visualY: number) {
        if (!ctx) return;
        const wrappedY = (visualY % height + height) % height;
        
        ctx.fillStyle = `rgba(200, 240, 255, ${this.size * 0.2})`;
        ctx.beginPath();
        ctx.arc(this.x, wrappedY, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        return wrappedY;
      }
    }

    const initParticles = () => {
      particles = [];
      const numberOfParticles = (width * height) / 12000; // um pouco menos denso para as linhas não poluirem
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      
      // Update and Draw Particles
      const particlePositions = particles.map(p => ({
        x: p.x,
        y: p.update()
      }));

      // Draw Connections first (so they are behind particles)
      ctx.lineWidth = 0.5;
      for (let a = 0; a < particles.length; a++) {
        const pA = particles[a];
        const yA = (particlePositions[a].y % height + height) % height;
        
        for (let b = a; b < particles.length; b++) {
          const pB = particles[b];
          const yB = (particlePositions[b].y % height + height) % height;
          
          const dx = pA.x - pB.x;
          const dy = yA - yB;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const opacity = 1 - (distance / 100);
            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.15})`; // Cyan connections
            ctx.beginPath();
            ctx.moveTo(pA.x, yA);
            ctx.lineTo(pB.x, yB);
            ctx.stroke();
          }
        }
        // Draw particle on top
        pA.draw(particlePositions[a].y);
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none bg-[#050505]"
    />
  );
};