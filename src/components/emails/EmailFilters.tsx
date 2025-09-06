import React from 'react';
import { Filter, Calendar } from 'lucide-react';
import { FilterState } from '../../types';

interface EmailFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const EmailFilters: React.FC<EmailFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>

        <div className="flex flex-wrap gap-4">
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange({ ...filters, priority: e.target.value as FilterState['priority'] })}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="normal">Normal</option>
          </select>

          <select
            value={filters.sentiment}
            onChange={(e) => onFilterChange({ ...filters, sentiment: e.target.value as FilterState['sentiment'] })}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Sentiment</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value as FilterState['status'] })}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="responded">Responded</option>
            <option value="resolved">Resolved</option>
          </select>

          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <input
              type="date"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Start date"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="End date"
            />
          </div>
        </div>

        <button
          onClick={() => onFilterChange({
            priority: 'all',
            sentiment: 'all',
            status: 'all',
            dateRange: { start: null, end: null }
          })}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};