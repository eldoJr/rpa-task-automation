import React, { useState } from 'react';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Server, 
  RefreshCw, 
} from 'lucide-react';

// Types for automation status and details
interface AutomationProcess {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'error' | 'paused';
  startTime: Date;
  endTime?: Date;
  duration: number;
  progress: number;
  errorDetails?: string;
}

const mockAutomationProcesses: AutomationProcess[] = [
  {
    id: 'process-001',
    name: 'Email Data Extraction',
    status: 'running',
    startTime: new Date(),
    duration: 15,
    progress: 65,
  },
  {
    id: 'process-002',
    name: 'Financial Report Generation',
    status: 'completed',
    startTime: new Date('2024-03-26T10:00:00'),
    endTime: new Date('2024-03-26T10:15:00'),
    duration: 15,
    progress: 100,
  },
  {
    id: 'process-003',
    name: 'Database Sync',
    status: 'error',
    startTime: new Date(),
    duration: 5,
    progress: 30,
    errorDetails: 'Connection timeout'
  },
  {
    id: 'process-004',
    name: 'Backup Database',
    status: 'paused',
    startTime: new Date(),
    duration: 10,
    progress: 0,
  }
];

const StatusBadge: React.FC<{ status: AutomationProcess['status'] }> = ({ status }) => {
  const badgeStyles = {
    running: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    paused: 'bg-yellow-100 text-yellow-800'
  };

  const icons = {
    running: <Activity size={16} className="mr-2" />,
    completed: <CheckCircle2 size={16} className="mr-2" />,
    error: <AlertCircle size={16} className="mr-2" />,
    paused: <Clock size={16} className="mr-2" />
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${badgeStyles[status]}`}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const Monitoring: React.FC = () => {
  const [processes, setProcesses] = useState<AutomationProcess[]>(mockAutomationProcesses);
  const [filter, setFilter] = useState<AutomationProcess['status'] | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshProcesses = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setProcesses(mockAutomationProcesses);
      setIsRefreshing(false);
    }, 1000);
  };

  const filteredProcesses = filter === 'all' 
    ? processes 
    : processes.filter(process => process.status === filter);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Server className="mr-3" /> Real-Time Monitoring
        </h1>
        <div className="flex items-center space-x-4">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as AutomationProcess['status'] | 'all')}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Processes</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="error">Errors</option>
            <option value="paused">Paused</option>
          </select>
          <button 
            onClick={refreshProcesses}
            disabled={isRefreshing}
            className="btn-secondary flex items-center"
          >
            <RefreshCw 
              size={16} 
              className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} 
            /> 
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <Activity className="text-blue-500 mr-4" size={40} />
          <div>
            <h3 className="text-lg font-semibold">Running Processes</h3>
            <p className="text-2xl font-bold">{processes.filter(p => p.status === 'running').length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <CheckCircle2 className="text-green-500 mr-4" size={40} />
          <div>
            <h3 className="text-lg font-semibold">Completed Processes</h3>
            <p className="text-2xl font-bold">{processes.filter(p => p.status === 'completed').length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <AlertCircle className="text-red-500 mr-4" size={40} />
          <div>
            <h3 className="text-lg font-semibold">Error Processes</h3>
            <p className="text-2xl font-bold">{processes.filter(p => p.status === 'error').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 text-left">Process Name</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Progress</th>
              <th className="p-4 text-left">Start Time</th>
              <th className="p-4 text-left">Duration</th>
            </tr>
          </thead>
          <tbody>
            {filteredProcesses.map(process => (
              <tr key={process.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{process.name}</td>
                <td className="p-4">
                  <StatusBadge status={process.status} />
                </td>
                <td className="p-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${process.progress}%` }}
                    ></div>
                  </div>
                </td>
                <td className="p-4">
                  {process.startTime.toLocaleString()}
                </td>
                <td className="p-4">
                  {process.duration} min
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Monitoring;