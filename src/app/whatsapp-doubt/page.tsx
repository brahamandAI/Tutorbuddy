'use client';
import { LearningToolsProvider, WhatsAppDoubt, ToolsLauncher } from '@/components/learning-tools';
import { MessageSquare } from 'lucide-react';
// import Lottie from 'lottie-react';
// import whatsappAnimation from '@/public/animations/whatsapp.json';

export default function WhatsAppDoubtPage() {
  return (
    <LearningToolsProvider questionRef="whatsapp-doubt-page" initialText="">
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-900 via-green-400/30 to-green-100 dark:from-gray-900 dark:to-green-900 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-green-400/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-green-600/20 rounded-full blur-2xl animate-pulse" />
        </div>
        {/* Hero */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-white/30 dark:bg-green-900/60 backdrop-blur-lg rounded-full p-8 shadow-2xl mb-4 border-4 border-green-300 animate-float">
            {/* <Lottie animationData={whatsappAnimation} loop style={{ width: 80, height: 80 }} /> */}
            <MessageSquare className="h-16 w-16 text-green-700 dark:text-green-200 drop-shadow-glow animate-bounce" />
          </div>
          <h1 className="text-5xl font-extrabold text-green-900 dark:text-white mb-2 drop-shadow-glow tracking-tight">Ask This Doubt in WhatsApp</h1>
          <p className="text-xl text-green-700 dark:text-green-200 mb-4 text-center max-w-2xl font-semibold">
            <span className="inline-block animate-wiggle">💬</span> Share your doubts with friends or tutors in one click! <br />
            <span className="italic text-green-500 dark:text-green-300">“Doubt? WhatsApp it away.”</span>
          </p>
        </div>
        {/* Description Card */}
        <div className="relative z-10 bg-white/60 dark:bg-green-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-10 mb-8 max-w-xl w-full flex flex-col items-center border border-green-200 dark:border-green-800">
          <ul className="list-disc text-green-700 dark:text-green-200 mb-4 pl-6 text-left w-full space-y-1">
            <li>Paste or type your question <span className="ml-1">📝</span></li>
            <li>Get a WhatsApp share link <span className="ml-1">🔗</span></li>
            <li>Optional: AI summary for clarity <span className="ml-1">🤖</span></li>
            <li>Share with friends or tutors instantly <span className="ml-1">🚀</span></li>
          </ul>
          <a href="#tool" className="mt-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-full font-bold shadow-lg hover:scale-105 hover:from-green-600 hover:to-green-800 transition-all duration-200 animate-shimmer">Try Now 💬</a>
        </div>
        {/* Tool Launcher + Tool */}
        <div id="tool" className="relative z-10 w-full flex flex-col items-center">
          <ToolsLauncher />
          <WhatsAppDoubt />
        </div>
        {/* Floating Mascot */}
        <div className="fixed bottom-8 left-8 z-20 hidden md:block animate-float">
          <span className="text-5xl">🦉</span>
          <div className="text-xs text-green-700 dark:text-green-200 font-bold mt-1">Doubt Owl</div>
        </div>
      </div>
    </LearningToolsProvider>
  );
} 