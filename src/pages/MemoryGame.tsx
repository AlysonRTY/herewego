import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GameCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameStats {
  moves: number;
  matches: number;
  timeElapsed: number;
  score: number;
}

const EMOJI_SETS = {
  easy: ["🎮", "🎯", "🎲", "🎪", "🎨", "🎭"],
  medium: ["🚀", "⭐", "🌟", "💫", "🔥", "⚡", "💎", "🎊"],
  hard: [
    "🦄",
    "🐉",
    "🦋",
    "🌈",
    "🎪",
    "🎭",
    "🎨",
    "🎯",
    "🎮",
    "🎲",
    "🎊",
    "🎉",
  ],
};

const DIFFICULTY_CONFIG = {
  easy: { pairs: 6, gridCols: 4, timeBonus: 10 },
  medium: { pairs: 8, gridCols: 4, timeBonus: 15 },
  hard: { pairs: 12, gridCols: 6, timeBonus: 20 },
};

type Difficulty = keyof typeof DIFFICULTY_CONFIG;

export default function MemoryGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    moves: 0,
    matches: 0,
    timeElapsed: 0,
    score: 0,
  });
  const [gameState, setGameState] = useState<"setup" | "playing" | "won">(
    "setup"
  );
  const [startTime, setStartTime] = useState<number>(0);
  const [bestScores, setBestScores] = useState<Record<Difficulty, number>>({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [matchAnimation, setMatchAnimation] = useState<number[]>([]);

  // Load best scores from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("memory-game-scores");
    if (saved) {
      setBestScores(JSON.parse(saved));
    }
  }, []);

  // Save best scores to localStorage
  const saveBestScore = useCallback((difficulty: Difficulty, score: number) => {
    setBestScores((prev) => {
      const newScores = {
        ...prev,
        [difficulty]: Math.max(prev[difficulty], score),
      };
      localStorage.setItem("memory-game-scores", JSON.stringify(newScores));
      return newScores;
    });
  }, []);

  // Initialize game
  const initializeGame = useCallback(() => {
    const config = DIFFICULTY_CONFIG[difficulty];
    const emojis = EMOJI_SETS[difficulty].slice(0, config.pairs);

    // Create pairs of cards
    const gameCards: GameCard[] = [];
    emojis.forEach((emoji, index) => {
      gameCards.push(
        { id: index * 2, emoji, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, emoji, isFlipped: false, isMatched: false }
      );
    });

    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }

    setCards(gameCards);
    setFlippedCards([]);
    setGameStats({ moves: 0, matches: 0, timeElapsed: 0, score: 0 });
    setGameState("playing");
    setStartTime(Date.now());
  }, [difficulty]);

  // Timer effect
  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setGameStats((prev) => ({
        ...prev,
        timeElapsed: Math.floor((Date.now() - startTime) / 1000),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, startTime]);

  // Handle card click
  const handleCardClick = useCallback(
    (cardId: number) => {
      if (gameState !== "playing") return;
      if (flippedCards.length >= 2) return;
      if (flippedCards.includes(cardId)) return;
      if (cards.find((c) => c.id === cardId)?.isMatched) return;

      const newFlippedCards = [...flippedCards, cardId];
      setFlippedCards(newFlippedCards);

      // Flip the card
      setCards((prev) =>
        prev.map((card) =>
          card.id === cardId ? { ...card, isFlipped: true } : card
        )
      );

      // Check for match when 2 cards are flipped
      if (newFlippedCards.length === 2) {
        const [firstId, secondId] = newFlippedCards;
        const firstCard = cards.find((c) => c.id === firstId);
        const secondCard = cards.find((c) => c.id === secondId);

        setGameStats((prev) => ({ ...prev, moves: prev.moves + 1 }));

        if (firstCard?.emoji === secondCard?.emoji) {
          // Match found!
          setMatchAnimation(newFlippedCards);
          setTimeout(() => {
            setCards((prev) =>
              prev.map((card) =>
                newFlippedCards.includes(card.id)
                  ? { ...card, isMatched: true }
                  : card
              )
            );
            setGameStats((prev) => ({ ...prev, matches: prev.matches + 1 }));
            setFlippedCards([]);
            setMatchAnimation([]);
          }, 800);
        } else {
          // No match, flip back
          setTimeout(() => {
            setCards((prev) =>
              prev.map((card) =>
                newFlippedCards.includes(card.id)
                  ? { ...card, isFlipped: false }
                  : card
              )
            );
            setFlippedCards([]);
          }, 1000);
        }
      }
    },
    [gameState, flippedCards, cards]
  );

  // Check for game completion
  useEffect(() => {
    const config = DIFFICULTY_CONFIG[difficulty];
    if (gameStats.matches === config.pairs && gameState === "playing") {
      const timeBonus = Math.max(
        0,
        config.timeBonus * 60 - gameStats.timeElapsed
      );
      const moveBonus = Math.max(0, (config.pairs * 2 - gameStats.moves) * 10);
      const finalScore = Math.round(1000 + timeBonus * 10 + moveBonus);

      setGameStats((prev) => ({ ...prev, score: finalScore }));
      setGameState("won");
      setShowConfetti(true);
      saveBestScore(difficulty, finalScore);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [
    gameStats.matches,
    gameStats.timeElapsed,
    gameStats.moves,
    difficulty,
    gameState,
    saveBestScore,
  ]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getGridClass = () => {
    const config = DIFFICULTY_CONFIG[difficulty];
    return `grid gap-3 ${
      config.gridCols === 4 ? "grid-cols-4" : "grid-cols-6"
    }`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-yellow-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            >
              {
                ["🎉", "🎊", "✨", "🌟", "💫", "🎈"][
                  Math.floor(Math.random() * 6)
                ]
              }
            </div>
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              🧠 Memory Match
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-4"></div>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Test your memory! Flip cards to find matching pairs. Complete the
            game with fewer moves and faster time for a higher score!
          </p>
        </div>

        {/* Game Setup */}
        {gameState === "setup" && (
          <div className="max-w-md mx-auto">
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-2 border-white/20 shadow-2xl">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Choose Your Challenge
                </CardTitle>
                <div className="flex justify-center space-x-1 mt-2">
                  {["🎯", "🚀", "💎"].map((emoji, i) => (
                    <span
                      key={i}
                      className="text-2xl animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map(
                    (level, index) => (
                      <Button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        variant={difficulty === level ? "default" : "outline"}
                        className={`w-full justify-between h-14 text-lg transition-all duration-300 transform hover:scale-105 ${
                          difficulty === level
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                            : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {["🟢", "🟡", "🔴"][index]}
                          </span>
                          <span className="capitalize font-semibold">
                            {level}
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-white/20 text-white"
                        >
                          {DIFFICULTY_CONFIG[level].pairs} pairs
                        </Badge>
                      </Button>
                    )
                  )}
                </div>

                {bestScores[difficulty] > 0 && (
                  <div className="text-center p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-lg">🏆</span>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Best Score ({difficulty})
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                      {bestScores[difficulty].toLocaleString()}
                    </p>
                  </div>
                )}

                <Button
                  onClick={initializeGame}
                  className="w-full h-14 text-lg bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg transform transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  <span className="mr-2 text-xl">🎮</span>
                  Start Game
                  <span className="ml-2 text-xl">✨</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game Board */}
        {(gameState === "playing" || gameState === "won") && (
          <div className="space-y-6">
            {/* Game Stats */}
            <div className="flex justify-center gap-4 flex-wrap mb-8">
              <Card className="text-center backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-2 border-blue-200/50 shadow-xl transform transition-all duration-300 hover:scale-105">
                <CardContent className="p-4">
                  <div className="text-3xl mb-1">👆</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {gameStats.moves}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Moves
                  </div>
                </CardContent>
              </Card>
              <Card className="text-center backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-2 border-green-200/50 shadow-xl transform transition-all duration-300 hover:scale-105">
                <CardContent className="p-4">
                  <div className="text-3xl mb-1">🎯</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {gameStats.matches}/{DIFFICULTY_CONFIG[difficulty].pairs}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Matches
                  </div>
                </CardContent>
              </Card>
              <Card className="text-center backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-2 border-orange-200/50 shadow-xl transform transition-all duration-300 hover:scale-105">
                <CardContent className="p-4">
                  <div className="text-3xl mb-1">⏱️</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-mono">
                    {formatTime(gameStats.timeElapsed)}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Time
                  </div>
                </CardContent>
              </Card>
              {gameStats.score > 0 && (
                <Card className="text-center backdrop-blur-sm bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/50 dark:to-orange-900/50 border-2 border-yellow-300/50 shadow-xl transform transition-all duration-300 hover:scale-105 animate-pulse">
                  <CardContent className="p-4">
                    <div className="text-3xl mb-1">🏆</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      {gameStats.score.toLocaleString()}
                    </div>
                    <div className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                      Score
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Game Grid */}
            <div className="max-w-4xl mx-auto">
              <div
                className={`${getGridClass()} p-6 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl`}
              >
                {cards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={`
                      aspect-square rounded-xl border-2 cursor-pointer transition-all duration-500 flex items-center justify-center text-4xl relative overflow-hidden group
                      ${
                        card.isFlipped || card.isMatched
                          ? "bg-gradient-to-br from-white to-blue-50 dark:from-gray-100 dark:to-blue-100 border-blue-400 scale-105 shadow-xl"
                          : "bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 border-indigo-400 hover:scale-110 hover:shadow-2xl hover:rotate-2"
                      }
                      ${
                        card.isMatched
                          ? "ring-4 ring-green-400 bg-gradient-to-br from-green-50 to-emerald-100 animate-pulse"
                          : ""
                      }
                      ${
                        matchAnimation.includes(card.id)
                          ? "animate-bounce scale-125"
                          : ""
                      }
                      ${
                        flippedCards.includes(card.id)
                          ? "animate-pulse shadow-lg"
                          : ""
                      }
                    `}
                  >
                    {/* Card shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                    {card.isFlipped || card.isMatched ? (
                      <span
                        className={`text-5xl transform transition-all duration-300 ${
                          matchAnimation.includes(card.id)
                            ? "animate-spin scale-150"
                            : "hover:scale-110"
                        }`}
                      >
                        {card.emoji}
                      </span>
                    ) : (
                      <div className="relative">
                        <span className="text-white text-3xl font-bold drop-shadow-lg">
                          ?
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-sm"></div>
                      </div>
                    )}

                    {/* Sparkle effects for matched cards */}
                    {card.isMatched && (
                      <>
                        <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                        <div className="absolute bottom-1 left-1 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-300"></div>
                        <div className="absolute top-1/2 left-1 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping delay-700"></div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Game Controls */}
            <div className="flex justify-center gap-4 mt-8">
              <Button
                onClick={() => setGameState("setup")}
                variant="outline"
                className="px-8 py-3 text-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transform transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <span className="mr-2">🎯</span>
                New Game
              </Button>
              <Button
                onClick={initializeGame}
                variant="outline"
                className="px-8 py-3 text-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 dark:hover:from-green-900/20 dark:hover:to-blue-900/20 transform transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <span className="mr-2">🔄</span>
                Restart
              </Button>
            </div>
          </div>
        )}

        {/* Victory Modal */}
        {gameState === "won" && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-500">
            <Card className="max-w-md w-full mx-4 bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-800 dark:via-blue-900/20 dark:to-purple-900/20 border-2 border-white/30 shadow-2xl transform animate-in zoom-in duration-700">
              <CardHeader className="text-center pb-2">
                <div className="relative">
                  <CardTitle className="text-3xl bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
                    🎉 Victory! 🎉
                  </CardTitle>
                  <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                    ✨
                  </div>
                  <div className="absolute -top-2 -left-2 text-2xl animate-bounce delay-300">
                    🌟
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <div className="relative">
                  <div className="text-8xl mb-4 animate-bounce">🏆</div>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-xl"></div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
                    <p className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      You conquered the {difficulty} level!
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/80 dark:bg-gray-700/80 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="text-2xl font-bold text-blue-600">
                        {gameStats.moves}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        Moves
                      </div>
                    </div>
                    <div className="p-3 bg-white/80 dark:bg-gray-700/80 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="text-2xl font-bold text-orange-600 font-mono">
                        {formatTime(gameStats.timeElapsed)}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        Time
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 dark:from-yellow-800/50 dark:via-orange-800/50 dark:to-red-800/50 rounded-xl border-2 border-yellow-300 dark:border-yellow-600 shadow-lg">
                    <div className="text-4xl font-bold bg-gradient-to-r from-yellow-700 to-orange-700 bg-clip-text text-transparent animate-pulse">
                      {gameStats.score.toLocaleString()}
                    </div>
                    <div className="text-yellow-800 dark:text-yellow-200 font-semibold">
                      Final Score
                    </div>
                    <div className="flex justify-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="text-yellow-500 text-xl animate-pulse"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>

                  {gameStats.score === bestScores[difficulty] && (
                    <div className="animate-bounce">
                      <Badge className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white text-lg px-4 py-2 shadow-lg">
                        🎊 NEW BEST SCORE! 🎊
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={initializeGame}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg transform transition-all duration-300 hover:scale-105"
                  >
                    <span className="mr-2">🎮</span>
                    Play Again
                  </Button>
                  <Button
                    onClick={() => setGameState("setup")}
                    variant="outline"
                    className="flex-1 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 transform transition-all duration-300 hover:scale-105"
                  >
                    <span className="mr-2">🎯</span>
                    Change Level
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game Instructions */}
        <div className="mt-16 max-w-3xl mx-auto">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-2 border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🎮 How to Master the Game
              </CardTitle>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-2"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                  <span className="text-3xl">🎯</span>
                  <div>
                    <strong className="text-blue-700 dark:text-blue-300">
                      Objective:
                    </strong>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Find all matching pairs by flipping cards. Match all pairs
                      to win!
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
                  <span className="text-3xl">🎮</span>
                  <div>
                    <strong className="text-green-700 dark:text-green-300">
                      Gameplay:
                    </strong>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Click cards to flip them. Find two matching emojis to make
                      a pair!
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
                  <span className="text-3xl">🏆</span>
                  <div>
                    <strong className="text-yellow-700 dark:text-yellow-300">
                      Scoring:
                    </strong>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Fewer moves and faster completion time = higher score!
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                  <span className="text-3xl">⚡</span>
                  <div>
                    <strong className="text-purple-700 dark:text-purple-300">
                      Difficulty:
                    </strong>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Easy (6 pairs), Medium (8 pairs), Hard (12 pairs)
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl border border-indigo-200 dark:border-indigo-700">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">💡</span>
                  <strong className="text-indigo-700 dark:text-indigo-300">
                    Pro Tips:
                  </strong>
                </div>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Remember card positions to reduce moves</li>
                  <li>• Work systematically from one area to another</li>
                  <li>• Speed matters - but accuracy matters more!</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
