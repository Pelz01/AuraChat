"use client";

import React, { useRef, useEffect, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StopIcon, ArrowUpIcon } from 'lucide-react';
import { Message } from 'ai';

interface ConversationFormProps {
    chatId: string;
    input: string;
    setInput: (value: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    inputRef: React.RefObject<HTMLTextAreaElement>;
    stop: () => void;
    messages: Message[];
    append: (message: any) => void;
    selectedModel: string;
    setSelectedModel: (model: string) => void;
    resetSuggestedQuestions: () => void;
    lastSubmittedQueryRef: React.MutableRefObject<string>;
    status: string;
    setHasSubmitted: (value: boolean) => void;
    conversationHistory: string;
    setConversationHistory: (value: string) => void;
    currentGoal: string;
    setCurrentGoal: (value: string) => void;
    additionalContext: string;
    setAdditionalContext: (value: string) => void;
    desiredTone: string;
    setDesiredTone: (value: string) => void;
    isMinimal?: boolean;
}

const toneOptions = [
    { value: 'playful', label: 'Playful', description: 'Light-hearted and fun banter' },
    { value: 'witty', label: 'Witty', description: 'Clever and intelligent humor' },
    { value: 'empathetic', label: 'Empathetic', description: 'Understanding and supportive' },
    { value: 'direct', label: 'Direct', description: 'Straightforward and honest' },
    { value: 'curious', label: 'Curious', description: 'Inquisitive and engaging' },
    { value: 'confident', label: 'Confident', description: 'Self-assured and charismatic' },
    { value: 'mysterious', label: 'Mysterious', description: 'Intriguing and enigmatic' },
    { value: 'warm', label: 'Warm', description: 'Friendly and approachable' },
];

const goalSuggestions = [
    "Make her laugh",
    "Build deeper connection", 
    "Transition to asking for number",
    "Respond to challenging question",
    "Create romantic tension",
    "Demonstrate value through storytelling",
    "Recover from awkward moment",
    "End conversation gracefully",
    "Shift conversation to personal topics",
    "Show confidence without arrogance"
];

export function ConversationForm({
    chatId,
    input,
    setInput,
    handleSubmit,
    inputRef,
    stop,
    messages,
    append,
    selectedModel,
    setSelectedModel,
    resetSuggestedQuestions,
    lastSubmittedQueryRef,
    status,
    setHasSubmitted,
    conversationHistory,
    setConversationHistory,
    currentGoal,
    setCurrentGoal,
    additionalContext,
    setAdditionalContext,
    desiredTone,
    setDesiredTone,
    isMinimal = false
}: ConversationFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const historyRef = useRef<HTMLTextAreaElement>(null);
    const goalRef = useRef<HTMLTextAreaElement>(null);
    const contextRef = useRef<HTMLTextAreaElement>(null);

    const isFormReady = conversationHistory.trim() && currentGoal.trim();
    const isStreaming = status === 'streaming';

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isFormReady || isStreaming) return;

        setHasSubmitted(true);
        resetSuggestedQuestions();

        // Create the request payload
        const payload = {
            model: selectedModel,
            conversationHistory,
            currentGoal,
            additionalContext,
            desiredTone,
        };

