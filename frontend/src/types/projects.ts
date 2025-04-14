export interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "completed";
  automations: number;
  department: "Finance" | "Healthcare" | "Logistics" | "Customer Support";
  lastUpdated: string;
  createdAt?: string;
  owner?: string;
  teamMembers?: string[];
  progress?: number;
}

export type StatusType = Project["status"];
export type DepartmentType = Project["department"];
