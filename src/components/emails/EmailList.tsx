import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Eye, Bot, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Email } from '../../types';

interface EmailListProps {
  emails: Email[];
  onEmailClick: (email: Email) => void;
}

export const EmailList: React.FC<EmailListProps> = ({ emails, onEmailClick }) => {
  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😟';
      case 'neutral': return '😐';
      default: return '😐';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'responded':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {emails.map((email) => (
        <Card 
          key={email.id} 
          className="p-6 hover:shadow-md transition-all duration-200 cursor-pointer border-l-4"
          style={{
            borderLeftColor: email.priority === 'urgent' ? '#EF4444' : '#3B82F6'
          }}
          onClick={() => onEmailClick(email)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={email.sender.avatar}
                alt={email.sender.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{email.sender.name}</span>
                  <Badge variant={email.priority}>{email.priority}</Badge>
                  {getStatusIcon(email.status)}
                </div>
                <div className="text-sm text-gray-600 flex items-center space-x-2">
                  <span>{email.sender.email}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(email.receivedAt, { addSuffix: true })}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-lg">{getSentimentEmoji(email.sentiment)}</span>
              <Badge variant={email.status}>{email.status}</Badge>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
              {email.priority === 'urgent' && <AlertTriangle className="h-4 w-4 text-red-500" />}
              <span>{email.subject}</span>
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {email.body}
            </p>
          </div>

          {email.extractedInfo.urgencyKeywords.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {email.extractedInfo.urgencyKeywords.map((keyword, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full border border-red-200"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Priority: <Badge variant={email.priority}>{email.priority}</Badge></span>
              <span>Sentiment: <Badge variant={email.sentiment}>{email.sentiment}</Badge></span>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                <Eye className="h-4 w-4" />
                <span>View Details</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
                <Bot className="h-4 w-4" />
                <span>AI Response</span>
              </button>
            </div>
          </div>
        </Card>
      ))}

      {emails.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">No emails found</p>
            <p className="text-sm">Try adjusting your filters to see more results.</p>
          </div>
        </Card>
      )}
    </div>
  );
};