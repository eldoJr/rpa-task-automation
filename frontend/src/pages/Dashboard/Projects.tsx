import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Avatar,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  PlayArrow as ActiveIcon,
  Pause as PausedIcon,
  CheckCircle as CompletedIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreIcon,
} from "@mui/icons-material";

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
      description:
        "Automate monthly financial report generation and data extraction",
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
    const iconProps = { fontSize: "small", sx: { mr: 0.5 } };
    switch (status) {
      case "active":
        return <ActiveIcon color="success" {...iconProps} />;
      case "completed":
        return <CompletedIcon color="primary" {...iconProps} />;
      case "paused":
        return <PausedIcon color="warning" {...iconProps} />;
    }
  };

  const getDepartmentColor = (department: Project["department"]) => {
    const colors = {
      Finance: "primary",
      Healthcare: "success",
      Logistics: "secondary",
      "Customer Support": "warning",
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
    navigate("/dashboard/add-automation", {
      state: { editingProject: project },
    });
  };

  const handleStatusChange = (
    projectId: string,
    newStatus: Project["status"]
  ) => {
    setProjects(
      projects.map((project) =>
        project.id === projectId ? { ...project, status: newStatus } : project
      )
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Automation Projects
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create, manage, and monitor your RPA workflows
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateProject}
          sx={{ height: 40 }}
        >
          Create New Project
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "box-shadow 0.3s ease",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    sx={{
                      bgcolor: `${getDepartmentColor(
                        project.department
                      )}.light`,
                    }}
                  >
                    {project.name.charAt(0)}
                  </Avatar>
                }
                action={
                  <IconButton aria-label="settings">
                    <MoreIcon />
                  </IconButton>
                }
                title={
                  <Typography variant="h6" component="div">
                    {project.name}
                  </Typography>
                }
                subheader={
                  <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                    {getStatusIcon(project.status)}
                    <Chip
                      label={project.status}
                      size="small"
                      sx={{ ml: 1, textTransform: "capitalize" }}
                    />
                  </Box>
                }
              />

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {project.description}
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Chip
                    label={project.department}
                    color={getDepartmentColor(project.department)}
                    size="small"
                  />
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="caption" display="block">
                      {project.automations} automations
                    </Typography>
                    <Typography variant="caption" display="block">
                      Updated: {project.lastUpdated}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                <Button
                  size="small"
                  startIcon={<ViewIcon />}
                  onClick={() => handleViewDetails(project)}
                >
                  Details
                </Button>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleEditWorkflow(project)}
                >
                  Edit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {projects.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            p: 8,
            bgcolor: "background.paper",
            borderRadius: 2,
            mt: 4,
          }}
        >
          <Typography variant="h5" gutterBottom>
            No Automation Projects Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Start streamlining your workflows by creating your first RPA project
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateProject}
            sx={{ mt: 2 }}
          >
            Create First Project
          </Button>
        </Box>
      )}

      {/* Project Details Dialog */}
      <Dialog
        open={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedProject && (
          <>
            <DialogTitle>{selectedProject.name}</DialogTitle>
            <DialogContent>
              <DialogContentText paragraph>
                {selectedProject.description}
              </DialogContentText>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <Typography variant="body2">Status:</Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {getStatusIcon(selectedProject.status)}
                  <Typography
                    variant="body2"
                    sx={{ ml: 1, textTransform: "capitalize" }}
                  >
                    {selectedProject.status}
                  </Typography>
                </Box>

                <Typography variant="body2">Department:</Typography>
                <Chip
                  label={selectedProject.department}
                  color={getDepartmentColor(selectedProject.department)}
                  size="small"
                />

                <Typography variant="body2">Automations:</Typography>
                <Typography variant="body2">
                  {selectedProject.automations}
                </Typography>

                <Typography variant="body2">Last Updated:</Typography>
                <Typography variant="body2">
                  {selectedProject.lastUpdated}
                </Typography>
              </Box>
            </DialogContent>

            <DialogActions>
              {selectedProject.status !== "completed" && (
                <Button
                  onClick={() => {
                    handleStatusChange(selectedProject.id, "completed");
                    setIsDetailsModalOpen(false);
                  }}
                >
                  Mark as Completed
                </Button>
              )}
              <Button
                variant="contained"
                onClick={() => {
                  handleEditWorkflow(selectedProject);
                  setIsDetailsModalOpen(false);
                }}
              >
                Edit Workflow
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Projects;
