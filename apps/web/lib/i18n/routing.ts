// Stub for i18n routing (next-intl not installed)
// This provides type exports and placeholder functions
import type { FC, ReactNode } from 'react';

export const routing = {
  // A list of all locales that are supported
  locales: ['sq', 'en', 'de', 'fr', 'it', 'zh', 'ru', 'es', 'hi', 'ar', 'el', 'tr', 'he'] as const,
  defaultLocale: 'sq' as const,
  pathnames: {
    '/': '/',
    '/dashboard': {
      sq: '/dashboard',
      en: '/dashboard',
      de: '/dashboard',
      fr: '/tableau-de-bord',
      it: '/dashboard',
      zh: '/仪表板',
      ru: '/панель',
      es: '/tablero',
      hi: '/डैशबोर्ड',
      ar: '/لوحة-التحكم',
      el: '/πίνακας-ελέγχου',
      tr: '/kontrol-paneli',
      he: '/לוח-בקרה'
    },
    '/analytics': {
      sq: '/analitika',
      en: '/analytics',
      de: '/analytik',
      fr: '/analytique',
      it: '/analisi',
      zh: '/分析',
      ru: '/аналитика',
      es: '/analitica',
      hi: '/विश्लेषण',
      ar: '/التحليلات',
      el: '/αναλύσεις',
      tr: '/analizler',
      he: '/אנליטיקה'
    },
    '/settings': {
      sq: '/cilesimet',
      en: '/settings',
      de: '/einstellungen',
      fr: '/parametres',
      it: '/impostazioni',
      zh: '/设置',
      ru: '/настройки',
      es: '/configuracion',
      hi: '/सेटिंग्स',
      ar: '/الإعدادات',
      el: '/ρυθμίσεις',
      tr: '/ayarlar',
      he: '/הגדרות'
    },
    '/projects': {
      sq: '/projektet',
      en: '/projects',
      de: '/projekte',
      fr: '/projets',
      it: '/progetti',
      zh: '/项目',
      ru: '/проекты',
      es: '/proyectos',
      hi: '/परियोजनाएं',
      ar: '/المشاريع',
      el: '/έργα',
      tr: '/projeler',
      he: '/פרויקטים'
    },
    '/about': {
      sq: '/rreth-nesh',
      en: '/about',
      de: '/uber-uns',
      fr: '/a-propos',
      it: '/chi-siamo',
      zh: '/关于我们',
      ru: '/о-нас',
      es: '/acerca-de',
      hi: '/हमारे-बारे-में',
      ar: '/حولنا',
      el: '/σχετικά',
      tr: '/hakkimizda',
      he: '/אודותינו'
    },
    '/contact': {
      sq: '/kontakt',
      en: '/contact',
      de: '/kontakt',
      fr: '/contact',
      it: '/contatto',
      zh: '/联系我们',
      ru: '/контакт',
      es: '/contacto',
      hi: '/संपर्क',
      ar: '/اتصال',
      el: '/επικοινωνία',
      tr: '/iletisim',
      he: '/צור-קשר'
    },
    '/help': {
      sq: '/ndihme',
      en: '/help',
      de: '/hilfe',
      fr: '/aide',
      it: '/aiuto',
      zh: '/帮助',
      ru: '/помощь',
      es: '/ayuda',
      hi: '/मदद',
      ar: '/مساعدة',
      el: '/βοήθεια',
      tr: '/yardim',
      he: '/עזרה'
    },
    '/web8-tabs': {
      sq: '/web8-tabs',
      en: '/web8-tabs',
      de: '/web8-tabs',
      fr: '/web8-tabs',
      it: '/web8-tabs',
      zh: '/web8-tabs',
      ru: '/web8-tabs',
      es: '/web8-tabs',
      hi: '/web8-tabs',
      ar: '/web8-tabs',
      el: '/web8-tabs',
      tr: '/web8-tabs',
      he: '/web8-tabs'
    }
  }
};

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

// Stub navigation functions (next-intl not installed)
export const Link = 'a' as unknown as FC<{ href: string; children: ReactNode }>;
export const redirect = (path: string) => { if (typeof window !== 'undefined') window.location.href = path; };
export const usePathname = () => typeof window !== 'undefined' ? window.location.pathname : '/';
export const useRouter = () => ({ push: (path: string) => { if (typeof window !== 'undefined') window.location.href = path; } });
export const getPathname = (path: string) => path;
