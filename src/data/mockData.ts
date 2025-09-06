import { Email, AnalyticsData, ChartData } from '../types';

export const mockEmails: Email[] = [
  {
    id: '1',
    sender: {
      name: 'Sarah Johnson',
      email: 'sarah.j@techcorp.com',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60'
    },
    subject: 'URGENT: Cannot access my account - Critical business issue',
    body: 'Hi Support Team, I urgently need help accessing my account. I have an important client presentation in 30 minutes and cannot log in. This is affecting our business operations. Please help immediately!',
    receivedAt: new Date('2025-01-27T08:30:00'),
    priority: 'urgent',
    sentiment: 'negative',
    status: 'pending',
    extractedInfo: {
      contactDetails: ['sarah.j@techcorp.com'],
      requirements: ['account access', 'login help'],
      sentimentIndicators: ['urgently', 'cannot', 'important'],
      urgencyKeywords: ['URGENT', 'immediately', 'critical'],
      productMentions: ['account']
    }
  },
  {
    id: '2',
    sender: {
      name: 'Michael Chen',
      email: 'm.chen@startup.io',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60'
    },
    subject: 'Query about new pricing plans',
    body: 'Hello, I\'m interested in upgrading our plan. Could you provide information about the enterprise pricing? We\'re currently on the standard plan and need more features. Thank you!',
    receivedAt: new Date('2025-01-27T09:15:00'),
    priority: 'normal',
    sentiment: 'positive',
    status: 'responded',
    extractedInfo: {
      contactDetails: ['m.chen@startup.io'],
      requirements: ['pricing information', 'plan upgrade'],
      sentimentIndicators: ['interested', 'thank you'],
      urgencyKeywords: [],
      productMentions: ['enterprise pricing', 'standard plan']
    },
    aiResponse: 'Hi Michael, Thank you for your interest in upgrading! I\'d be happy to help you with enterprise pricing information. Our enterprise plan includes advanced features like priority support, custom integrations, and enhanced security. I\'ll send you detailed pricing information shortly. Best regards, Support Team'
  },
  {
    id: '3',
    sender: {
      name: 'Emma Wilson',
      email: 'emma.w@agency.com',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=60'
    },
    subject: 'Billing inquiry - Invoice #12345',
    body: 'Hi there, I have a question about invoice #12345. The amount seems different from what I expected. Could someone please review this? Not urgent, but would appreciate clarification.',
    receivedAt: new Date('2025-01-27T10:45:00'),
    priority: 'normal',
    sentiment: 'neutral',
    status: 'pending',
    extractedInfo: {
      contactDetails: ['emma.w@agency.com'],
      requirements: ['invoice review', 'billing clarification'],
      sentimentIndicators: ['appreciate'],
      urgencyKeywords: [],
      productMentions: ['invoice #12345']
    }
  },
  {
    id: '4',
    sender: {
      name: 'David Rodriguez',
      email: 'd.rodriguez@company.com',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=60'
    },
    subject: 'Great service! Feature request',
    body: 'Your support team has been amazing! I love the new dashboard update. Could we possibly get a dark mode feature? That would be fantastic. Keep up the excellent work!',
    receivedAt: new Date('2025-01-27T11:20:00'),
    priority: 'normal',
    sentiment: 'positive',
    status: 'resolved',
    extractedInfo: {
      contactDetails: ['d.rodriguez@company.com'],
      requirements: ['dark mode feature', 'feature request'],
      sentimentIndicators: ['amazing', 'love', 'fantastic', 'excellent'],
      urgencyKeywords: [],
      productMentions: ['dashboard']
    }
  },
  {
    id: '5',
    sender: {
      name: 'Lisa Thompson',
      email: 'l.thompson@enterprise.com',
      avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=60'
    },
    subject: 'CRITICAL: System down - Need immediate assistance',
    body: 'Our entire system is down and we cannot process orders. This is costing us thousands per minute. Please escalate this immediately to your technical team. We need this fixed now!',
    receivedAt: new Date('2025-01-27T12:10:00'),
    priority: 'urgent',
    sentiment: 'negative',
    status: 'responded',
    extractedInfo: {
      contactDetails: ['l.thompson@enterprise.com'],
      requirements: ['system recovery', 'technical support'],
      sentimentIndicators: ['costing', 'cannot'],
      urgencyKeywords: ['CRITICAL', 'immediately', 'now'],
      productMentions: ['system', 'orders']
    },
    aiResponse: 'Hi Lisa, I understand the urgency of this situation. I\'ve immediately escalated your case to our senior technical team with priority status. They are investigating the system issues now. You should receive an update within 15 minutes. We apologize for the inconvenience and are working to resolve this ASAP.'
  }
];

export const mockAnalytics: AnalyticsData = {
  totalEmails: 127,
  urgentEmails: 8,
  resolvedEmails: 89,
  avgResponseTime: 2.4,
  satisfactionScore: 4.6,
  emailTrend: 12
};

export const mockChartData: ChartData = {
  emailVolume: [
    { date: '2025-01-20', emails: 45 },
    { date: '2025-01-21', emails: 52 },
    { date: '2025-01-22', emails: 38 },
    { date: '2025-01-23', emails: 61 },
    { date: '2025-01-24', emails: 49 },
    { date: '2025-01-25', emails: 73 },
    { date: '2025-01-26', emails: 67 },
    { date: '2025-01-27', emails: 84 }
  ],
  sentimentDistribution: [
    { name: 'Positive', value: 45, color: '#10B981' },
    { name: 'Neutral', value: 35, color: '#6B7280' },
    { name: 'Negative', value: 20, color: '#EF4444' }
  ],
  priorityBreakdown: [
    { name: 'Normal', value: 78, color: '#3B82F6' },
    { name: 'Urgent', value: 22, color: '#EF4444' }
  ],
  responseTime: [
    { day: 'Mon', time: 2.1 },
    { day: 'Tue', time: 3.2 },
    { day: 'Wed', time: 1.8 },
    { day: 'Thu', time: 2.9 },
    { day: 'Fri', time: 2.4 },
    { day: 'Sat', time: 1.6 },
    { day: 'Sun', time: 1.9 }
  ]
};