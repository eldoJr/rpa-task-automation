import React, { useState } from "react";
import {
  Box,
  Typography,
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
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Save,
  Add,
  Delete,
  Edit,
  ExpandMore,
  Notifications,
  Security,
  AccountCircle,
  Api,
  Storage,
  Cloud,
  Language,
  Palette,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styled components - removed hover effects
const SettingsCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.shape.borderRadius * 1.5,
}));

const SectionIcon = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  width: 36,
  height: 36,
}));

// Types
type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "manager";
  lastActive: string;
  status: "active" | "inactive";
};

type Integration = {
  id: string;
  name: string;
  type: "api" | "database" | "cloud";
  status: "connected" | "disconnected";
  lastSync: string;
};

type NotificationPreference = {
  type: "email" | "sms" | "push";
  enabled: boolean;
  description: string;
};

// Sample data
const users: User[] = [
  {
    id: "user-1",
    name: "Admin User",
    email: "admin@company.com",
    role: "admin",
    lastActive: "2023-06-15T14:30:00",
    status: "active",
  },
  {
    id: "user-2",
    name: "Manager User",
    email: "manager@company.com",
    role: "manager",
    lastActive: "2023-06-14T09:15:00",
    status: "active",
  },
  {
    id: "user-3",
    name: "Regular User",
    email: "user@company.com",
    role: "user",
    lastActive: "2023-06-10T16:45:00",
    status: "inactive",
  },
];

const integrations: Integration[] = [
  {
    id: "int-1",
    name: "Microsoft Office 365",
    type: "cloud",
    status: "connected",
    lastSync: "2023-06-15T08:00:00",
  },
  {
    id: "int-2",
    name: "SQL Database",
    type: "database",
    status: "connected",
    lastSync: "2023-06-14T23:30:00",
  },
  {
    id: "int-3",
    name: "REST API",
    type: "api",
    status: "disconnected",
    lastSync: "2023-06-10T11:15:00",
  },
];

const notificationPreferences: NotificationPreference[] = [
  {
    type: "email",
    enabled: true,
    description: "Receive email notifications for important events",
  },
  {
    type: "sms",
    enabled: false,
    description: "Receive SMS alerts for critical issues",
  },
  {
    type: "push",
    enabled: true,
    description: "Get push notifications on your mobile device",
  },
];

