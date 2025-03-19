import React from "react";

interface CardData {
  label: string;
  value: number;
  color: string;
  textColor: string;
  bgColor: string;
  trend?: number;
  icon?: React.ReactNode;
}

interface OverviewCardsProps {
  isSidebarCollapsed?: boolean;
}

const OverviewCards: React.FC<OverviewCardsProps> = () => {
  const data: CardData[] = [
    { 
      label: "PASSED", 
      value: 68, 
      color: "bg-green-500", 
      textColor: "text-green-600", 
      bgColor: "bg-green-50",
      trend: 12
    },
    { 
      label: "FAILED", 
      value: 3, 
      color: "bg-red-500", 
      textColor: "text-red-600", 
      bgColor: "bg-red-50",
      trend: -2
    },
    { 
      label: "ABORTED", 
      value: 4, 
      color: "bg-yellow-500", 
      textColor: "text-yellow-600", 
      bgColor: "bg-yellow-50",
      trend: 0
    },
    { 
      label: "IN PROGRESS", 
      value: 24, 
      color: "bg-blue-500", 
      textColor: "text-blue-600", 
      bgColor: "bg-blue-50",
      trend: 5
    },
  ];

  return (
    <div className="bg-[#E6F1ED] rounded-lg shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
        <div className="text-sm text-gray-500">Last 24 hours</div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 flex-grow">
        {data.map((item, index) => (
          <div
            key={index}
            className={`p-5 ${item.bgColor} rounded-lg border border-gray-100 transition-all hover:shadow-md flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${item.color} mr-2`}></div>
                <p className="text-xs font-medium text-gray-500">{item.label}</p>
              </div>
              {item.trend !== undefined && (
                <div className={`text-xs font-medium ${
                  item.trend > 0 ? 'text-green-600' : 
                  item.trend < 0 ? 'text-red-600' : 'text-gray-400'
                }`}>
                  {item.trend > 0 ? '+' : ''}{item.trend}%
                </div>
              )}
            </div>
            <p className={`text-2xl font-bold ${item.textColor}`}>{item.value}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Total Tests</span>
          <span className="text-lg font-semibold text-gray-800">
            {data.reduce((sum, item) => sum + item.value, 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OverviewCards;