import { Project, StatusType, DepartmentType } from "@/types/projects";
import {
  PlayArrow as ActiveIcon,
  Pause as PausedIcon,
  CheckCircle as CompletedIcon,
} from "@mui/icons-material";

export const getStatusIcon = (status: StatusType, props: any = {}) => {
  const iconProps = {
    fontSize: "small",
    ...props,
  };

  switch (status) {
    case "active":
      return <ActiveIcon color="success" {...iconProps} />;
    case "completed":
      return <CompletedIcon color="primary" {...iconProps} />;
    case "paused":
      return <PausedIcon color="warning" {...iconProps} />;
    default:
      return <ActiveIcon color="inherit" {...iconProps} />;
  }
};

export const getStatusColor = (status: StatusType): string => {
  switch (status) {
    case "active":
      return "success";
    case "completed":
      return "primary";
    case "paused":
      return "warning";
    default:
      return "default";
  }
};

export const getDepartmentColor = (department: DepartmentType) => {
  const colors: Record<
    DepartmentType,
    "primary" | "success" | "secondary" | "warning"
  > = {
    Finance: "primary",
    Healthcare: "success",
    Logistics: "secondary",
    "Customer Support": "warning",
  };
  return colors[department];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const filterProjects = (
  projects: Project[],
  filters: {
    status?: StatusType[];
    department?: DepartmentType[];
    search?: string;
  }
): Project[] => {
  return projects.filter((project) => {
    if (
      filters.status &&
      filters.status.length > 0 &&
      !filters.status.includes(project.status)
    ) {
      return false;
    }
    if (
      filters.department &&
      filters.department.length > 0 &&
      !filters.department.includes(project.department)
    ) {
      return false;
    }
    if (filters.search && filters.search.trim() !== "") {
      const searchTerm = filters.search.toLowerCase();
      return (
        project.name.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.department.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });
};

export const sortProjects = (
  projects: Project[],
  sortBy: keyof Project,
  sortOrder: "asc" | "desc"
): Project[] => {
  return [...projects].sort((a, b) => {
    let valueA = a[sortBy];
    let valueB = b[sortBy];

    if (
      (sortBy === "lastUpdated" || sortBy === "createdAt") &&
      typeof valueA === "string" &&
      typeof valueB === "string"
    ) {
      valueA = new Date(valueA).getTime();
      valueB = new Date(valueB).getTime();
    }

    if (valueA == null) return sortOrder === "asc" ? -1 : 1;
    if (valueB == null) return sortOrder === "asc" ? 1 : -1;

    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
};
