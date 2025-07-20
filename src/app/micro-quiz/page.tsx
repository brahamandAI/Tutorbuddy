'use client';
import { LearningToolsProvider, MicroQuiz, ToolsLauncher } from '@/components/learning-tools';
import { Star } from 'lucide-react';
// import Lottie from 'lottie-react';
// import quizAnimation from '@/public/animations/quiz.json';

export default function MicroQuizPage() {
  return (
    <LearningToolsProvider questionRef="micro-quiz-page" initialText="">
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-900 via-pink-400/30 to-pink-100 dark:from-gray-900 dark:to-pink-900 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-pink-400/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-pink-600/20 rounded-full blur-2xl animate-pulse" />
        </div>
        {/* Hero */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-white/30 dark:bg-pink-900/60 backdrop-blur-lg rounded-full p-8 shadow-2xl mb-4 border-4 border-pink-300 animate-float">
            {/* <Lottie animationData={quizAnimation} loop style={{ width: 80, height: 80 }} /> */}
            <Star className="h-16 w-16 text-pink-700 dark:text-pink-200 drop-shadow-glow animate-bounce" />
          </div>
          <h1 className="text-5xl font-extrabold text-pink-900 dark:text-white mb-2 drop-shadow-glow tracking-tight">Micro-Quiz Generator</h1>
          <p className="text-xl text-pink-700 dark:text-pink-200 mb-4 text-center max-w-2xl font-semibold">
            <span className="inline-block animate-wiggle">⭐</span> Paste any text and let AI quiz you instantly! <br />
            <span className="italic text-pink-500 dark:text-pink-300">“Quiz yourself, level up fast!”</span>
          </p>
        </div>
        {/* Description Card */}
        <div className="relative z-10 bg-white/60 dark:bg-pink-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-10 mb-8 max-w-xl w-full flex flex-col items-center border border-pink-200 dark:border-pink-800">
          <ul className="list-disc text-pink-700 dark:text-pink-200 mb-4 pl-6 text-left w-full space-y-1">
            <li>Paste any text <span className="ml-1">📝</span></li>
            <li>Get 3 instant MCQs <span className="ml-1">❓</span></li>
            <li>Preview answers & explanations <span className="ml-1">💡</span></li>
            <li>Great for all subjects <span className="ml-1">🌍</span></li>
          </ul>
          <a href="#tool" className="mt-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-700 text-white rounded-full font-bold shadow-lg hover:scale-105 hover:from-pink-600 hover:to-pink-800 transition-all duration-200 animate-shimmer">Try Now ⭐</a>
        </div>
        {/* Tool Launcher + Tool */}
        <div id="tool" className="relative z-10 w-full flex flex-col items-center">
          <ToolsLauncher />
          <MicroQuiz />
        </div>
        {/* Floating Mascot */}
        <div className="fixed bottom-8 left-8 z-20 hidden md:block animate-float">
          <span className="text-5xl">🦄</span>
          <div className="text-xs text-pink-700 dark:text-pink-200 font-bold mt-1">Quiz Unicorn</div>
        </div>
      </div>
    </LearningToolsProvider>
  );
} 