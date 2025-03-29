import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Results from "@/pages/Results";
import Config from "@/pages/Config";
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
      <Route path="/config" component={Config} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <header className="py-3 sticky top-0 z-50 glass-nav">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-700 to-purple-400 rounded-lg flex items-center justify-center shadow-lg shadow-purple-900/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </Link>
            </div>
            <nav className="flex items-center space-x-1">
              <Link to="/config" className="nav-link text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Config
              </Link>
              <a href="https://github.com/topics/gmfss" target="_blank" rel="noopener noreferrer" className="nav-link text-gray-300">GitHub</a>
              <Link to="/" className="ml-1 bg-gradient-to-r from-purple-700/80 to-purple-500/80 px-3 py-1.5 rounded-full border border-purple-500/30 text-white shadow-sm transition-all hover:shadow-purple-500/20 text-sm">
                Home
              </Link>
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
