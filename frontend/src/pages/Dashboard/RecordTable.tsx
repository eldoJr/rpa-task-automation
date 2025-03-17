import React, { useState } from "react";

interface RecordTableProps {
  isSidebarCollapsed: boolean;
}

const dummyData = [
  {
    id: 1,
    projectName: "Project Alpha",
    executionId: "EX-001",
    username: "johndoe",
    date: "2024-03-17",
    serviceType: "Automation",
    testType: "Functional",
    status: "Passed",
  },
  {
    id: 2,
    projectName: "Project Beta",
    executionId: "EX-002",
    username: "janedoe",
    date: "2024-03-16",
    serviceType: "Performance",
    testType: "Load",
    status: "In Progress",
  },
  {
    id: 3,
    projectName: "Project Gamma",
    executionId: "EX-003",
    username: "mike123",
    date: "2024-03-15",
    serviceType: "Security",
    testType: "Penetration",
    status: "Failed",
  },
];

const statusColors: { [key: string]: string } = {
  Passed: "text-green-600 bg-green-100",
  Failed: "text-red-600 bg-red-100",
  "In Progress": "text-blue-600 bg-blue-100",
};

const RecordTable: React.FC<RecordTableProps> = ({ isSidebarCollapsed }) => {
  const [data] = useState(dummyData);

  return (
    <div className={`bg-white p-4 shadow rounded-lg ${isSidebarCollapsed ? "w-full" : "w-full"}`}>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Record Table</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left text-sm text-gray-600">Project Name</th>
              <th className="border p-2 text-left text-sm text-gray-600">Execution ID</th>
              <th className="border p-2 text-left text-sm text-gray-600">Username</th>
              <th className="border p-2 text-left text-sm text-gray-600">Date</th>
              <th className="border p-2 text-left text-sm text-gray-600">Service Type</th>
              <th className="border p-2 text-left text-sm text-gray-600">Test Type</th>
              <th className="border p-2 text-left text-sm text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border p-2 text-sm">{item.projectName}</td>
                <td className="border p-2 text-sm">{item.executionId}</td>
                <td className="border p-2 text-sm">{item.username}</td>
                <td className="border p-2 text-sm">{item.date}</td>
                <td className="border p-2 text-sm">{item.serviceType}</td>
                <td className="border p-2 text-sm">{item.testType}</td>
                <td className="border p-2 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[item.status]}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecordTable;