'use client';

import React, { useState } from 'react';
import { useLearningTools } from './LearningToolsProvider';
import { Modal } from '../ui/Modal';
import { TextArea } from '../ui/TextArea';
import { postJSON } from '@/lib/apiClient';

// Types
export type BattleSubject = 'Class 10 Science' | 'Class 10 Math' | 'Competitive' | 'Custom';
export type BattleStatus = 'pending' | 'active' | 'completed';

export interface Battle {
  id: string;
  subject: BattleSubject;
  questions: Array<{ q: string; options: string[]; answerIndex: number }>;
  status: BattleStatus;
  challenger: string;
  opponent: string;
  xp: number;
  winner?: string;
}

export interface LeaderboardEntry {
  user: string;
  xp: number;
  wins: number;
  streak: number;
}

const subjects: BattleSubject[] = [
  'Class 10 Science',
  'Class 10 Math',
  'Competitive',
  'Custom',
];

export const DoubtBattle = () => {
  const { currentTool, closeTool } = useLearningTools();
  const [tab, setTab] = useState<'start' | 'join' | 'leaderboard'>('start');
  // Start Battle
  const [friend, setFriend] = useState('');
  const [subject, setSubject] = useState<BattleSubject>('Class 10 Science');
  const [numQ, setNumQ] = useState(5);
  const [startLoading, setStartLoading] = useState(false);
  const [battleCode, setBattleCode] = useState('');
  const [startResult, setStartResult] = useState<Battle | null>(null);
  // Join Battle
  const [joinCode, setJoinCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinResult, setJoinResult] = useState<Battle | null>(null);
  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [lbLoading, setLbLoading] = useState(false);

  // Dummy quiz preview
  const quizPreview = [
    { q: 'What is H2O?', options: ['Water', 'Oxygen', 'Hydrogen'], answerIndex: 0 },
    { q: '2+2=?', options: ['3', '4', '5'], answerIndex: 1 },
  ];

  // Start Battle handler (stub)
  const handleStartBattle = async () => {
    setStartLoading(true);
    setStartResult(null);
    // TODO: Integrate with backend /api/doubt-battle/start
    await new Promise(r => setTimeout(r, 800));
    setStartResult({
      id: 'BATTLE123',
      subject,
      questions: quizPreview,
      status: 'pending',
      challenger: 'You',
      opponent: friend,
      xp: 0,
    });
    setBattleCode('BATTLE123');
    setStartLoading(false);
  };

  // Join Battle handler (stub)
  const handleJoinBattle = async () => {
    setJoinLoading(true);
    setJoinResult(null);
    // TODO: Integrate with backend /api/doubt-battle/join
    await new Promise(r => setTimeout(r, 800));
    setJoinResult({
      id: joinCode,
      subject: 'Class 10 Science',
      questions: quizPreview,
      status: 'active',
      challenger: 'Friend',
      opponent: 'You',
      xp: 0,
    });
    setJoinLoading(false);
  };

  // Load leaderboard (stub)
  const loadLeaderboard = async () => {
    setLbLoading(true);
    // TODO: Integrate with backend /api/doubt-battle/leaderboard
    await new Promise(r => setTimeout(r, 800));
    setLeaderboard([
      { user: 'You', xp: 120, wins: 5, streak: 2 },
      { user: 'Friend1', xp: 100, wins: 4, streak: 1 },
      { user: 'Friend2', xp: 80, wins: 3, streak: 1 },
    ]);
    setLbLoading(false);
  };

  // Auto-load leaderboard on tab switch
  React.useEffect(() => {
    if (tab === 'leaderboard') loadLeaderboard();
  }, [tab]);

  return (
    <Modal open={currentTool === 'doubtBattle'} onClose={closeTool} title="Doubt Battles – Friendly Quiz Duels">
      <div className="flex flex-col gap-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-2">
          <button className={`px-3 py-1 rounded ${tab === 'start' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`} onClick={() => setTab('start')}>Start Battle</button>
          <button className={`px-3 py-1 rounded ${tab === 'join' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`} onClick={() => setTab('join')}>Join Battle</button>
          <button className={`px-3 py-1 rounded ${tab === 'leaderboard' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`} onClick={() => setTab('leaderboard')}>Leaderboard</button>
        </div>
        {/* Start Battle Tab */}
        {tab === 'start' && (
          <div className="flex flex-col gap-3">
            <input className="border rounded p-2" placeholder="Friend's username/email" value={friend} onChange={e => setFriend(e.target.value)} />
            <select className="border rounded p-2" value={subject} onChange={e => setSubject(e.target.value as BattleSubject)}>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input className="border rounded p-2" type="number" min={5} max={10} value={numQ} onChange={e => setNumQ(Number(e.target.value))} />
            <button className="bg-blue-600 text-white rounded px-4 py-2" onClick={handleStartBattle} disabled={startLoading}>{startLoading ? 'Starting...' : 'Start Battle'}</button>
            {startResult && (
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded text-sm mt-2">
                Battle created! Code: <span className="font-bold">{battleCode}</span>
                <div className="mt-2">Share this code with your friend to join.</div>
                <div className="mt-2 font-semibold">Quiz Preview:</div>
                <ul className="list-disc ml-6">
                  {startResult.questions.map((q, i) => <li key={i}>{q.q}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
        {/* Join Battle Tab */}
        {tab === 'join' && (
          <div className="flex flex-col gap-3">
            <input className="border rounded p-2" placeholder="Enter Battle Code" value={joinCode} onChange={e => setJoinCode(e.target.value)} />
            <button className="bg-blue-600 text-white rounded px-4 py-2" onClick={handleJoinBattle} disabled={joinLoading}>{joinLoading ? 'Joining...' : 'Join Battle'}</button>
            {joinResult && (
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded text-sm mt-2">
                Joined battle! Subject: <span className="font-bold">{joinResult.subject}</span>
                <div className="mt-2 font-semibold">Quiz Preview:</div>
                <ul className="list-disc ml-6">
                  {joinResult.questions.map((q, i) => <li key={i}>{q.q}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
        {/* Leaderboard Tab */}
        {tab === 'leaderboard' && (
          <div className="flex flex-col gap-3">
            {lbLoading ? (
              <div>Loading leaderboard...</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th>User</th>
                    <th>XP</th>
                    <th>Wins</th>
                    <th>Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, i) => (
                    <tr key={i} className={i === 0 ? 'font-bold text-blue-700 dark:text-blue-300' : ''}>
                      <td>{entry.user}</td>
                      <td>{entry.xp}</td>
                      <td>{entry.wins}</td>
                      <td>{entry.streak}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}; 