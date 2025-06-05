"use client";

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ThemeSwitcher } from '@/components/theme-switcher';

interface ConversationNavbarProps {
    selectedModel: string;
    onModelChange: (model: string) => void;
    status: string;
}

const freeModels = [
    {
        id: 'google/gemini-2.0-flash-exp:free',
        name: 'Gemini 2.0 Flash',
        provider: 'Google',
        description: 'Fast and capable, great for conversation coaching',
        context: '1M tokens'
    },
    {
        id: 'google/gemma-3-4b-it:free',
        name: 'Gemma 3 4B',
        provider: 'Google',
        description: 'Multimodal with vision support',
        context: '96k tokens'
    },
    {
        id: 'google/gemma-3-1b-it:free',
        name: 'Gemma 3 1B',
        provider: 'Google', 
        description: 'Lightweight and efficient',
        context: '32k tokens'
    }
];

export function ConversationNavbar({ selectedModel, onModelChange, status }: ConversationNavbarProps) {
    const isStreaming = status === 'streaming';
    const selectedModelInfo = freeModels.find(model => model.id === selectedModel);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Title */}
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">AC</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-foreground">AuraChat</h1>
                            </div>
                        </div>
                    </div>

                    {/* Center - Model Selection */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground hidden sm:block">AI Model:</span>
                            <Select 
                                value={selectedModel} 
                                onValueChange={onModelChange}
                                disabled={isStreaming}
                            >
                                <SelectTrigger className="w-48 sm:w-64">
                                    <SelectValue>
                                        <div className="flex items-center justify-between w-full">
                                            <span className="truncate">{selectedModelInfo?.name || 'Select Model'}</span>
                                            <Badge variant="secondary" className="ml-2 text-xs">
                                                FREE
                                            </Badge>
                                        </div>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {freeModels.map((model) => (
                                        <SelectItem key={model.id} value={model.id}>
                                            <div className="flex flex-col">
                                                <div className="flex items-center justify-between w-full">
                                                    <span className="font-medium">{model.name}</span>
                                                    <div className="flex items-center space-x-1 ml-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            {model.provider}
                                                        </Badge>
                                                        <Badge variant="secondary" className="text-xs">
                                                            FREE
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-muted-foreground">{model.description}</span>
                                                <span className="text-xs text-muted-foreground">{model.context}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {/* Status indicator */}
                        {isStreaming && (
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-muted-foreground hidden sm:block">Generating...</span>
                            </div>
                        )}
                    </div>

                    {/* Right side - Theme switcher */}
                    <div className="flex items-center space-x-2">
                        <ThemeSwitcher />
                    </div>
                </div>
            </div>
        </nav>
    );
} 