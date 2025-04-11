import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import {
  Add,
  Refresh,
  Download,
  InsertDriveFile,
  PictureAsPdf,
  Description,
  BarChart,
  TableChart,
  FilterList,
  Search,
  MoreVert,
  Share,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styled components
const ReportCard = styled(Card)(({ theme }) => ({
  transition: "all 0.3s ease",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[6],
  },
}));

const ReportIcon = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.main,
  width: 40,
  height: 40,
}));

// Types
type Report = {
  id: string;
  title: string;
  type: "pdf" | "excel" | "word" | "dashboard";
  description: string;
  lastGenerated: string;
  frequency: "daily" | "weekly" | "monthly" | "on-demand";
  size: string;
  automationId: string;
};

type ReportData = {
  id: string;
  automationName: string;
  successRate: number;
  executions: number;
  avgDuration: number;
  lastRun: string;
  status: "active" | "inactive";
};

// Helper function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

// Sample data
const savedReports: Report[] = [
  {
    id: "report-1",
    title: "Monthly Financial Summary",
    type: "pdf",
    description: "Comprehensive financial report with all transactions",
    lastGenerated: "2023-06-01T00:00:00",
    frequency: "monthly",
    size: "2.4 MB",
    automationId: "auto-fin-001",
  },
  {
    id: "report-2",
    title: "CRM Activity Log",
    type: "excel",
    description: "Daily customer interactions and sales activities",
    lastGenerated: "2023-06-15T00:00:00",
    frequency: "daily",
    size: "1.1 MB",
    automationId: "auto-sales-002",
  },
  {
    id: "report-3",
    title: "Automation Performance",
    type: "dashboard",
    description: "Interactive dashboard with automation metrics",
    lastGenerated: "2023-06-14T00:00:00",
    frequency: "weekly",
    size: "N/A",
    automationId: "auto-admin-003",
  },
  {
    id: "report-4",
    title: "Inventory Levels",
    type: "word",
    description: "Current stock levels with reorder recommendations",
    lastGenerated: "2023-06-10T00:00:00",
    frequency: "weekly",
    size: "3.2 MB",
    automationId: "auto-log-004",
  },
];

const reportData: ReportData[] = [
  {
    id: "data-1",
    automationName: "Invoice Processing",
    successRate: 98,
    executions: 245,
    avgDuration: 4.5,
    lastRun: "2023-06-15T14:30:00",
    status: "active",
  },
  {
    id: "data-2",
    automationName: "CRM Data Sync",
    successRate: 92,
    executions: 187,
    avgDuration: 7.2,
    lastRun: "2023-06-15T09:15:00",
    status: "active",
  },
  {
    id: "data-3",
    automationName: "Email Extraction",
    successRate: 85,
    executions: 312,
    avgDuration: 3.8,
    lastRun: "2023-06-14T16:45:00",
    status: "active",
  },
  {
    id: "data-4",
    automationName: "HR Onboarding",
    successRate: 76,
    executions: 56,
    avgDuration: 12.5,
    lastRun: "2023-06-13T11:00:00",
    status: "inactive",
  },
];

