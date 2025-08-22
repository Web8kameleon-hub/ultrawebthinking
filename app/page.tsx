/**
 * EuroWeb Ultra Platform - Root Redirect Page
 * Redirects to default locale (Albanian)
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version Ultra 2.0.0 i18n
 * @license MIT
 */

import { redirect } from 'next/navigation'

export default function RootPage() {
  // Redirect to default locale (Albanian)
  redirect('/sq')
}
