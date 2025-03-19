import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid} from "recharts";

interface StatusChartProps {
  isSidebarCollapsed: boolean;
}

const data = [
  { name: "Passed", value: 68, color: "#16A34A" },
  { name: "Failed", value: 3, color: "#DC2626" },
  { name: "Aborted", value: 4, color: "#FACC15" },
  { name: "In Progress", value: 44, color: "#2563EB" },
];

const StatusChart: React.FC<StatusChartProps> = () => {
  const totalTests = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Status Distribution</h3>
          <p className="text-sm text-gray-500 mt-1">Total tests: {totalTests}</p>
        </div>
        
        <div className="flex gap-4">
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
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          barSize={40}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="green" />
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
  );
};

export default StatusChart;