const Settings: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openIntegrationDialog, setOpenIntegrationDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentIntegration, setCurrentIntegration] =
    useState<Integration | null>(null);
  const [notifications, setNotifications] = useState(notificationPreferences);
  const [systemSettings, setSystemSettings] = useState({
    darkMode: false,
    language: "en",
    autoUpdate: true,
    dataRetention: "30 days",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // User management handlers
  const handleUserDialogOpen = (user: User | null) => {
    setCurrentUser(
      user ||
        ({
          id: "",
          name: "",
          email: "",
          role: "user",
          lastActive: new Date().toISOString(),
          status: "active",
        } as User)
    );
    setOpenUserDialog(true);
  };

  const handleUserDialogClose = () => {
    setOpenUserDialog(false);
    setCurrentUser(null);
  };

  const handleUserSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      handleUserDialogClose();
    }, 1500);
  };

  // Integration management handlers
  const handleIntegrationDialogOpen = (integration: Integration | null) => {
    setCurrentIntegration(
      integration ||
        ({
          id: "",
          name: "",
          type: "api",
          status: "disconnected",
          lastSync: new Date().toISOString(),
        } as Integration)
    );
    setOpenIntegrationDialog(true);
  };

  const handleIntegrationDialogClose = () => {
    setOpenIntegrationDialog(false);
    setCurrentIntegration(null);
  };

  const handleIntegrationSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      handleIntegrationDialogClose();
    }, 1500);
  };

  // Notification preference handlers
  const handleNotificationToggle = (type: string) => {
    setNotifications(
      notifications.map((pref) =>
        pref.type === type ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  // System settings handlers
  const handleSystemSettingChange = (field: string, value: any) => {
    setSystemSettings({ ...systemSettings, [field]: value });
  };

  const handleSaveAllSettings = () => {
    setIsSaving(true);
    // Simulate saving all settings
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 2000);
  };

  // Helper functions
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "error";
      case "manager":
        return "warning";
      case "user":
        return "primary";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active" || status === "connected" ? "success" : "error";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Box sx={{ p: 3 }}>
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 500 }}>
          <SettingsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          System Settings
        </Typography>
        <Button
          variant="contained"
          startIcon={
            isSaving ? <CircularProgress size={20} color="inherit" /> : <Save />
          }
          onClick={handleSaveAllSettings}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save All Settings"}
        </Button>
      </Box>

      <Tabs
        value={selectedTab}
        onChange={(_, newValue) => setSelectedTab(newValue)}
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
        variant="scrollable"
      >
        <Tab icon={<SettingsIcon />} label="General" iconPosition="start" />
        <Tab icon={<AccountCircle />} label="Users" iconPosition="start" />
        <Tab icon={<Api />} label="Integrations" iconPosition="start" />
        <Tab
          icon={<Notifications />}
          label="Notifications"
          iconPosition="start"
        />
      </Tabs>

      {selectedTab === 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <SettingsCard elevation={1}>
              <CardHeader
                avatar={
                  <SectionIcon>
                    <Palette />
                  </SectionIcon>
                }
                title="Appearance"
              />
              <CardContent>
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemSettings.darkMode}
                      onChange={(e) =>
                        handleSystemSettingChange("darkMode", e.target.checked)
                      }
                    />
                  }
                  label="Dark Mode"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={systemSettings.language}
                    onChange={(e) =>
                      handleSystemSettingChange("language", e.target.value)
                    }
                    label="Language"
                    size="small"
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                    <MenuItem value="de">German</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </SettingsCard>
          </Box>

          <Box sx={{ flex: 1 }}>
            <SettingsCard elevation={1}>
              <CardHeader
                avatar={
                  <SectionIcon>
                    <Storage />
                  </SectionIcon>
                }
                title="System Preferences"
              />
              <CardContent>
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemSettings.autoUpdate}
                      onChange={(e) =>
                        handleSystemSettingChange(
                          "autoUpdate",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Automatic Updates"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Data Retention</InputLabel>
                  <Select
                    value={systemSettings.dataRetention}
                    onChange={(e) =>
                      handleSystemSettingChange("dataRetention", e.target.value)
                    }
                    label="Data Retention"
                    size="small"
                  >
                    <MenuItem value="7 days">7 days</MenuItem>
                    <MenuItem value="30 days">30 days</MenuItem>
                    <MenuItem value="90 days">90 days</MenuItem>
                    <MenuItem value="1 year">1 year</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </SettingsCard>
          </Box>
        </Box>
      )}

      {selectedTab === 0 && (
        <Box sx={{ mt: 3 }}>
          <SettingsCard elevation={1}>
            <CardHeader
              avatar={
                <SectionIcon>
                  <Security />
                </SectionIcon>
              }
              title="Security Settings"
              action={
                <Button startIcon={<Edit />} variant="outlined" size="small">
                  Edit
                </Button>
              }
            />
            <CardContent>
              <Accordion
                elevation={0}
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Password Policy</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Minimum 8 characters, including at least one uppercase
                    letter, one number, and one special character.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                elevation={0}
                sx={{ border: "1px solid", borderColor: "divider", mt: 2 }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Two-Factor Authentication</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormControlLabel
                    control={<Switch checked={true} />}
                    label="Require 2FA for all admin users"
                  />
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </SettingsCard>
        </Box>
      )}

      {selectedTab === 1 && (
        <Box sx={{ mt: 2 }}>
          <SettingsCard elevation={1}>
            <CardHeader
              avatar={
                <SectionIcon>
                  <AccountCircle />
                </SectionIcon>
              }
              title="User Management"
              action={
                <Button
                  startIcon={<Add />}
                  variant="outlined"
                  size="small"
                  onClick={() => handleUserDialogOpen(null)}
                >
                  Add User
                </Button>
              }
            />
            <CardContent>
              <List sx={{ bgcolor: "background.paper" }}>
                {users.map((user) => (
                  <ListItem
                    key={user.id}
                    sx={{
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      py: 1.5,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight={500}>
                          {user.name}
                        </Typography>
                      }
                      secondary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 0.5,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                          <Chip
                            label={user.role}
                            size="small"
                            color={getRoleColor(user.role)}
                            sx={{ ml: 1, height: 20, fontSize: "0.75rem" }}
                          />
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={user.status}
                          size="small"
                          color={getStatusColor(user.status)}
                          sx={{ height: 20, fontSize: "0.75rem" }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ minWidth: 100 }}
                        >
                          Last active: {formatDate(user.lastActive)}
                        </Typography>
                        <IconButton
                          onClick={() => handleUserDialogOpen(user)}
                          size="small"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small">
                          <Delete fontSize="small" color="error" />
                        </IconButton>
                      </Stack>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </SettingsCard>
        </Box>
      )}

      {selectedTab === 2 && (
        <Box sx={{ mt: 2 }}>
          <SettingsCard elevation={1}>
            <CardHeader
              avatar={
                <SectionIcon>
                  <Cloud />
                </SectionIcon>
              }
              title="Integration Management"
              action={
                <Button
                  startIcon={<Add />}
                  variant="outlined"
                  size="small"
                  onClick={() => handleIntegrationDialogOpen(null)}
                >
                  Add Integration
                </Button>
              }
            />
            <CardContent>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {integrations.map((integration) => (
                  <Box
                    key={integration.id}
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "calc(50% - 8px)",
                        md: "calc(33.33% - 10.67px)",
                      },
                    }}
                  >
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight={500}>
                            {integration.name}
                          </Typography>
                          <Chip
                            label={integration.status}
                            size="small"
                            color={getStatusColor(integration.status)}
                            sx={{ height: 20, fontSize: "0.75rem" }}
                          />
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Type: {integration.type.toUpperCase()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Last sync: {formatDate(integration.lastSync)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            mt: 2,
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleIntegrationDialogOpen(integration)
                            }
                            sx={{ mr: 1 }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <Delete fontSize="small" color="error" />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </SettingsCard>
        </Box>
      )}

      {selectedTab === 3 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            mt: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <SettingsCard elevation={1}>
              <CardHeader
                avatar={
                  <SectionIcon>
                    <Notifications />
                  </SectionIcon>
                }
                title="Notification Preferences"
              />
              <CardContent>
                <List disablePadding>
                  {notifications.map((preference) => (
                    <ListItem
                      key={preference.type}
                      sx={{
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        py: 1.5,
                      }}
                      disablePadding
                    >
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2">
                            {preference.type.charAt(0).toUpperCase() +
                              preference.type.slice(1)}{" "}
                            Notifications
                          </Typography>
                        }
                        secondary={preference.description}
                        sx={{ my: 0 }}
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          edge="end"
                          checked={preference.enabled}
                          onChange={() =>
                            handleNotificationToggle(preference.type)
                          }
                          size="small"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </SettingsCard>
          </Box>
          <Box sx={{ flex: 1 }}>
            <SettingsCard elevation={1}>
              <CardHeader
                avatar={
                  <SectionIcon>
                    <Language />
                  </SectionIcon>
                }
                title="Alert Settings"
              />
              <CardContent>
                <FormControlLabel
                  control={<Switch checked={true} size="small" />}
                  label="Email alerts for system errors"
                />
                <FormControlLabel
                  control={<Switch checked={false} size="small" />}
                  label="SMS alerts for critical failures"
                  sx={{ display: "block", mt: 1 }}
                />
                <FormControlLabel
                  control={<Switch checked={true} size="small" />}
                  label="Push notifications for completed automations"
                  sx={{ display: "block", mt: 1 }}
                />
                <TextField
                  label="Notification Email"
                  type="email"
                  fullWidth
                  sx={{ mt: 2 }}
                  defaultValue="admin@company.com"
                  size="small"
                />
              </CardContent>
            </SettingsCard>
          </Box>
        </Box>
      )}

      {/* User Dialog */}
      <Dialog
        open={openUserDialog}
        onClose={handleUserDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentUser?.id ? "Edit User" : "Add New User"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={currentUser?.name || ""}
              onChange={(e) =>
                currentUser &&
                setCurrentUser({ ...currentUser, name: e.target.value })
              }
              size="small"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={currentUser?.email || ""}
              onChange={(e) =>
                currentUser &&
                setCurrentUser({ ...currentUser, email: e.target.value })
              }
              size="small"
              margin="normal"
            />
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                value={currentUser?.role || "user"}
                onChange={(e) =>
                  currentUser &&
                  setCurrentUser({
                    ...currentUser,
                    role: e.target.value as any,
                  })
                }
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={currentUser?.status || "active"}
                onChange={(e) =>
                  currentUser &&
                  setCurrentUser({
                    ...currentUser,
                    status: e.target.value as any,
                  })
                }
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUserDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUserSave}
            disabled={isSaving || !currentUser?.name || !currentUser?.email}
            startIcon={isSaving ? <CircularProgress size={20} /> : <Save />}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Integration Dialog */}
      <Dialog
        open={openIntegrationDialog}
        onClose={handleIntegrationDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentIntegration?.id ? "Edit Integration" : "Add New Integration"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Integration Name"
              value={currentIntegration?.name || ""}
              onChange={(e) =>
                currentIntegration &&
                setCurrentIntegration({
                  ...currentIntegration,
                  name: e.target.value,
                })
              }
              size="small"
              margin="normal"
            />
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Type</InputLabel>
              <Select
                label="Type"
                value={currentIntegration?.type || "api"}
                onChange={(e) =>
                  currentIntegration &&
                  setCurrentIntegration({
                    ...currentIntegration,
                    type: e.target.value as any,
                  })
                }
              >
                <MenuItem value="api">API</MenuItem>
                <MenuItem value="database">Database</MenuItem>
                <MenuItem value="cloud">Cloud Service</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={currentIntegration?.status || "disconnected"}
                onChange={(e) =>
                  currentIntegration &&
                  setCurrentIntegration({
                    ...currentIntegration,
                    status: e.target.value as any,
                  })
                }
              >
                <MenuItem value="connected">Connected</MenuItem>
                <MenuItem value="disconnected">Disconnected</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleIntegrationDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleIntegrationSave}
            disabled={isSaving || !currentIntegration?.name}
            startIcon={isSaving ? <CircularProgress size={20} /> : <Save />}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
