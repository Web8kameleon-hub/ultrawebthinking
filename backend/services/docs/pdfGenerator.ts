/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 * Industrial PDF Report Generator - Real Document Creation Engine
 */

import { PDFDocument, PDFPage, rgb, StandardFonts } from 'pdf-lib';
import { TextAnalysisResult } from '../analysis/textAnalysis';
import { IndustrialSearchResponse } from '../search/websearch';

export interface ReportData {
  title: string;
  description: string;
  author: string;
  date: string;
  sections: Array<{
    title: string;
    content: string;
    type: 'text' | 'table' | 'chart' | 'image';
    data?: any;
  }>;
  metadata: {
    source: string;
    version: string;
    classification: 'public' | 'internal' | 'confidential';
    tags: string[];
  };
}

export interface SearchReport extends ReportData {
  searchQuery: string;
  searchResults: IndustrialSearchResponse;
  analytics: {
    totalResults: number;
    searchTime: number;
    topDomains: string[];
    categories: Record<string, number>;
  };
}

export interface AnalysisReport extends ReportData {
  textAnalysis: TextAnalysisResult[];
  summary: {
    totalWords: number;
    avgSentiment: number;
    avgReadability: number;
    topKeywords: string[];
    detectedLanguages: string[];
  };
}

export class IndustrialPDFGenerator {
  private readonly pageWidth = 595; // A4 width in points
  private readonly pageHeight = 842; // A4 height in points
  private readonly margin = 50;
  private readonly headerHeight = 80;
  private readonly footerHeight = 40;

  async generateSearchReport(searchData: IndustrialSearchResponse, query: string): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Create title page
    let currentPage = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
    let yPosition = this.pageHeight - this.margin - this.headerHeight;

    // Title
    currentPage.drawText('INDUSTRIAL SEARCH REPORT', {
      x: this.margin,
      y: yPosition,
      size: 24,
      font: timesRomanBoldFont,
      color: rgb(0.1, 0.1, 0.5)
    });

    yPosition -= 60;

    // Query info
    currentPage.drawText(`Search Query: "${query}"`, {
      x: this.margin,
      y: yPosition,
      size: 16,
      font: timesRomanFont,
      color: rgb(0.2, 0.2, 0.2)
    });

    yPosition -= 30;

    currentPage.drawText(`Generated: ${new Date().toLocaleDateString()}`, {
      x: this.margin,
      y: yPosition,
      size: 12,
      font: helveticaFont,
      color: rgb(0.4, 0.4, 0.4)
    });

    yPosition -= 30;

    currentPage.drawText(`Total Results: ${searchData.results.length}`, {
      x: this.margin,
      y: yPosition,
      size: 12,
      font: helveticaFont,
      color: rgb(0.4, 0.4, 0.4)
    });

    yPosition -= 50;

    // Executive Summary
    yPosition = this.addSection(currentPage, 'EXECUTIVE SUMMARY', yPosition, timesRomanBoldFont);
    
    const summaryText = `This report contains ${searchData.results.length} search results for the query "${query}". ` +
      `The search was completed in ${searchData.meta.search_time}ms using the ${searchData.meta.api_provider} API. ` +
      `Results include ${Object.keys(searchData.clustering.by_category).length} different categories of content.`;

    yPosition = this.addParagraph(currentPage, summaryText, yPosition, timesRomanFont, 12);

    yPosition -= 40;

    // Analytics Section
    yPosition = this.addSection(currentPage, 'SEARCH ANALYTICS', yPosition, timesRomanBoldFont);

    // Categories breakdown
    yPosition = this.addSubsection(currentPage, 'Content Categories:', yPosition, timesRomanFont, 14);
    
    for (const [category, count] of Object.entries(searchData.clustering.by_category)) {
      if (yPosition < this.margin + this.footerHeight + 60) {
        currentPage = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
        yPosition = this.pageHeight - this.margin - this.headerHeight;
      }
      
      yPosition = this.addListItem(currentPage, `${category}: ${count} results`, yPosition, helveticaFont);
    }

    yPosition -= 30;

    // Top domains
    yPosition = this.addSubsection(currentPage, 'Top Domains:', yPosition, timesRomanFont, 14);
    
