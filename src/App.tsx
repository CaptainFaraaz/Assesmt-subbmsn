import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { AnalyticsCards } from './components/dashboard/AnalyticsCards';
import { Charts } from './components/dashboard/Charts';
import { EmailFilters } from './components/emails/EmailFilters';
import { EmailList } from './components/emails/EmailList';
import { EmailDetail } from './components/emails/EmailDetail';
import { CSVImport } from './components/import/CSVImport';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { mockEmails, mockAnalytics, mockChartData } from './data/mockData';
import { Email, FilterState } from './types';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priority: 'all',
    sentiment: 'all',
    status: 'all',
    dateRange: { start: null, end: null }
  });

  // Filter emails based on current filters
  const filteredEmails = emails.filter(email => {
    if (filters.priority !== 'all' && email.priority !== filters.priority) return false;
    if (filters.sentiment !== 'all' && email.sentiment !== filters.sentiment) return false;
    if (filters.status !== 'all' && email.status !== filters.status) return false;
    return true;
  });

  const handleEmailUpdate = (updatedEmail: Email) => {
    setEmails(prevEmails => 
      prevEmails.map(email => 
        email.id === updatedEmail.id ? updatedEmail : email
      )
    );
  };

  const handleEmailsImported = (importedEmails: Email[]) => {
    setEmails(prevEmails => [...prevEmails, ...importedEmails]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
              <p className="text-gray-600">AI-powered email management overview</p>
            </div>
            <AnalyticsCards data={mockAnalytics} />
            <Charts data={mockChartData} />
          </div>
        );
      
      case 'emails':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Management</h2>
                <p className="text-gray-600">Process and respond to support emails</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowCSVImport(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>Import CSV</span>
                </button>
                <div className="text-sm text-gray-500">
                  {filteredEmails.length} of {emails.length} emails
                </div>
              </div>
            </div>
            <EmailFilters filters={filters} onFilterChange={setFilters} />
            <EmailList emails={filteredEmails} onEmailClick={setSelectedEmail} />
          </div>
        );
      
      case 'settings':
        return <SettingsPanel />;
      
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header 
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>

      {selectedEmail && (
        <EmailDetail
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
          onUpdateEmail={handleEmailUpdate}
        />
      )}

      {showCSVImport && (
        <CSVImport
          onEmailsImported={handleEmailsImported}
          onClose={() => setShowCSVImport(false)}
        />
      )}

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
          },
        }}
      />
    </div>
  );
}

export default App;