import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface StatusChartProps {
  isSidebarCollapsed: boolean;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const StatusChart: React.FC<StatusChartProps> = () => {
  const [timeRange, setTimeRange] = useState<string>("day");
  
  const data: ChartData[] = [
    { name: "Passed", value: 68, color: "#16A34A" },
    { name: "Failed", value: 3, color: "#DC2626" },
    { name: "Aborted", value: 4, color: "#FACC15" },
    { name: "In Progress", value: 24, color: "#2563EB" },
  ];

  const totalTests = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="bg-[#E6F1ED] p-6 shadow-sm rounded-lg border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Status Distribution</h3>
          <p className="text-sm text-gray-500 mt-1">Total tests: {totalTests}</p>
        </div>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button 
            className={`text-xs px-3 py-1 rounded-md ${timeRange === 'day' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
            onClick={() => setTimeRange('day')}
          >
            Day
          </button>
          <button 
            className={`text-xs px-3 py-1 rounded-md ${timeRange === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={`text-xs px-3 py-1 rounded-md ${timeRange === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
        </div>
      </div>
      
      <div className="flex gap-4 mb-6 flex-wrap">
        {data.map((status, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: status.color }}
            ></div>
            <span className="text-xs font-medium text-gray-600">{status.name}</span>
          </div>
        ))}
      </div>
      
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
          <BarChart 
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            barSize={40}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.04)" }}
              contentStyle={{ 
                backgroundColor: "#fff", 
                border: "1px solid #e5e7eb",
                borderRadius: "0.375rem",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                padding: "8px 12px"
              }}
              labelStyle={{ fontWeight: 600, marginBottom: 4 }}
            />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => (
                <Bar key={index} dataKey="value" fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Success Rate</span>
          <span className="text-lg font-semibold text-green-600">
            {Math.round((data[0].value / totalTests) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusChart;