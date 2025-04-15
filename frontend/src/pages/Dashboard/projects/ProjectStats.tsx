import React, { useMemo } from "react";
import { Box, Paper, Typography, Grid, useTheme } from "@mui/material";
import {
  CheckCircle as CompletedIcon,
  PlayArrow as ActiveIcon,
  Pause as PausedIcon,
  Settings as AutomationIcon,
} from "@mui/icons-material";
import { Project } from "@/types/projects";

interface ProjectStatsProps {
  projects: Project[];
}

export const ProjectStats: React.FC<ProjectStatsProps> = ({ projects }) => {
  const theme = useTheme();

  const stats = useMemo(() => {
    const active = projects.filter((p) => p.status === "active").length;
    const completed = projects.filter((p) => p.status === "completed").length;
    const paused = projects.filter((p) => p.status === "paused").length;
    const totalAutomations = projects.reduce(
      (sum, p) => sum + p.automations,
      0
    );

    return {
      active,
      completed,
      paused,
      totalAutomations,
      totalProjects: projects.length,
    };
  }, [projects]);

  const statCards = [
    {
      value: stats.active,
      label: "Active Projects",
      icon: <ActiveIcon sx={{ fontSize: 36, mr: 1 }} />,
      color: "success",
      description: `${Math.round(
        (stats.active / stats.totalProjects) * 100
      )}% of total`,
    },
    {
      value: stats.completed,
      label: "Completed Projects",
      icon: <CompletedIcon sx={{ fontSize: 36, mr: 1 }} />,
      color: "primary",
      description: `${Math.round(
        (stats.completed / stats.totalProjects) * 100
      )}% of total`,
    },
    {
      value: stats.paused,
      label: "Paused Projects",
      icon: <PausedIcon sx={{ fontSize: 36, mr: 1 }} />,
      color: "warning",
      description: `${Math.round(
        (stats.paused / stats.totalProjects) * 100
      )}% of total`,
    },
    {
      value: stats.totalAutomations,
      label: "Total Automations",
      icon: <AutomationIcon sx={{ fontSize: 36, mr: 1 }} />,
      color: "secondary",
      description: `Across ${stats.totalProjects} projects`,
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {statCards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              height: "100%",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              bgcolor: `${card.color}.light`,
              color: `${card.color}.contrastText`,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: theme.shadows[4],
              },
            }}
            aria-label={`${card.label} statistics card`}
          >
            <Box sx={{ mr: 2 }}>{card.icon}</Box>
            <Box>
              <Typography
                variant="h4"
                fontWeight="bold"
                component="div"
                aria-label={`${card.value} ${card.label.toLowerCase()}`}
              >
                {card.value}
              </Typography>
              <Typography variant="body1" component="div">
                {card.label}
              </Typography>
              <Typography
                variant="caption"
                component="div"
                sx={{
                  opacity: 0.9,
                  mt: 0.5,
                }}
              >
                {card.description}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
