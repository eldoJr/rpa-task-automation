import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card/card";
import { Button } from "@/components/ui/button/Button";
import { Badge } from "@/components/ui/badge/badge";
import { 
  PlusIcon, 
  PlayIcon, 
  PauseIcon, 
  CheckCircleIcon, 
  EyeIcon, 
  EditIcon 
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog/dialog";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "paused";
  automations: number;
  department: "Finance" | "Healthcare" | "Logistics" | "Customer Support";
  lastUpdated: string;
}

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Financial Reporting Automation",
      description: "Automate monthly financial report generation and data extraction",
      status: "active",
      automations: 5,
      department: "Finance",
      lastUpdated: "2024-03-25",
    },
    {
      id: "2",
      name: "Patient Intake Workflow",
      description: "Streamline patient registration and data entry processes",
      status: "paused",
      automations: 3,
      department: "Healthcare",
      lastUpdated: "2024-03-20",
    },
    {
      id: "3",
      name: "Logistics Order Processing",
      description: "Automate order tracking and shipping documentation",
      status: "completed",
      automations: 4,
      department: "Logistics",
      lastUpdated: "2024-03-22",
    },
  ]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const getStatusIcon = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return <PlayIcon className="text-green-500 w-5 h-5" />;
      case "completed":
        return <CheckCircleIcon className="text-blue-500 w-5 h-5" />;
      case "paused":
        return <PauseIcon className="text-yellow-500 w-5 h-5" />;
    }
  };

  const getDepartmentColor = (department: Project["department"]) => {
    const colors = {
      Finance: "bg-blue-100 text-blue-800",
      Healthcare: "bg-green-100 text-green-800",
      Logistics: "bg-purple-100 text-purple-800",
      "Customer Support": "bg-orange-100 text-orange-800",
    };
    return colors[department];
  };

  const handleCreateProject = () => {
    navigate("/dashboard/add-automation");
  };

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
  };

  const handleEditWorkflow = (project: Project) => {
    // TODO: Implement workflow editing 
    // For now, navigate to add automation with project details
    navigate("/dashboard/add-automation", { 
      state: { 
        editingProject: project 
      } 
    });
  };

  const handleStatusChange = (projectId: string, newStatus: Project["status"]) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, status: newStatus }
        : project
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Automation Projects
          </h1>
          <p className="text-gray-500 mt-2">
            Create, manage, and monitor your RPA workflows
          </p>
        </div>
        <Button
          onClick={handleCreateProject}
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Create New Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="flex flex-col hover:shadow-xl transition-all duration-300 border-gray-200"
          >
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-700">
                {project.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                {getStatusIcon(project.status)}
                <Badge
                  className={`${getDepartmentColor(
                    project.department
                  )} px-2 py-1 rounded-full text-xs`}
                >
                  {project.department}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-grow">
              <p className="text-gray-600 mb-4">{project.description}</p>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                  <p>Automations: {project.automations}</p>
                  <p>Last Updated: {project.lastUpdated}</p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center border-t pt-4">
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewDetails(project)}
                >
                  <EyeIcon className="mr-2 w-4 h-4" />
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditWorkflow(project)}
                >
                  <EditIcon className="mr-2 w-4 h-4" />
                  Edit Workflow
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            No Automation Projects Yet
          </h2>
          <p className="text-gray-500 mb-6">
            Start streamlining your workflows by creating your first RPA project
          </p>
          <Button
            onClick={handleCreateProject}
            className="flex items-center gap-2 mx-auto"
          >
            <PlusIcon className="w-5 h-5" />
            Create First Project
          </Button>
        </div>
      )}

      {/* Project Details Modal */}
      <Dialog 
        open={isDetailsModalOpen} 
        onOpenChange={setIsDetailsModalOpen}
      >
        <DialogContent>
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProject.name}</DialogTitle>
                <DialogDescription>
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedProject.status)}
                    {selectedProject.status}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Department:</span>
                  <Badge 
                    className={getDepartmentColor(selectedProject.department)}
                  >
                    {selectedProject.department}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Automations:</span>
                  <span>{selectedProject.automations}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span>{selectedProject.lastUpdated}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                {selectedProject.status !== "completed" && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      handleStatusChange(selectedProject.id, "completed");
                      setIsDetailsModalOpen(false);
                    }}
                  >
                    Mark as Completed
                  </Button>
                )}
                <Button 
                  onClick={() => {
                    handleEditWorkflow(selectedProject);
                    setIsDetailsModalOpen(false);
                  }}
                >
                  Edit Workflow
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;