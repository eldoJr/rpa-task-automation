import React, { useState, useMemo } from "react";
import { Search, ChevronUp, ChevronDown, Calendar, User } from "lucide-react";

interface Record {
  id: number;
  projectName: string;
  executionId: string;
  username: string;
  date: string;
  serviceType: string;
  testType: string;
  status: "Passed" | "Failed" | "In Progress";
}

interface RecordTableProps {
  isSidebarCollapsed: boolean;
}

const dummyData: Record[] = [
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

const RecordTable: React.FC<RecordTableProps> = () => {
  const [data] = useState<Record[]>(dummyData);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Record>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Handle sorting
  const handleSort = (field: keyof Record) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    return [...data]
      .filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.projectName.toLowerCase().includes(searchLower) ||
          item.executionId.toLowerCase().includes(searchLower) ||
          item.username.toLowerCase().includes(searchLower) ||
          item.serviceType.toLowerCase().includes(searchLower) ||
          item.testType.toLowerCase().includes(searchLower) ||
          item.status.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [data, searchTerm, sortField, sortDirection]);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Status badge variants
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Passed":
        return "bg-green-100 text-green-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Sort icon based on sort direction and field
  const SortIcon = ({ field }: { field: keyof Record }) => {
    if (sortField !== field) {
      return (
        <div className="inline-flex ml-1 opacity-50">
          <ChevronUp className="h-3 w-3" />
        </div>
      );
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="inline-flex ml-1 h-3 w-3" />
    ) : (
      <ChevronDown className="inline-flex ml-1 h-3 w-3" />
    );
  };

  return (
    <div className="bg-[#E6F1ED] rounded-lg border border-gray-200 shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">Test Records</h2>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search records..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th 
                className="px-4 py-3 text-left font-medium" 
                onClick={() => handleSort("projectName")}
              >
                <div className="flex items-center cursor-pointer hover:text-blue-600">
                  Project Name
                  <SortIcon field="projectName" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left font-medium"
                onClick={() => handleSort("executionId")}
              >
                <div className="flex items-center cursor-pointer hover:text-blue-600">
                  Execution ID
                  <SortIcon field="executionId" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left font-medium"
                onClick={() => handleSort("username")}
              >
                <div className="flex items-center cursor-pointer hover:text-blue-600">
                  <User className="h-3 w-3 mr-1 text-gray-500" />
                  User
                  <SortIcon field="username" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left font-medium"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center cursor-pointer hover:text-blue-600">
                  <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                  Date
                  <SortIcon field="date" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left font-medium"
                onClick={() => handleSort("serviceType")}
              >
                <div className="flex items-center cursor-pointer hover:text-blue-600">
                  Service Type
                  <SortIcon field="serviceType" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left font-medium"
                onClick={() => handleSort("testType")}
              >
                <div className="flex items-center cursor-pointer hover:text-blue-600">
                  Test Type
                  <SortIcon field="testType" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left font-medium"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center cursor-pointer hover:text-blue-600">
                  Status
                  <SortIcon field="status" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedData.length > 0 ? (
              filteredAndSortedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.projectName}</td>
                  <td className="px-4 py-3 font-mono text-gray-700">{item.executionId}</td>
                  <td className="px-4 py-3 text-gray-700">{item.username}</td>
                  <td className="px-4 py-3 text-gray-700">{formatDate(item.date)}</td>
                  <td className="px-4 py-3 text-gray-700">{item.serviceType}</td>
                  <td className="px-4 py-3 text-gray-700">{item.testType}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusVariant(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No records found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 text-gray-500 text-xs px-4 py-2 border-t">
        Showing {filteredAndSortedData.length} of {data.length} records
      </div>
    </div>
  );
};

export default RecordTable;