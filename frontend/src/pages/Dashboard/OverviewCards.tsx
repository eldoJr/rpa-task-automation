import React from "react";

interface OverviewCardsProps {
  isSidebarCollapsed?: boolean; 
}

const OverviewCards: React.FC<OverviewCardsProps> = () => {
  const data = [
    { label: "PASSED", value: 68, color: "bg-green-500", textColor: "text-green-600", bgColor: "bg-green-50" },
    { label: "FAILED", value: 3, color: "bg-red-500", textColor: "text-red-600", bgColor: "bg-red-50" },
    { label: "ABORTED", value: 4, color: "bg-yellow-500", textColor: "text-yellow-600", bgColor: "bg-yellow-50" },
    { label: "IN PROGRESS", value: 24, color: "bg-blue-500", textColor: "text-blue-600", bgColor: "bg-blue-50" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {data.map((item, index) => (
          <div
            key={index}
            className={`p-7 ${item.bgColor} rounded-lg border border-gray-100 transition-all hover:shadow-md`}
          >
            <div className="flex items-center mb-1">
              <div className={`w-2 h-2 rounded-full ${item.color} mr-2`}></div>
              <p className="text-xs font-medium text-gray-500">{item.label}</p>
            </div>
            <p className={`text-2xl font-bold ${item.textColor}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewCards;