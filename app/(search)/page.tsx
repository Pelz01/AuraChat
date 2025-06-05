"use client";

import { Suspense } from 'react';
import { ConversationInterface } from '@/components/conversation-interface';
import { InstallPrompt } from '@/components/InstallPrompt';

const Home = () => {
    return (
        <Suspense>
            <ConversationInterface />
            <InstallPrompt />
        </Suspense>
    );
};

export default Home;