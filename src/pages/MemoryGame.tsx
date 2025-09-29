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
          }, 500);
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
      saveBestScore(difficulty, finalScore);
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🧠 Memory Match Game</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Test your memory! Flip cards to find matching pairs. Complete the
            game with fewer moves and faster time for a higher score!
          </p>
        </div>

        {/* Game Setup */}
        {gameState === "setup" && (
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Choose Difficulty</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map(
                    (level) => (
                      <Button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        variant={difficulty === level ? "default" : "outline"}
                        className="w-full justify-between"
                      >
                        <span className="capitalize">{level}</span>
                        <Badge variant="secondary">
                          {DIFFICULTY_CONFIG[level].pairs} pairs
                        </Badge>
                      </Button>
                    )
                  )}
                </div>

                {bestScores[difficulty] > 0 && (
                  <div className="text-center p-3 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">
                      Best Score ({difficulty})
                    </p>
                    <p className="text-lg font-bold">
                      {bestScores[difficulty].toLocaleString()}
                    </p>
                  </div>
                )}

                <Button onClick={initializeGame} className="w-full" size="lg">
                  Start Game 🎮
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game Board */}
        {(gameState === "playing" || gameState === "won") && (
          <div className="space-y-6">
            {/* Game Stats */}
            <div className="flex justify-center gap-4 flex-wrap">
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{gameStats.moves}</div>
                  <div className="text-sm text-muted-foreground">Moves</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">
                    {gameStats.matches}/{DIFFICULTY_CONFIG[difficulty].pairs}
                  </div>
                  <div className="text-sm text-muted-foreground">Matches</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">
                    {formatTime(gameStats.timeElapsed)}
                  </div>
                  <div className="text-sm text-muted-foreground">Time</div>
                </CardContent>
              </Card>
              {gameStats.score > 0 && (
                <Card className="text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {gameStats.score.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Game Grid */}
            <div className="max-w-2xl mx-auto">
              <div className={getGridClass()}>
                {cards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={`
                      aspect-square rounded-lg border-2 cursor-pointer transition-all duration-300 flex items-center justify-center text-4xl
                      ${
                        card.isFlipped || card.isMatched
                          ? "bg-white border-blue-500 scale-105"
                          : "bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400 hover:scale-105 hover:shadow-lg"
                      }
                      ${
                        card.isMatched
                          ? "ring-4 ring-green-400 bg-green-50"
                          : ""
                      }
                      ${flippedCards.includes(card.id) ? "animate-pulse" : ""}
                    `}
                  >
                    {card.isFlipped || card.isMatched ? (
                      <span className="animate-bounce">{card.emoji}</span>
                    ) : (
                      <span className="text-white text-2xl">?</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Game Controls */}
            <div className="flex justify-center gap-4">
              <Button onClick={() => setGameState("setup")} variant="outline">
                New Game
              </Button>
              <Button onClick={initializeGame} variant="outline">
                Restart
              </Button>
            </div>
          </div>
        )}

        {/* Victory Modal */}
        {gameState === "won" && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">🎉 Congratulations!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <div className="text-6xl mb-4">🏆</div>
                <div className="space-y-2">
                  <p className="text-lg">
                    You completed the {difficulty} level!
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-bold text-lg">{gameStats.moves}</div>
                      <div className="text-muted-foreground">Moves</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg">
                        {formatTime(gameStats.timeElapsed)}
                      </div>
                      <div className="text-muted-foreground">Time</div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-800">
                      {gameStats.score.toLocaleString()}
                    </div>
                    <div className="text-yellow-700">Final Score</div>
                  </div>
                  {gameStats.score === bestScores[difficulty] && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                      🎊 New Best Score!
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={initializeGame} className="flex-1">
                    Play Again
                  </Button>
                  <Button
                    onClick={() => setGameState("setup")}
                    variant="outline"
                    className="flex-1"
                  >
                    Change Level
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game Instructions */}
        <div className="mt-12 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>How to Play</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-lg">🎯</span>
                <div>
                  <strong>Objective:</strong> Find all matching pairs by
                  flipping cards
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🎮</span>
                <div>
                  <strong>Gameplay:</strong> Click cards to flip them. Find two
                  matching emojis to make a pair
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🏆</span>
                <div>
                  <strong>Scoring:</strong> Fewer moves and faster completion
                  time = higher score!
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">⚡</span>
                <div>
                  <strong>Difficulty:</strong> Easy (6 pairs), Medium (8 pairs),
                  Hard (12 pairs)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
