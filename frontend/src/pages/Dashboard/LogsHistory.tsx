import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Tooltip,
  Menu,
  MenuItem,
  Pagination,
  Stack,
  Tabs,
  Tab,
  Badge,
  CircularProgress
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  Refresh, 
  MoreVert, 
  CheckCircle, 
  Error, 
  Schedule, 
  HourglassEmpty,
  Download,
  Clear
} from '@mui/icons-material';
import { format } from 'date-fns';
import { styled } from '@mui/material/styles';

interface LogEntry {
  id: string;
  automationName: string;
  botId: string;
  startTime: Date;
  endTime: Date | null;
  status: 'success' | 'failed' | 'running' | 'pending';
  duration: number | null;
  triggeredBy: string;
  details: string;
}

const StatusChip = styled(Chip)(({ theme }) => ({
  borderRadius: 4,
  fontWeight: 500,
  '&.success': {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  },
  '&.failed': {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  },
  '&.running': {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  },
  '&.pending': {
    backgroundColor: theme.palette.info.light,
    color: theme.palette.info.dark,
  },
}));

const LogsHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 10;

  // Sample log data
  const sampleLogs: LogEntry[] = [
    {
      id: 'log-001',
      automationName: 'Invoice Processing',
      botId: 'bot-fin-001',
      startTime: new Date(2023, 5, 15, 10, 30),
      endTime: new Date(2023, 5, 15, 10, 35),
      status: 'success',
      duration: 5,
      triggeredBy: 'System (Scheduled)',
      details: 'Processed 24 invoices successfully'
    },
    {
      id: 'log-002',
      automationName: 'CRM Data Sync',
      botId: 'bot-sales-002',
      startTime: new Date(2023, 5, 15, 9, 15),
      endTime: new Date(2023, 5, 15, 9, 22),
      status: 'success',
      duration: 7,
      triggeredBy: 'Manual (User: admin)',
      details: 'Synced 142 customer records'
    },
    {
      id: 'log-003',
      automationName: 'Email Extraction',
      botId: 'bot-data-003',
      startTime: new Date(2023, 5, 15, 8, 0),
      endTime: null,
      status: 'running',
      duration: null,
      triggeredBy: 'System (Trigger)',
      details: 'Processing 53 new emails'
    },
    {
      id: 'log-004',
      automationName: 'HR Onboarding',
      botId: 'bot-hr-004',
      startTime: new Date(2023, 5, 14, 16, 45),
      endTime: new Date(2023, 5, 14, 16, 50),
      status: 'failed',
      duration: 5,
      triggeredBy: 'Manual (User: hr_manager)',
      details: 'Failed to integrate with payroll system'
    },
    {
      id: 'log-005',
      automationName: 'Inventory Update',
      botId: 'bot-log-005',
      startTime: new Date(2023, 5, 14, 14, 30),
      endTime: new Date(2023, 5, 14, 14, 38),
      status: 'success',
      duration: 8,
      triggeredBy: 'System (Scheduled)',
      details: 'Updated 87 inventory items'
    },
    {
      id: 'log-006',
      automationName: 'Customer Support Routing',
      botId: 'bot-support-006',
      startTime: new Date(2023, 5, 14, 11, 0),
      endTime: null,
      status: 'pending',
      duration: null,
      triggeredBy: 'System (Trigger)',
      details: 'Waiting for new tickets'
    },
    {
      id: 'log-007',
      automationName: 'Report Generation',
      botId: 'bot-fin-007',
      startTime: new Date(2023, 5, 13, 23, 0),
      endTime: new Date(2023, 5, 14, 0, 15),
      status: 'success',
      duration: 75,
      triggeredBy: 'System (Scheduled)',
      details: 'Generated monthly financial reports'
    },
  ];

  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
  };

  const filteredLogs = sampleLogs.filter(log => {
    const matchesSearch = log.automationName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         log.botId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle fontSize="small" />;
      case 'failed': return <Error fontSize="small" />;
      case 'running': return <CircularProgress size={16} />;
      case 'pending': return <HourglassEmpty fontSize="small" />;
      default: return <Schedule fontSize="small" />;
    }
  };

  const getStatusCount = (status: string) => {
    return sampleLogs.filter(log => log.status === status).length;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Logs & History</Typography>
        <Box>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="More options">
            <IconButton onClick={handleMenuClick}>
              <MoreVert />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <Download sx={{ mr: 1 }} /> Export Logs
            </MenuItem>
            <MenuItem onClick={handleClearFilters}>
              <Clear sx={{ mr: 1 }} /> Clear Filters
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Tabs 
        value={selectedTab} 
        onChange={(_, newValue) => setSelectedTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="All Logs" />
        <Tab label={
          <Badge badgeContent={getStatusCount('running')} color="warning">
            Running
          </Badge>
        } />
        <Tab label={
          <Badge badgeContent={getStatusCount('failed')} color="error">
            Errors
          </Badge>
        } />
      </Tabs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search logs..."
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
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterList color="action" sx={{ mr: 1 }} />
          <Chip
            label="All"
            variant={filterStatus === 'all' ? 'filled' : 'outlined'}
            color={filterStatus === 'all' ? 'primary' : 'default'}
            onClick={() => setFilterStatus('all')}
            sx={{ mx: 0.5 }}
          />
          <Chip
            label="Success"
            variant={filterStatus === 'success' ? 'filled' : 'outlined'}
            color={filterStatus === 'success' ? 'success' : 'default'}
            onClick={() => setFilterStatus('success')}
            sx={{ mx: 0.5 }}
            icon={<CheckCircle fontSize="small" />}
          />
          <Chip
            label="Failed"
            variant={filterStatus === 'failed' ? 'filled' : 'outlined'}
            color={filterStatus === 'failed' ? 'error' : 'default'}
            onClick={() => setFilterStatus('failed')}
            sx={{ mx: 0.5 }}
            icon={<Error fontSize="small" />}
          />
          <Chip
            label="Running"
            variant={filterStatus === 'running' ? 'filled' : 'outlined'}
            color={filterStatus === 'running' ? 'warning' : 'default'}
            onClick={() => setFilterStatus('running')}
            sx={{ mx: 0.5 }}
            icon={<CircularProgress size={16} />}
          />
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell>Automation</TableCell>
              <TableCell>Bot ID</TableCell>
              <TableCell>Triggered By</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : paginatedLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">
                    No logs found matching your criteria
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedLogs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell>
                    <Typography fontWeight="medium">{log.automationName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={log.botId} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{log.triggeredBy}</TableCell>
                  <TableCell>
                    {format(log.startTime, 'MMM d, yyyy - h:mm a')}
                  </TableCell>
                  <TableCell>
                    {log.duration ? `${log.duration} min` : '-'}
                  </TableCell>
                  <TableCell>
                    <StatusChip
                      label={log.status}
                      className={log.status}
                      icon={getStatusIcon(log.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {log.details}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredLogs.length > 0 && (
        <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
          <Pagination
            count={Math.ceil(filteredLogs.length / rowsPerPage)}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Stack>
      )}
    </Box>
  );
};

export default LogsHistory;