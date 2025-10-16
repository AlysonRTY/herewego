import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/StatCard";
import GameCard from "@/components/GameCard";
import GradientText from "@/components/GradientText";
import ColorPalette from "@/components/ColorPalette";
import FeatureGrid from "@/components/FeatureGrid";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

interface RippleEffect {
  id: number;
  x: number;
  y: number;
  radius: number;
  opacity: number;
}

// Constants for better maintainability
const PARTICLE_CONFIG = {
  MAX_PARTICLES: 50,
  LIFE_DECAY: 0.02,
  GRAVITY: 0.1,
  VELOCITY_RANGE: 4,
  SIZE_RANGE: { min: 2, max: 8 },
} as const;

const RIPPLE_CONFIG = {
  MAX_RIPPLES: 10,
  GROWTH_RATE: 3,
  OPACITY_DECAY: 0.02,
} as const;

const CANVAS_CONFIG = {
  WIDTH: 600,
  HEIGHT: 400,
} as const;

export default function Playground() {
  // Interactive States
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const [brushSize, setBrushSize] = useState(5);

  // Animation States
  const [floatingElements, setFloatingElements] = useState<
    Array<{ id: number; x: number; y: number; rotation: number }>
  >([]);
  const [waveOffset, setWaveOffset] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(0.5);

  // Interactive Counters
  const [clickCount, setClickCount] = useState(0);
  const [hoverCount, setHoverCount] = useState(0);
  const [keyPresses, setKeyPresses] = useState(0);

  // Canvas and Animation Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particleIdRef = useRef(0);
  const rippleIdRef = useRef(0);

  // Initialize floating elements
  useEffect(() => {
    const initializeElements = () => {
      const elements = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * (window.innerWidth || 1200),
        y: Math.random() * (window.innerHeight || 800),
        rotation: Math.random() * 360,
      }));
      setFloatingElements(elements);
    };

    initializeElements();

    // Reinitialize on window resize
    const handleResize = () => initializeElements();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mouse tracking with throttling
  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });

        // Create particles on mouse move (reduced frequency)
        if (Math.random() > 0.9) {
          const particle: Particle = {
            id: particleIdRef.current++,
            x: e.clientX,
            y: e.clientY,
            vx: (Math.random() - 0.5) * PARTICLE_CONFIG.VELOCITY_RANGE,
            vy: (Math.random() - 0.5) * PARTICLE_CONFIG.VELOCITY_RANGE,
            size:
              Math.random() *
                (PARTICLE_CONFIG.SIZE_RANGE.max -
                  PARTICLE_CONFIG.SIZE_RANGE.min) +
              PARTICLE_CONFIG.SIZE_RANGE.min,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            life: 1,
          };
          setParticles((prev) => [
            ...prev.slice(-PARTICLE_CONFIG.MAX_PARTICLES),
            particle,
          ]);
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Keyboard tracking
  useEffect(() => {
    const handleKeyPress = () => {
      setKeyPresses((prev) => prev + 1);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Wave animation with RAF for better performance
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      setWaveOffset((prev) => (prev + 0.05) % (Math.PI * 2));
      setGlowIntensity((prev) => 0.3 + Math.sin(Date.now() * 0.004) * 0.2);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Floating elements animation with RAF
  useEffect(() => {
    let animationId: number;

    const animateElements = () => {
      setFloatingElements((prev) =>
        prev.map((el) => ({
          ...el,
          x: el.x + Math.sin(Date.now() * 0.0005 + el.id) * 0.3,
          y: el.y + Math.cos(Date.now() * 0.0005 + el.id) * 0.2,
          rotation: el.rotation + 0.3,
        }))
      );
      animationId = requestAnimationFrame(animateElements);
    };

    animationId = requestAnimationFrame(animateElements);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Particle system
  const createParticle = useCallback((x: number, y: number) => {
    const particle: Particle = {
      id: particleIdRef.current++,
      x,
      y,
      vx: (Math.random() - 0.5) * PARTICLE_CONFIG.VELOCITY_RANGE,
      vy: (Math.random() - 0.5) * PARTICLE_CONFIG.VELOCITY_RANGE,
      size:
        Math.random() *
          (PARTICLE_CONFIG.SIZE_RANGE.max - PARTICLE_CONFIG.SIZE_RANGE.min) +
        PARTICLE_CONFIG.SIZE_RANGE.min,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      life: 1,
    };

    setParticles((prev) => [
      ...prev.slice(-PARTICLE_CONFIG.MAX_PARTICLES),
      particle,
    ]);
  }, []);

  // Ripple effect
  const createRipple = useCallback((x: number, y: number) => {
    const ripple: RippleEffect = {
      id: rippleIdRef.current++,
      x,
      y,
      radius: 0,
      opacity: 1,
    };

    setRipples((prev) => [...prev.slice(-RIPPLE_CONFIG.MAX_RIPPLES), ripple]);
  }, []);

  // Update particles and ripples
  useEffect(() => {
    const animate = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - PARTICLE_CONFIG.LIFE_DECAY,
            vy: p.vy + PARTICLE_CONFIG.GRAVITY, // gravity
          }))
          .filter((p) => p.life > 0)
      );

      setRipples((prev) =>
        prev
          .map((r) => ({
            ...r,
            radius: r.radius + RIPPLE_CONFIG.GROWTH_RATE,
            opacity: r.opacity - RIPPLE_CONFIG.OPACITY_DECAY,
          }))
          .filter((r) => r.opacity > 0)
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Canvas drawing with proper coordinate calculation
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const coords = getCanvasCoordinates(e);

    // Start drawing immediately
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const coords = getCanvasCoordinates(e);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  // Touch support for mobile
  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    handleCanvasMouseDown(mouseEvent as any);
  };

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    handleCanvasMouseMove(mouseEvent as any);
  };

  const handleCanvasTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    handleCanvasMouseUp();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
    }
  };

  // Interactive click handler
  const handleInteractiveClick = (e: React.MouseEvent) => {
    setClickCount((prev) => prev + 1);
    // Use current mouse position instead of event coordinates for better accuracy
    createRipple(mousePos.x, mousePos.y);
    createParticle(mousePos.x, mousePos.y);
  };

  const colors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
  ];

  const playgroundFeatures = [
    {
      icon: "🎨",
      title: "Interactive Canvas",
      description: "Zeichne mit verschiedenen Farben und Pinselgrößen",
    },
    {
      icon: "✨",
      title: "Particle System",
      description: "Dynamische Partikel folgen deiner Maus",
    },
    {
      icon: "🌊",
      title: "Animated Waves",
      description: "Flüssige Animationen im Hintergrund",
    },
    {
      icon: "🎯",
      title: "Click Tracking",
      description: "Jeder Klick wird gezählt und visualisiert",
    },
    {
      icon: "🌈",
      title: "Color Morphing",
      description: "Sich ständig verändernde Farbverläufe",
    },
    {
      icon: "💫",
      title: "Ripple Effects",
      description: "Welleneffekte bei jedem Klick",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating geometric shapes */}
        {floatingElements.map((el) => (
          <div
            key={el.id}
            className="absolute w-8 h-8 opacity-20"
            style={{
              left: `${
                ((el.x % window.innerWidth) / window.innerWidth) * 100
              }%`,
              top: `${
                ((el.y % window.innerHeight) / window.innerHeight) * 100
              }%`,
              transform: `rotate(${el.rotation}deg)`,
              transition: "all 0.1s ease-out",
            }}
          >
            <div
              className={`w-full h-full ${
                el.id % 4 === 0
                  ? "bg-blue-400 rounded-full"
                  : el.id % 4 === 1
                  ? "bg-purple-400 rotate-45"
                  : el.id % 4 === 2
                  ? "bg-pink-400 rounded-full"
                  : "bg-cyan-400"
              }`}
            />
          </div>
        ))}

        {/* Animated waves */}
        <div className="absolute bottom-0 left-0 w-full h-32 opacity-30">
          <svg viewBox="0 0 1200 120" className="w-full h-full">
            <path
              d={`M0,60 Q300,${
                60 + Math.sin(waveOffset) * 20
              } 600,60 T1200,60 V120 H0 Z`}
              fill="url(#waveGradient)"
            />
            <defs>
              <linearGradient
                id="waveGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="fixed rounded-full pointer-events-none z-30"
            style={{
              left: particle.x - particle.size / 2,
              top: particle.y - particle.size / 2,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.life,
            }}
          />
        ))}

        {/* Ripples */}
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="fixed border-2 border-white rounded-full pointer-events-none z-40"
            style={{
              left: ripple.x - ripple.radius,
              top: ripple.y - ripple.radius,
              width: ripple.radius * 2,
              height: ripple.radius * 2,
              opacity: ripple.opacity,
            }}
          />
        ))}

        {/* Mouse follower */}
        <div
          className="fixed w-6 h-6 bg-white rounded-full pointer-events-none mix-blend-difference z-50"
          style={{
            left: mousePos.x - 12,
            top: mousePos.y - 12,
            boxShadow: `0 0 ${
              20 * glowIntensity
            }px rgba(255, 255, 255, ${glowIntensity})`,
          }}
        />
      </div>

      <div
        className="container mx-auto px-4 py-8 relative z-10"
        onClick={handleInteractiveClick}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <GradientText
            className="text-6xl md:text-8xl mb-6"
            gradient="from-cyan-400 via-purple-400 to-pink-400"
            animate={true}
          >
            ✨ PLAYGROUND ✨
          </GradientText>
          <div className="h-2 w-32 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full mx-auto mb-6 animate-pulse" />
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Ein interaktiver Spielplatz voller Animationen, Effekte und cooler
            Features! Bewege deine Maus, klicke herum und entdecke alle
            versteckten Interaktionen! 🚀
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon="👆"
            value={clickCount}
            label="Clicks"
            className="bg-white/10 backdrop-blur-md border-white/20 text-white"
            gradient="from-blue-400 to-cyan-400"
          />
          <StatCard
            icon="🖱️"
            value={Math.round(mousePos.x + mousePos.y)}
            label="Mouse Distance"
            className="bg-white/10 backdrop-blur-md border-white/20 text-white"
            gradient="from-green-400 to-blue-400"
          />
          <StatCard
            icon="⌨️"
            value={keyPresses}
            label="Key Presses"
            className="bg-white/10 backdrop-blur-md border-white/20 text-white"
            gradient="from-purple-400 to-pink-400"
          />
          <StatCard
            icon="✨"
            value={particles.length}
            label="Active Particles"
            className="bg-white/10 backdrop-blur-md border-white/20 text-white"
            gradient="from-yellow-400 to-orange-400"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Drawing Canvas */}
          <GameCard
            title="🎨 Digital Canvas"
            className="bg-white/10 backdrop-blur-md border-white/20"
          >
            {/* Color Palette */}
            <ColorPalette
              colors={colors}
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
            />

            {/* Brush Size */}
            <div className="flex items-center gap-4">
              <span className="text-white text-sm">Brush Size:</span>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-white text-sm w-8">{brushSize}px</span>
            </div>

            {/* Canvas */}
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={CANVAS_CONFIG.WIDTH}
                height={CANVAS_CONFIG.HEIGHT}
                className="w-full max-w-full border-2 border-white/30 rounded-lg bg-white/5 cursor-crosshair touch-none"
                style={{ imageRendering: "auto" }}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                onTouchStart={handleCanvasTouchStart}
                onTouchMove={handleCanvasTouchMove}
                onTouchEnd={handleCanvasTouchEnd}
              />
              <div className="absolute top-2 left-2 text-white/50 text-xs pointer-events-none">
                Click and drag to draw! 🎨
              </div>
            </div>

            <Button
              onClick={clearCanvas}
              variant="outline"
              className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              🗑️ Clear Canvas
            </Button>
          </GameCard>

          {/* Interactive Elements */}
          <div className="space-y-6">
            {/* Hover Counter */}
            <GameCard
              title="🎯 Hover Challenge"
              className="bg-white/10 backdrop-blur-md border-white/20"
            >
              <div
                className="w-full h-32 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-lg border-2 border-white/30 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-purple-500/50 hover:to-pink-500/50"
                onMouseEnter={() => setHoverCount((prev) => prev + 1)}
              >
                <div className="text-center text-white">
                  <div className="text-3xl mb-2">🎪</div>
                  <div className="text-lg font-bold">
                    Hover Count: {hoverCount}
                  </div>
                  <div className="text-sm opacity-80">Hover over me!</div>
                </div>
              </div>
            </GameCard>

            {/* Color Morphing Box */}
            <GameCard
              title="🌈 Color Morpher"
              className="bg-white/10 backdrop-blur-md border-white/20"
            >
              <div
                className="w-full h-32 rounded-lg border-2 border-white/30 transition-all duration-1000 cursor-pointer"
                style={{
                  background: `linear-gradient(${waveOffset * 50}deg, 
                    hsl(${(waveOffset * 100) % 360}, 70%, 60%), 
                    hsl(${(waveOffset * 100 + 120) % 360}, 70%, 60%), 
                    hsl(${(waveOffset * 100 + 240) % 360}, 70%, 60%))`,
                }}
                onClick={() => createParticle(mousePos.x, mousePos.y)}
              >
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                  Click for Particles! ✨
                </div>
              </div>
            </GameCard>

            {/* Particle Explosion Button */}
            <GameCard
              title="💥 Particle Explosion"
              className="bg-white/10 backdrop-blur-md border-white/20"
            >
              <Button
                onClick={() => {
                  for (let i = 0; i < 20; i++) {
                    setTimeout(() => {
                      createParticle(
                        mousePos.x + (Math.random() - 0.5) * 200,
                        mousePos.y + (Math.random() - 0.5) * 200
                      );
                    }, i * 50);
                  }
                }}
                className="w-full h-16 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
              >
                🚀 EXPLODE! 💥
              </Button>
            </GameCard>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="mt-12">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl">
                🎮 Features in diesem Playground
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FeatureGrid features={playgroundFeatures} />
            </CardContent>
          </Card>
        </div>

        {/* Easter Egg */}
        <div className="mt-8 text-center">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 text-lg animate-bounce">
            🎉 Du hast {clickCount + hoverCount + keyPresses} Interaktionen
            gemacht! 🎉
          </Badge>
        </div>
      </div>
    </div>
  );
}
