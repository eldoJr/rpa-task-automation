import {Button} from "@/components/ui/button/Button";
import { BarChart, Workflow, Code2, ShieldCheck, Users, RefreshCcw } from "lucide-react";
import React from 'react';

// Define the Card components inline
interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div className={`group p-6 text-center shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 ${className}`}>
      {children}
    </div>
  );
};

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="flex justify-center">{children}</div>;
};

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <h3 className={`text-xl font-bold text-gray-900 mb-4 ${className}`}>{children}</h3>;
};

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <p className={`text-sm text-gray-600 ${className}`}>{children}</p>;
};

// Features data
const features = [
  {
    title: "AI-Powered Insights & Predictions",
    description:
      "Leverage AI to analyze trends, suggest optimal strategies, and provide predictive analytics for smarter decision-making.",
    icon: <RefreshCcw size={40} strokeWidth={1.5} className="text-purple-600" />,
    color: "bg-purple-50",
  },
  {
    title: "Seamless Integration with Third-Party Tools",
    description:
      "Effortlessly connect with hundreds of third-party apps to streamline your workflow and enhance automation.",
    icon: <Code2 size={40} strokeWidth={1.5} className="text-blue-600" />,
    color: "bg-blue-50",
  },
  {
    title: "Analytics & Dashboard",
    description:
      "Get real-time analytics and interactive dashboards to monitor and optimize your performance with ease.",
    icon: <BarChart size={40} strokeWidth={1.5} className="text-green-600" />,
    color: "bg-green-50",
  },
  {
    title: "Smart Workflow Automation",
    description:
      "Automate repetitive tasks, reduce manual effort, and improve operational efficiency with smart workflow automation.",
    icon: <Workflow size={40} strokeWidth={1.5} className="text-orange-600" />,
    color: "bg-orange-50",
  },
  {
    title: "Real-Time Collaboration & Version Control",
    description:
      "Enable seamless collaboration and track changes efficiently with built-in version control and team management features.",
    icon: <Users size={40} strokeWidth={1.5} className="text-pink-600" />,
    color: "bg-pink-50",
  },
  {
    title: "Compliance & Risk Analysis",
    description:
      "Ensure regulatory compliance and minimize risks with automated monitoring, reporting, and security assessments.",
    icon: <ShieldCheck size={40} strokeWidth={1.5} className="text-indigo-600" />,
    color: "bg-indigo-50",
  },
];

// FeaturesAutomation component
const FeaturesAutomation = () => {
  return (
    <section className="bg-[#EAF2EF] py-20 text-center">
      <h2 className="text-4xl font-bold text-gray-900 mb-6 animate-fade-in-up">
        Features & Automation
      </h2>
      <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in-up delay-100">
        Unlock the power of smart automation and enhance productivity with AI-driven insights and seamless integrations.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {features.map(({ title, description, icon, color }, index) => (
          <Card
            key={index}
            className={`${color} animate-fade-in-up delay-${200 + index * 100}`}
          >
            <CardHeader>
              <div className="p-4 rounded-full bg-white shadow-sm">{icon}</div>
            </CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>

      <Button className="mt-12 px-8 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300 animate-fade-in-up delay-800">
        Explore More Features
      </Button>
    </section>
  );
};

export default FeaturesAutomation;