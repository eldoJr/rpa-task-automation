import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  IconButton,
  Divider,
  Avatar,
  AvatarGroup,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Group as TeamIcon,
  Description as DescriptionIcon,
  PlayArrow as StartIcon,
  Pause as PauseIcon,
  CheckCircle as CompleteIcon,
  Timeline as TimelineIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { Project, StatusType } from "@/types/projects";
import {
  formatDate,
  getStatusColor,
  getStatusIcon,
  getDepartmentColor,
} from "@/utils/projectUtils";

interface ProjectDetailsDialogProps {
  open: boolean;
  project: Project;
  onClose: () => void;
  onEdit: () => void;
  onStatusChange: (status: StatusType) => void;
}

export const ProjectDetailsDialog: React.FC<ProjectDetailsDialogProps> = ({
  open,
  project,
  onClose,
  onEdit,
  onStatusChange,
}) => {
  const theme = useTheme();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const statusLabel =
    project.status.charAt(0).toUpperCase() + project.status.slice(1);
  const departmentColor = getDepartmentColor(project.department);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      aria-labelledby="project-details-dialog-title"
    >
      <DialogTitle id="project-details-dialog-title" sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" component="h2">
            Project Details
          </Typography>
          <IconButton
            aria-label="close dialog"
            onClick={onClose}
            size="small"
            sx={{
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Header section */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: theme.palette[departmentColor].main,
                  color: theme.palette[departmentColor].contrastText,
                  mr: 2,
                  fontSize: "1.5rem",
                }}
                alt={project.name}
              >
                {getInitials(project.name)}
              </Avatar>
              <Box>
                <Typography variant="h4" component="h2">
                  {project.name}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                  <Chip label={project.department} color={departmentColor} />
                  <Chip
                    label={statusLabel}
                    color={getStatusColor(project.status)}
                    icon={getStatusIcon(project.status, { fontSize: "small" })}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Description section */}
          <Grid item xs={12}>
            <Box
              sx={{
                bgcolor: "background.default",
                p: 2,
                borderRadius: 1,
                borderLeft: `4px solid ${theme.palette[departmentColor].main}`,
              }}
            >
              <Typography variant="body1" paragraph>
                {project.description}
              </Typography>
            </Box>
          </Grid>

          {/* Progress section */}
          {project.progress !== undefined && (
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <TimelineIcon sx={{ mr: 1 }} />
                Progress
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ flex: 1, mr: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={project.progress}
                    color={getStatusColor(project.status)}
                    sx={{
                      height: 12,
                      borderRadius: 1,
                      backgroundColor: theme.palette.grey[200],
                    }}
                  />
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  {project.progress}%
                </Typography>
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Project metadata */}
          <Grid item xs={12} md={6}>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <StarIcon color="secondary" />
                </ListItemIcon>
                <ListItemText
                  primary="Automations"
                  secondary={project.automations}
                  primaryTypographyProps={{ fontWeight: "medium" }}
                  secondaryTypographyProps={{ color: "text.primary" }}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <ScheduleIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Last Updated"
                  secondary={formatDate(project.lastUpdated)}
                  primaryTypographyProps={{ fontWeight: "medium" }}
                  secondaryTypographyProps={{ color: "text.primary" }}
                />
              </ListItem>

              {project.createdAt && (
                <ListItem>
                  <ListItemIcon>
                    <ScheduleIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Created On"
                    secondary={formatDate(project.createdAt)}
                    primaryTypographyProps={{ fontWeight: "medium" }}
                    secondaryTypographyProps={{ color: "text.primary" }}
                  />
                </ListItem>
              )}
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <List dense>
              {project.owner && (
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Project Owner"
                    secondary={project.owner}
                    primaryTypographyProps={{ fontWeight: "medium" }}
                    secondaryTypographyProps={{ color: "text.primary" }}
                  />
                </ListItem>
              )}

              {project.teamMembers && project.teamMembers.length > 0 && (
                <ListItem>
                  <ListItemIcon>
                    <TeamIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Team Members"
                    secondaryTypographyProps={{ component: "div" }}
                    primaryTypographyProps={{ fontWeight: "medium" }}
                    secondary={
                      <AvatarGroup
                        max={5}
                        sx={{
                          mt: 0.5,
                          justifyContent: "flex-start",
                          "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            fontSize: "0.8rem",
                          },
                        }}
                      >
                        {project.teamMembers.map((member, i) => (
                          <Tooltip key={i} title={member}>
                            <Avatar alt={member}>{getInitials(member)}</Avatar>
                          </Tooltip>
                        ))}
                      </AvatarGroup>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        <Box>
          {project.status !== "active" && (
            <Button
              variant="outlined"
              color="success"
              startIcon={<StartIcon />}
              onClick={() => onStatusChange("active")}
              sx={{ mr: 1 }}
              aria-label="Set project as active"
            >
              Set Active
            </Button>
          )}

          {project.status !== "paused" && (
            <Button
              variant="outlined"
              color="warning"
              startIcon={<PauseIcon />}
              onClick={() => onStatusChange("paused")}
              sx={{ mr: 1 }}
              aria-label="Pause project"
            >
              Pause
            </Button>
          )}

          {project.status !== "completed" && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<CompleteIcon />}
              onClick={() => onStatusChange("completed")}
              aria-label="Mark project as completed"
            >
              Mark Complete
            </Button>
          )}
        </Box>

        <Box>
          <Button onClick={onClose} sx={{ mr: 1 }} aria-label="Close dialog">
            Close
          </Button>
          <Button
            variant="contained"
            onClick={onEdit}
            aria-label="Edit project"
          >
            Edit Project
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
