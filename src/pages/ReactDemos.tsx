import { useState, useEffect, useReducer, useMemo, useCallback } from "react";
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

export default function ReactDemos() {
  // State management demos
  const [count, dispatch] = useReducer(counterReducer, 0);
  const [items, setItems] = useState<string[]>(["React", "TypeScript", "Vite"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useLocalStorage("demo-theme", "light");

  // Performance demos
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const expensiveCalculation = useMemo(() => {
    console.log("Expensive calculation running...");
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
                  "Custom Hooks",
                  "Event Handling",
                  "Conditional Rendering",
                  "List Rendering",
                  "Component Composition",
                  "Performance Optimization",
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
