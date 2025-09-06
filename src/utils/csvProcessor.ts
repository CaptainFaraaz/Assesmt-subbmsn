import { CSVEmailData, Email, ImportResult, AnalysisResult } from '../types';

export class CSVProcessor {
  static parseCSV(csvContent: string): CSVEmailData[] {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Validate required headers
    const requiredHeaders = ['sender', 'subject', 'body', 'sent_date'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }
    
    const data: CSVEmailData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      if (values.length !== headers.length) continue;
      
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() || '';
      });
      
      if (row.sender && row.subject && row.body && row.sent_date) {
        data.push({
          sender: row.sender,
          subject: row.subject,
          body: row.body,
          sent_date: row.sent_date
        });
      }
    }
    
    return data;
  }
  
  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }
  
  static async processEmails(csvData: CSVEmailData[]): Promise<ImportResult> {
    const errors: string[] = [];
    const processedEmails: Email[] = [];
    let successfulImports = 0;
    let failedImports = 0;
    
    for (let i = 0; i < csvData.length; i++) {
      try {
        const csvEmail = csvData[i];
        const processedEmail = await this.convertToEmail(csvEmail, i);
        processedEmails.push(processedEmail);
        successfulImports++;
      } catch (error) {
        failedImports++;
        errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return {
      totalEmails: csvData.length,
      successfulImports,
      failedImports,
      errors,
      processedEmails
    };
  }
  
  private static async convertToEmail(csvData: CSVEmailData, index: number): Promise<Email> {
    // Parse date
    let receivedAt: Date;
    try {
      receivedAt = new Date(csvData.sent_date);
      if (isNaN(receivedAt.getTime())) {
        throw new Error('Invalid date format');
      }
    } catch {
      receivedAt = new Date();
    }
    
    // Extract sender info
    const senderParts = csvData.sender.includes('<') 
      ? csvData.sender.match(/^(.*?)\s*<(.+)>$/) 
      : null;
    
    const senderName = senderParts ? senderParts[1].trim() : csvData.sender.split('@')[0];
    const senderEmail = senderParts ? senderParts[2].trim() : csvData.sender;
    
    // AI Analysis simulation
    const analysis = await this.analyzeEmail(csvData.subject, csvData.body);
    
    return {
      id: `csv-${index}-${Date.now()}`,
      sender: {
        name: senderName,
        email: senderEmail,
        avatar: `https://images.pexels.com/photos/${1000000 + (index % 100000)}/pexels-photo-${1000000 + (index % 100000)}.jpeg?auto=compress&cs=tinysrgb&w=60`
      },
      subject: csvData.subject,
      body: csvData.body,
      receivedAt,
      priority: analysis.priority,
      sentiment: analysis.sentiment,
      status: 'pending',
      extractedInfo: analysis.extractedInfo
    };
  }
  
  private static async analyzeEmail(subject: string, body: string) {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const text = `${subject} ${body}`.toLowerCase();
    
    // Priority detection
    const urgentKeywords = ['urgent', 'critical', 'emergency', 'asap', 'immediately', 'cannot access', 'down', 'broken', 'not working'];
    const priority = urgentKeywords.some(keyword => text.includes(keyword)) ? 'urgent' : 'normal';
    
    // Sentiment analysis
    const positiveWords = ['thank', 'great', 'excellent', 'love', 'amazing', 'wonderful', 'fantastic', 'pleased'];
    const negativeWords = ['angry', 'frustrated', 'terrible', 'awful', 'hate', 'disappointed', 'cannot', 'broken', 'problem'];
    
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;
    
    let sentiment: 'positive' | 'negative' | 'neutral';
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
    } else {
      sentiment = 'neutral';
    }
    
    // Extract information
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
    
    const contactDetails = [
      ...(body.match(emailRegex) || []),
      ...(body.match(phoneRegex) || [])
    ];
    
    const requirements = this.extractRequirements(text);
    const sentimentIndicators = sentiment === 'positive' ? positiveWords.filter(w => text.includes(w)) :
                               sentiment === 'negative' ? negativeWords.filter(w => text.includes(w)) : [];
    const urgencyKeywords = urgentKeywords.filter(keyword => text.includes(keyword));
    const productMentions = this.extractProductMentions(text);
    
    return {
      priority,
      sentiment,
      extractedInfo: {
        contactDetails,
        requirements,
        sentimentIndicators,
        urgencyKeywords,
        productMentions
      }
    };
  }
  
  private static extractRequirements(text: string): string[] {
    const requirementKeywords = [
      'need help', 'need assistance', 'want to', 'looking for', 'require',
      'account access', 'password reset', 'billing', 'refund', 'cancel',
      'upgrade', 'downgrade', 'feature request', 'bug report'
    ];
    
    return requirementKeywords.filter(keyword => text.includes(keyword));
  }
  
  private static extractProductMentions(text: string): string[] {
    const products = [
      'dashboard', 'account', 'billing', 'subscription', 'api', 'integration',
      'mobile app', 'web app', 'service', 'support', 'premium', 'basic plan'
    ];
    
    return products.filter(product => text.includes(product));
  }
  
  static analyzeImportedData(emails: Email[]): AnalysisResult {
    const totalProcessed = emails.length;
    
    // Sentiment breakdown
    const sentimentBreakdown = {
      positive: emails.filter(e => e.sentiment === 'positive').length,
      negative: emails.filter(e => e.sentiment === 'negative').length,
      neutral: emails.filter(e => e.sentiment === 'neutral').length
    };
    
    // Priority breakdown
    const priorityBreakdown = {
      urgent: emails.filter(e => e.priority === 'urgent').length,
      normal: emails.filter(e => e.priority === 'normal').length
    };
    
    // Common keywords
    const allKeywords: string[] = [];
    emails.forEach(email => {
      allKeywords.push(...email.extractedInfo.urgencyKeywords);
      allKeywords.push(...email.extractedInfo.sentimentIndicators);
      allKeywords.push(...email.extractedInfo.requirements);
    });
    
    const keywordCounts: { [key: string]: number } = {};
    allKeywords.forEach(keyword => {
      keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
    });
    
    const commonKeywords = Object.entries(keywordCounts)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Time distribution
    const timeDistribution = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: emails.filter(email => email.receivedAt.getHours() === hour).length
    }));
    
    // Average response time needed (simulated based on priority and sentiment)
    const avgResponseTimeNeeded = emails.reduce((acc, email) => {
      let time = 4; // base 4 hours
      if (email.priority === 'urgent') time = 1;
      if (email.sentiment === 'negative') time *= 0.8;
      return acc + time;
    }, 0) / emails.length;
    
    return {
      totalProcessed,
      sentimentBreakdown,
      priorityBreakdown,
      commonKeywords,
      timeDistribution,
      avgResponseTimeNeeded
    };
  }
}