import React from 'react';
import { Mail, AlertTriangle, CheckCircle, Clock, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../ui/Card';
import { AnalyticsData } from '../../types';

interface AnalyticsCardsProps {
  data: AnalyticsData;
}

export const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ data }) => {
  const cards = [
    {
      title: 'Total Emails',
      value: data.totalEmails,
      subtitle: 'last 24h',
      icon: Mail,
      trend: data.emailTrend,
      color: 'bg-blue-500'
    },
    {
      title: 'Urgent Emails',
      value: data.urgentEmails,
      subtitle: 'pending',
      icon: AlertTriangle,
      color: 'bg-red-500'
    },
    {
      title: 'Emails Resolved',
      value: data.resolvedEmails,
      subtitle: 'today',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Avg Response Time',
      value: `${data.avgResponseTime}h`,
      subtitle: 'hours',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Satisfaction Score',
      value: data.satisfactionScore,
      subtitle: '/ 5.0',
      icon: Star,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              {card.trend && (
                <div className={`flex items-center ${card.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {card.trend > 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">{Math.abs(card.trend)}%</span>
                </div>
              )}
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {card.value}
              </div>
              <div className="text-sm text-gray-600">
                {card.title} <span className="text-gray-400">{card.subtitle}</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};