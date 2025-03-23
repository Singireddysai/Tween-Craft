import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Results from "@/pages/Results";
import { useState, useEffect } from "react";

function Router() {
  // Set up WebSocket connection
  const [socket, setSocket] = useState<WebSocket | null>(null);
  
  useEffect(() => {
    // Create WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    console.log("Connecting to WebSocket at:", wsUrl);
    
    const newSocket = new WebSocket(wsUrl);
    
    newSocket.addEventListener("open", () => {
      console.log("WebSocket connection established");
      // Send test message
      newSocket.send(JSON.stringify({ type: "client_connected", timestamp: Date.now() }));
    });
    
    newSocket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);
      } catch (err) {
        console.log("WebSocket message (raw):", event.data);
      }
    });
    
    newSocket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });
    
    newSocket.addEventListener("close", (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
    });
    
    setSocket(newSocket);
    
    // Clean up on unmount
    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, []);
  
  return (
    <Switch>
      <Route path="/" component={() => <Home socket={socket} />} />
      <Route path="/results/:fileId" component={Results} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <header className="py-6 border-b border-purple-900/30 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
          <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-700 to-purple-400 rounded-lg flex items-center justify-center shadow-lg shadow-purple-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold violet-gradient-text">GMFSS Video Enhancer</h1>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="https://github.com/topics/gmfss" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors hidden md:block">GitHub</a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Docs</a>
              <a href="#" className="bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-900/20 hover:border-purple-500/40 transition-all text-sm">
                About
              </a>
            </nav>
          </div>
        </header>
        
        <Router />
        
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
