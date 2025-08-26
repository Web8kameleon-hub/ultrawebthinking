import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function buildAnalysisPDF(params: {
    title: string;
    query: string;
    results: { title: string; url: string; snippet: string }[];
    analysis: {
        langGuess: string;
        wordCount: number;
        topKeywords: { token: string, score: number }[];
        summary: string[];
        sentiment: { score: number; magnitude: number }
    };
}): Promise<Uint8Array> {
    const pdf = await PDFDocument.create();
    let page = pdf.addPage([595.28, 841.89]); // A4
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

    const draw = (txt: string, x: number, y: number, size = 12, bold = false) =>
        page.drawText(txt, {
            x, y, size,
            font: bold ? boldFont : font,
            color: rgb(0, 0, 0)
        });

    let y = 800;

    // Header
    draw(params.title, 40, y, 18, true);
    y -= 30;
    draw(`Generated: ${new Date().toLocaleString()}`, 40, y, 10);
    y -= 20;
    draw(`Query: ${params.query}`, 40, y, 12, true);
    y -= 20;

    // Analysis Overview
    const lang = params.analysis.langGuess.toUpperCase();
    const sentiment = params.analysis.sentiment;
    const sentimentLabel = sentiment.score > 0 ? "Positive" : sentiment.score < 0 ? "Negative" : "Neutral";

    draw(`Language: ${lang} | Words: ${params.analysis.wordCount} | Sentiment: ${sentimentLabel} (${sentiment.score}/${sentiment.magnitude})`, 40, y);
    y -= 30;

    // Top Keywords
    draw("Top Keywords:", 40, y, 14, true);
    y -= 20;
    for (const k of params.analysis.topKeywords.slice(0, 10)) {
        draw(`• ${k.token} (${k.score})`, 50, y);
        y -= 16;
    }

    y -= 20;
    draw("Extractive Summary:", 40, y, 14, true);
    y -= 20;

    for (const s of params.analysis.summary) {
        const chunks = s.match(/.{1,75}(\s|$)/g) || [s];
        for (const c of chunks) {
            if (y < 80) {
                page = pdf.addPage([595.28, 841.89]);
                y = 800;
            }
            draw(c.trim(), 50, y);
            y -= 16;
        }
        y -= 8;
    }

    y -= 20;
    draw("Search Results:", 40, y, 14, true);
    y -= 20;

    for (const r of params.results.slice(0, 8)) {
        if (y < 120) {
            page = pdf.addPage([595.28, 841.89]);
            y = 800;
        }

        draw(`• ${r.title}`, 50, y, 11, true);
        y -= 16;

        const snippetChunks = (r.snippet || "").match(/.{1,75}(\s|$)/g) || [];
        for (const c of snippetChunks) {
            draw(`  ${c.trim()}`, 55, y, 10);
            y -= 14;
        }

        // URL (truncated if too long)
        const urlDisplay = r.url.length > 70 ? r.url.substring(0, 67) + "..." : r.url;
        draw(`  ${urlDisplay}`, 55, y, 9);
        y -= 16;
        y -= 8;
    }

    const bytes = await pdf.save();
    return bytes;
}
