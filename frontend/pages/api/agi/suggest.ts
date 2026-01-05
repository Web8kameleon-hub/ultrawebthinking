// pages/api/agi/suggest.ts
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.body
  const base = query.toLowerCase()

  const suggestions = [
    "sa është ora?",
    "hap navigatorin",
    "gjej dokumentin tim",
    "ndihmë për projektin Web8",
    "aktivizo modalitetin etik",
  ].filter((s: string) => s.toLowerCase().includes(base))

  res.status(200).json({ suggestions })
}
