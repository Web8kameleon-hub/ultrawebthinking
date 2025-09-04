import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['sq', 'en', 'de', 'fr', 'it', 'zh', 'ru', 'es', 'hi', 'ar', 'el', 'tr', 'he'],

  // Used when no locale matches
  defaultLocale: 'sq',
  
  // The prefix for the default locale when creating links
  localePrefix: {
    mode: 'as-needed',
    prefixes: {
      // Albanian as default (no prefix)
      // English with /en prefix
      // German with /de prefix
      // French with /fr prefix
      // Italian with /it prefix
    }
  },

  // Pathnames that are localized
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
    }
  }
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
