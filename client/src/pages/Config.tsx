import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Config() {
  const [comfyUrl, setComfyUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get the current config from localStorage if available
    const savedConfig = localStorage.getItem('comfyui_server');
    if (savedConfig) {
      setComfyUrl(savedConfig);
    }
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Validate the URL
      new URL(comfyUrl);
      
      // Save to localStorage
      localStorage.setItem('comfyui_server', comfyUrl);
      
      // Save to server config (.env equivalent)
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comfyuiServer: comfyUrl }),
      });
      
      if (response.ok) {
        toast({
          title: "Configuration saved",
          description: "The ComfyUI server connection has been configured. Your settings have been saved.",
        });
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: "Configuration error",
        description: error instanceof Error ? error.message : "Invalid URL or connection error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      // Validate the URL first
      new URL(comfyUrl);
      
      // Test the connection
      const response = await fetch('/api/test-comfyui', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: comfyUrl }),
      });
      
      if (response.ok) {
        toast({
          title: "Connection successful",
          description: "Successfully connected to the ComfyUI server.",
        });
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to connect to ComfyUI server');
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      toast({
        title: "Connection error",
        description: error instanceof Error ? error.message : "Invalid URL or connection error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-md mx-auto bg-card/80 backdrop-blur-sm border-primary/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-400 bg-clip-text text-transparent">
            Configuration
          </CardTitle>
          <CardDescription>
            Configure the connection to your ComfyUI server
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comfyUrl">ComfyUI Server URL</Label>
            <Input
              id="comfyUrl"
              placeholder="https://your-comfyui-server.com"
              value={comfyUrl}
              onChange={(e) => setComfyUrl(e.target.value)}
              className="bg-background/50"
            />
            <p className="text-xs text-muted-foreground">
              Enter the full URL of your ComfyUI server, including the protocol (http:// or https://)
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            className="w-[48%]" 
            onClick={handleTestConnection}
            disabled={isLoading || !comfyUrl}
          >
            Test Connection
          </Button>
          <Button 
            className="w-[48%] bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600" 
            onClick={handleSave}
            disabled={isLoading || !comfyUrl}
          >
            Save Configuration
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}