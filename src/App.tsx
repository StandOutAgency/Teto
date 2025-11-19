import { useState } from 'react';
import { Trophy, Plus, RotateCcw, Share2, Undo2, Target } from 'lucide-react';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { Language, translations } from './types/language';

interface Round {
  id: string;
  round_number: number;
  team1_score: number;
  team2_score: number;
}

function App() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [team1Input, setTeam1Input] = useState('');
  const [team2Input, setTeam2Input] = useState('');
  const [language, setLanguage] = useState<Language>('en');

  const t = translations[language];
  const isRTL = language === 'ar';

  const team1Total = rounds.reduce((sum, round) => sum + round.team1_score, 0);
  const team2Total = rounds.reduce((sum, round) => sum + round.team2_score, 0);
  const gameEnded = team1Total >= 250 || team2Total >= 250;
  const winner = gameEnded ? (team1Total >= 250 ? 1 : 2) : null;

  const team1Progress = Math.min((team1Total / 250) * 100, 100);
  const team2Progress = Math.min((team2Total / 250) * 100, 100);

  const addRound = () => {
    if (!team1Input && !team2Input) return;
    if (gameEnded) return;

    const team1Score = team1Input ? parseInt(team1Input) : 0;
    const team2Score = team2Input ? parseInt(team2Input) : 0;

    if (isNaN(team1Score) || isNaN(team2Score)) return;

    const newRound: Round = {
      id: crypto.randomUUID(),
      round_number: rounds.length + 1,
      team1_score: team1Score,
      team2_score: team2Score,
    };

    setRounds([...rounds, newRound]);
    setTeam1Input('');
    setTeam2Input('');
  };

  const resetGame = () => {
    setRounds([]);
    setTeam1Input('');
    setTeam2Input('');
  };

  const goBackOneRound = () => {
    if (rounds.length === 0) return;
    setRounds(rounds.slice(0, -1));
  };

  const shareResults = () => {
    const winnerText = winner ? `${winner === 1 ? t.team1 : t.team2} ${t.winMessage}` : t.progress;
    const shareText = `${t.title}\n${winnerText}\n${t.finalScore}: ${team1Total} - ${team2Total}`;

    if (navigator.share) {
      navigator.share({
        title: t.title,
        text: shareText,
      }).catch(() => {
        copyToClipboard(shareText);
      });
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(language === 'en' ? 'Results copied to clipboard!' : 'تم نسخ النتائج!');
    });
  };

  const getScoreColor = (team: 1 | 2) => {
    if (team1Total === team2Total) return 'text-emerald-400';
    if (team === 1) return team1Total > team2Total ? 'text-emerald-400' : 'text-rose-400';
    return team2Total > team1Total ? 'text-emerald-400' : 'text-rose-400';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !gameEnded) {
      addRound();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />

      <div className="container mx-auto px-4 py-8 max-w-6xl flex-1">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-3 mt-12">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-7xl font-black bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
              {t.title}
            </h1>
          </div>
          <p className="text-base text-slate-400 mt-3 font-medium">{t.rulesMessage}</p>
        </div>

        {gameEnded && winner && (
          <div className="relative overflow-hidden bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-3xl p-8 mb-10 text-center shadow-2xl border-2 border-amber-300">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent)]" />
            <div className="relative">
              <div className="inline-block p-4 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
                <Trophy className="w-20 h-20 text-white drop-shadow-lg" />
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-white drop-shadow-md">{winner === 1 ? t.team1 : t.team2} {t.winMessage}</h2>
                <p className="text-xl font-semibold text-white/95">
                  {t.finalScore}: {team1Total} - {team2Total}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50 mb-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent)]" />
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-200">{t.progress}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full">
                <Target className="w-4 h-4" />
                <span className="font-semibold">{t.target}</span>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-slate-300">{t.team1}</span>
                  <span className={`text-base font-black ${getScoreColor(1)} drop-shadow-md`}>{team1Total} / 250</span>
                </div>
                <div className="h-5 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/50 shadow-inner">
                  <div
                    className={`h-full transition-all duration-700 ease-out ${team1Total > team2Total ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/50' : 'bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 shadow-lg shadow-rose-500/50'}`}
                    style={{ width: `${team1Progress}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-slate-300">{t.team2}</span>
                  <span className={`text-base font-black ${getScoreColor(2)} drop-shadow-md`}>{team2Total} / 250</span>
                </div>
                <div className="h-5 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/50 shadow-inner">
                  <div
                    className={`h-full transition-all duration-700 ease-out ${team2Total > team1Total ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/50' : 'bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 shadow-lg shadow-rose-500/50'}`}
                    style={{ width: `${team2Progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.1),transparent)]" />
            <div className="relative">
              <h2 className="text-2xl font-black text-slate-200 mb-4 tracking-wide">{t.team1}</h2>
              <div className={`text-7xl font-black mb-6 ${getScoreColor(1)} transition-all duration-300 drop-shadow-2xl`}>
                {team1Total}
              </div>
              <input
                type="number"
                value={team1Input}
                onChange={(e) => setTeam1Input(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={gameEnded}
                placeholder={t.enterScore}
                className="w-full px-5 py-4 bg-slate-900/50 border-2 border-slate-700 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-lg text-slate-200 placeholder-slate-500 disabled:bg-slate-900/30 disabled:cursor-not-allowed transition-all font-semibold"
              />
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.1),transparent)]" />
            <div className="relative">
              <h2 className="text-2xl font-black text-slate-200 mb-4 tracking-wide">{t.team2}</h2>
              <div className={`text-7xl font-black mb-6 ${getScoreColor(2)} transition-all duration-300 drop-shadow-2xl`}>
                {team2Total}
              </div>
              <input
                type="number"
                value={team2Input}
                onChange={(e) => setTeam2Input(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={gameEnded}
                placeholder={t.enterScore}
                className="w-full px-5 py-4 bg-slate-900/50 border-2 border-slate-700 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-lg text-slate-200 placeholder-slate-500 disabled:bg-slate-900/30 disabled:cursor-not-allowed transition-all font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <button
            onClick={addRound}
            disabled={gameEnded || (!team1Input && !team2Input)}
            className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white px-6 py-5 rounded-2xl font-bold text-base hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 disabled:from-slate-700 disabled:to-slate-800 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100 transition-all duration-200 flex items-center justify-center gap-2 border border-blue-400/20"
          >
            <Plus className="w-5 h-5" />
            <span>{t.addRound}</span>
          </button>

          <button
            onClick={goBackOneRound}
            disabled={rounds.length === 0}
            className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white px-6 py-5 rounded-2xl font-bold text-base hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 disabled:from-slate-700 disabled:to-slate-800 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100 transition-all duration-200 flex items-center justify-center gap-2 border border-orange-400/20"
          >
            <Undo2 className="w-5 h-5" />
            <span>{t.goBack}</span>
          </button>

          <button
            onClick={shareResults}
            disabled={rounds.length === 0}
            className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white px-6 py-5 rounded-2xl font-bold text-base hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 disabled:from-slate-700 disabled:to-slate-800 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100 transition-all duration-200 flex items-center justify-center gap-2 border border-emerald-400/20"
          >
            <Share2 className="w-5 h-5" />
            <span>{t.shareResults}</span>
          </button>

          <button
            onClick={resetGame}
            disabled={rounds.length === 0}
            className="bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 text-white px-6 py-5 rounded-2xl font-bold text-base hover:shadow-2xl hover:shadow-slate-500/50 hover:scale-105 disabled:from-slate-700 disabled:to-slate-800 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100 transition-all duration-200 flex items-center justify-center gap-2 border border-slate-500/20"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{t.reset}</span>
          </button>
        </div>

        {rounds.length > 0 && (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 px-8 py-5">
              <h3 className="text-2xl font-black text-slate-100">{t.roundsHistory}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-slate-700/50">
                  <tr>
                    <th className={`px-8 py-5 ${isRTL ? 'text-right' : 'text-left'} text-sm font-bold text-slate-300 uppercase tracking-wide`}>
                      {t.round}
                    </th>
                    <th className="px-8 py-5 text-center text-sm font-bold text-slate-300 uppercase tracking-wide">
                      {t.team1}
                    </th>
                    <th className="px-8 py-5 text-center text-sm font-bold text-slate-300 uppercase tracking-wide">
                      {t.team2}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {[...rounds].reverse().map((round) => (
                    <tr key={round.id} className="hover:bg-slate-700/20 transition-colors">
                      <td className={`px-8 py-5 text-sm font-bold text-slate-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t.round} {round.round_number}
                      </td>
                      <td className="px-8 py-5 text-center text-xl font-black text-slate-200">
                        {round.team1_score}
                      </td>
                      <td className="px-8 py-5 text-center text-xl font-black text-slate-200">
                        {round.team2_score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {rounds.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50">
            <p className="text-slate-400 text-xl font-semibold">{t.noRoundsYet}</p>
          </div>
        )}
      </div>

      <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50 py-8 mt-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">{t.title}</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-400 font-semibold">{t.poweredBy}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
