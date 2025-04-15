import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Grid,
  Alert,
  Snackbar,
  Fade,
  Menu,
  MenuItem,
  ListItemText,
  Tooltip,
  IconButton,
  Tab,
  Tabs,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Sort as SortIcon,
  ViewList as ListViewIcon,
  ViewModule as GridViewIcon,
} from "@mui/icons-material";

import { Project, StatusType } from "@/types/projects";
import { ProjectProvider, useProjects } from "@/contexts/ProjectContext";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetailsDialog } from "./ProjectDetailsDialog";
import { ProjectsFilter } from "./ProjectsFilter";
import { ProjectCardSkeleton } from "./ProjectCardSkeleton";
import { ProjectStats } from "./ProjectStats";
import { filterProjects, sortProjects } from "@/utils/projectUtils";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...other
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const ProjectsContent: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { state, dispatch, updateProjectStatus } = useProjects();
  const { projects, loading, error } = state;

  // State management
  const [filters, setFilters] = useState({
    status: [] as StatusType[],
    department: [] as string[],
    search: "",
  });
  const [sortConfig, setSortConfig] = useState({
    field: "lastUpdated" as keyof Project,
    order: "desc" as "asc" | "desc",
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });
  const [lastChangedProject, setLastChangedProject] = useState<{
    id: string;
    prevStatus: StatusType;
  } | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [tabValue, setTabValue] = useState(0);
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  // Memoized project data
  const { activeProjects, completedProjects, pausedProjects } = useMemo(
    () => ({
      activeProjects: projects.filter((p) => p.status === "active"),
      completedProjects: projects.filter((p) => p.status === "completed"),
      pausedProjects: projects.filter((p) => p.status === "paused"),
    }),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    const filtered = filterProjects(projects, filters);
    return sortProjects(filtered, sortConfig.field, sortConfig.order);
  }, [projects, filters, sortConfig]);

  // Handlers
  const handleCreateProject = useCallback(() => {
    navigate("/dashboard/add-automation");
  }, [navigate]);

  const handleViewDetails = useCallback((project: Project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
  }, []);

  const handleEditWorkflow = useCallback(
    (project: Project) => {
      navigate("/dashboard/add-automation", {
        state: { editingProject: project },
      });
    },
    [navigate]
  );

  const handleStatusChange = useCallback(
    async (projectId: string, newStatus: StatusType) => {
      try {
        const projectToUpdate = projects.find((p) => p.id === projectId);
        if (projectToUpdate) {
          setLastChangedProject({
            id: projectId,
            prevStatus: projectToUpdate.status,
          });
          updateProjectStatus(projectId, newStatus);

          setSnackbarState({
            open: true,
            message: `Project status changed to ${newStatus}`,
            severity: "success",
          });
        }
      } catch (err) {
        if (lastChangedProject) {
          updateProjectStatus(projectId, lastChangedProject.prevStatus);
        }
        setSnackbarState({
          open: true,
          message: "Failed to update project status",
          severity: "error",
        });
      }
    },
    [projects, updateProjectStatus, lastChangedProject]
  );

  const handleRefresh = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const data = await projectService.getProjects();
      dispatch({ type: "SET_PROJECTS", payload: data });
      setSnackbarState({
        open: true,
        message: "Projects refreshed",
        severity: "success",
      });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Failed to refresh projects" });
      setSnackbarState({
        open: true,
        message: "Failed to refresh projects",
        severity: "error",
      });
    }
  }, [dispatch]);

  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
      setFilters((prev) => ({
        ...prev,
        status:
          newValue === 0
            ? []
            : newValue === 1
            ? ["active"]
            : newValue === 2
            ? ["completed"]
            : ["paused"],
      }));
    },
    []
  );

  const handleUndoStatusChange = useCallback(() => {
    if (lastChangedProject) {
      updateProjectStatus(lastChangedProject.id, lastChangedProject.prevStatus);
      setSnackbarState({
        open: true,
        message: "Status change undone",
        severity: "info",
      });
      setLastChangedProject(null);
    }
  }, [lastChangedProject, updateProjectStatus]);

  // Effects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const data = await projectService.getProjects();
        dispatch({ type: "SET_PROJECTS", payload: data });
      } catch (err) {
        dispatch({ type: "SET_ERROR", payload: "Failed to load projects" });
        setSnackbarState({
          open: true,
          message: "Failed to load projects",
          severity: "error",
        });
      }
    };

    fetchProjects();
  }, [dispatch]);

  // Render helpers
  const renderSkeletons = useCallback(
    () =>
      Array(6)
        .fill(0)
        .map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
            <ProjectCardSkeleton />
          </Grid>
        )),
    []
  );

  const renderProjectGrid = useCallback(
    (projectsToRender: Project[]) => (
      <Fade in timeout={500}>
        <Grid container spacing={3}>
          {projectsToRender.map((project) => (
            <Grid
              item
              xs={12}
              sm={viewMode === "list" ? 12 : 6}
              md={viewMode === "list" ? 12 : 4}
              key={project.id}
            >
              <ProjectCard
                project={project}
                onViewDetails={() => handleViewDetails(project)}
                onEditWorkflow={() => handleEditWorkflow(project)}
                onStatusChange={(status) =>
                  handleStatusChange(project.id, status)
                }
                isCompact={viewMode === "list"}
              />
            </Grid>
          ))}
          {loading && renderSkeletons()}
        </Grid>
      </Fade>
    ),
    [
      viewMode,
      loading,
      handleViewDetails,
      handleEditWorkflow,
      handleStatusChange,
      renderSkeletons,
    ]
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Projects
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Refresh projects">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={viewMode === "grid" ? "List view" : "Grid view"}>
            <IconButton
              onClick={() =>
                setViewMode((prev) => (prev === "grid" ? "list" : "grid"))
              }
              color="inherit"
            >
              {viewMode === "grid" ? <ListViewIcon /> : <GridViewIcon />}
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateProject}
            aria-label="Create new project"
          >
            New Project
          </Button>
        </Box>
      </Box>

      {/* Projects statistics */}
      <ProjectStats projects={projects} />

      {/* Tabs navigation */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="project tabs"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={`All (${projects.length})`} id="project-tab-0" />
          <Tab label={`Active (${activeProjects.length})`} id="project-tab-1" />
          <Tab
            label={`Completed (${completedProjects.length})`}
            id="project-tab-2"
          />
          <Tab label={`Paused (${pausedProjects.length})`} id="project-tab-3" />
        </Tabs>
      </Box>

      {/* Filter and sort controls */}
      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        <ProjectsFilter onFilterChange={setFilters} />

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            size="medium"
            startIcon={<SortIcon />}
            onClick={(e) => setSortMenuAnchor(e.currentTarget)}
            variant="outlined"
            aria-controls="sort-menu"
            aria-haspopup="true"
          >
            Sort
          </Button>
          <Menu
            id="sort-menu"
            anchorEl={sortMenuAnchor}
            open={Boolean(sortMenuAnchor)}
            onClose={() => setSortMenuAnchor(null)}
          >
            {["name", "lastUpdated", "department", "automations"].map(
              (field) => (
                <MenuItem
                  key={field}
                  onClick={() => {
                    handleSort(field as keyof Project);
                    setSortMenuAnchor(null);
                  }}
                >
                  <ListItemText>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </ListItemText>
                </MenuItem>
              )
            )}
          </Menu>
        </Box>
      </Box>

      {/* Tab panels */}
      <TabPanel value={tabValue} index={0}>
        {loading && !projects.length ? (
          <Grid container spacing={3}>
            {renderSkeletons()}
          </Grid>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : filteredProjects.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            No projects match the selected filters
          </Alert>
        ) : (
          renderProjectGrid(filteredProjects)
        )}
      </TabPanel>

      {/* Other tab panels with similar structure */}
      {[1, 2, 3].map((index) => (
        <TabPanel key={index} value={tabValue} index={index}>
          {loading && !projects.length ? (
            <Grid container spacing={3}>
              {renderSkeletons()}
            </Grid>
          ) : filteredProjects.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              {index === 1
                ? "No active projects"
                : index === 2
                ? "No completed projects"
                : "No paused projects"}
            </Alert>
          ) : (
            renderProjectGrid(filteredProjects)
          )}
        </TabPanel>
      ))}

      {/* Project details dialog */}
      {selectedProject && (
        <ProjectDetailsDialog
          open={isDetailsModalOpen}
          project={selectedProject}
          onClose={() => setIsDetailsModalOpen(false)}
          onEdit={() => {
            setIsDetailsModalOpen(false);
            handleEditWorkflow(selectedProject);
          }}
          onStatusChange={(status) => {
            handleStatusChange(selectedProject.id, status);
            setIsDetailsModalOpen(false);
          }}
        />
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={5000}
        onClose={() => setSnackbarState((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        action={
          lastChangedProject && (
            <Button
              color="secondary"
              size="small"
              onClick={handleUndoStatusChange}
            >
              UNDO
            </Button>
          )
        }
      >
        <Alert
          onClose={() => setSnackbarState((prev) => ({ ...prev, open: false }))}
          severity={snackbarState.severity}
          sx={{ width: "100%" }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export const Projects: React.FC = () => (
  <ProjectProvider>
    <ProjectsContent />
  </ProjectProvider>
);
