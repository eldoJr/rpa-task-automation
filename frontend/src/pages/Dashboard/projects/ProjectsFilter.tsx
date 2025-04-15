import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  InputAdornment,
  IconButton,
  useTheme,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { StatusType, DepartmentType } from "@/types/projects";
import {
  getStatusColor,
  getStatusIcon,
  getDepartmentColor,
} from "@/utils/projectUtils";

interface ProjectsFilterProps {
  onFilterChange: (filters: {
    status: StatusType[];
    department: DepartmentType[];
    search: string;
  }) => void;
}

export const ProjectsFilter: React.FC<ProjectsFilterProps> = ({
  onFilterChange,
}) => {
  const theme = useTheme();
  const [statusFilter, setStatusFilter] = useState<StatusType[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState<DepartmentType[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Status options
  const statusOptions: StatusType[] = ["active", "paused", "completed"];

  // Department options
  const departmentOptions: DepartmentType[] = [
    "Finance",
    "Healthcare",
    "Logistics",
    "Customer Support",
  ];

  const handleStatusChange = (event: SelectChangeEvent<StatusType[]>) => {
    const value = event.target.value as StatusType[];
    setStatusFilter(value);
    onFilterChange({
      status: value,
      department: departmentFilter,
      search: searchTerm,
    });
  };

  const handleDepartmentChange = (
    event: SelectChangeEvent<DepartmentType[]>
  ) => {
    const value = event.target.value as DepartmentType[];
    setDepartmentFilter(value);
    onFilterChange({
      status: statusFilter,
      department: value,
      search: searchTerm,
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    onFilterChange({
      status: statusFilter,
      department: departmentFilter,
      search: value,
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
    onFilterChange({
      status: statusFilter,
      department: departmentFilter,
      search: "",
    });
  };

  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        alignItems: { xs: "stretch", md: "flex-end" },
      }}
    >
      {/* Status Filter */}
      <FormControl sx={{ minWidth: 200, flex: 1 }}>
        <InputLabel id="status-filter-label">Status</InputLabel>
        <Select
          labelId="status-filter-label"
          id="status-filter"
          multiple
          value={statusFilter}
          onChange={handleStatusChange}
          input={<OutlinedInput label="Status" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value.charAt(0).toUpperCase() + value.slice(1)}
                  color={getStatusColor(value)}
                  size="small"
                />
              ))}
            </Box>
          )}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
              },
            },
          }}
        >
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {getStatusIcon(status, { fontSize: "small", sx: { mr: 1 } })}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Department Filter */}
      <FormControl sx={{ minWidth: 200, flex: 1 }}>
        <InputLabel id="department-filter-label">Department</InputLabel>
        <Select
          labelId="department-filter-label"
          id="department-filter"
          multiple
          value={departmentFilter}
          onChange={handleDepartmentChange}
          input={<OutlinedInput label="Department" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  color={getDepartmentColor(value)}
                  size="small"
                />
              ))}
            </Box>
          )}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
              },
            },
          }}
        >
          {departmentOptions.map((department) => (
            <MenuItem key={department} value={department}>
              {department}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Search Field */}
      <TextField
        label="Search Projects"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ flex: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={clearSearch}
                edge="end"
                size="small"
                sx={{
                  color: theme.palette.action.active,
                  "&:hover": {
                    color: theme.palette.error.main,
                  },
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};
