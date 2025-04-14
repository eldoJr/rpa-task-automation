import { Project } from "@/types/projects";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Financial Reporting Automation",
    description:
      "Automate monthly financial report generation and data extraction",
    status: "active",
    automations: 5,
    department: "Finance",
    lastUpdated: "2024-03-25",
    createdAt: "2024-02-15",
    owner: "Jane Smith",
    teamMembers: ["John Doe", "Alice Johnson"],
    progress: 65,
  },
  // Add other mock projects as needed
];

export const projectService = {
  async getProjects(): Promise<Project[]> {
    await delay(800);
    return [...mockProjects];
  },

  async getProjectById(id: string): Promise<Project | undefined> {
    await delay(500);
    return mockProjects.find((project) => project.id === id);
  },

  async createProject(project: Omit<Project, "id">): Promise<Project> {
    await delay(1000);
    const newProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    mockProjects.push(newProject);
    return newProject;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    await delay(800);
    const projectIndex = mockProjects.findIndex((p) => p.id === id);
    if (projectIndex === -1) {
      throw new Error(`Project with ID ${id} not found`);
    }

    const updatedProject = {
      ...mockProjects[projectIndex],
      ...updates,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    mockProjects[projectIndex] = updatedProject;
    return updatedProject;
  },

  async deleteProject(id: string): Promise<boolean> {
    await delay(600);
    const projectIndex = mockProjects.findIndex((p) => p.id === id);
    if (projectIndex === -1) {
      return false;
    }
    mockProjects.splice(projectIndex, 1);
    return true;
  },
};
