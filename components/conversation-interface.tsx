"use client";

import { useChat, UseChatOptions } from '@ai-sdk/react';
import { parseAsString, useQueryState } from 'nuqs';
import { toast } from 'sonner';
import React, {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';

import { ConversationForm } from '@/components/conversation-form';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn, invalidateChatsCache } from '@/lib/utils';
import { getCurrentUser, suggestQuestions } from '@/app/actions';
import Messages from '@/components/messages';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/lib/db/schema';
import { useRouter } from 'next/navigation';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ConversationNavbar } from '@/components/conversation-navbar';

interface ConversationInterfaceProps {
    initialChatId?: string;
    initialMessages?: any[];
    initialVisibility?: 'public' | 'private';
    isOwner?: boolean;
}

const ConversationInterface = memo(({ initialChatId, initialMessages, initialVisibility = 'private', isOwner = true }: ConversationInterfaceProps): JSX.Element => {
    const router = useRouter();
    const [query] = useQueryState('query', parseAsString.withDefault(''))
    const [q] = useQueryState('q', parseAsString.withDefault(''))

    // Use localStorage hook directly for model selection with a default to free Gemini
    const [selectedModel, setSelectedModel] = useLocalStorage('inner-game-selected-model', 'google/gemini-2.0-flash-exp:free');

    const initialState = useMemo(() => ({
        query: query || q,
    }), [query, q]);

    const lastSubmittedQueryRef = useRef(initialState.query);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
    const [isEditingMessage, setIsEditingMessage] = useState(false);
    const [editingMessageIndex, setEditingMessageIndex] = useState(-1);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const initializedRef = useRef(false);
    const [hasSubmitted, setHasSubmitted] = React.useState(false);
    const [hasManuallyScrolled, setHasManuallyScrolled] = useState(false);
    const isAutoScrollingRef = useRef(false);
    const [user, setUser] = useState<User | null>(null);
    const [userLoading, setUserLoading] = useState(true);

    // Generate random UUID once for greeting selection
    const greetingUuidRef = useRef<string>(uuidv4());

    // Conversation-specific state
    const [conversationHistory, setConversationHistory] = useLocalStorage('conversation-history', '');
    const [currentGoal, setCurrentGoal] = useLocalStorage('current-goal', '');
    const [additionalContext, setAdditionalContext] = useLocalStorage('additional-context', '');
    const [desiredTone, setDesiredTone] = useLocalStorage<string>('desired-tone', 'playful');

    // Memoized greeting
    const personalizedGreeting = useMemo(() => {
        return "AuraChat - Your AI Conversation Coach";
    }, []);

    // Generate a consistent ID for new chats
    const chatId = useMemo(() => initialChatId ?? uuidv4(), [initialChatId]);

    // Fetch user data after component mounts (we'll make this optional since no sign-in required)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setUserLoading(true);
                const userData = await getCurrentUser();
                if (userData) {
                    setUser(userData as User);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setUserLoading(false);
            }
        };

        fetchUser();
    }, []);

    type VisibilityType = 'public' | 'private';
    const [selectedVisibilityType, setSelectedVisibilityType] = useState<VisibilityType>(initialVisibility);

    const chatOptions: UseChatOptions = useMemo(() => ({
        id: chatId,
        api: process.env.NEXT_PUBLIC_BACKEND_URL || '/api/conversation',
        experimental_throttle: 500,
        maxSteps: 3,
        body: {
            id: chatId,
            model: selectedModel,
            conversationHistory,
            currentGoal,
            additionalContext,
            desiredTone,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            ...(initialChatId ? { chat_id: initialChatId } : {}),
            selectedVisibilityType,
        },
        onFinish: async (message, { finishReason }) => {
            console.log("[finish reason]:", finishReason);
            if (message.content && (finishReason === 'stop' || finishReason === 'length')) {
                const newHistory = [
                    { role: "user", content: lastSubmittedQueryRef.current },
                    { role: "assistant", content: message.content },
                ];
                try {
                    const { questions } = await suggestQuestions(newHistory);
                    setSuggestedQuestions(questions);
                } catch (error) {
                    console.error("Error generating suggested questions:", error);
                }
            }
        },
        onError: (error) => {
            console.error("Chat error:", error.cause, error.message);
            toast.error("An error occurred.", {
                description: `Oops! An error occurred while processing your request. ${error.message}`,
            });
        },
        initialMessages: initialMessages,
    }), [selectedModel, chatId, initialChatId, initialMessages, selectedVisibilityType, conversationHistory, currentGoal, additionalContext, desiredTone]);

    const {
        input,
        messages,
        setInput,
        append,
        handleSubmit,
        setMessages,
        reload,
        stop,
        data,
        status,
        error,
        experimental_resume
    } = useChat(chatOptions);

    useEffect(() => {
        if (status === 'streaming' && messages.length > 0) {
            console.log("[chatId]:", chatId);
            invalidateChatsCache();
        }
    }, [status, router, chatId, initialChatId, messages.length]);

    useEffect(() => {
        if (!initializedRef.current && initialState.query && !messages.length && !initialChatId) {
            initializedRef.current = true;
            console.log("[initial query]:", initialState.query);
            append({
                content: initialState.query,
                role: 'user'
            });
        }
    }, [initialState.query, append, setInput, messages.length, initialChatId]);

    // Reset suggested questions when status changes to streaming
    useEffect(() => {
        if (status === 'streaming') {
            setSuggestedQuestions([]);
        }
    }, [status]);

    const lastUserMessageIndex = useMemo(() => {
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role === 'user') {
                return i;
            }
        }
        return -1;
    }, [messages]);

    useEffect(() => {
        if (status === 'streaming') {
            setHasManuallyScrolled(false);
            if (bottomRef.current) {
                isAutoScrollingRef.current = true;
                bottomRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [status]);

    useEffect(() => {
        let scrollTimeout: NodeJS.Timeout;

        const handleScroll = () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            if (!isAutoScrollingRef.current && status === 'streaming') {
                const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
                if (!isAtBottom) {
                    setHasManuallyScrolled(true);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        if (status === 'streaming' && !hasManuallyScrolled && bottomRef.current) {
            scrollTimeout = setTimeout(() => {
                isAutoScrollingRef.current = true;
                bottomRef.current?.scrollIntoView({ behavior: "smooth" });
                setTimeout(() => {
                    isAutoScrollingRef.current = false;
                }, 100);
            }, 100);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
        };
    }, [messages, suggestedQuestions, status, hasManuallyScrolled]);

    const handleModelChange = useCallback((model: string) => {
        setSelectedModel(model);
    }, [setSelectedModel]);

    const resetSuggestedQuestions = useCallback(() => {
        setSuggestedQuestions([]);
    }, []);

    return (
        <TooltipProvider>
            <div className="flex flex-col font-sans items-center min-h-screen bg-background text-foreground transition-all duration-500">
                <ConversationNavbar
                    selectedModel={selectedModel}
                    onModelChange={handleModelChange}
                    status={status}
                />

                <div className={`w-full p-2 sm:p-4 ${status === 'ready' && messages.length === 0
                    ? 'min-h-screen flex flex-col items-center justify-center'
                    : 'mt-20 sm:mt-16 flex flex-col'
                    }`}>
                    <div className={`w-full max-w-[95%] sm:max-w-4xl space-y-6 p-0 mx-auto transition-all duration-300`}>
                        {status === 'ready' && messages.length === 0 && (
                            <div className="text-center">
                                <h1 className="text-3xl sm:text-5xl mb-4 sm:mb-6 text-neutral-800 dark:text-neutral-100 font-bold">
                                    {personalizedGreeting}
                                </h1>
                                <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 mb-8">
                                    AI-powered conversation coaching inspired by social dynamics mastery
                                </p>
                            </div>
                        )}

                        {messages.length === 0 && !hasSubmitted && (
                            <div className="mt-4">
                                <ConversationForm
                                    chatId={chatId}
                                    input={input}
                                    setInput={setInput}
                                    handleSubmit={handleSubmit}
                                    inputRef={inputRef}
                                    stop={stop}
                                    messages={messages as any}
                                    append={append}
                                    selectedModel={selectedModel}
                                    setSelectedModel={handleModelChange}
                                    resetSuggestedQuestions={resetSuggestedQuestions}
                                    lastSubmittedQueryRef={lastSubmittedQueryRef}
                                    status={status}
                                    setHasSubmitted={setHasSubmitted}
                                    conversationHistory={conversationHistory}
                                    setConversationHistory={setConversationHistory}
                                    currentGoal={currentGoal}
                                    setCurrentGoal={setCurrentGoal}
                                    additionalContext={additionalContext}
                                    setAdditionalContext={setAdditionalContext}
                                    desiredTone={desiredTone}
                                    setDesiredTone={setDesiredTone}
                                />
                            </div>
                        )}

                        {messages.length > 0 && (
                            <Messages
                                messages={messages}
                                lastUserMessageIndex={lastUserMessageIndex}
                                isEditingMessage={isEditingMessage}
                                editingMessageIndex={editingMessageIndex}
                                input={input}
                                setInput={setInput}
                                setIsEditingMessage={setIsEditingMessage}
                                setEditingMessageIndex={setEditingMessageIndex}
                                setMessages={setMessages}
                                append={append}
                                reload={reload}
                                suggestedQuestions={suggestedQuestions}
                                setSuggestedQuestions={setSuggestedQuestions}
                                status={status}
                                error={error}
                                user={user}
                                selectedVisibilityType={selectedVisibilityType}
                                chatId={initialChatId || (messages.length > 0 ? chatId : undefined)}
                                onVisibilityChange={() => {}}
                                initialMessages={initialMessages}
                                isOwner={isOwner}
                            />
                        )}

                        <div ref={bottomRef} />
                    </div>

                    {(messages.length > 0 || hasSubmitted) && (
                        <div className="fixed bottom-6 sm:bottom-4 left-0 right-0 w-full max-w-[90%] sm:max-w-4xl mx-auto z-20">
                            <ConversationForm
                                chatId={chatId}
                                input={input}
                                setInput={setInput}
                                handleSubmit={handleSubmit}
                                inputRef={inputRef}
                                stop={stop}
                                messages={messages as any}
                                append={append}
                                selectedModel={selectedModel}
                                setSelectedModel={handleModelChange}
                                resetSuggestedQuestions={resetSuggestedQuestions}
                                lastSubmittedQueryRef={lastSubmittedQueryRef}
                                status={status}
                                setHasSubmitted={setHasSubmitted}
                                conversationHistory={conversationHistory}
                                setConversationHistory={setConversationHistory}
                                currentGoal={currentGoal}
                                setCurrentGoal={setCurrentGoal}
                                additionalContext={additionalContext}
                                setAdditionalContext={setAdditionalContext}
                                desiredTone={desiredTone}
                                setDesiredTone={setDesiredTone}
                                isMinimal={true}
                            />
                        </div>
                    )}
                </div>
            </div>
        </TooltipProvider>
    );
});

ConversationInterface.displayName = "ConversationInterface";

export { ConversationInterface }; 