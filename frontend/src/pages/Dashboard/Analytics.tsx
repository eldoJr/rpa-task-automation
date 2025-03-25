import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";
import { Activity, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

// Sample data types
interface AutomationData {
  name: string;
  efficiency: number;
  timeSaved: number;
  errorsReduced: number;
}

interface StatusData {
  name: string;
  value: number;
}

const Analytics: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState<
    "monthly" | "quarterly" | "yearly"
  >("monthly");

  // Sample data for charts
  const automationEfficiencyData: AutomationData[] = [
    { name: "Finance", efficiency: 85, timeSaved: 120, errorsReduced: 45 },
    { name: "HR", efficiency: 75, timeSaved: 90, errorsReduced: 30 },
    { name: "Logistics", efficiency: 92, timeSaved: 150, errorsReduced: 55 },
    {
      name: "Customer Support",
      efficiency: 80,
      timeSaved: 110,
      errorsReduced: 40,
    },
  ];

  const automationStatusData: StatusData[] = [
    { name: "Active", value: 45 },
    { name: "Completed", value: 30 },
    { name: "Paused", value: 15 },
    { name: "Failed", value: 10 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Key metrics calculation
  const totalAutomations = automationStatusData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const totalEfficiencyGain =
    automationEfficiencyData.reduce((sum, item) => sum + item.efficiency, 0) /
    automationEfficiencyData.length;
  const totalTimeSaved = automationEfficiencyData.reduce(
    (sum, item) => sum + item.timeSaved,
    0
  );

  // Corrected onValueChange handler
  const handleTimeFrameChange = (value: string) => {
    setTimeFrame(value as "monthly" | "quarterly" | "yearly");
    //  Add logic to update chart data based on the selected time frame
    //  For example:
    //  if (value === 'monthly') {
    //    setAutomationEfficiencyData(monthlyData);
    //    setAutomationStatusData(monthlyStatusData);
    //  } else if (value === 'quarterly') {
    //     setAutomationEfficiencyData(quarterlyData);
    //     setAutomationStatusData(quarterlyStatusData)
    //  } //and so on
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Automation Analytics
        </h1>
        <Select
          value={timeFrame}
          onValueChange={handleTimeFrameChange} // Use the corrected handler
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Automations
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAutomations}</div>
            <p className="text-xs text-muted-foreground">
              +{totalAutomations} new this {timeFrame}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Efficiency Gain
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalEfficiencyGain.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall process improvement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTimeSaved} hrs</div>
            <p className="text-xs text-muted-foreground">
              Cumulative time reduction
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Error Reduction
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {automationEfficiencyData.reduce(
                (sum, item) => sum + item.errorsReduced,
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Potential errors prevented
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Automation Efficiency by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={automationEfficiencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="efficiency" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Automation Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={automationStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {automationStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
