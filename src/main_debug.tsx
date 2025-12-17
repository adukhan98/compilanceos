import { createRoot } from 'react-dom/client';
import React from 'react';
import { nanoid } from 'nanoid';
import { ArrowLeft } from 'lucide-react';
import { StoreProvider } from './context/StoreContext.tsx';

console.log("DEBUG: main_debug.tsx V3 executing. StoreProvider:", StoreProvider);

const root = document.getElementById('root');
if (root) {
    createRoot(root).render(<h1>Debug Works</h1>);
}
