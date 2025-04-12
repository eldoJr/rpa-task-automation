import React, { useReducer, useState, useCallback, useMemo } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  Switch,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputAdornment,
} from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  Save as SaveIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
  Storage as DatabaseIcon,
  Description as ExcelIcon,
  Code as ApiIcon,
  Notifications as NotificationIcon,
  SwapHoriz as TransformIcon,
  Gavel as ApprovalIcon,
  Timer as DelayIcon,
  FilterAlt as ConditionIcon,
  TextSnippet as OcrIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Delete as DeleteIcon,
  DragHandle as DragHandleIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  ViewList as ListViewIcon,
  AccountTree as FlowchartIcon,
  SmartToy as RobotIcon,
  Close as CloseIcon,
  CheckCircle as ConfiguredIcon,
  Error as ErrorIcon,
  Warning as PartialIcon,
  RadioButtonUnchecked as UnconfiguredIcon,
  CalendarToday as CalendarIcon,
  CloudUpload as FileUploadIcon,
  PlayCircle as ManualIcon,
  Webhook as WebhookIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

// ========== Type Definitions ==========
type StepType =
  | "email"
  | "excel"
  | "database"
  | "ocr"
  | "api"
  | "condition"
  | "notification"
  | "transform"
  | "approval"
  | "delay";

type TriggerType =
  | "schedule"
  | "email"
  | "database"
  | "calendar"
  | "webhook"
  | "manual"
  | "file-upload";

type StepStatus = "configured" | "partial" | "error" | "unconfigured";
type AutomationStatus = "draft" | "active" | "paused" | "error";

interface BaseConfig {
  name: string;
  description?: string;
}

interface EmailConfig extends BaseConfig {
  folder: string;
  filter: string;
  includeAttachments?: boolean;
  markAsRead?: boolean;
}

interface ExcelConfig extends BaseConfig {
  file: string;
  sheet: string;
  range?: string;
  headerRow?: boolean;
}

interface OCRConfig extends BaseConfig {
  dataPoints: string[];
  templateId?: string;
  confidence?: number;
}

interface DatabaseConfig extends BaseConfig {
  query: string;
  connection: string;
  parameters?: Record<string, any>;
}

interface APIConfig extends BaseConfig {
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  authentication?: {
    type: "basic" | "oauth" | "apiKey";
    credentials: Record<string, string>;
  };
}

interface ConditionConfig extends BaseConfig {
  conditions: Array<{
    field: string;
    operator: string;
    value: string;
  }>;
  logicalOperator: "and" | "or";
}

interface NotificationConfig extends BaseConfig {
  type: "email" | "slack" | "teams" | "webhook";
  recipients: string[];
  template?: string;
  subject?: string;
}

interface TransformConfig extends BaseConfig {
  transforms: Array<{
    field: string;
    operation: string;
    value?: string;
  }>;
}

interface ApprovalConfig extends BaseConfig {
  approvers: string[];
  timeoutHours: number;
  reminderHours?: number;
}

interface DelayConfig extends BaseConfig {
  duration: number;
  timeUnit: "minutes" | "hours" | "days";
  condition?: {
    field: string;
    operator: string;
    value: string;
  };
}

type StepConfig =
  | EmailConfig
  | ExcelConfig
  | OCRConfig
  | DatabaseConfig
  | APIConfig
  | ConditionConfig
  | NotificationConfig
  | TransformConfig
  | ApprovalConfig
  | DelayConfig;

interface AutomationStep {
  id: string;
  type: StepType;
  name: string;
  config: StepConfig;
  status: StepStatus;
  connections?: {
    inputs: string[];
    outputs: string[];
  };
}

interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  popularity: number;
  steps: AutomationStep[];
  trigger: TriggerType;
  tags: string[];
}

interface AvailableStep {
  id: StepType;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: "input" | "processing" | "output" | "logic";
}

interface TriggerTypeOption {
  id: TriggerType;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: "timer" | "event" | "manual";
}

