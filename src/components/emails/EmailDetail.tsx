import React, { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { X, Bot, Send, Clock, User, Mail, Tag, MessageSquare, Copy, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Email } from '../../types';
import toast from 'react-hot-toast';

interface EmailDetailProps {
  email: Email;
  onClose: () => void;
  onUpdateEmail: (updatedEmail: Email) => void;
}

export const EmailDetail: React.FC<EmailDetailProps> = ({ email, onClose, onUpdateEmail }) => {
  const [aiResponse, setAiResponse] = useState(email.aiResponse || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState<'professional' | 'friendly' | 'empathetic'>('professional');
  const [copied, setCopied] = useState(false);

  const generateAiResponse = async () => {
    setIsGenerating(true);
    
    // Simulate AI response generation
    setTimeout(() => {
      let response = '';
      
      if (email.sentiment === 'negative' && email.priority === 'urgent') {
        response = `Dear ${email.sender.name},

Thank you for reaching out to us. I understand the urgency of your situation and sincerely apologize for the inconvenience you're experiencing.

I've immediately escalated your case to our senior technical team with the highest priority. We're actively investigating the issue and will provide you with a detailed update within the next 15 minutes.

In the meantime, I'm personally monitoring your case to ensure we resolve this as quickly as possible. We value your business and are committed to getting this sorted out immediately.

Please don't hesitate to reach out if you need any additional assistance.

Best regards,
Support Team`;
      } else if (email.sentiment === 'positive') {
        response = `Hi ${email.sender.name},

Thank you so much for your wonderful feedback! It truly brightens our day to hear from satisfied customers like yourself.

I'm excited to let you know that we're always working on new features based on customer feedback like yours. I've forwarded your feature request to our product team for consideration in our upcoming roadmap.

Thank you for being such a valued customer. If there's anything else I can help you with, please don't hesitate to reach out.

Warm regards,
Support Team`;
      } else {
        response = `Dear ${email.sender.name},

Thank you for contacting us regarding your inquiry. I've reviewed your request and I'm here to help.

Based on the information provided, I'll need to gather some additional details to provide you with the most accurate assistance. I'll reach out to you shortly with the specific information we need.

We appreciate your patience and look forward to resolving this matter promptly.

Best regards,
Support Team`;
      }
      
      setAiResponse(response);
      setIsGenerating(false);
      toast.success('AI response generated successfully!');
    }, 2000);
  };

  const sendResponse = () => {
    const updatedEmail = {
      ...email,
      aiResponse,
      status: 'responded' as const
    };
    onUpdateEmail(updatedEmail);
    toast.success('Response sent successfully!');
    onClose();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiResponse);
    setCopied(true);
    toast.success('Response copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😟';
      case 'neutral': return '😐';
      default: return '😐';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Email Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Email Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={email.sender.avatar}
                  alt={email.sender.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-lg text-gray-900">{email.sender.name}</h3>
                    <Badge variant={email.priority}>{email.priority}</Badge>
                    <Badge variant={email.status}>{email.status}</Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{email.sender.email}</p>
                  <p className="text-gray-500 text-xs">
                    {format(email.receivedAt, 'PPP')} • {formatDistanceToNow(email.receivedAt, { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getSentimentEmoji(email.sentiment)}</span>
                </div>
              </div>

              <h4 className="text-lg font-medium text-gray-900 mb-4">{email.subject}</h4>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{email.body}</p>
              </div>
            </div>

            {/* AI Response Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <span>AI-Generated Response</span>
                </h5>
                <div className="flex items-center space-x-2">
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as typeof tone)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="empathetic">Empathetic</option>
                  </select>
                </div>
              </div>

              {!aiResponse ? (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Generate an AI-powered response for this email</p>
                  <button
                    onClick={generateAiResponse}
                    disabled={isGenerating}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isGenerating ? 'Generating...' : 'Generate AI Response'}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="relative">
                    <textarea
                      value={aiResponse}
                      onChange={(e) => setAiResponse(e.target.value)}
                      className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="AI response will appear here..."
                    />
                    <button
                      onClick={copyToClipboard}
                      className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={generateAiResponse}
                        disabled={isGenerating}
                        className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md disabled:opacity-50 transition-colors"
                      >
                        {isGenerating ? 'Regenerating...' : 'Regenerate'}
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={sendResponse}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <Send className="h-4 w-4" />
                        <span>Send Response</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Extracted Information Sidebar */}
          <div className="w-80 border-l border-gray-200 p-6 bg-gray-50 overflow-y-auto">
            <h5 className="font-semibold text-gray-900 mb-4">Extracted Information</h5>
            
            <div className="space-y-4">
              <Card className="p-4">
                <h6 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Contact Details</span>
                </h6>
                <div className="space-y-1">
                  {email.extractedInfo.contactDetails.map((contact, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                      <Mail className="h-3 w-3" />
                      <span>{contact}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h6 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Requirements</span>
                </h6>
                <div className="space-y-1">
                  {email.extractedInfo.requirements.map((req, index) => (
                    <span key={index} className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mr-1 mb-1">
                      {req}
                    </span>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h6 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                  <Tag className="h-4 w-4" />
                  <span>Sentiment Indicators</span>
                </h6>
                <div className="space-y-1">
                  {email.extractedInfo.sentimentIndicators.map((indicator, index) => (
                    <span key={index} className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full mr-1 mb-1">
                      {indicator}
                    </span>
                  ))}
                </div>
              </Card>

              {email.extractedInfo.urgencyKeywords.length > 0 && (
                <Card className="p-4 border-red-200">
                  <h6 className="font-medium text-red-900 mb-2 flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-red-500" />
                    <span>Urgency Keywords</span>
                  </h6>
                  <div className="space-y-1">
                    {email.extractedInfo.urgencyKeywords.map((keyword, index) => (
                      <span key={index} className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full mr-1 mb-1 font-medium">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </Card>
              )}

              <Card className="p-4">
                <h6 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                  <Tag className="h-4 w-4" />
                  <span>Product Mentions</span>
                </h6>
                <div className="space-y-1">
                  {email.extractedInfo.productMentions.map((product, index) => (
                    <span key={index} className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full mr-1 mb-1">
                      {product}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};