    const topDomains = Object.entries(searchData.clustering.by_domain)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10);

    for (const [domain, count] of topDomains) {
      if (yPosition < this.margin + this.footerHeight + 60) {
        currentPage = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
        yPosition = this.pageHeight - this.margin - this.headerHeight;
      }
      
      yPosition = this.addListItem(currentPage, `${domain}: ${count} results`, yPosition, helveticaFont);
    }

    // Results Section
    currentPage = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
    yPosition = this.pageHeight - this.margin - this.headerHeight;

    yPosition = this.addSection(currentPage, 'SEARCH RESULTS', yPosition, timesRomanBoldFont);

    for (let i = 0; i < Math.min(searchData.results.length, 20); i++) {
      const result = searchData.results[i];
      
      if (yPosition < this.margin + this.footerHeight + 120) {
        currentPage = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
        yPosition = this.pageHeight - this.margin - this.headerHeight;
      }

      // Result title
      yPosition = this.addSubsection(currentPage, `${i + 1}. ${result.title}`, yPosition, timesRomanBoldFont, 12);
      
      // URL
      yPosition = this.addParagraph(currentPage, `URL: ${result.url}`, yPosition, helveticaFont, 10, rgb(0, 0, 0.8));
      
      // Description
      const description = result.description.length > 300 
        ? result.description.substring(0, 300) + '...'
        : result.description;
      yPosition = this.addParagraph(currentPage, description, yPosition, timesRomanFont, 10);
      
      // Metadata
      const metadata = `Category: ${result.category} | Neural Score: ${(result.neural_score * 100).toFixed(1)}% | Relevance: ${(result.relevance * 100).toFixed(1)}%`;
      yPosition = this.addParagraph(currentPage, metadata, yPosition, helveticaFont, 9, rgb(0.5, 0.5, 0.5));
      
      yPosition -= 20;
    }

    // Add footer to all pages
    this.addFooters(pdfDoc, timesRomanFont);

    return await pdfDoc.save();
  }

  async generateAnalysisReport(analysisData: TextAnalysisResult[], title: string): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Title page
    let currentPage = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
    let yPosition = this.pageHeight - this.margin - this.headerHeight;

    currentPage.drawText('INDUSTRIAL TEXT ANALYSIS REPORT', {
      x: this.margin,
      y: yPosition,
      size: 24,
      font: timesRomanBoldFont,
      color: rgb(0.1, 0.1, 0.5)
    });

    yPosition -= 60;

    currentPage.drawText(title, {
      x: this.margin,
      y: yPosition,
      size: 16,
      font: timesRomanFont,
      color: rgb(0.2, 0.2, 0.2)
    });

    yPosition -= 30;

    currentPage.drawText(`Generated: ${new Date().toLocaleDateString()}`, {
      x: this.margin,
      y: yPosition,
      size: 12,
      font: helveticaFont,
      color: rgb(0.4, 0.4, 0.4)
    });

    yPosition -= 30;

    currentPage.drawText(`Total Documents Analyzed: ${analysisData.length}`, {
      x: this.margin,
      y: yPosition,
      size: 12,
      font: helveticaFont,
      color: rgb(0.4, 0.4, 0.4)
    });

    // Summary statistics
    yPosition -= 50;
    yPosition = this.addSection(currentPage, 'SUMMARY STATISTICS', yPosition, timesRomanBoldFont);

    const totalWords = analysisData.reduce((sum, a) => sum + a.content.wordCount, 0);
    const avgSentiment = analysisData.reduce((sum, a) => sum + a.sentiment.polarity, 0) / analysisData.length;
    const avgReadability = analysisData.reduce((sum, a) => sum + a.readability.score, 0) / analysisData.length;

    const stats = [
      `Total Words Analyzed: ${totalWords.toLocaleString()}`,
      `Average Words per Document: ${Math.round(totalWords / analysisData.length).toLocaleString()}`,
      `Average Sentiment: ${(avgSentiment * 100).toFixed(1)}% (${avgSentiment > 0.1 ? 'Positive' : avgSentiment < -0.1 ? 'Negative' : 'Neutral'})`,
      `Average Readability Score: ${avgReadability.toFixed(1)}`,
      `Languages Detected: ${Array.from(new Set(analysisData.map(a => a.language.detected))).join(', ')}`
    ];

    for (const stat of stats) {
      yPosition = this.addListItem(currentPage, stat, yPosition, helveticaFont);
    }

    // Individual analysis results
    for (let i = 0; i < analysisData.length; i++) {
      const analysis = analysisData[i];
      
      currentPage = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
      yPosition = this.pageHeight - this.margin - this.headerHeight;

      yPosition = this.addSection(currentPage, `DOCUMENT ${i + 1} ANALYSIS`, yPosition, timesRomanBoldFont);

      // Content stats
      yPosition = this.addSubsection(currentPage, 'Content Statistics:', yPosition, timesRomanFont, 14);
      
      const contentStats = [
        `Word Count: ${analysis.content.wordCount.toLocaleString()}`,
        `Character Count: ${analysis.content.charCount.toLocaleString()}`,
        `Sentences: ${analysis.content.sentences}`,
        `Paragraphs: ${analysis.content.paragraphs}`
      ];

      for (const stat of contentStats) {
        yPosition = this.addListItem(currentPage, stat, yPosition, helveticaFont);
      }

      yPosition -= 20;

      // Sentiment analysis
      yPosition = this.addSubsection(currentPage, 'Sentiment Analysis:', yPosition, timesRomanFont, 14);
      
      const sentimentInfo = [
        `Polarity: ${(analysis.sentiment.polarity * 100).toFixed(1)}% (${analysis.sentiment.emotion})`,
        `Subjectivity: ${(analysis.sentiment.subjectivity * 100).toFixed(1)}%`,
        `Confidence: ${(analysis.sentiment.confidence * 100).toFixed(1)}%`
      ];

      for (const info of sentimentInfo) {
        yPosition = this.addListItem(currentPage, info, yPosition, helveticaFont);
      }

      yPosition -= 20;

      // Top keywords
      yPosition = this.addSubsection(currentPage, 'Top Keywords:', yPosition, timesRomanFont, 14);
      
      const topKeywords = analysis.keywords.slice(0, 10);
      for (const keyword of topKeywords) {
        yPosition = this.addListItem(currentPage, `${keyword.word} (${keyword.frequency}x, ${(keyword.relevance * 100).toFixed(1)}% relevance)`, yPosition, helveticaFont);
      }

      yPosition -= 20;

      // Readability
      yPosition = this.addSubsection(currentPage, 'Readability:', yPosition, timesRomanFont, 14);
      
      const readabilityInfo = [
        `Score: ${analysis.readability.score.toFixed(1)} (${analysis.readability.level})`,
        `Avg Words per Sentence: ${analysis.readability.averageWordsPerSentence.toFixed(1)}`,
        `Avg Syllables per Word: ${analysis.readability.averageSyllablesPerWord.toFixed(1)}`
      ];

      for (const info of readabilityInfo) {
        yPosition = this.addListItem(currentPage, info, yPosition, helveticaFont);
      }

      // Topics
      if (analysis.topics.length > 0) {
        yPosition -= 20;
        yPosition = this.addSubsection(currentPage, 'Detected Topics:', yPosition, timesRomanFont, 14);
        
        for (const topic of analysis.topics) {
          yPosition = this.addListItem(currentPage, `${topic.topic} (${(topic.confidence * 100).toFixed(1)}% confidence)`, yPosition, helveticaFont);
        }
      }
    }

    this.addFooters(pdfDoc, timesRomanFont);
    return await pdfDoc.save();
  }

  async generateCustomReport(reportData: ReportData): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Title page
    let currentPage = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
    let yPosition = this.pageHeight - this.margin - this.headerHeight;

    currentPage.drawText(reportData.title.toUpperCase(), {
      x: this.margin,
      y: yPosition,
      size: 24,
      font: timesRomanBoldFont,
      color: rgb(0.1, 0.1, 0.5)
    });

    yPosition -= 60;

    yPosition = this.addParagraph(currentPage, reportData.description, yPosition, timesRomanFont, 14);

    yPosition -= 40;

    // Metadata
    const metadataLines = [
      `Author: ${reportData.author}`,
      `Date: ${reportData.date}`,
      `Source: ${reportData.metadata.source}`,
      `Version: ${reportData.metadata.version}`,
      `Classification: ${reportData.metadata.classification.toUpperCase()}`,
      `Tags: ${reportData.metadata.tags.join(', ')}`
    ];

    for (const line of metadataLines) {
      yPosition = this.addParagraph(currentPage, line, yPosition, helveticaFont, 12, rgb(0.4, 0.4, 0.4));
    }

    // Sections
    for (const section of reportData.sections) {
      currentPage = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
      yPosition = this.pageHeight - this.margin - this.headerHeight;

      yPosition = this.addSection(currentPage, section.title, yPosition, timesRomanBoldFont);
      yPosition = this.addParagraph(currentPage, section.content, yPosition, timesRomanFont, 12);
    }

    this.addFooters(pdfDoc, timesRomanFont);
    return await pdfDoc.save();
  }

  private addSection(page: PDFPage, title: string, yPosition: number, font: any, size = 18): number {
    page.drawText(title, {
      x: this.margin,
      y: yPosition,
      size,
      font,
      color: rgb(0.1, 0.1, 0.5)
    });
    return yPosition - (size + 20);
  }

  private addSubsection(page: PDFPage, title: string, yPosition: number, font: any, size = 14): number {
    page.drawText(title, {
      x: this.margin,
      y: yPosition,
      size,
      font,
      color: rgb(0.2, 0.2, 0.2)
    });
    return yPosition - (size + 10);
  }

  private addParagraph(page: PDFPage, text: string, yPosition: number, font: any, size = 12, color = rgb(0, 0, 0)): number {
    const maxWidth = this.pageWidth - (this.margin * 2);
    const lines = this.wrapText(text, maxWidth, font, size);
    
    for (const line of lines) {
      page.drawText(line, {
        x: this.margin,
        y: yPosition,
        size,
        font,
        color
      });
      yPosition -= size + 4;
    }
    
    return yPosition - 10;
  }

  private addListItem(page: PDFPage, text: string, yPosition: number, font: any, size = 12): number {
    page.drawText(`• ${text}`, {
      x: this.margin + 15,
      y: yPosition,
      size,
      font,
      color: rgb(0, 0, 0)
    });
    return yPosition - (size + 6);
  }

  private wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);
      
      if (textWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // Word is too long, force break
          lines.push(word);
          currentLine = '';
        }
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  }

  private addFooters(pdfDoc: PDFDocument, font: any): void {
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;
    
    pages.forEach((page, index) => {
      // Add page number
      page.drawText(`Page ${index + 1} of ${totalPages}`, {
        x: this.pageWidth - this.margin - 80,
        y: this.margin / 2,
        size: 10,
        font,
        color: rgb(0.5, 0.5, 0.5)
      });
      
      // Add generation info
      page.drawText(`Generated by UltraWeb AGI System v8.0.0`, {
        x: this.margin,
        y: this.margin / 2,
        size: 10,
        font,
        color: rgb(0.5, 0.5, 0.5)
      });
    });
  }

  // Utility methods
  async generateQuickReport(title: string, content: string, author = 'UltraWeb AGI'): Promise<Uint8Array> {
    const reportData: ReportData = {
      title,
      description: 'Automatically generated report',
      author,
      date: new Date().toLocaleDateString(),
      sections: [{
        title: 'Content',
        content,
        type: 'text'
      }],
      metadata: {
        source: 'UltraWeb AGI System',
        version: '8.0.0',
        classification: 'public',
        tags: ['auto-generated', 'quick-report']
      }
    };
    
    return this.generateCustomReport(reportData);
  }

  // Convert buffer to base64 for web transmission
  bufferToBase64(buffer: Uint8Array): string {
    return Buffer.from(buffer).toString('base64');
  }

  // Get MIME type for PDF
  getMimeType(): string {
    return 'application/pdf';
  }
}

// Export singleton instance
export const industrialPDFGenerator = new IndustrialPDFGenerator();
