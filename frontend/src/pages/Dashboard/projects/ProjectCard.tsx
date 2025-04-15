import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Tooltip,
  Avatar,
  AvatarGroup,
  useTheme,
} from "@mui/material";
import {
  MoreVert as MoreIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  PlayArrow as StartIcon,
  Pause as PauseIcon,
  CheckCircle as CompleteIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { Project, StatusType } from "@/types/projects";
import {
  formatDate,
  getStatusColor,
  getStatusIcon,
  getDepartmentColor,
} from "@/utils/projectUtils";

interface ProjectCardProps {
  project: Project;
  onViewDetails: () => void;
  onEditWorkflow: () => void;
  onStatusChange: (status: StatusType) => void;
  isCompact?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onViewDetails,
  onEditWorkflow,
  onStatusChange,
  isCompact = false,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (status: StatusType) => {
    onStatusChange(status);
    handleMenuClose();
  };

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
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: isCompact ? "row" : "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[6],
        },
      }}
    >
      {isCompact ? (
        // Compact list view layout
        <>
          <Box
            sx={{
              width: 8,
              bgcolor: `${getStatusColor(project.status)}.main`,
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4,
            }}
          />

          <Box sx={{ display: "flex", flex: 1, flexDirection: "column" }}>
            <Box
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette[departmentColor].main,
                    mr: 2,
                    color: theme.palette[departmentColor].contrastText,
                  }}
                >
                  {getInitials(project.name)}
                </Avatar>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{ mr: 1 }}
                      noWrap
                    >
                      {project.name}
                    </Typography>
                    <Chip
                      size="small"
                      label={project.department}
                      color={departmentColor}
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      size="small"
                      label={statusLabel}
                      color={getStatusColor(project.status)}
                      icon={getStatusIcon(project.status, {
                        fontSize: "small",
                      })}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Last updated: {formatDate(project.lastUpdated)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                {project.progress !== undefined && (
                  <Box sx={{ width: 120, mr: 2 }}>
                    <Typography
                      variant="caption"
                      display="block"
                      textAlign="right"
                    >
                      {project.progress}% complete
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={project.progress}
                      color={getStatusColor(project.status)}
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>
                )}

                <Chip
                  icon={<StarIcon fontSize="small" />}
                  label={`${project.automations} Automations`}
                  size="small"
                  variant="outlined"
                  sx={{ mr: 2 }}
                />

                <CardActions sx={{ p: 0 }}>
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={onViewDetails}
                      aria-label="view project details"
                    >
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Workflow">
                    <IconButton
                      size="small"
                      onClick={onEditWorkflow}
                      aria-label="edit project workflow"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Actions">
                    <IconButton
                      size="small"
                      onClick={handleMenuClick}
                      aria-label="project actions"
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                    >
                      <MoreIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Box>
            </Box>

            <CardContent sx={{ py: 1.5, flex: 1 }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                {project.description}
              </Typography>

              {project.teamMembers && project.teamMembers.length > 0 && (
                <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                  <Typography variant="caption" sx={{ mr: 1 }}>
                    Team:
                  </Typography>
                  <AvatarGroup
                    max={3}
                    sx={{
                      "& .MuiAvatar-root": {
                        width: 24,
                        height: 24,
                        fontSize: "0.75rem",
                      },
                    }}
                  >
                    {project.teamMembers.map((member, i) => (
                      <Tooltip key={i} title={member}>
                        <Avatar alt={member}>{getInitials(member)}</Avatar>
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                </Box>
              )}
            </CardContent>
          </Box>
        </>
      ) : (
        // Standard grid card layout
        <>
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette[departmentColor].main,
                  mr: 2,
                  color: theme.palette[departmentColor].contrastText,
                }}
              >
                {getInitials(project.name)}
              </Avatar>
              <Typography variant="h6" component="h2" noWrap>
                {project.name}
              </Typography>
            </Box>
            <IconButton
              onClick={handleMenuClick}
              aria-label="project actions"
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <MoreIcon />
            </IconButton>
          </Box>

          <CardContent sx={{ flexGrow: 1 }}>
            <Box
              sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Chip
                size="small"
                label={project.department}
                color={departmentColor}
              />
              <Chip
                size="small"
                label={statusLabel}
                color={getStatusColor(project.status)}
                icon={getStatusIcon(project.status, { fontSize: "small" })}
              />
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
              paragraph
            >
              {project.description}
            </Typography>

            {project.progress !== undefined && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">Progress</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {project.progress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={project.progress}
                  color={getStatusColor(project.status)}
                  sx={{ height: 8, borderRadius: 1, mt: 0.5 }}
                />
              </Box>
            )}

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Chip
                icon={<StarIcon fontSize="small" />}
                label={`${project.automations} Automations`}
                size="small"
                variant="outlined"
              />
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Last updated:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {formatDate(project.lastUpdated)}
                </Typography>
              </Box>
            </Box>

            {project.teamMembers && project.teamMembers.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Team Members:
                </Typography>
                <AvatarGroup max={4} sx={{ mt: 0.5 }}>
                  {project.teamMembers.map((member, i) => (
                    <Tooltip key={i} title={member}>
                      <Avatar
                        alt={member}
                        sx={{ width: 28, height: 28, fontSize: "0.8rem" }}
                      >
                        {getInitials(member)}
                      </Avatar>
                    </Tooltip>
                  ))}
                </AvatarGroup>
              </Box>
            )}
          </CardContent>

          <CardActions sx={{ justifyContent: "space-between", p: 2, pt: 0 }}>
            <Button
              size="small"
              startIcon={<ViewIcon />}
              onClick={onViewDetails}
              aria-label="view project details"
            >
              Details
            </Button>
            <Button
              size="small"
              startIcon={<EditIcon />}
              color="primary"
              onClick={onEditWorkflow}
              aria-label="edit project workflow"
            >
              Edit
            </Button>
          </CardActions>
        </>
      )}

      {/* Actions menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        MenuListProps={{
          "aria-labelledby": "project-actions-button",
        }}
      >
        <MenuItem onClick={onViewDetails}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={onEditWorkflow}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Workflow</ListItemText>
        </MenuItem>

        {project.status !== "active" && (
          <MenuItem onClick={() => handleStatusChange("active")}>
            <ListItemIcon>
              <StartIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Set Active</ListItemText>
          </MenuItem>
        )}

        {project.status !== "paused" && (
          <MenuItem onClick={() => handleStatusChange("paused")}>
            <ListItemIcon>
              <PauseIcon fontSize="small" color="warning" />
            </ListItemIcon>
            <ListItemText>Pause Project</ListItemText>
          </MenuItem>
        )}

        {project.status !== "completed" && (
          <MenuItem onClick={() => handleStatusChange("completed")}>
            <ListItemIcon>
              <CompleteIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText>Mark Completed</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};
