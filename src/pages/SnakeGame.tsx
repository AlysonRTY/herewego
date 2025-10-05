import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Position {
  x: number;
  y: number;
}

interface GameState {
  snake: Position[];
  food: Position;
  direction: Position;
  gameOver: boolean;
  score: number;
  highScore: number;
  speed: number;
  level: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = { x: 0, y: -1 };

const FOOD_EMOJIS = ["🍎", "🍊", "🍌", "🍇", "🍓", "🥝", "🍑", "🍒"];
const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

export default function SnakeGame() {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: INITIAL_FOOD,
    direction: INITIAL_DIRECTION,
    gameOver: false,
    score: 0,
    highScore: 0,
    speed: 150,
    level: 1,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentFoodEmoji, setCurrentFoodEmoji] = useState("🍎");
  const [showExplosion, setShowExplosion] = useState<Position | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("snake-high-score");
    if (saved) {
      setGameState((prev) => ({ ...prev, highScore: parseInt(saved) }));
    }
  }, []);

  // Generate random food position
  const generateFood = useCallback((snake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      snake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );

    setCurrentFoodEmoji(
      FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)]
    );
    return newFood;
  }, []);

  // Check collision with walls or self
  const checkCollision = useCallback(
    (head: Position, snake: Position[]): boolean => {
      // Wall collision
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
      ) {
        return true;
      }

      // Self collision
      return snake.some(
        (segment) => segment.x === head.x && segment.y === head.y
      );
    },
    []
  );

  // Move snake
  const moveSnake = useCallback(() => {
    if (!isPlaying || isPaused || gameState.gameOver) return;

    setGameState((prevState) => {
      const { snake, direction, food, score, speed } = prevState;
      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      head.x += direction.x;
      head.y += direction.y;

      if (checkCollision(head, newSnake)) {
        setShowExplosion(head);
        setTimeout(() => setShowExplosion(null), 1000);
        return { ...prevState, gameOver: true };
      }

      newSnake.unshift(head);

      // Check if food is eaten
      if (head.x === food.x && head.y === food.y) {
        const newScore = score + 10;
        const newLevel = Math.floor(newScore / 100) + 1;
        const newSpeed = Math.max(50, speed - 2);
        const newFood = generateFood(newSnake);

        // Save high score
        const newHighScore = Math.max(prevState.highScore, newScore);
        if (newScore > prevState.highScore) {
          localStorage.setItem("snake-high-score", newScore.toString());
        }

        return {
          ...prevState,
          snake: newSnake,
          food: newFood,
          score: newScore,
          highScore: newHighScore,
          speed: newSpeed,
          level: newLevel,
        };
      } else {
        newSnake.pop();
        return { ...prevState, snake: newSnake };
      }
    });
  }, [isPlaying, isPaused, gameState.gameOver, checkCollision, generateFood]);

  // Game loop
  useEffect(() => {
    if (isPlaying && !isPaused && !gameState.gameOver) {
      gameLoopRef.current = setInterval(moveSnake, gameState.speed);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, isPaused, gameState.gameOver, gameState.speed, moveSnake]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying || gameState.gameOver) return;

      const newDirection = DIRECTIONS[e.key as keyof typeof DIRECTIONS];
      if (newDirection) {
        e.preventDefault();
        setGameState((prev) => {
          // Prevent reverse direction
          if (
            newDirection.x === -prev.direction.x ||
            newDirection.y === -prev.direction.y
          ) {
            return prev;
          }
          return { ...prev, direction: newDirection };
        });
      }

      if (e.key === " ") {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying, gameState.gameOver]);

  // Start game
  const startGame = useCallback(() => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      direction: INITIAL_DIRECTION,
      gameOver: false,
      score: 0,
      highScore: gameState.highScore,
      speed: 150,
      level: 1,
    });
    setIsPlaying(true);
    setIsPaused(false);
    setGameStarted(true);
    setShowExplosion(null);
  }, [generateFood, gameState.highScore]);

  // Pause/Resume game
  const togglePause = useCallback(() => {
    if (isPlaying && !gameState.gameOver) {
      setIsPaused((prev) => !prev);
    }
  }, [isPlaying, gameState.gameOver]);

  // Reset game
  const resetGame = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    setGameStarted(false);
    setShowExplosion(null);
    setGameState((prev) => ({
      snake: INITIAL_SNAKE,
      food: INITIAL_FOOD,
      direction: INITIAL_DIRECTION,
      gameOver: false,
      score: 0,
      highScore: prev.highScore,
      speed: 150,
      level: 1,
    }));
  }, []);

  // Touch controls for mobile
  const handleDirectionClick = useCallback(
    (direction: Position) => {
      if (!isPlaying || gameState.gameOver) return;

      setGameState((prev) => {
        if (
          direction.x === -prev.direction.x ||
          direction.y === -prev.direction.y
        ) {
          return prev;
        }
        return { ...prev, direction };
      });
    },
    [isPlaying, gameState.gameOver]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-teal-900/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-green-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-teal-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Explosion effect */}
      {showExplosion && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${(showExplosion.x / GRID_SIZE) * 100}%`,
                top: `${(showExplosion.y / GRID_SIZE) * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${0.5 + Math.random() * 1}s`,
              }}
            >
              {["💥", "⚡", "💫", "✨"][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              🐍 Snake Game
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full mb-4"></div>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Guide the snake to eat food and grow longer! Avoid hitting walls or
            yourself. Use arrow keys or WASD to move.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Game Stats */}
          <div className="flex justify-center gap-4 flex-wrap mb-6">
            <Card className="text-center backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-2 border-green-200/50 shadow-xl">
              <CardContent className="p-4">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {gameState.score}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Score
                </div>
              </CardContent>
            </Card>

            <Card className="text-center backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-2 border-yellow-200/50 shadow-xl">
              <CardContent className="p-4">
                <div className="text-2xl mb-1">👑</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  {gameState.highScore}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Best
                </div>
              </CardContent>
            </Card>

            <Card className="text-center backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-2 border-blue-200/50 shadow-xl">
              <CardContent className="p-4">
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {gameState.level}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Level
                </div>
              </CardContent>
            </Card>

            <Card className="text-center backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-2 border-purple-200/50 shadow-xl">
              <CardContent className="p-4">
                <div className="text-2xl mb-1">📏</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {gameState.snake.length}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Length
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Game Board */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div
                ref={canvasRef}
                className="grid gap-1 p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl border-4 border-green-300/50 dark:border-green-700/50 shadow-2xl backdrop-blur-sm"
                style={{
                  gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                  width: "600px",
                  height: "600px",
                }}
              >
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map(
                  (_, index) => {
                    const x = index % GRID_SIZE;
                    const y = Math.floor(index / GRID_SIZE);

                    const isSnakeHead =
                      gameState.snake[0]?.x === x &&
                      gameState.snake[0]?.y === y;
                    const isSnakeBody = gameState.snake
                      .slice(1)
                      .some((segment) => segment.x === x && segment.y === y);
                    const isFood =
                      gameState.food.x === x && gameState.food.y === y;

                    return (
                      <div
                        key={index}
                        className={`
                        aspect-square rounded-sm transition-all duration-200 flex items-center justify-center text-lg
                        ${
                          isSnakeHead
                            ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg scale-110 animate-pulse"
                            : isSnakeBody
                            ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-md"
                            : isFood
                            ? "bg-gradient-to-br from-yellow-200 to-orange-200 shadow-lg scale-110 animate-bounce"
                            : "bg-green-50/50 dark:bg-green-900/10"
                        }
                      `}
                      >
                        {isSnakeHead && (
                          <span className="text-white text-sm">
                            {gameState.direction.y === -1
                              ? "⬆️"
                              : gameState.direction.y === 1
                              ? "⬇️"
                              : gameState.direction.x === -1
                              ? "⬅️"
                              : "➡️"}
                          </span>
                        )}
                        {isFood && (
                          <span className="animate-spin text-2xl">
                            {currentFoodEmoji}
                          </span>
                        )}
                      </div>
                    );
                  }
                )}
              </div>

              {/* Game Over Overlay */}
              {gameState.gameOver && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Card className="bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50 border-2 border-red-300 dark:border-red-700">
                    <CardContent className="p-6 text-center">
                      <div className="text-6xl mb-4">💀</div>
                      <h3 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-2">
                        Game Over!
                      </h3>
                      <p className="text-red-600 dark:text-red-400 mb-4">
                        Final Score: {gameState.score}
                      </p>
                      <Button
                        onClick={startGame}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      >
                        Play Again 🎮
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Pause Overlay */}
              {isPaused && !gameState.gameOver && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Card className="bg-white/90 dark:bg-gray-800/90">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">⏸️</div>
                      <h3 className="text-xl font-bold mb-2">Paused</h3>
                      <p className="text-muted-foreground mb-4">
                        Press Space or click Resume
                      </p>
                      <Button onClick={togglePause}>Resume ▶️</Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Game Controls */}
          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            {!gameStarted ? (
              <Button
                onClick={startGame}
                className="px-8 py-4 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg transform transition-all duration-300 hover:scale-105"
                size="lg"
              >
                <span className="mr-2 text-xl">🎮</span>
                Start Game
                <span className="ml-2 text-xl">🐍</span>
              </Button>
            ) : (
              <>
                <Button
                  onClick={togglePause}
                  disabled={gameState.gameOver}
                  variant="outline"
                  className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 transform transition-all duration-300 hover:scale-105"
                >
                  {isPaused ? "▶️ Resume" : "⏸️ Pause"}
                </Button>
                <Button
                  onClick={resetGame}
                  variant="outline"
                  className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 transform transition-all duration-300 hover:scale-105"
                >
                  🔄 Reset
                </Button>
              </>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex justify-center mb-6 md:hidden">
            <div className="grid grid-cols-3 gap-2 w-48">
              <div></div>
              <Button
                onClick={() => handleDirectionClick({ x: 0, y: -1 })}
                variant="outline"
                className="aspect-square bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                disabled={!isPlaying || gameState.gameOver}
              >
                ⬆️
              </Button>
              <div></div>
              <Button
                onClick={() => handleDirectionClick({ x: -1, y: 0 })}
                variant="outline"
                className="aspect-square bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                disabled={!isPlaying || gameState.gameOver}
              >
                ⬅️
              </Button>
              <div></div>
              <Button
                onClick={() => handleDirectionClick({ x: 1, y: 0 })}
                variant="outline"
                className="aspect-square bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                disabled={!isPlaying || gameState.gameOver}
              >
                ➡️
              </Button>
              <div></div>
              <Button
                onClick={() => handleDirectionClick({ x: 0, y: 1 })}
                variant="outline"
                className="aspect-square bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                disabled={!isPlaying || gameState.gameOver}
              >
                ⬇️
              </Button>
              <div></div>
            </div>
          </div>

          {/* Game Status */}
          {gameStarted && (
            <div className="text-center mb-6">
              <Badge
                variant="outline"
                className={`text-lg px-4 py-2 ${
                  gameState.gameOver
                    ? "bg-red-100 text-red-700 border-red-300"
                    : isPaused
                    ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                    : "bg-green-100 text-green-700 border-green-300"
                }`}
              >
                {gameState.gameOver
                  ? "💀 Game Over"
                  : isPaused
                  ? "⏸️ Paused"
                  : "🎮 Playing"}
              </Badge>
            </div>
          )}

          {/* Instructions */}
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-2 border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                🎮 How to Play
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                    <span className="text-2xl">⌨️</span>
                    <div>
                      <strong>Desktop Controls:</strong>
                      <p className="text-sm text-muted-foreground">
                        Arrow keys or WASD to move
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                    <span className="text-2xl">📱</span>
                    <div>
                      <strong>Mobile Controls:</strong>
                      <p className="text-sm text-muted-foreground">
                        Use the direction buttons
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                    <span className="text-2xl">🍎</span>
                    <div>
                      <strong>Objective:</strong>
                      <p className="text-sm text-muted-foreground">
                        Eat food to grow and score points
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <strong>Avoid:</strong>
                      <p className="text-sm text-muted-foreground">
                        Walls and your own tail
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg text-center">
                <strong>💡 Pro Tip:</strong> Press Space to pause/resume the
                game!
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
