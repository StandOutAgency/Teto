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
    if (!team1Input || !team2Input) return;

    const team1Score = parseInt(team1Input);
    const team2Score = parseInt(team2Input);

    if (isNaN(team1Score) || isNaN(team2Score)) return;
    if (gameEnded) return;

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
    if (team1Total === team2Total) return 'text-emerald-600';
    if (team === 1) return team1Total > team2Total ? 'text-emerald-600' : 'text-red-600';
    return team2Total > team1Total ? 'text-emerald-600' : 'text-red-600';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !gameEnded) {
      addRound();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />

      <div className="container mx-auto px-4 py-8 max-w-5xl flex-1">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-10 h-10 text-amber-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {t.title}
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-2">{t.rulesMessage}</p>
        </div>

        {gameEnded && winner && (
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-2xl p-6 mb-8 text-center shadow-xl">
            <Trophy className="w-16 h-16 mx-auto mb-3" />
            <div className="space-y-1">
              <h2 className="text-3xl font-bold">{winner === 1 ? t.team1 : t.team2} {t.winMessage}</h2>
              <p className="text-amber-50">
                {t.finalScore}: {team1Total} - {team2Total}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-700">{t.progress}</h3>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Target className="w-4 h-4" />
              <span>{t.target}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">{t.team1}</span>
                <span className={`text-sm font-bold ${getScoreColor(1)}`}>{team1Total} / 250</span>
              </div>
              <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${team1Total > team2Total ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}
                  style={{ width: `${team1Progress}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">{t.team2}</span>
                <span className={`text-sm font-bold ${getScoreColor(2)}`}>{team2Total} / 250</span>
              </div>
              <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${team2Total > team1Total ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}
                  style={{ width: `${team2Progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-3">{t.team1}</h2>
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(1)} transition-colors`}>
              {team1Total}
            </div>
            <input
              type="number"
              value={team1Input}
              onChange={(e) => setTeam1Input(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={gameEnded}
              placeholder={t.enterScore}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg disabled:bg-slate-50 disabled:cursor-not-allowed transition-colors"
            />
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-3">{t.team2}</h2>
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(2)} transition-colors`}>
              {team2Total}
            </div>
            <input
              type="number"
              value={team2Input}
              onChange={(e) => setTeam2Input(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={gameEnded}
              placeholder={t.enterScore}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg disabled:bg-slate-50 disabled:cursor-not-allowed transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={addRound}
            disabled={gameEnded || !team1Input || !team2Input}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl font-semibold text-base hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>{t.addRound}</span>
          </button>

          <button
            onClick={goBackOneRound}
            disabled={rounds.length === 0}
            className="bg-orange-600 text-white px-6 py-4 rounded-xl font-semibold text-base hover:bg-orange-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Undo2 className="w-5 h-5" />
            <span>{t.goBack}</span>
          </button>

          <button
            onClick={shareResults}
            disabled={rounds.length === 0}
            className="bg-green-600 text-white px-6 py-4 rounded-xl font-semibold text-base hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            <span>{t.shareResults}</span>
          </button>

          <button
            onClick={resetGame}
            disabled={rounds.length === 0}
            className="bg-slate-600 text-white px-6 py-4 rounded-xl font-semibold text-base hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{t.reset}</span>
          </button>
        </div>

        {rounds.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
              <h3 className="text-xl font-bold text-white">{t.roundsHistory}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'} text-sm font-semibold text-slate-700`}>
                      {t.round}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                      {t.team1}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                      {t.team2}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rounds.map((round) => (
                    <tr key={round.id} className="hover:bg-slate-50 transition-colors">
                      <td className={`px-6 py-4 text-sm font-medium text-slate-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t.round} {round.round_number}
                      </td>
                      <td className="px-6 py-4 text-center text-lg font-semibold text-slate-800">
                        {round.team1_score}
                      </td>
                      <td className="px-6 py-4 text-center text-lg font-semibold text-slate-800">
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
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-slate-200">
            <p className="text-slate-400 text-lg">{t.noRoundsYet}</p>
          </div>
        )}
      </div>

      <footer className="bg-white border-t border-slate-200 py-6 mt-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-500" />
              <span className="text-lg font-bold text-slate-800">{t.title}</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-600 font-medium">{t.poweredBy}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
