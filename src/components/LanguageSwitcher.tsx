import { Languages } from 'lucide-react';
import { Language } from '../types/language';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <button
      onClick={() => onLanguageChange(currentLanguage === 'en' ? 'ar' : 'en')}
      className="fixed top-6 right-6 bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-slate-200 px-5 py-3 rounded-2xl font-bold text-sm shadow-2xl border border-slate-700 transition-all hover:shadow-slate-500/50 hover:scale-105 flex items-center gap-2 backdrop-blur-xl"
      aria-label="Switch language"
    >
      <Languages className="w-5 h-5" />
      <span>{currentLanguage === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
}