const Reports: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [reportType, setReportType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleGenerateDialogOpen = () => {
    setOpenGenerateDialog(true);
  };

  const handleGenerateDialogClose = () => {
    setOpenGenerateDialog(false);
  };

  const handleGenerateReport = () => {
    setLoading(true);
    // Simulate report generation
    setTimeout(() => {
      setLoading(false);
      handleGenerateDialogClose();
    }, 2000);
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "success" : "error";
  };

  const filteredReports = savedReports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Reports & Analytics</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleGenerateDialogOpen}
        >
          Generate Report
        </Button>
      </Box>

      <Tabs
        value={selectedTab}
        onChange={(_, newValue) => setSelectedTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Saved Reports" />
        <Tab label="Automation Analytics" />
      </Tabs>

      {selectedTab === 0 ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search reports..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 350 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FilterList color="action" sx={{ mr: 1 }} />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  label="Report Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="excel">Excel</MenuItem>
                  <MenuItem value="word">Word</MenuItem>
                  <MenuItem value="dashboard">Dashboard</MenuItem>
                </Select>
              </FormControl>
              <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh} sx={{ ml: 1 }}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {filteredReports.length === 0 ? (
            <Box sx={{ textAlign: "center", p: 5 }}>
              <Typography variant="h6" color="text.secondary">
                No reports found matching your criteria
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredReports.map((report) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={report.id}>
                  <ReportCard>
                    <CardHeader
                      avatar={
                        <ReportIcon>
                          {report.type === "pdf" ? (
                            <PictureAsPdf />
                          ) : report.type === "excel" ? (
                            <TableChart />
                          ) : report.type === "word" ? (
                            <Description />
                          ) : (
                            <BarChart />
                          )}
                        </ReportIcon>
                      }
                      action={
                        <IconButton>
                          <MoreVert />
                        </IconButton>
                      }
                      title={report.title}
                      subheader={
                        <Chip
                          label={report.type.toUpperCase()}
                          size="small"
                          variant="outlined"
                        />
                      }
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {report.description}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {report.size}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Last gen: {formatDate(report.lastGenerated)}
                        </Typography>
                      </Box>
                    </CardContent>
                    <Box
                      sx={{
                        p: 2,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Chip
                        label={report.frequency}
                        size="small"
                        variant="outlined"
                      />
                      <Box>
                        <Tooltip title="Download">
                          <IconButton size="small" sx={{ mr: 1 }}>
                            <Download fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Share">
                          <IconButton size="small">
                            <Share fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </ReportCard>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      ) : (
        <>
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="From Date"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <TextField
                label="To Date"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
              <Button variant="outlined" onClick={handleRefresh}>
                Apply Filters
              </Button>
            </Stack>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: "action.hover" }}>
                <TableRow>
                  <TableCell>Automation</TableCell>
                  <TableCell align="center">Success Rate</TableCell>
                  <TableCell align="center">Executions</TableCell>
                  <TableCell align="center">Avg Duration (min)</TableCell>
                  <TableCell align="center">Last Run</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  reportData.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>
                        <Typography fontWeight="medium">
                          {row.automationName}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box sx={{ width: "100%", mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={row.successRate}
                              color={
                                row.successRate > 90
                                  ? "success"
                                  : row.successRate > 75
                                  ? "warning"
                                  : "error"
                              }
                            />
                          </Box>
                          {row.successRate}%
                        </Box>
                      </TableCell>
                      <TableCell align="center">{row.executions}</TableCell>
                      <TableCell align="center">
                        {row.avgDuration.toFixed(1)}
                      </TableCell>
                      <TableCell align="center">
                        {formatDateTime(row.lastRun)}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={row.status}
                          size="small"
                          color={getStatusColor(row.status)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Generate Report">
                          <IconButton size="small">
                            <InsertDriveFile fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <BarChart fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Generate Report Dialog */}
      <Dialog
        open={openGenerateDialog}
        onClose={handleGenerateDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Generate New Report</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select label="Report Type" defaultValue="pdf">
                  <MenuItem value="pdf">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PictureAsPdf fontSize="small" />
                      <span>PDF Report</span>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="excel">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <TableChart fontSize="small" />
                      <span>Excel Spreadsheet</span>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="dashboard">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <BarChart fontSize="small" />
                      <span>Interactive Dashboard</span>
                    </Stack>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="From Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
                <TextField
                  label="To Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Automation</InputLabel>
                <Select label="Automation" defaultValue="all">
                  <MenuItem value="all">All Automations</MenuItem>
                  {reportData.map((auto) => (
                    <MenuItem key={auto.id} value={auto.id}>
                      {auto.automationName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleGenerateDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleGenerateReport}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Generating..." : "Generate Report"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reports;