interface AutomationState {
  name: string;
  description: string;
  steps: AutomationStep[];
  trigger: TriggerType;
  status: AutomationStatus;
  selectedTemplate: string;
  history: Array<{
    steps: AutomationStep[];
    timestamp: number;
  }>;
  historyIndex: number;
  tags: string[];
  schedule?: {
    frequency: "once" | "hourly" | "daily" | "weekly" | "monthly";
    time?: string;
    daysOfWeek?: number[];
    dayOfMonth?: number;
  };
}

type AutomationAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_TRIGGER"; payload: TriggerType }
  | { type: "SET_STATUS"; payload: AutomationStatus }
  | { type: "ADD_STEP"; payload: AutomationStep }
  | {
      type: "UPDATE_STEP";
      payload: { id: string; config: Partial<StepConfig>; status?: StepStatus };
    }
  | { type: "REMOVE_STEP"; payload: string }
  | { type: "REORDER_STEPS"; payload: AutomationStep[] }
  | { type: "LOAD_TEMPLATE"; payload: { template: AutomationTemplate } }
  | { type: "SET_SCHEDULE"; payload: AutomationState["schedule"] }
  | { type: "ADD_TAG"; payload: string }
  | { type: "REMOVE_TAG"; payload: string }
  | { type: "SAVE_HISTORY_SNAPSHOT" }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET" };

// ========== Constants ==========
const AVAILABLE_STEPS: AvailableStep[] = [
  {
    id: "email",
    name: "Email Integration",
    description: "Process incoming emails or send notifications",
    icon: <EmailIcon />,
    category: "input",
  },
  {
    id: "excel",
    name: "Excel Processing",
    description: "Read from or write to Excel spreadsheets",
    icon: <ExcelIcon />,
    category: "processing",
  },
  {
    id: "database",
    name: "Database Query",
    description: "Execute SQL queries or database operations",
    icon: <DatabaseIcon />,
    category: "processing",
  },
  {
    id: "ocr",
    name: "OCR Recognition",
    description: "Extract text from images or documents",
    icon: <OcrIcon />,
    category: "input",
  },
  {
    id: "api",
    name: "API Request",
    description: "Make HTTP requests to external services",
    icon: <ApiIcon />,
    category: "processing",
  },
  {
    id: "condition",
    name: "Condition",
    description: "Add branching logic to your workflow",
    icon: <ConditionIcon />,
    category: "logic",
  },
  {
    id: "notification",
    name: "Send Notification",
    description: "Alert users via email, Slack, or other channels",
    icon: <NotificationIcon />,
    category: "output",
  },
  {
    id: "transform",
    name: "Data Transformation",
    description: "Format, map, or clean data in your workflow",
    icon: <TransformIcon />,
    category: "processing",
  },
  {
    id: "approval",
    name: "Approval Request",
    description: "Request approval from specified users",
    icon: <ApprovalIcon />,
    category: "logic",
  },
  {
    id: "delay",
    name: "Time Delay",
    description: "Pause workflow execution for a specified time",
    icon: <DelayIcon />,
    category: "logic",
  },
];

const TRIGGER_TYPES: TriggerTypeOption[] = [
  {
    id: "schedule",
    name: "Schedule Based",
    description: "Run on a defined schedule",
    icon: <ScheduleIcon />,
    category: "timer",
  },
  {
    id: "email",
    name: "Email Trigger",
    description: "Triggered when emails arrive",
    icon: <EmailIcon />,
    category: "event",
  },
  {
    id: "database",
    name: "Database Change",
    description: "Triggered on database updates",
    icon: <DatabaseIcon />,
    category: "event",
  },
  {
    id: "calendar",
    name: "Calendar Event",
    description: "Triggered by calendar events",
    icon: <CalendarIcon />,
    category: "event",
  },
  {
    id: "webhook",
    name: "Webhook",
    description: "Triggered by external HTTP requests",
    icon: <WebhookIcon />,
    category: "event",
  },
  {
    id: "manual",
    name: "Manual Trigger",
    description: "Run on demand by users",
    icon: <ManualIcon />,
    category: "manual",
  },
  {
    id: "file-upload",
    name: "File Upload",
    description: "Triggered when files are uploaded",
    icon: <FileUploadIcon />,
    category: "event",
  },
];