        // Use fetch to call the backend
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
            const response = await fetch(`${backendUrl}/api/conversation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            // Simulate the append behavior by creating a user message and assistant response
            const userMessage = `CONVERSATION HISTORY:\n${conversationHistory}\n\nCURRENT GOAL: ${currentGoal}\n\nADDITIONAL CONTEXT: ${additionalContext || 'None provided'}\n\nDESIRED TONE: ${desiredTone}`;
            
            append({
                content: userMessage,
                role: 'user'
            });

            append({
                content: result.response,
                role: 'assistant'
            });

        } catch (error) {
            console.error('Error calling backend:', error);
            // You might want to show an error message to the user here
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            if (isFormReady && !isStreaming) {
                onSubmit(e);
            }
        }
    };

    // Auto-resize textareas
    const autoResize = (element: HTMLTextAreaElement) => {
        element.style.height = 'auto';
        element.style.height = element.scrollHeight + 'px';
    };

    useEffect(() => {
        if (historyRef.current) autoResize(historyRef.current);
    }, [conversationHistory]);

    useEffect(() => {
        if (goalRef.current) autoResize(goalRef.current);
    }, [currentGoal]);

    useEffect(() => {
        if (contextRef.current) autoResize(contextRef.current);
    }, [additionalContext]);

    if (isMinimal) {
        return (
            <Card className="w-full shadow-lg border border-neutral-200 dark:border-neutral-800">
                <CardContent className="p-4">
                    <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="conversation-history-minimal" className="text-sm font-medium">
                                    Conversation History
                                </Label>
                                <Textarea
                                    id="conversation-history-minimal"
                                    ref={historyRef}
                                    placeholder="Paste the conversation so far..."
                                    value={conversationHistory}
                                    onChange={(e) => {
                                        setConversationHistory(e.target.value);
                                        autoResize(e.target);
                                    }}
                                    onKeyDown={handleKeyDown}
                                    className="min-h-[80px] resize-none"
                                    disabled={isStreaming}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="current-goal-minimal" className="text-sm font-medium">
                                    Current Goal
                                </Label>
                                <Textarea
                                    id="current-goal-minimal"
                                    ref={goalRef}
                                    placeholder="What do you want to achieve?"
                                    value={currentGoal}
                                    onChange={(e) => {
                                        setCurrentGoal(e.target.value);
                                        autoResize(e.target);
                                    }}
                                    onKeyDown={handleKeyDown}
                                    className="min-h-[80px] resize-none"
                                    disabled={isStreaming}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <Select value={desiredTone} onValueChange={setDesiredTone} disabled={isStreaming}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Select tone" />
                                </SelectTrigger>
                                <SelectContent>
                                    {toneOptions.map((tone) => (
                                        <SelectItem key={tone.value} value={tone.value}>
                                            <div className="flex flex-col">
                                                <span>{tone.label}</span>
                                                <span className="text-xs text-muted-foreground">{tone.description}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button
                                type="submit"
                                disabled={!isFormReady || isStreaming}
                                className="flex items-center space-x-2"
                            >
                                {isStreaming ? (
                                    <>
                                        <StopIcon className="h-4 w-4" />
                                        <span>Stop</span>
                                    </>
                                ) : (
                                    <>
                                        <ArrowUpIcon className="h-4 w-4" />
                                        <span>Get Replies</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full shadow-lg border border-neutral-200 dark:border-neutral-800">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Conversation Assistant</CardTitle>
                <CardDescription>
                    Provide the conversation context and your goal to get strategic reply suggestions
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
                    {/* Conversation History */}
                    <div className="space-y-3">
                        <Label htmlFor="conversation-history" className="text-base font-medium">
                            Conversation History <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="conversation-history"
                            ref={historyRef}
                            placeholder="Paste the conversation that has happened so far. Include both your messages and their responses..."
                            value={conversationHistory}
                            onChange={(e) => {
                                setConversationHistory(e.target.value);
                                autoResize(e.target);
                            }}
                            onKeyDown={handleKeyDown}
                            className="min-h-[120px] resize-none"
                            disabled={isStreaming}
                        />
                    </div>

                    {/* Current Goal */}
                    <div className="space-y-3">
                        <Label htmlFor="current-goal" className="text-base font-medium">
                            Current Goal <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="current-goal"
                            ref={goalRef}
                            placeholder="What do you want to achieve with your next response?"
                            value={currentGoal}
                            onChange={(e) => {
                                setCurrentGoal(e.target.value);
                                autoResize(e.target);
                            }}
                            onKeyDown={handleKeyDown}
                            className="min-h-[80px] resize-none"
                            disabled={isStreaming}
                        />
                        <div className="flex flex-wrap gap-2">
                            {goalSuggestions.slice(0, 5).map((suggestion) => (
                                <Badge
                                    key={suggestion}
                                    variant="secondary"
                                    className="cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                    onClick={() => setCurrentGoal(suggestion)}
                                >
                                    {suggestion}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Additional Context */}
                    <div className="space-y-3">
                        <Label htmlFor="additional-context" className="text-base font-medium">
                            Additional Context
                        </Label>
                        <Textarea
                            id="additional-context"
                            ref={contextRef}
                            placeholder="Any relevant background information (e.g., 'she mentioned she loves sci-fi', 'we're at a coffee shop', 'he's interested in entrepreneurship')..."
                            value={additionalContext}
                            onChange={(e) => {
                                setAdditionalContext(e.target.value);
                                autoResize(e.target);
                            }}
                            onKeyDown={handleKeyDown}
                            className="min-h-[60px] resize-none"
                            disabled={isStreaming}
                        />
                    </div>

                    {/* Desired Tone */}
                    <div className="space-y-3">
                        <Label htmlFor="desired-tone" className="text-base font-medium">
                            Desired Tone
                        </Label>
                        <Select value={desiredTone} onValueChange={setDesiredTone} disabled={isStreaming}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select the tone for your response" />
                            </SelectTrigger>
                            <SelectContent>
                                {toneOptions.map((tone) => (
                                    <SelectItem key={tone.value} value={tone.value}>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{tone.label}</span>
                                            <span className="text-sm text-muted-foreground">{tone.description}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={!isFormReady || isStreaming}
                            size="lg"
                            className="flex items-center space-x-2"
                        >
                            {isStreaming ? (
                                <>
                                    <StopIcon className="h-5 w-5" />
                                    <span>Stop Generation</span>
                                </>
                            ) : (
                                <>
                                    <ArrowUpIcon className="h-5 w-5" />
                                    <span>Generate Reply Options</span>
                                </>
                            )}
                        </Button>
                    </div>

                    {!isFormReady && (
                        <div className="text-sm text-muted-foreground text-center">
                            Please fill in both conversation history and current goal to continue
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
} 