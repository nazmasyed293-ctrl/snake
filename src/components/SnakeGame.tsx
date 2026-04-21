import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2; // Milliseconds to decrease from interval per food eaten

type Point = { x: number; y: number };

// Helper to generate food not on the snake
const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!isOnSnake) break;
  }
  return newFood;
};

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 }); // UP
  const [nextDirection, setNextDirection] = useState<Point>({ x: 0, y: -1 });
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  
  // Start the game by pressing an arrow key if it hasn't properly started
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  // Load high score on mount
  useEffect(() => {
    const saved = localStorage.getItem('neonSnakeHighScore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const resetGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ]);
    setDirection({ x: 0, y: -1 });
    setNextDirection({ x: 0, y: -1 });
    setScore(0);
    setGameOver(false);
    setHasStarted(false);
    setFood(generateFood([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]));
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default scrolling for game controls
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "Enter"].includes(e.key)) {
      e.preventDefault();
    }

    if (gameOver) {
      if (e.key === "Enter") resetGame();
      return;
    }

    if (!hasStarted && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      setHasStarted(true);
    }

    if (e.key === ' ' || e.key === 'Escape') {
      setIsPaused(p => !p);
      return;
    }

    setNextDirection((prevDir) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.y !== 1) return { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.y !== -1) return { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.x !== 1) return { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.x !== -1) return { x: 1, y: 0 };
          break;
      }
      return prevDir;
    });
  }, [direction, gameOver, hasStarted]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const currentDir = nextDirection;
        setDirection(currentDir); // Sync actual direction used this tick

        const newHead = {
          x: head.x + currentDir.x,
          y: head.y + currentDir.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          handleGameOver();
          return prevSnake;
        }

        // Check self collision (ignore the tail tip since it will move, unless we just ate food)
        const isSelfCollision = prevSnake.some(
          (segment, index) => index !== prevSnake.length - 1 && segment.x === newHead.x && segment.y === newHead.y
        );

        if (isSelfCollision) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check if eaten food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
          // Don't pop(), making it longer
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, INITIAL_SPEED - (Math.floor(score / 10) * SPEED_INCREMENT));
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [direction, nextDirection, food, gameOver, isPaused, hasStarted, score]);

  const handleGameOver = () => {
    setGameOver(true);
    setHasStarted(false);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('neonSnakeHighScore', score.toString());
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center relative">
      
      {/* Absolute positioning for scoreboard matching the mockup view over the center area */}
      <div className="absolute top-0 right-0 text-right z-10 pointer-events-none hidden md:block">
        <div className="text-2xl tracking-widest text-[#0ff] uppercase">SCORE</div>
        <div className="text-6xl font-black text-[#f0f] leading-none">{score.toString()}</div>
      </div>
      
      {/* High Score styled as glass panel, placed relative in mobile or absolute left in wide views */}
      <div className="absolute top-0 left-0 xl:-left-40 2xl:-left-60 raw-border p-4 space-y-2 pointer-events-none z-10 hidden md:block">
        <div className="text-2xl tracking-widest text-[#f0f] uppercase">MAX_OVERFLOW</div>
        <div className="text-4xl font-black text-[#0ff]">{highScore.toString()}</div>
      </div>

      {/* Mobile headers */}
      <div className="flex md:hidden w-full justify-between items-end mb-4 px-4">
        <div className="raw-border p-2 flex flex-col">
          <span className="text-[#f0f] text-sm uppercase tracking-wider">MAX_OVERFLOW</span>
          <span className="text-[#0ff] text-2xl font-black">{highScore.toString()}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[#0ff] text-sm uppercase tracking-wider">SCORE</span>
          <span className="text-[#f0f] text-4xl font-black">{score.toString()}</span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="game-grid relative mt-4 lg:mt-0"
        style={{
          width: 'clamp(280px, 50vmin, 500px)',
          height: 'clamp(280px, 50vmin, 500px)',
        }}
      >
        {/* Snake cells */}
        {snake.map((segment, index) => {
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute snake-body ${index === 0 ? 'z-10 bg-white border-[#f0f]' : 'bg-[#0ff] border-black'}`}
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(segment.x * 100) / GRID_SIZE}%`,
                top: `${(segment.y * 100) / GRID_SIZE}%`,
              }}
            />
          );
        })}

        {/* Food cell */}
        <div
          className="absolute food animate-pulse"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x * 100) / GRID_SIZE}%`,
            top: `${(food.y * 100) / GRID_SIZE}%`,
          }}
        />

        {/* Overlays */}
        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 text-center z-20 border-4 border-[#0ff]">
            <p className="text-[#f0f] text-2xl animate-pulse uppercase tracking-widest font-bold">&gt; DEPLOY_SNAKE.exe</p>
          </div>
        )}

        {isPaused && hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20 border-4 border-[#0ff]">
            <h2 className="text-4xl font-black tracking-widest text-[#f0f] glitch" data-text="PAUSED_">PAUSED_</h2>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 raw-border flex flex-col items-center justify-center p-6 z-20 bg-black">
            <h2 className="text-4xl font-black text-white mb-2 uppercase text-center glitch" data-text="FATAL_ERR">
              FATAL_ERR
            </h2>
            <p className="text-[#f0f] text-xl tracking-widest uppercase mb-8">&gt; CORE_DUMPED</p>
            
            <button 
              onClick={resetGame}
              className="flex items-center gap-3 px-6 py-3 border-4 border-[#0ff] hover:bg-[#0ff] hover:text-black text-white active:scale-95 transition-all font-black tracking-widest uppercase text-xl"
            >
              <RotateCcw className="w-6 h-6" />
              REBOOT
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-[#0ff] text-xl uppercase tracking-widest text-center px-4 bg-black p-2 border-2 border-[#f0f] font-bold">
         [ARROWS_TO_EXECUTE] // [AUDIO_SYNC_RECOMMENDED]
      </div>
    </div>
  );
}