// ========== Utility Functions ==========
const generateStepId = (): string =>
  `step-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const getStepIcon = (type: StepType): React.ReactNode => {
  const step = AVAILABLE_STEPS.find((s) => s.id === type);
  return step?.icon || <SettingsIcon />;
};

const getTriggerIcon = (type: TriggerType): React.ReactNode => {
  const trigger = TRIGGER_TYPES.find((t) => t.id === type);
  return trigger?.icon || <SettingsIcon />;
};

const getStepStatusIcon = (status: StepStatus) => {
  switch (status) {
    case "configured":
      return <ConfiguredIcon color="success" fontSize="small" />;
    case "partial":
      return <PartialIcon color="warning" fontSize="small" />;
    case "error":
      return <ErrorIcon color="error" fontSize="small" />;
    default:
      return <UnconfiguredIcon color="action" fontSize="small" />;
  }
};

const getStepStatusBadge = (status: StepStatus) => {
  switch (status) {
    case "configured":
      return (
        <Chip
          icon={<ConfiguredIcon fontSize="small" />}
          label="Configured"
          size="small"
          color="success"
          variant="outlined"
        />
      );
    case "partial":
      return (
        <Chip
          icon={<PartialIcon fontSize="small" />}
          label="Partial"
          size="small"
          color="warning"
          variant="outlined"
        />
      );
    case "error":
      return (
        <Chip
          icon={<ErrorIcon fontSize="small" />}
          label="Error"
          size="small"
          color="error"
          variant="outlined"
        />
      );
    default:
      return (
        <Chip
          icon={<UnconfiguredIcon fontSize="small" />}
          label="Not Configured"
          size="small"
          color="default"
          variant="outlined"
        />
      );
  }
};

// ========== Reducer Function ==========
const automationReducer = (
  state: AutomationState,
  action: AutomationAction
): AutomationState => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "SET_TRIGGER":
      return { ...state, trigger: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "ADD_STEP": {
      const newSteps = [...state.steps, action.payload];
      return { ...state, steps: newSteps };
    }
    case "UPDATE_STEP": {
      const { id, config, status } = action.payload;
      const updatedSteps = state.steps.map((step) => {
        if (step.id === id) {
          return {
            ...step,
            config: { ...step.config, ...config },
            status: status || step.status,
          };
        }
        return step;
      });
      return { ...state, steps: updatedSteps };
    }
    case "REMOVE_STEP": {
      const filteredSteps = state.steps.filter(
        (step) => step.id !== action.payload
      );
      return { ...state, steps: filteredSteps };
    }
    case "REORDER_STEPS":
      return { ...state, steps: action.payload };
    case "LOAD_TEMPLATE": {
      const { template } = action.payload;
      return {
        ...state,
        name: template.name,
        description: template.description,
        steps: template.steps,
        trigger: template.trigger,
        selectedTemplate: template.id,
        tags: template.tags,
      };
    }
    case "SET_SCHEDULE":
      return { ...state, schedule: action.payload };
    case "ADD_TAG": {
      if (!state.tags.includes(action.payload)) {
        return { ...state, tags: [...state.tags, action.payload] };
      }
      return state;
    }
    case "REMOVE_TAG": {
      return {
        ...state,
        tags: state.tags.filter((tag) => tag !== action.payload),
      };
    }
    case "SAVE_HISTORY_SNAPSHOT": {
      const stepsCopy = JSON.parse(JSON.stringify(state.steps));
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      return {
        ...state,
        history: [...newHistory, { steps: stepsCopy, timestamp: Date.now() }],
        historyIndex: newHistory.length,
      };
    }
    case "UNDO": {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        return {
          ...state,
          steps: JSON.parse(JSON.stringify(state.history[newIndex].steps)),
          historyIndex: newIndex,
        };
      }
      return state;
    }
    case "REDO": {
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        return {
          ...state,
          steps: JSON.parse(JSON.stringify(state.history[newIndex].steps)),
          historyIndex: newIndex,
        };
      }
      return state;
    }
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

// ========== Initial State ==========
const initialState: AutomationState = {
  name: "",
  description: "",
  steps: [],
  trigger: "schedule",
  status: "draft",
  selectedTemplate: "",
  history: [{ steps: [], timestamp: Date.now() }],
  historyIndex: 0,
  tags: [],
};

// ========== Custom Hooks ==========
interface AIAssistantSuggestion {
  text: string;
  action?: () => void;
  actionLabel?: string;
}

const useAIAssistant = (state: AutomationState) => {
  const { name, description, steps } = state;

  const getSuggestions = useCallback((): AIAssistantSuggestion[] => {
    const suggestions: AIAssistantSuggestion[] = [];

    if (steps.length === 0) {
      suggestions.push({
        text: "Your workflow is empty. Start by adding steps from the component panel.",
      });
    }

    if (name.toLowerCase().includes("email")) {
      suggestions.push({
        text: "This automation seems email-related. Consider using an Email trigger or step.",
      });
    }

    if (description.toLowerCase().includes("extract")) {
      suggestions.push({
        text: "Your automation involves data extraction. OCR Recognition would be useful for extracting text from documents.",
      });
    }

    if (
      description.toLowerCase().includes("excel") ||
      description.toLowerCase().includes("spreadsheet")
    ) {
      suggestions.push({
        text: "Your automation involves spreadsheets. Add Excel Processing to read or write Excel files.",
      });
    }

    if (steps.length > 1 && !steps.some((step) => step.type === "notification")) {
      suggestions.push({
        text: "Consider adding a notification step to alert users about the workflow results.",
      });
    }

    if (steps.length > 2 && !steps.some((step) => step.type === "condition")) {
      suggestions.push({
        text: "Your workflow is getting complex. Add conditional logic to handle different scenarios.",
      });
    }

    const stepTypes = steps.map((step) => step.type);
    if (
      stepTypes.includes("database") &&
      stepTypes.indexOf("database") < stepTypes.indexOf("excel")
    ) {
      suggestions.push({
        text: "You're extracting data from a database before using Excel. Consider adding a transformation step in between.",
      });
    }

    if (steps.length <= 1) {
      suggestions.push({
        text: "Starting from a template can save time. Choose one that matches your needs.",
        actionLabel: "Browse Templates",
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        text: "Your automation is taking shape! Consider how users will be notified about outcomes.",
      });
    }

    return suggestions;
  }, [name, description, steps]);

  const getOptimizationTips = useCallback((): AIAssistantSuggestion[] => {
    const tips: AIAssistantSuggestion[] = [];

    if (steps.length > 2 && !steps.some((step) => step.type === "condition")) {
      tips.push({
        text: "Add error handling with conditional steps to make your workflow more robust.",
      });
    }

    const notificationSteps = steps.filter(
      (step) => step.type === "notification"
    );
    if (notificationSteps.length > 1) {
      tips.push({
        text: "You have multiple notification steps. Consider consolidating them for clarity.",
      });
    }

    if (
      steps.some((step) => step.type === "api") &&
      !steps.some((step) => step.type === "condition")
    ) {
      tips.push({
        text: "API calls might fail. Add conditional logic to handle failed API responses.",
      });
    }

    if (steps.length > 3 && !steps.some((step) => step.type === "condition")) {
      tips.push({
        text: "Your workflow is linear. Consider adding branching logic for different scenarios.",
      });
    }

    return tips;
  }, [steps]);

  return { getSuggestions, getOptimizationTips: getOptimizationTips };
};

// ========== Step Configuration Components ==========
const EmailStepConfig: React.FC<{
  config: EmailConfig;
  onUpdate: (config: EmailConfig) => void;
}> = ({ config, onUpdate }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Folder"
        value={config.folder}
        onChange={(e) => onUpdate({ ...config, folder: e.target.value })}
        fullWidth
      />
      <TextField
        label="Filter"
        value={config.filter}
        onChange={(e) => onUpdate({ ...config, filter: e.target.value })}
        placeholder="e.g. subject:invoice, from:sales@example.com"
        fullWidth
      />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Switch
          checked={config.includeAttachments || false}
          onChange={(e) =>
            onUpdate({ ...config, includeAttachments: e.target.checked })
          }
        />
        <Typography variant="body2">Include Attachments</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Switch
          checked={config.markAsRead || false}
          onChange={(e) =>
            onUpdate({ ...config, markAsRead: e.target.checked })
          }
        />
        <Typography variant="body2">Mark as Read</Typography>
      </Box>
    </Box>
  );
};

const ExcelStepConfig: React.FC<{
  config: ExcelConfig;
  onUpdate: (config: ExcelConfig) => void;
}> = ({ config, onUpdate }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="File Path"
        value={config.file}
        onChange={(e) => onUpdate({ ...config, file: e.target.value })}
        fullWidth
      />
      <TextField
        label="Sheet Name"
        value={config.sheet}
        onChange={(e) => onUpdate({ ...config, sheet: e.target.value })}
        fullWidth
      />
      <TextField
        label="Range (optional)"
        value={config.range || ""}
        onChange={(e) => onUpdate({ ...config, range: e.target.value })}
        placeholder="e.g. A1:D100"
        fullWidth
      />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Switch
          checked={config.headerRow || false}
          onChange={(e) =>
            onUpdate({ ...config, headerRow: e.target.checked })
          }
        />
        <Typography variant="body2">First row contains headers</Typography>
      </Box>
    </Box>
  );
};

const DatabaseStepConfig: React.FC<{
  config: DatabaseConfig;
  onUpdate: (config: DatabaseConfig) => void;
}> = ({ config, onUpdate }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Select
        value={config.connection}
        onChange={(e) =>
          onUpdate({ ...config, connection: e.target.value as string })
        }
        fullWidth
      >
        <MenuItem value="production_db">Production Database</MenuItem>
        <MenuItem value="analytics_db">Analytics Database</MenuItem>
        <MenuItem value="backup_db">Backup Database</MenuItem>
      </Select>
      <TextField
        label="Query"
        value={config.query}
        onChange={(e) => onUpdate({ ...config, query: e.target.value })}
        multiline
        rows={4}
        fullWidth
      />
    </Box>
  );
};

// ========== Main Component ==========
const AddAutomation: React.FC = () => {
  const [state, dispatch] = useReducer(automationReducer, initialState);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { getSuggestions, getOptimizationTips } = useAIAssistant(state);
  const [viewMode, setViewMode] = useState<"flowchart" | "list">("list");
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");
  //const [activeTab, setActiveTab] = useState("steps");

  const filteredSteps = useMemo(() => {
    return AVAILABLE_STEPS.filter((step) => {
      const matchesSearch =
        step.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        step.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || step.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [filterCategory, searchTerm]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(state.steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    dispatch({ type: "REORDER_STEPS", payload: items });
    dispatch({ type: "SAVE_HISTORY_SNAPSHOT" });
  };

  const addStep = useCallback(
    (stepType: StepType) => {
      const newStep: AutomationStep = {
        id: generateStepId(),
        type: stepType,
        name: `${stepType.charAt(0).toUpperCase() + stepType.slice(1)} Step`,
        config: {
          name: `${stepType.charAt(0).toUpperCase() + stepType.slice(1)} Step`,
        } as StepConfig,
        status: "unconfigured",
      };
      dispatch({ type: "ADD_STEP", payload: newStep });
      dispatch({ type: "SAVE_HISTORY_SNAPSHOT" });
      setActiveStep(newStep.id);
    },
    [dispatch]
  );

  const updateStep = useCallback(
    (id: string, config: Partial<StepConfig>, status?: StepStatus) => {
      dispatch({ type: "UPDATE_STEP", payload: { id, config, status } });
      dispatch({ type: "SAVE_HISTORY_SNAPSHOT" });
    },
    [dispatch]
  );

  const removeStep = useCallback(
    (id: string) => {
      dispatch({ type: "REMOVE_STEP", payload: id });
      dispatch({ type: "SAVE_HISTORY_SNAPSHOT" });
      if (activeStep === id) setActiveStep(null);
    },
    [dispatch, activeStep]
  );

  const handleSave = () => {
    dispatch({ type: "SET_STATUS", payload: "active" });
  };

  const handleUndo = () => {
    dispatch({ type: "UNDO" });
  };

  const handleRedo = () => {
    dispatch({ type: "REDO" });
  };

  const handleAddTag = () => {
    if (newTagInput.trim()) {
      dispatch({ type: "ADD_TAG", payload: newTagInput.trim() });
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    dispatch({ type: "REMOVE_TAG", payload: tag });
  };

  const renderStepConfiguration = (step: AutomationStep) => {
    switch (step.type) {
      case "email":
        return (
          <EmailStepConfig
            config={step.config as EmailConfig}
            onUpdate={(config) => updateStep(step.id, config, "configured")}
          />
        );
      case "excel":
        return (
          <ExcelStepConfig
            config={step.config as ExcelConfig}
            onUpdate={(config) => updateStep(step.id, config, "configured")}
          />
        );
      case "database":
        return (
          <DatabaseStepConfig
            config={step.config as DatabaseConfig}
            onUpdate={(config) => updateStep(step.id, config, "configured")}
          />
        );
      default:
        return <Typography>Configuration not available for this step type.</Typography>;
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "background.default" }}>
      {/* Left Sidebar - Components */}
      <Paper sx={{ width: 280, display: "flex", flexDirection: "column", borderRadius: 0 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6" gutterBottom>
            Automation Components
          </Typography>
          <TextField
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            fullWidth
            size="small"
            sx={{ mt: 2 }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="input">Input</MenuItem>
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="output">Output</MenuItem>
            <MenuItem value="logic">Logic</MenuItem>
          </Select>
        </Box>
        <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
          <List dense>
            {filteredSteps.map((step) => (
              <ListItem
                key={step.id}
                button
                onClick={() => addStep(step.id)}
                sx={{
                  mb: 0.5,
                  borderRadius: 1,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                    {step.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={step.name}
                  secondary={step.description}
                  secondaryTypographyProps={{ variant: "caption" }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <Paper square elevation={0} sx={{ p: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              startIcon={viewMode === "flowchart" ? <ListViewIcon /> : <FlowchartIcon />}
              onClick={() => setViewMode(viewMode === "flowchart" ? "list" : "flowchart")}
              size="small"
            >
              {viewMode === "flowchart" ? "List View" : "Flowchart View"}
            </Button>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Tooltip title="Undo">
                <span>
                  <IconButton
                    onClick={handleUndo}
                    disabled={state.historyIndex === 0}
                    size="small"
                  >
                    <UndoIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Redo">
                <span>
                  <IconButton
                    onClick={handleRedo}
                    disabled={state.historyIndex === state.history.length - 1}
                    size="small"
                  >
                    <RedoIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              startIcon={<RobotIcon />}
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              variant="outlined"
              size="small"
            >
              AI Assistant
            </Button>
            <Button
              startIcon={<SaveIcon />}
              onClick={handleSave}
              variant="contained"
              size="small"
            >
              Save Automation
            </Button>
          </Box>
        </Paper>

        {/* Workflow Area */}
        <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Workflow Header */}
            <Paper square elevation={0} sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    placeholder="Automation Name"
                    value={state.name}
                    onChange={(e) => dispatch({ type: "SET_NAME", payload: e.target.value })}
                    fullWidth
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                      style: { fontSize: "1.25rem", fontWeight: "bold" },
                    }}
                  />
                  <TextField
                    placeholder="Description (what does this automation do?)"
                    value={state.description}
                    onChange={(e) =>
                      dispatch({ type: "SET_DESCRIPTION", payload: e.target.value })
                    }
                    fullWidth
                    variant="standard"
                    multiline
                    InputProps={{
                      disableUnderline: true,
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Select
                    value={state.trigger}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_TRIGGER",
                        payload: e.target.value as TriggerType,
                      })
                    }
                    sx={{ minWidth: 200 }}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {getTriggerIcon(selected)}
                        <Typography sx={{ ml: 1 }}>
                          Trigger: {TRIGGER_TYPES.find((t) => t.id === selected)?.name}
                        </Typography>
                      </Box>
                    )}
                  >
                    {TRIGGER_TYPES.map((trigger) => (
                      <MenuItem key={trigger.id} value={trigger.id}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {trigger.icon}
                          <Box sx={{ ml: 2 }}>
                            <Typography>{trigger.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {trigger.description}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {state.trigger === "schedule" && (
                    <Button
                      startIcon={<ScheduleIcon />}
                      onClick={() => setShowScheduleDialog(true)}
                      variant="outlined"
                      size="small"
                    >
                      Schedule
                    </Button>
                  )}
                </Box>
              </Box>
              <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {state.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                    deleteIcon={<CloseIcon fontSize="small" />}
                  />
                ))}
                <TextField
                  placeholder="Add tag..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                  size="small"
                  sx={{ width: 100 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={handleAddTag}>
                          <AddCircleIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Paper>

            {/* Workflow Content */}
            <Box sx={{ flex: 1, overflow: "auto", p: 2, bgcolor: "background.paper" }}>
              {viewMode === "list" ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="steps">
                    {(provided) => (
                      <Box
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                      >
                        {state.steps.length === 0 ? (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "50vh",
                              color: "text.secondary",
                            }}
                          >
                            <HelpIcon sx={{ fontSize: 48, mb: 2 }} />
                            <Typography>No steps added yet</Typography>
                            <Typography variant="caption">
                              Drag components from the left or choose a template
                            </Typography>
                          </Box>
                        ) : (
                          state.steps.map((step, index) => (
                            <Draggable key={step.id} draggableId={step.id} index={index}>
                              {(provided) => (
                                <Paper
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  elevation={1}
                                  sx={{
                                    borderLeft: 4,
                                    borderColor:
                                      activeStep === step.id ? "primary.main" : "divider",
                                    position: "relative",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      p: 1,
                                    }}
                                  >
                                    <IconButton
                                      {...provided.dragHandleProps}
                                      size="small"
                                      sx={{ mr: 1 }}
                                    >
                                      <DragHandleIcon />
                                    </IconButton>
                                    <Box sx={{ mr: 2 }}>{getStepIcon(step.type)}</Box>
                                    <Box sx={{ flex: 1 }}>
                                      <Typography variant="subtitle2">
                                        {step.name}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {step.type}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ mr: 2 }}>
                                      {getStepStatusBadge(step.status)}
                                    </Box>
                                    <Box sx={{ display: "flex", gap: 0.5 }}>
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          setActiveStep(activeStep === step.id ? null : step.id)
                                        }
                                      >
                                        {activeStep === step.id ? (
                                          <ExpandMoreIcon />
                                        ) : (
                                          <ChevronRightIcon />
                                        )}
                                      </IconButton>
                                      <IconButton
                                        size="small"
                                        onClick={() => removeStep(step.id)}
                                      >
                                        <DeleteIcon color="error" />
                                      </IconButton>
                                    </Box>
                                  </Box>
                                  {activeStep === step.id && (
                                    <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
                                      {renderStepConfiguration(step)}
                                    </Box>
                                  )}
                                </Paper>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "text.secondary",
                  }}
                >
                  <FlowchartIcon sx={{ fontSize: 48, mb: 2 }} />
                  <Typography>Flowchart view coming soon</Typography>
                  <Typography variant="caption">Currently showing list view</Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Configuration Panel */}
          {activeStep && (
            <Paper
              sx={{
                width: 320,
                display: "flex",
                flexDirection: "column",
                borderLeft: 1,
                borderColor: "divider",
              }}
            >
              <Box
                sx={{
                  p: 1,
                  borderBottom: 1,
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="subtitle1">Step Configuration</Typography>
                <IconButton size="small" onClick={() => setActiveStep(null)}>
                  <ChevronRightIcon />
                </IconButton>
              </Box>
              <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
                {state.steps.map((step) => {
                  if (step.id === activeStep) {
                    return (
                      <Box key={step.id}>{renderStepConfiguration(step)}</Box>
                    );
                  }
                  return null;
                })}
              </Box>
            </Paper>
          )}
        </Box>
      </Box>

      {/* AI Assistant Panel */}
      {showAIAssistant && (
        <Paper
          sx={{
            width: 320,
            display: "flex",
            flexDirection: "column",
            borderLeft: 1,
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              p: 1,
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="subtitle1" sx={{ display: "flex", alignItems: "center" }}>
              <RobotIcon sx={{ mr: 1 }} /> AI Assistant
            </Typography>
            <IconButton size="small" onClick={() => setShowAIAssistant(false)}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
          <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Suggestions
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {getSuggestions().map((suggestion, index) => (
                  <Paper key={index} sx={{ p: 1.5 }}>
                    <Typography variant="body2">{suggestion.text}</Typography>
                    {suggestion.actionLabel && (
                      <Button size="small" sx={{ mt: 0.5 }}>
                        {suggestion.actionLabel}
                      </Button>
                    )}
                  </Paper>
                ))}
              </Box>
            </Box>
            <Divider />
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Optimization Tips
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {getOptimizationTips().length > 0 ? (
                  getOptimizationTips().map((tip, index) => (
                    <Paper key={index} sx={{ p: 1.5, bgcolor: "info.light" }}>
                      <Typography variant="body2">{tip.text}</Typography>
                    </Paper>
                  ))
                ) : (
                  <Paper sx={{ p: 1.5 }}>
                    <Typography variant="body2">
                      Your workflow looks optimized!
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onClose={() => setShowScheduleDialog(false)}>
        <DialogTitle>Schedule Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Configure when this automation should run automatically.
          </Typography>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Typography variant="body2" gutterBottom>
                Frequency
              </Typography>
              <Select
                value={state.schedule?.frequency || "daily"}
                onChange={(e) =>
                  dispatch({
                    type: "SET_SCHEDULE",
                    payload: {
                      ...state.schedule,
                      frequency: e.target.value as
                        | "once"
                        | "hourly"
                        | "daily"
                        | "weekly"
                        | "monthly",
                    },
                  })
                }
                fullWidth
              >
                <MenuItem value="once">Run Once</MenuItem>
                <MenuItem value="hourly">Hourly</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </Box>
            {state.schedule?.frequency !== "once" &&
              state.schedule?.frequency !== "hourly" && (
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Time
                  </Typography>
                  <TextField
                    type="time"
                    value={state.schedule?.time || "09:00"}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_SCHEDULE",
                        payload: { ...state.schedule, time: e.target.value },
                      })
                    }
                    fullWidth
                  />
                </Box>
              )}
            {state.schedule?.frequency === "weekly" && (
              <Box>
                <Typography variant="body2" gutterBottom>
                  Days of Week
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                    <Chip
                      key={day}
                      label={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]}
                      onClick={() => {
                        const currentDays = state.schedule?.daysOfWeek || [];
                        const newDays = currentDays.includes(day)
                          ? currentDays.filter((d) => d !== day)
                          : [...currentDays, day];
                        dispatch({
                          type: "SET_SCHEDULE",
                          payload: { ...state.schedule, daysOfWeek: newDays },
                        });
                      }}
                      color={
                        state.schedule?.daysOfWeek?.includes(day)
                          ? "primary"
                          : "default"
                      }
                    />
                  ))}
                </Box>
              </Box>
            )}
            {state.schedule?.frequency === "monthly" && (
              <Box>
                <Typography variant="body2" gutterBottom>
                  Day of Month
                </Typography>
                <TextField
                  type="number"
                  inputProps={{ min: 1, max: 31 }}
                  value={state.schedule?.dayOfMonth || 1}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_SCHEDULE",
                      payload: {
                        ...state.schedule,
                        dayOfMonth: parseInt(e.target.value),
                      },
                    })
                  }
                  fullWidth
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowScheduleDialog(false)}>Cancel</Button>
          <Button
            onClick={() => setShowScheduleDialog(false)}
            variant="contained"
          >
            Save Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddAutomation;