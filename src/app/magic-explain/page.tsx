'use client';
import { LearningToolsProvider, MagicExplain, ToolsLauncher } from '@/components/learning-tools';
import { Sparkles } from 'lucide-react';
// import Lottie from 'lottie-react';
// import magicAnimation from '@/public/animations/magic.json';

export default function MagicExplainPage() {
  return (
    <LearningToolsProvider questionRef="magic-explain-page" initialText="">
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-purple-400/30 to-purple-100 dark:from-gray-900 dark:to-purple-900 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-400/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-purple-600/20 rounded-full blur-2xl animate-pulse" />
        </div>
        {/* Hero */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-white/30 dark:bg-purple-900/60 backdrop-blur-lg rounded-full p-8 shadow-2xl mb-4 border-4 border-purple-300 animate-float">
            {/* <Lottie animationData={magicAnimation} loop style={{ width: 80, height: 80 }} /> */}
            <Sparkles className="h-16 w-16 text-purple-700 dark:text-purple-200 drop-shadow-glow animate-bounce" />
          </div>
          <h1 className="text-5xl font-extrabold text-purple-900 dark:text-white mb-2 drop-shadow-glow tracking-tight">Magic Explain</h1>
          <p className="text-xl text-purple-700 dark:text-purple-200 mb-4 text-center max-w-2xl font-semibold">
            <span className="inline-block animate-wiggle">✨</span> Highlight or paste any text and let AI explain it your way! <br />
            <span className="italic text-purple-500 dark:text-purple-300">“Confusion? Gone in a sparkle.”</span>
          </p>
        </div>
        {/* Description Card */}
        <div className="relative z-10 bg-white/60 dark:bg-purple-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-10 mb-8 max-w-xl w-full flex flex-col items-center border border-purple-200 dark:border-purple-800">
          <ul className="list-disc text-purple-700 dark:text-purple-200 mb-4 pl-6 text-left w-full space-y-1">
            <li>Explain any text in simple words <span className="ml-1">📝</span></li>
            <li>Choose level: Kid, Class 10, Competitive, Meme <span className="ml-1">🎯</span></li>
            <li>Instant, AI-powered answers <span className="ml-1">⚡</span></li>
            <li>Great for all ages! <span className="ml-1">🌟</span></li>
          </ul>
          <a href="#tool" className="mt-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full font-bold shadow-lg hover:scale-105 hover:from-purple-600 hover:to-purple-800 transition-all duration-200 animate-shimmer">Try Now ✨</a>
        </div>
        {/* Tool Launcher + Tool */}
        <div id="tool" className="relative z-10 w-full flex flex-col items-center">
          <ToolsLauncher />
          <MagicExplain />
        </div>
        {/* Floating Mascot */}
        <div className="fixed bottom-8 left-8 z-20 hidden md:block animate-float">
          <span className="text-5xl">🦄</span>
          <div className="text-xs text-purple-700 dark:text-purple-200 font-bold mt-1">Magic Buddy</div>
        </div>
      </div>
    </LearningToolsProvider>
  );
} 