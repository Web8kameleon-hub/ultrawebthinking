/**
 * EuroWeb Ultra Platform - Localized Layout
 * Pure TypeScript Implementation - i18n Support
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version Ultra 2.0.0 i18n
 * @license MIT
 */

import { notFound } from 'next/navigation';
import { routing } from '../../lib/i18n/routing';

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default function LocaleLayout({
  children,
  params: { locale }
}: Props) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  return (
    <div lang={locale} data-locale={locale}>
      {children}
    </div>
  );
}
