import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Download, BarChart3, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CSVProcessor } from '../../utils/csvProcessor';
import { ImportResult, AnalysisResult, Email } from '../../types';
import toast from 'react-hot-toast';

interface CSVImportProps {
  onEmailsImported: (emails: Email[]) => void;
  onClose: () => void;
}

export const CSVImport: React.FC<CSVImportProps> = ({ onEmailsImported, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setIsProcessing(true);
    setImportResult(null);
    setAnalysisResult(null);

    try {
      const content = await file.text();
      const csvData = CSVProcessor.parseCSV(content);
      
      if (csvData.length === 0) {
        toast.error('No valid data found in CSV file');
        setIsProcessing(false);
        return;
      }

      const result = await CSVProcessor.processEmails(csvData);
      setImportResult(result);

      if (result.processedEmails.length > 0) {
        const analysis = CSVProcessor.analyzeImportedData(result.processedEmails);
        setAnalysisResult(analysis);
        toast.success(`Successfully processed ${result.successfulImports} emails`);
      }

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process CSV file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportEmails = () => {
    if (importResult?.processedEmails) {
      onEmailsImported(importResult.processedEmails);
      toast.success('Emails imported successfully!');
      onClose();
    }
  };

  const downloadSampleCSV = () => {
    const sampleData = `sender,subject,body,sent_date
"John Doe <john@example.com>","URGENT: Cannot access my account","Hi Support Team, I urgently need help accessing my account. I have an important client presentation in 30 minutes and cannot log in. This is affecting our business operations. Please help immediately!","2025-01-27T08:30:00Z"
"Sarah Wilson <sarah@company.com>","Query about new pricing plans","Hello, I'm interested in upgrading our plan. Could you provide information about the enterprise pricing? We're currently on the standard plan and need more features. Thank you!","2025-01-27T09:15:00Z"
"Mike Chen <mike@startup.io>","Billing inquiry - Invoice #12345","Hi there, I have a question about invoice #12345. The amount seems different from what I expected. Could someone please review this? Not urgent, but would appreciate clarification.","2025-01-27T10:45:00Z"`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_emails.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Import Emails from CSV</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {!importResult ? (
            <div className="space-y-6">
              {/* Upload Area */}
              <Card className="p-8">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Upload CSV File
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isProcessing ? 'Processing...' : 'Choose File'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>
              </Card>

              {/* CSV Format Requirements */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>CSV Format Requirements</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Required Columns:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Badge variant="normal">sender</Badge>
                        <span className="text-sm text-gray-600">Email address or "Name &lt;email&gt;"</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="normal">subject</Badge>
                        <span className="text-sm text-gray-600">Email subject line</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="normal">body</Badge>
                        <span className="text-sm text-gray-600">Email content/message</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="normal">sent_date</Badge>
                        <span className="text-sm text-gray-600">ISO date format (YYYY-MM-DD)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Sample CSV Format:</h4>
                    <code className="text-sm text-gray-700 block whitespace-pre">
{`sender,subject,body,sent_date
"John Doe <john@example.com>","Account Issue","Cannot access my account","2025-01-27T08:30:00Z"`}
                    </code>
                  </div>

                  <button
                    onClick={downloadSampleCSV}
                    className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Sample CSV</span>
                  </button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Import Results */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{importResult.totalEmails}</div>
                    <div className="text-sm text-gray-600">Total Emails</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{importResult.successfulImports}</div>
                    <div className="text-sm text-gray-600">Successfully Processed</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{importResult.failedImports}</div>
                    <div className="text-sm text-gray-600">Failed to Process</div>
                  </div>
                </div>

                {importResult.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span className="font-medium text-red-800">Processing Errors:</span>
                    </div>
                    <ul className="text-sm text-red-700 space-y-1">
                      {importResult.errors.slice(0, 5).map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                      {importResult.errors.length > 5 && (
                        <li>• ... and {importResult.errors.length - 5} more errors</li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={() => setShowAnalysis(!showAnalysis)}
                    className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>{showAnalysis ? 'Hide' : 'Show'} Analysis</span>
                  </button>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleImportEmails}
                      disabled={importResult.successfulImports === 0}
                      className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Import {importResult.successfulImports} Emails</span>
                    </button>
                  </div>
                </div>
              </Card>

              {/* Analysis Results */}
              {showAnalysis && analysisResult && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis Results</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sentiment Analysis */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Sentiment Distribution</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Positive</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${(analysisResult.sentimentBreakdown.positive / analysisResult.totalProcessed) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{analysisResult.sentimentBreakdown.positive}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Neutral</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gray-500 h-2 rounded-full" 
                                style={{ width: `${(analysisResult.sentimentBreakdown.neutral / analysisResult.totalProcessed) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{analysisResult.sentimentBreakdown.neutral}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Negative</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-500 h-2 rounded-full" 
                                style={{ width: `${(analysisResult.sentimentBreakdown.negative / analysisResult.totalProcessed) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{analysisResult.sentimentBreakdown.negative}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Priority Analysis */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Priority Distribution</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Urgent</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-500 h-2 rounded-full" 
                                style={{ width: `${(analysisResult.priorityBreakdown.urgent / analysisResult.totalProcessed) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{analysisResult.priorityBreakdown.urgent}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Normal</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${(analysisResult.priorityBreakdown.normal / analysisResult.totalProcessed) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{analysisResult.priorityBreakdown.normal}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Common Keywords */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Most Common Keywords</h4>
                      <div className="space-y-2">
                        {analysisResult.commonKeywords.slice(0, 5).map((keyword, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{keyword.word}</span>
                            <Badge variant="normal">{keyword.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Response Time */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Estimated Response Time</h4>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {analysisResult.avgResponseTimeNeeded.toFixed(1)}h
                        </div>
                        <div className="text-sm text-gray-600">Average Response Time Needed</div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};