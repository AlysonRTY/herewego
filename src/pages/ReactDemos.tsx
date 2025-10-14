import {
  useState,
  useEffect,
  useReducer,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Counter with useReducer
type CounterAction =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset" };
const counterReducer = (state: number, action: CounterAction): number => {
  switch (action.type) {
    case "increment":
      return state + 1;
    case "decrement":
      return state - 1;
    case "reset":
      return 0;
    default:
      return state;
  }
};

// Custom hook for local storage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}

// Debounced search hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 1000) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const start = current;
    const increment = (target - start) / (duration / 16);
    let currentValue = start;

    const timer = setInterval(() => {
      currentValue += increment;
      if (
        (increment > 0 && currentValue >= target) ||
        (increment < 0 && currentValue <= target)
      ) {
        setCurrent(target);
        clearInterval(timer);
      } else {
        setCurrent(Math.round(currentValue));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return current;
}

// Drag and drop hook
function useDragAndDrop<T>(initialItems: T[]) {
  const [items, setItems] = useState(initialItems);
  const [draggedItem, setDraggedItem] = useState<T | null>(null);

  const handleDragStart = (item: T) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetItem: T) => {
    if (!draggedItem) return;

    const draggedIndex = items.indexOf(draggedItem);
    const targetIndex = items.indexOf(targetItem);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newItems = [...items];
    newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    setItems(newItems);
    setDraggedItem(null);
  };

  return { items, handleDragStart, handleDragOver, handleDrop, draggedItem };
}

// Focus management hook
function useFocusTrap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
      if (e.key === "Escape") {
        setIsActive(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    firstElement?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive]);

  return { containerRef, isActive, setIsActive };
}

// Intersection observer hook
function useIntersectionObserver(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { elementRef, isVisible };
}

export default function ReactDemos() {
  // State management demos
  const [count, dispatch] = useReducer(counterReducer, 0);
  const [items, setItems] = useState<string[]>(["React", "TypeScript", "Vite"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useLocalStorage("demo-theme", "light");

  // New demo states
  const [targetNumber, setTargetNumber] = useState(100);
  const animatedCount = useAnimatedCounter(targetNumber);
  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [swipeDirection, setSwipeDirection] = useState<string>("");

  // Additional interactive states
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [notification, setNotification] = useState<string>("");
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Focus trap and intersection observer
  const {
    containerRef: focusRef,
    isActive: focusActive,
    setIsActive: setFocusActive,
  } = useFocusTrap();
  const { elementRef: observerRef, isVisible } = useIntersectionObserver();

  // Drag and drop demo
  const dragItems = ["🎯 Task 1", "🚀 Task 2", "⭐ Task 3", "🎨 Task 4"];
  const {
    items: draggableItems,
    handleDragStart,
    handleDragOver,
    handleDrop,
  } = useDragAndDrop(dragItems);

  // Performance demos
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const expensiveCalculation = useMemo(() => {
    // Simulating expensive calculation
    return items.filter((item) =>
      item.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ).length;
  }, [items, debouncedSearchTerm]);

  const addItem = useCallback(() => {
    const newItem = `Item ${items.length + 1}`;
    setItems((prev) => [...prev, newItem]);
  }, [items.length]);

  // Effect demos
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Real-time clock effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Progress bar animation
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          setNotification("Animation completed! 🎉");
          setTimeout(() => setNotification(""), 3000);
          return 0;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Form validation
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setSwipeDirection("");
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        setSwipeDirection(deltaX > 0 ? "👉 Right" : "👈 Left");
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        setSwipeDirection(deltaY > 0 ? "👇 Down" : "👆 Up");
      }
    }

    setTouchStart(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Cool React Features</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Interactive demos showcasing React hooks, state management,
            performance optimization, and more!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* useReducer Demo */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                useReducer Counter
                <Badge variant="secondary">State Management</Badge>
              </CardTitle>
              <CardDescription>
                Complex state logic with useReducer hook
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold mb-4">{count}</div>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => dispatch({ type: "decrement" })}
                    variant="outline"
                    size="sm"
                  >
                    -1
                  </Button>
                  <Button
                    onClick={() => dispatch({ type: "increment" })}
                    size="sm"
                  >
                    +1
                  </Button>
                  <Button
                    onClick={() => dispatch({ type: "reset" })}
                    variant="destructive"
                    size="sm"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Hook Demo */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Custom Hooks
                <Badge variant="secondary">Reusability</Badge>
              </CardTitle>
              <CardDescription>
                useLocalStorage hook persists theme preference
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="mb-4">
                  Current theme: <strong>{theme}</strong>
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => setTheme("light")}
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                  >
                    Light
                  </Button>
                  <Button
                    onClick={() => setTheme("dark")}
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                  >
                    Dark
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Refresh page - preference is saved!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Performance Demo */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Performance Hooks
                <Badge variant="secondary">Optimization</Badge>
              </CardTitle>
              <CardDescription>
                useMemo, useCallback, and debouncing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border rounded-md mb-2"
                />
                <p className="text-sm">
                  Matching items: <strong>{expensiveCalculation}</strong>
                </p>
                <Button onClick={addItem} size="sm" className="mt-2">
                  Add Item ({items.length})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Effect Hooks Demo */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                useEffect Events
                <Badge variant="secondary">Side Effects</Badge>
              </CardTitle>
              <CardDescription>
                Window resize and mouse tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <p>
                  Window:{" "}
                  <strong>
                    {windowSize.width} × {windowSize.height}
                  </strong>
                </p>
                <p>
                  Mouse:{" "}
                  <strong>
                    ({mousePosition.x}, {mousePosition.y})
                  </strong>
                </p>
                <div className="w-full h-20 border-2 border-dashed border-muted-foreground rounded-md flex items-center justify-center text-xs text-muted-foreground">
                  Move mouse here to see coordinates
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dynamic List Demo */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Dynamic Lists
                <Badge variant="secondary">Rendering</Badge>
              </CardTitle>
              <CardDescription>
                Adding, removing, and filtering items
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded-md"
                  >
                    <span className="text-sm">{item}</span>
                    <Button
                      onClick={() =>
                        setItems((prev) => prev.filter((_, i) => i !== index))
                      }
                      variant="destructive"
                      size="sm"
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={() =>
                    setItems((prev) => [...prev, `New Item ${Date.now()}`])
                  }
                  className="w-full"
                  size="sm"
                >
                  Add Random Item
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Drag & Drop Demo */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Drag & Drop
                <Badge variant="secondary">Interactive</Badge>
              </CardTitle>
              <CardDescription>
                Reorder items with drag and drop
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {draggableItems.map((item, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(item)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(item)}
                    className="p-3 bg-muted rounded-md cursor-move hover:bg-muted/80 transition-colors border-2 border-transparent hover:border-primary/20"
                  >
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">
                  Drag items to reorder them!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Animated Counter Demo */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Animated Counter
                <Badge variant="secondary">Animation</Badge>
              </CardTitle>
              <CardDescription>
                Smooth number transitions with custom hook
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold mb-4 font-mono">
                  {animatedCount.toLocaleString()}
                </div>
                <div className="flex gap-2 justify-center flex-wrap">
                  <Button
                    onClick={() => setTargetNumber(100)}
                    variant="outline"
                    size="sm"
                  >
                    100
                  </Button>
                  <Button
                    onClick={() => setTargetNumber(1000)}
                    variant="outline"
                    size="sm"
                  >
                    1K
                  </Button>
                  <Button
                    onClick={() => setTargetNumber(10000)}
                    variant="outline"
                    size="sm"
                  >
                    10K
                  </Button>
                  <Button
                    onClick={() =>
                      setTargetNumber(Math.floor(Math.random() * 100000))
                    }
                    size="sm"
                  >
                    Random
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Picker Demo */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Live Color Picker
                <Badge variant="secondary">Interactive</Badge>
              </CardTitle>
              <CardDescription>
                Real-time color preview and manipulation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div
                  className="w-full h-20 rounded-md border-2 transition-colors duration-200"
                  style={{ backgroundColor: selectedColor }}
                />
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full h-10 rounded-md border cursor-pointer"
                />
                <div className="text-center">
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {selectedColor.toUpperCase()}
                  </code>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {["#ef4444", "#22c55e", "#3b82f6", "#a855f7"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className="w-full h-8 rounded border-2 hover:scale-105 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Clock Demo */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                World Clock
                <Badge variant="secondary">Real-time</Badge>
              </CardTitle>
              <CardDescription>
                Multiple timezone display with live updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { label: "Local", timezone: undefined },
                  { label: "UTC", timezone: "UTC" },
                  { label: "Tokyo", timezone: "Asia/Tokyo" },
                  { label: "New York", timezone: "America/New_York" },
                ].map(({ label, timezone }) => (
                  <div
                    key={label}
                    className="flex justify-between items-center p-2 bg-muted rounded"
                  >
                    <span className="font-medium text-sm">{label}</span>
                    <span className="font-mono text-sm">
                      {currentTime.toLocaleTimeString([], {
                        timeZone: timezone,
                        hour12: false,
                      })}
                    </span>
                  </div>
                ))}
                <div className="text-center text-xs text-muted-foreground">
                  Updates every second
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Touch Gesture Demo */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Gesture Detection
                <Badge variant="secondary">Touch</Badge>
              </CardTitle>
              <CardDescription>
                Swipe detection for touch devices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="w-full h-32 border-2 border-dashed border-muted-foreground rounded-md flex items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div>
                  {swipeDirection ? (
                    <div className="text-2xl font-bold">{swipeDirection}</div>
                  ) : (
                    <div className="text-muted-foreground">
                      <div className="text-lg mb-1">👆👇👈👉</div>
                      <div className="text-sm">Swipe here!</div>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Works on touch devices and trackpads
              </p>
            </CardContent>
          </Card>

          {/* Progress Bar Demo */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Progress Animation
                <Badge variant="secondary">Animation</Badge>
              </CardTitle>
              <CardDescription>
                Controlled animations with useEffect
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">{progress}%</div>
                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={() => {
                        setProgress(0);
                        setIsPlaying(!isPlaying);
                      }}
                      size="sm"
                      variant={isPlaying ? "destructive" : "default"}
                    >
                      {isPlaying ? "Stop" : "Start"}
                    </Button>
                    <Button
                      onClick={() => setProgress(0)}
                      size="sm"
                      variant="outline"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
                {notification && (
                  <div className="text-center text-sm text-green-600 font-medium animate-pulse">
                    {notification}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Form Validation Demo */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Form Validation
                <Badge variant="secondary">Validation</Badge>
              </CardTitle>
              <CardDescription>
                Real-time validation with custom hooks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className={`w-full p-2 border rounded-md ${
                      validationErrors.name
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className={`w-full p-2 border rounded-md ${
                      validationErrors.email
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.email}
                    </p>
                  )}
                </div>
                <Button onClick={validateForm} className="w-full" size="sm">
                  Validate Form
                </Button>
                {Object.keys(validationErrors).length === 0 &&
                  formData.name &&
                  formData.email && (
                    <p className="text-green-600 text-sm text-center">
                      ✅ Form is valid!
                    </p>
                  )}
              </div>
            </CardContent>
          </Card>

          {/* Focus Management Demo */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Focus Management
                <Badge variant="secondary">Accessibility</Badge>
              </CardTitle>
              <CardDescription>
                Keyboard navigation and focus trapping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button
                  onClick={() => setFocusActive(true)}
                  className="w-full"
                  size="sm"
                >
                  Open Focus Trap Modal
                </Button>

                {focusActive && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div
                      ref={focusRef}
                      className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4"
                    >
                      <h3 className="text-lg font-semibold mb-4">
                        Focus Trap Demo
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Try tabbing through these elements. Focus stays trapped!
                      </p>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="First input"
                          className="w-full p-2 border rounded"
                        />
                        <input
                          type="text"
                          placeholder="Second input"
                          className="w-full p-2 border rounded"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Action
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setFocusActive(false)}
                          >
                            Close (or press Esc)
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  Press Tab/Shift+Tab to navigate, Esc to close
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Intersection Observer Demo */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Scroll Detection
                <Badge variant="secondary">Observer</Badge>
              </CardTitle>
              <CardDescription>
                Intersection Observer API for scroll effects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                ref={observerRef}
                className={`w-full h-32 border-2 rounded-md flex items-center justify-center transition-all duration-500 ${
                  isVisible
                    ? "border-green-500 bg-green-50 scale-105"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{isVisible ? "👀" : "😴"}</div>
                  <div className="text-sm font-medium">
                    {isVisible ? "I can see you!" : "Scroll to see me"}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                This element detects when it's visible in the viewport
              </p>
            </CardContent>
          </Card>

          {/* Component Composition Demo */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Component Patterns
                <Badge variant="secondary">Architecture</Badge>
              </CardTitle>
              <CardDescription>
                Render props and component composition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="p-3 border rounded-md">
                  <h4 className="font-semibold mb-2">Compound Components</h4>
                  <div className="flex gap-2">
                    <Badge>React</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                    <Badge variant="outline">Vite</Badge>
                  </div>
                </div>
                <div className="p-3 border rounded-md">
                  <h4 className="font-semibold mb-2">
                    Higher Order Components
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Enhanced with additional functionality
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>React Features Showcased</CardTitle>
              <CardDescription>
                This page demonstrates various React concepts and patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  "useState",
                  "useEffect",
                  "useReducer",
                  "useMemo",
                  "useCallback",
                  "useRef",
                  "Custom Hooks",
                  "Event Handling",
                  "Drag & Drop",
                  "Animations",
                  "Touch Gestures",
                  "Real-time Updates",
                  "Color Manipulation",
                  "Form Validation",
                  "Focus Management",
                  "Intersection Observer",
                  "Progress Tracking",
                  "Conditional Rendering",
                  "List Rendering",
                  "Component Composition",
                  "Performance Optimization",
                  "Accessibility Features",
                ].map((feature) => (
                  <Badge
                    key={feature}
                    variant="outline"
                    className="justify-center"
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
