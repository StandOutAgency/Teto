export type Language = 'en' | 'ar';

export interface Translations {
  title: string;
  subtitle: string;
  winMessage: string;
  rulesMessage: string;
  finalScore: string;
  team1: string;
  team2: string;
  enterScore: string;
  addRound: string;
  reset: string;
  roundsHistory: string;
  round: string;
  noRoundsYet: string;
  target: string;
  progress: string;
  shareResults: string;
  goBack: string;
  poweredBy: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    title: 'Teto Score',
    subtitle: 'Teto Score',
    winMessage: 'Wins!',
    rulesMessage: 'First team to reach 250 points wins',
    finalScore: 'Final Score',
    team1: 'Us',
    team2: 'Them',
    enterScore: 'Enter score',
    addRound: 'Add Round',
    reset: 'Reset',
    roundsHistory: 'Rounds History',
    round: 'Round',
    noRoundsYet: 'No rounds yet. Start by entering scores above!',
    target: 'Target: 250 points',
    progress: 'Game Progress',
    shareResults: 'Share Results',
    goBack: 'Go Back One Round',
    poweredBy: 'Powered by Stand Out',
  },
  ar: {
    title: 'تيتو قيد',
    subtitle: 'تيتو قيد',
    winMessage: 'فاز!',
    rulesMessage: 'أول فريق يصل إلى 250 نقطة يفوز',
    finalScore: 'النتيجة النهائية',
    team1: 'لنا',
    team2: 'لهم',
    enterScore: 'أدخل النقاط',
    addRound: 'إضافة جولة',
    reset: 'إعادة',
    roundsHistory: 'تاريخ الجولات',
    round: 'جولة',
    noRoundsYet: 'لا توجد جولات بعد. ابدأ بإدخل النقاط أعلاه!',
    target: 'الهدف: 250 نقطة',
    progress: 'تقدم اللعبة',
    shareResults: 'مشاركة النتائج',
    goBack: 'العودة جولة واحدة',
    poweredBy: 'مدعوم من ستاند أوت',
  },
};
