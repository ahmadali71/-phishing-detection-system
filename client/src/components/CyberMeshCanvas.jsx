import React, { useRef, useEffect } from 'react';

/**
 * CyberMeshCanvas
 * Interactive neural constellation mesh animation.
 * Features floating cyber nodes, dynamic distance-based connecting lines,
 * and mouse-reactive particle movement (matches user screenshot).
 * When fullPage=true, spans the entire viewport as a fixed 60fps interactive background.
 */
export default function CyberMeshCanvas({
  fullPage = true,
  particleCount = 70,
  nodeColor = '#38bdf8',
  lineColor = 'rgba(56, 189, 248, ',
  accentNodeColor = '#10b981',
  maxDistance = 140,
  speed = 0.65,
  style = {},
  className = ''
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = fullPage ? window.innerWidth : (canvas.parentElement?.offsetWidth || window.innerWidth));
    let height = (canvas.height = fullPage ? window.innerHeight : (canvas.parentElement?.offsetHeight || window.innerHeight));

    // Mouse coordinates
    const mouse = {
      x: null,
      y: null,
      radius: 170
    };

    const handleMouseMove = (e) => {
      if (fullPage) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      } else {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      }
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = fullPage ? window.innerWidth : (canvas.parentElement?.offsetWidth || window.innerWidth);
      height = canvas.height = fullPage ? window.innerHeight : (canvas.parentElement?.offsetHeight || window.innerHeight);
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Particle definition
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.radius = Math.random() * 2.2 + 1.4;
        this.isAccent = Math.random() > 0.78;
        this.baseRadius = this.radius;
        this.pulseAngle = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundaries
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Gentle pulse
        this.pulseAngle += 0.03;
        this.radius = this.baseRadius + Math.sin(this.pulseAngle) * 0.6;

        // Mouse interaction (moveable effect)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            // Move slightly with cursor
            this.x -= Math.cos(angle) * force * 2.0;
            this.y -= Math.sin(angle) * force * 2.0;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.isAccent ? accentNodeColor : nodeColor;
        ctx.shadowColor = this.isAccent ? accentNodeColor : nodeColor;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Draw outer translucent halo for larger nodes
        if (this.isAccent || this.baseRadius > 2.5) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = this.isAccent ? 'rgba(16, 185, 129, 0.14)' : 'rgba(56, 189, 248, 0.14)';
          ctx.fill();
        }
      }
    }

    let particles = [];
    function initParticles() {
      particles = [];
      const densityCount = Math.floor((width * height) / 16000) + 25;
      const count = Math.min(particleCount, densityCount);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    initParticles();

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect particles with dynamic lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.45;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${lineColor}${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }

        // Connect to mouse cursor if nearby
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p1.x;
          const dy = mouse.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.7;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.lineWidth = 1.15;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [fullPage, particleCount, nodeColor, lineColor, accentNodeColor, maxDistance, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`cyber-mesh-canvas ${className}`}
      style={{
        position: fullPage ? 'fixed' : 'absolute',
        top: 0,
        left: 0,
        width: fullPage ? '100vw' : '100%',
        height: fullPage ? '100vh' : '100%',
        pointerEvents: 'none',
        zIndex: fullPage ? 0 : 2,
        opacity: 0.95,
        ...style
      }}
    />
  );
}
