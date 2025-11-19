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
      className="fixed top-6 right-6 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-semibold text-sm shadow-lg border border-slate-200 transition-all hover:shadow-xl flex items-center gap-2"
      aria-label="Switch language"
    >
      <Languages className="w-5 h-5" />
      <span>{currentLanguage === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
}
