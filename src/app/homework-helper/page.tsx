'use client';
import { LearningToolsProvider, HomeworkHelper, ToolsLauncher } from '@/components/learning-tools';
import { BookOpen } from 'lucide-react';
// import Lottie from 'lottie-react';
// import homeworkAnimation from '@/public/animations/homework.json';

export default function HomeworkHelperPage() {
  return (
    <LearningToolsProvider questionRef="homework-helper-page" initialText="">
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-900 via-yellow-400/30 to-yellow-100 dark:from-gray-900 dark:to-yellow-900 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-yellow-400/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-yellow-600/20 rounded-full blur-2xl animate-pulse" />
        </div>
        {/* Hero */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-white/30 dark:bg-yellow-900/60 backdrop-blur-lg rounded-full p-8 shadow-2xl mb-4 border-4 border-yellow-300 animate-float">
            {/* <Lottie animationData={homeworkAnimation} loop style={{ width: 80, height: 80 }} /> */}
            <BookOpen className="h-16 w-16 text-yellow-700 dark:text-yellow-200 drop-shadow-glow animate-bounce" />
          </div>
          <h1 className="text-5xl font-extrabold text-yellow-900 dark:text-white mb-2 drop-shadow-glow tracking-tight">AI Homework Helper</h1>
          <p className="text-xl text-yellow-700 dark:text-yellow-200 mb-4 text-center max-w-2xl font-semibold">
            <span className="inline-block animate-wiggle">📚</span> Stuck on homework? Let AI explain and guide you! <br />
            <span className="italic text-yellow-500 dark:text-yellow-300">“Homework help, just a click away.”</span>
          </p>
        </div>
        {/* Description Card */}
        <div className="relative z-10 bg-white/60 dark:bg-yellow-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-10 mb-8 max-w-xl w-full flex flex-col items-center border border-yellow-200 dark:border-yellow-800">
          <ul className="list-disc text-yellow-700 dark:text-yellow-200 mb-4 pl-6 text-left w-full space-y-1">
            <li>Upload image or paste text <span className="ml-1">🖼️</span></li>
            <li>Instant concept explanations <span className="ml-1">💡</span></li>
            <li>Step-by-step guidance <span className="ml-1">🪜</span></li>
            <li>Great for all subjects <span className="ml-1">🌍</span></li>
          </ul>
          <a href="#tool" className="mt-2 px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-700 text-white rounded-full font-bold shadow-lg hover:scale-105 hover:from-yellow-600 hover:to-yellow-800 transition-all duration-200 animate-shimmer">Try Now 📚</a>
        </div>
        {/* Tool Launcher + Tool */}
        <div id="tool" className="relative z-10 w-full flex flex-col items-center">
          <ToolsLauncher />
          <HomeworkHelper />
        </div>
        {/* Floating Mascot */}
        <div className="fixed bottom-8 left-8 z-20 hidden md:block animate-float">
          <span className="text-5xl">🦊</span>
          <div className="text-xs text-yellow-700 dark:text-yellow-200 font-bold mt-1">Helper Fox</div>
        </div>
      </div>
    </LearningToolsProvider>
  );
} 