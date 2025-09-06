export interface Email {
  id: string;
  sender: {
    name: string;
    email: string;
    avatar: string;
  };
  subject: string;
  body: string;
  receivedAt: Date;
  priority: 'urgent' | 'normal';
  sentiment: 'positive' | 'negative' | 'neutral';
  status: 'pending' | 'responded' | 'resolved';
  extractedInfo: {
    contactDetails: string[];
    requirements: string[];
    sentimentIndicators: string[];
    urgencyKeywords: string[];
    productMentions: string[];
  };
  aiResponse?: string;
}

export interface AnalyticsData {
  totalEmails: number;
  urgentEmails: number;
  resolvedEmails: number;
  avgResponseTime: number;
  satisfactionScore: number;
  emailTrend: number;
}

export interface ChartData {
  emailVolume: Array<{ date: string; emails: number }>;
  sentimentDistribution: Array<{ name: string; value: number; color: string }>;
  priorityBreakdown: Array<{ name: string; value: number; color: string }>;
  responseTime: Array<{ day: string; time: number }>;
}

export interface FilterState {
  priority: 'all' | 'urgent' | 'normal';
  sentiment: 'all' | 'positive' | 'negative' | 'neutral';
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  status: 'all' | 'pending' | 'responded' | 'resolved';
}

export interface CSVEmailData {
  sender: string;
  subject: string;
  body: string;
  sent_date: string;
}

export interface ImportResult {
  totalEmails: number;
  successfulImports: number;
  failedImports: number;
  errors: string[];
  processedEmails: Email[];
}

export interface AnalysisResult {
  totalProcessed: number;
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  priorityBreakdown: {
    urgent: number;
    normal: number;
  };
  commonKeywords: Array<{ word: string; count: number }>;
  timeDistribution: Array<{ hour: number; count: number }>;
  avgResponseTimeNeeded: number;
}