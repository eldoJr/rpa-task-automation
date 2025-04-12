import React, { useReducer, useState, useCallback, useMemo } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Button } from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";
import { Textarea } from "@/components/ui/textarea/textarea";
import { Switch } from "@/components/ui/switch/switch";
import { Badge } from "@/components/ui/badge/badge";
import { Separator } from "@/components/ui/separator/separator";
import { ScrollArea } from "@/components/ui/scroll-area/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog/dialog";
import {
  Calendar,
  FileText,
  Settings,
  HelpCircle,
  Trash2,
  GripVertical,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Code,
  Bell,
  BarChart,
  FileCheck,
  Menu,
  PlayCircle,
  Clock,
  Undo,
  Redo,
} from "lucide-react";
import {
  FaPlusCircle,
  FaSave,
  FaClock,
  FaDatabase,
  FaMailBulk,
  FaRobot,
  FaCloudUploadAlt,
  FaExchangeAlt,
  FaUserCog,
} from "react-icons/fa";

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

// Step Configuration Types
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

// Step definition interfaces
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

// State Types
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

// ========== Action Types ==========
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

// ========== Constant Data ==========
const AVAILABLE_STEPS: AvailableStep[] = [
  {
    id: "email",
    name: "Email Integration",
    description: "Process incoming emails or send notifications",
    icon: <FaMailBulk size={20} />,
    category: "input",
  },
  {
    id: "excel",
    name: "Excel Processing",
    description: "Read from or write to Excel spreadsheets",
    icon: <FileText size={20} />,
    category: "processing",
  },
  {
    id: "database",
    name: "Database Query",
    description: "Execute SQL queries or database operations",
    icon: <FaDatabase size={20} />,
    category: "processing",
  },
  {
    id: "ocr",
    name: "OCR Recognition",
    description: "Extract text from images or documents",
    icon: <FileCheck size={20} />,
    category: "input",
  },
  {
    id: "api",
    name: "API Request",
    description: "Make HTTP requests to external services",
    icon: <Code size={20} />,
    category: "processing",
  },
  {
    id: "condition",
    name: "Condition",
    description: "Add branching logic to your workflow",
    icon: <AlertCircle size={20} />,
    category: "logic",
  },
  {
    id: "notification",
    name: "Send Notification",
    description: "Alert users via email, Slack, or other channels",
    icon: <Bell size={20} />,
    category: "output",
  },
  {
    id: "transform",
    name: "Data Transformation",
    description: "Format, map, or clean data in your workflow",
    icon: <FaExchangeAlt size={20} />,
    category: "processing",
  },
  {
    id: "approval",
    name: "Approval Request",
    description: "Request approval from specified users",
    icon: <FaUserCog size={20} />,
    category: "logic",
  },
  {
    id: "delay",
    name: "Time Delay",
    description: "Pause workflow execution for a specified time",
    icon: <Clock size={20} />,
    category: "logic",
  },
];

const TRIGGER_TYPES: TriggerTypeOption[] = [
  {
    id: "schedule",
    name: "Schedule Based",
    description: "Run on a defined schedule",
    icon: <FaClock size={16} />,
    category: "timer",
  },
  {
    id: "email",
    name: "Email Trigger",
    description: "Triggered when emails arrive",
    icon: <FaMailBulk size={16} />,
    category: "event",
  },
  {
    id: "database",
    name: "Database Change",
    description: "Triggered on database updates",
    icon: <FaDatabase size={16} />,
    category: "event",
  },
  {
    id: "calendar",
    name: "Calendar Event",
    description: "Triggered by calendar events",
    icon: <Calendar size={16} />,
    category: "event",
  },
  {
    id: "webhook",
    name: "Webhook",
    description: "Triggered by external HTTP requests",
    icon: <Code size={16} />,
    category: "event",
  },
  {
    id: "manual",
    name: "Manual Trigger",
    description: "Run on demand by users",
    icon: <PlayCircle size={16} />,
    category: "manual",
  },
  {
    id: "file-upload",
    name: "File Upload",
    description: "Triggered when files are uploaded",
    icon: <FaCloudUploadAlt size={16} />,
    category: "event",
  },
];

const TEMPLATES: AutomationTemplate[] = [
  {
    id: "data-extraction",
    name: "Data Extraction from Emails",
    description:
      "Extract information from incoming emails and save to spreadsheets",
    category: "Data Processing",
    popularity: 87,
    tags: ["emails", "data extraction", "spreadsheets"],
    trigger: "email",
    steps: [
      {
        id: "step-1",
        type: "email",
        name: "Monitor Email Inbox",
        status: "configured",
        config: {
          name: "Monitor Email Inbox",
          folder: "Inbox",
          filter: "unread",
          includeAttachments: true,
          markAsRead: true,
        } as EmailConfig,
      },
      {
        id: "step-2",
        type: "ocr",
        name: "Extract Document Data",
        status: "configured",
        config: {
          name: "Extract Document Data",
          dataPoints: ["invoice_number", "total_amount", "date"],
          confidence: 0.8,
        } as OCRConfig,
      },
      {
        id: "step-3",
        type: "excel",
        name: "Update Spreadsheet",
        status: "configured",
        config: {
          name: "Update Spreadsheet",
          file: "invoices.xlsx",
          sheet: "Processed",
          headerRow: true,
        } as ExcelConfig,
      },
      {
        id: "step-4",
        type: "notification",
        name: "Notify Team",
        status: "configured",
        config: {
          name: "Notify Team",
          type: "email",
          recipients: ["finance@company.com"],
          subject: "New Invoice Processed",
        } as NotificationConfig,
      },
    ],
  },
  {
    id: "approval-workflow",
    name: "Document Approval Process",
    description: "Route documents for approval with notifications and tracking",
    category: "Business Process",
    popularity: 92,
    tags: ["approval", "documents", "notifications"],
    trigger: "file-upload",
    steps: [
      {
        id: "step-1",
        type: "ocr",
        name: "Extract Document Info",
        status: "configured",
        config: {
          name: "Extract Document Info",
          dataPoints: ["document_type", "amount", "requester"],
        } as OCRConfig,
      },
      {
        id: "step-2",
        type: "condition",
        name: "Check Amount Threshold",
        status: "configured",
        config: {
          name: "Check Amount Threshold",
          conditions: [
            {
              field: "amount",
              operator: ">",
              value: "5000",
            },
          ],
          logicalOperator: "and",
        } as ConditionConfig,
      },
      {
        id: "step-3",
        type: "approval",
        name: "Request Manager Approval",
        status: "configured",
        config: {
          name: "Request Manager Approval",
          approvers: ["manager@company.com"],
          timeoutHours: 48,
          reminderHours: 24,
        } as ApprovalConfig,
      },
      {
        id: "step-4",
        type: "database",
        name: "Update Approval Status",
        status: "configured",
        config: {
          name: "Update Approval Status",
          connection: "documentDB",
          query: "UPDATE documents SET status = ? WHERE id = ?",
        } as DatabaseConfig,
      },
      {
        id: "step-5",
        type: "notification",
        name: "Send Confirmation",
        status: "configured",
        config: {
          name: "Send Confirmation",
          type: "email",
          recipients: ["${requester.email}"],
          subject: "Document Approval Status",
        } as NotificationConfig,
      },
    ],
  },
  {
    id: "invoice-processing",
    name: "Invoice Processing",
    description:
      "Automatically process and record invoices from various sources",
    category: "Finance",
    popularity: 78,
    tags: ["finance", "invoices", "accounting"],
    trigger: "email",
    steps: [
      {
        id: "step-1",
        type: "email",
        name: "Monitor Invoice Emails",
        status: "configured",
        config: {
          name: "Monitor Invoice Emails",
          folder: "Invoices",
          filter: "subject:invoice OR subject:receipt",
          includeAttachments: true,
        } as EmailConfig,
      },
      {
        id: "step-2",
        type: "ocr",
        name: "Extract Invoice Details",
        status: "configured",
        config: {
          name: "Extract Invoice Details",
          dataPoints: [
            "invoice_number",
            "date",
            "amount",
            "vendor",
            "due_date",
          ],
          templateId: "invoice-template-1",
        } as OCRConfig,
      },
      {
        id: "step-3",
        type: "condition",
        name: "Check Amount Threshold",
        status: "configured",
        config: {
          name: "Check Amount Threshold",
          conditions: [
            {
              field: "amount",
              operator: ">",
              value: "1000",
            },
          ],
          logicalOperator: "and",
        } as ConditionConfig,
      },
      {
        id: "step-4",
        type: "database",
        name: "Record in Accounting System",
        status: "configured",
        config: {
          name: "Record in Accounting System",
          connection: "accounting_db",
          query:
            "INSERT INTO invoices (number, date, amount, vendor, due_date) VALUES (?, ?, ?, ?, ?)",
          parameters: {
            number: "${invoice_number}",
            date: "${date}",
            amount: "${amount}",
            vendor: "${vendor}",
            due_date: "${due_date}",
          },
        } as DatabaseConfig,
      },
    ],
  },
  {
    id: "customer-onboarding",
    name: "Customer Onboarding",
    description:
      "Streamline the customer onboarding process with automated steps",
    category: "Customer Service",
    popularity: 95,
    tags: ["onboarding", "customer", "welcome"],
    trigger: "database",
    steps: [
      {
        id: "step-1",
        type: "database",
        name: "Get New Customer Data",
        status: "configured",
        config: {
          name: "Get New Customer Data",
          connection: "customers_db",
          query: "SELECT * FROM customers WHERE status = 'new'",
        } as DatabaseConfig,
      },
      {
        id: "step-2",
        type: "notification",
        name: "Send Welcome Email",
        status: "configured",
        config: {
          name: "Send Welcome Email",
          type: "email",
          recipients: ["${customer.email}"],
          template: "welcome-template",
        } as NotificationConfig,
      },
      {
        id: "step-3",
        type: "api",
        name: "Create Account in CRM",
        status: "configured",
        config: {
          name: "Create Account in CRM",
          endpoint: "https://api.crm.example.com/accounts",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: '{"name": "${customer.name}", "email": "${customer.email}", "plan": "${customer.plan}"}',
        } as APIConfig,
      },
      {
        id: "step-4",
        type: "delay",
        name: "Wait 3 Days",
        status: "configured",
        config: {
          name: "Wait 3 Days",
          duration: 3,
          timeUnit: "days",
        } as DelayConfig,
      },
      {
        id: "step-5",
        type: "notification",
        name: "Send Follow-up Email",
        status: "configured",
        config: {
          name: "Send Follow-up Email",
          type: "email",
          recipients: ["${customer.email}"],
          template: "follow-up-template",
        } as NotificationConfig,
      },
    ],
  },
];

// ========== Utility Functions ==========
const generateStepId = (): string =>
  `step-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const getStepIcon = (type: StepType): React.ReactNode => {
  const step = AVAILABLE_STEPS.find((s) => s.id === type);
  return step?.icon || <Settings size={20} />;
};

const getTriggerIcon = (type: TriggerType): React.ReactNode => {
  const trigger = TRIGGER_TYPES.find((t) => t.id === type);
  return trigger?.icon || <Settings size={16} />;
};

const getStepStatusBadge = (status: StepStatus) => {
  switch (status) {
    case "configured":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-100"
        >
          Configured
        </Badge>
      );
    case "partial":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-100"
        >
          Partial
        </Badge>
      );
    case "error":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-100"
        >
          Error
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-700 border-gray-100"
        >
          Not Configured
        </Badge>
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
      return {
        ...state,
        steps: newSteps,
      };
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
      // Create a deep copy of the current steps
      const stepsCopy = JSON.parse(JSON.stringify(state.steps));

      // Calculate the new history by removing any future steps (if we're in the middle of the history)
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
  const { name, description, steps, trigger } = state;

  const getSuggestions = useCallback((): AIAssistantSuggestion[] => {
    const suggestions: AIAssistantSuggestion[] = [];

    // Check if any steps are added
    if (steps.length === 0) {
      suggestions.push({
        text: "Your workflow is empty. Start by adding steps from the component panel.",
      });
    }

    // Suggest based on automation name
    if (name.toLowerCase().includes("email")) {
      suggestions.push({
        text: "This automation seems email-related. Consider using an Email trigger or step.",
      });
    }

    // Suggest based on description
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

    // Check for missing notifications
    if (
      steps.length > 1 &&
      !steps.some((step) => step.type === "notification")
    ) {
      suggestions.push({
        text: "Consider adding a notification step to alert users about the workflow results.",
      });
    }

    // Check for complexity and suggest conditions
    if (steps.length > 2 && !steps.some((step) => step.type === "condition")) {
      suggestions.push({
        text: "Your workflow is getting complex. Add conditional logic to handle different scenarios.",
      });
    }

    // Step sequence recommendations
    const stepTypes = steps.map((step) => step.type);

    // Data processing flow recommendations
    if (
      stepTypes.includes("database") &&
      stepTypes.indexOf("database") < stepTypes.indexOf("excel")
    ) {
      suggestions.push({
        text: "You're extracting data from a database before using Excel. Consider adding a transformation step in between.",
      });
    }

    // If automation seems empty or basic, suggest templates
    if (steps.length <= 1) {
      suggestions.push({
        text: "Starting from a template can save time. Choose one that matches your needs.",
        actionLabel: "Browse Templates",
      });
    }

    // If no specific suggestions match, give general advice
    if (suggestions.length === 0) {
      suggestions.push({
        text: "Your automation is taking shape! Consider how users will be notified about outcomes.",
      });
    }

    return suggestions;
  }, [name, description, steps]);

  const getOptimizationTips = useCallback((): AIAssistantSuggestion[] => {
    const tips: AIAssistantSuggestion[] = [];

    // Check for error handling
    if (steps.length > 2 && !steps.some((step) => step.type === "condition")) {
      tips.push({
        text: "Add error handling with conditional steps to make your workflow more robust.",
      });
    }

    // Check for notification patterns
    const notificationSteps = steps.filter(
      (step) => step.type === "notification"
    );
    if (notificationSteps.length > 1) {
      tips.push({
        text: "You have multiple notification steps. Consider consolidating them for clarity.",
      });
    }

    // Check for potential bottlenecks
    if (
      steps.some((step) => step.type === "api") &&
      !steps.some((step) => step.type === "condition")
    ) {
      tips.push({
        text: "API calls might fail. Add conditional logic to handle failed API responses.",
      });
    }

    // Check for linear vs branched workflow
    if (steps.length > 3 && !steps.some((step) => step.type === "condition")) {
      tips.push({
        text: "Your workflow is linear. Consider adding branching logic for different scenarios.",
      });
    }

    return tips;
  }, [steps]);

  return { getSuggestions, getOptimizationTips };
};

// ========== Main Component ==========
const AddAutomation: React.FC = () => {
  const [state, dispatch] = useReducer(automationReducer, initialState);
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { getSuggestions, getOptimizationTips } = useAIAssistant(state);
  const [viewMode, setViewMode] = useState<"flowchart" | "list">("list");
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");

  // Filtered Steps
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

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    if (!searchTerm) return TEMPLATES;

    return TEMPLATES.filter(
      (template) =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [searchTerm]);

  // Event Handlers
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
      if (activeStep === id) {
        setActiveStep(null);
      }
    },
    [dispatch, activeStep]
  );

  const loadTemplate = useCallback(
    (template: AutomationTemplate) => {
      dispatch({ type: "LOAD_TEMPLATE", payload: { template } });
      dispatch({ type: "SAVE_HISTORY_SNAPSHOT" });
    },
    [dispatch]
  );

  const handleSave = () => {
    // Save logic would go here
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

  // Render Functions
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
      case "api":
        return (
          <APIStepConfig
            config={step.config as APIConfig}
            onUpdate={(config) => updateStep(step.id, config, "configured")}
          />
        );
      case "condition":
        return (
          <ConditionStepConfig
            config={step.config as ConditionConfig}
            onUpdate={(config) => updateStep(step.id, config, "configured")}
          />
        );
      case "notification":
        return (
          <NotificationStepConfig
            config={step.config as NotificationConfig}
            onUpdate={(config) => updateStep(step.id, config, "configured")}
          />
        );
      case "transform":
        return (
          <TransformStepConfig
            config={step.config as TransformConfig}
            onUpdate={(config) => updateStep(step.id, config, "configured")}
          />
        );
      case "approval":
        return (
          <ApprovalStepConfig
            config={step.config as ApprovalConfig}
            onUpdate={(config) => updateStep(step.id, config, "configured")}
          />
        );
      case "delay":
        return (
          <DelayStepConfig
            config={step.config as DelayConfig}
            onUpdate={(config) => updateStep(step.id, config, "configured")}
          />
        );
      default:
        return <div>Configuration not available for this step type.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Components */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-lg">Automation Components</h2>
          <div className="mt-2">
            <Input
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="mt-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="input">Input</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="output">Output</SelectItem>
                <SelectItem value="logic">Logic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <ScrollArea className="flex-1 p-2">
          <div className="grid grid-cols-1 gap-2">
            {filteredSteps.map((step) => (
              <div
                key={step.id}
                className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer flex items-center"
                onClick={() => addStep(step.id)}
              >
                <div className="mr-3">{step.icon}</div>
                <div>
                  <div className="font-medium">{step.name}</div>
                  <div className="text-xs text-gray-500">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setViewMode(viewMode === "flowchart" ? "list" : "flowchart")
              }
            >
              {viewMode === "flowchart" ? (
                <>
                  <Menu size={16} className="mr-2" />
                  List View
                </>
              ) : (
                <>
                  <BarChart size={16} className="mr-2" />
                  Flowchart View
                </>
              )}
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                disabled={state.historyIndex === 0}
              >
                <Undo size={16} className="mr-2" />
                Undo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRedo}
                disabled={state.historyIndex === state.history.length - 1}
              >
                <Redo size={16} className="mr-2" />
                Redo
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAIAssistant(!showAIAssistant)}
            >
              <FaRobot size={16} className="mr-2" />
              AI Assistant
            </Button>
            <Button variant="default" size="sm" onClick={handleSave}>
              <FaSave size={16} className="mr-2" />
              Save Automation
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Workflow Area */}
          <div
            className={`${
              activeStep ? "w-2/3" : "w-full"
            } border-r border-gray-200 flex flex-col`}
          >
            {/* Workflow Header */}
            <div className="bg-white p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <Input
                    placeholder="Automation Name"
                    value={state.name}
                    onChange={(e) =>
                      dispatch({ type: "SET_NAME", payload: e.target.value })
                    }
                    className="text-xl font-bold border-none shadow-none focus-visible:ring-0"
                  />
                  <Textarea
                    placeholder="Description (what does this automation do?)"
                    value={state.description}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_DESCRIPTION",
                        payload: e.target.value,
                      })
                    }
                    className="mt-1 border-none shadow-none focus-visible:ring-0 resize-none"
                    rows={2}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Select
                    value={state.trigger}
                    onValueChange={(value) =>
                      dispatch({
                        type: "SET_TRIGGER",
                        payload: value as TriggerType,
                      })
                    }
                  >
                    <SelectTrigger className="w-[200px]">
                      <div className="flex items-center">
                        {getTriggerIcon(state.trigger)}
                        <span className="ml-2">
                          Trigger:{" "}
                          {
                            TRIGGER_TYPES.find((t) => t.id === state.trigger)
                              ?.name
                          }
                        </span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {TRIGGER_TYPES.map((trigger) => (
                        <SelectItem key={trigger.id} value={trigger.id}>
                          <div className="flex items-center">
                            {trigger.icon}
                            <div className="ml-2">
                              <div>{trigger.name}</div>
                              <div className="text-xs text-gray-500">
                                {trigger.description}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {state.trigger === "schedule" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowScheduleDialog(true)}
                    >
                      <Settings size={16} className="mr-2" />
                      Schedule Settings
                    </Button>
                  )}
                </div>
              </div>
              <div className="mt-2 flex items-center flex-wrap gap-2">
                {state.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="flex items-center"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <Trash2 size={12} />
                    </button>
                  </Badge>
                ))}
                <div className="flex items-center">
                  <Input
                    placeholder="Add tag..."
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    className="h-8 w-24"
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                  />
                  <Button variant="ghost" size="sm" onClick={handleAddTag}>
                    <FaPlusCircle size={14} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Workflow Content */}
            <div className="flex-1 overflow-auto p-4 bg-gray-50">
              {viewMode === "list" ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="steps">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-3"
                      >
                        {state.steps.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <HelpCircle size={48} className="mb-4" />
                            <p>No steps added yet</p>
                            <p className="text-sm">
                              Drag components from the left or choose a template
                            </p>
                          </div>
                        ) : (
                          state.steps.map((step, index) => (
                            <Draggable
                              key={step.id}
                              draggableId={step.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`bg-white rounded-md border ${
                                    activeStep === step.id
                                      ? "border-blue-500 ring-2 ring-blue-200"
                                      : "border-gray-200"
                                  } shadow-sm`}
                                >
                                  <div className="flex items-center p-3">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="mr-2 text-gray-400 hover:text-gray-600 cursor-move"
                                    >
                                      <GripVertical size={16} />
                                    </div>
                                    <div className="flex items-center mr-3">
                                      {getStepIcon(step.type)}
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium">
                                        {step.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {step.type}
                                      </div>
                                    </div>
                                    <div className="mr-3">
                                      {getStepStatusBadge(step.status)}
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          setActiveStep(
                                            activeStep === step.id
                                              ? null
                                              : step.id
                                          )
                                        }
                                      >
                                        {activeStep === step.id ? (
                                          <ChevronDown size={16} />
                                        ) : (
                                          <ChevronRight size={16} />
                                        )}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeStep(step.id)}
                                      >
                                        <Trash2
                                          size={16}
                                          className="text-red-500"
                                        />
                                      </Button>
                                    </div>
                                  </div>
                                  {activeStep === step.id && (
                                    <div className="p-4 border-t border-gray-200">
                                      {renderStepConfiguration(step)}
                                    </div>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-400">
                    <BarChart size={48} className="mx-auto mb-4" />
                    <p>Flowchart view coming soon</p>
                    <p className="text-sm">Currently showing list view</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Configuration Panel */}
          {activeStep && (
            <div className="w-1/3 bg-white border-l border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Step Configuration</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveStep(null)}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
              <ScrollArea className="flex-1 p-4">
                {state.steps.map((step) => {
                  if (step.id === activeStep) {
                    return (
                      <div key={step.id}>{renderStepConfiguration(step)}</div>
                    );
                  }
                  return null;
                })}
              </ScrollArea>
            </div>
          )}
        </div>
      </div>

      {/* AI Assistant Panel */}
      {showAIAssistant && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-medium flex items-center">
              <FaRobot size={16} className="mr-2" />
              AI Assistant
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAIAssistant(false)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Suggestions</h4>
                <div className="space-y-2">
                  {getSuggestions().map((suggestion, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm">{suggestion.text}</p>
                      {suggestion.actionLabel && (
                        <Button
                          variant="link"
                          size="sm"
                          className="mt-1 p-0 h-auto"
                        >
                          {suggestion.actionLabel}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Optimization Tips</h4>
                <div className="space-y-2">
                  {getOptimizationTips().length > 0 ? (
                    getOptimizationTips().map((tip, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-md">
                        <p className="text-sm">{tip.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm">Your workflow looks optimized!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Settings</DialogTitle>
            <DialogDescription>
              Configure when this automation should run automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Frequency
              </label>
              <Select
                value={state.schedule?.frequency || "daily"}
                onValueChange={(value) =>
                  dispatch({
                    type: "SET_SCHEDULE",
                    payload: {
                      ...state.schedule,
                      frequency: value as
                        | "once"
                        | "hourly"
                        | "daily"
                        | "weekly"
                        | "monthly",
                    },
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Run Once</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {state.schedule?.frequency !== "once" &&
              state.schedule?.frequency !== "hourly" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <Input
                    type="time"
                    value={state.schedule?.time || "09:00"}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_SCHEDULE",
                        payload: { ...state.schedule, time: e.target.value },
                      })
                    }
                  />
                </div>
              )}
            {state.schedule?.frequency === "weekly" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Days of Week
                </label>
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                    <Button
                      key={day}
                      variant={
                        state.schedule?.daysOfWeek?.includes(day)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
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
                    >
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {state.schedule?.frequency === "monthly" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Day of Month
                </label>
                <Input
                  type="number"
                  min="1"
                  max="31"
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
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowScheduleDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowScheduleDialog(false)}>
              Save Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Step Configuration Components (simplified versions for brevity)
const EmailStepConfig: React.FC<{
  config: EmailConfig;
  onUpdate: (config: EmailConfig) => void;
}> = ({ config, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Folder</label>
        <Input
          value={config.folder}
          onChange={(e) => onUpdate({ ...config, folder: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Filter</label>
        <Input
          value={config.filter}
          onChange={(e) => onUpdate({ ...config, filter: e.target.value })}
          placeholder="e.g. subject:invoice, from:sales@example.com"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="includeAttachments"
          checked={config.includeAttachments || false}
          onCheckedChange={(checked) =>
            onUpdate({ ...config, includeAttachments: checked })
          }
        />
        <label htmlFor="includeAttachments" className="text-sm font-medium">
          Include Attachments
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="markAsRead"
          checked={config.markAsRead || false}
          onCheckedChange={(checked) =>
            onUpdate({ ...config, markAsRead: checked })
          }
        />
        <label htmlFor="markAsRead" className="text-sm font-medium">
          Mark as Read
        </label>
      </div>
    </div>
  );
};

// Similar simplified components would be defined for other step types...
const ExcelStepConfig: React.FC<{
  config: ExcelConfig;
  onUpdate: (config: ExcelConfig) => void;
}> = ({ config, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">File Path</label>
        <Input
          value={config.file}
          onChange={(e) => onUpdate({ ...config, file: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Sheet Name</label>
        <Input
          value={config.sheet}
          onChange={(e) => onUpdate({ ...config, sheet: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Range (optional)
        </label>
        <Input
          value={config.range || ""}
          onChange={(e) => onUpdate({ ...config, range: e.target.value })}
          placeholder="e.g. A1:D100"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="headerRow"
          checked={config.headerRow || false}
          onCheckedChange={(checked) =>
            onUpdate({ ...config, headerRow: checked })
          }
        />
        <label htmlFor="headerRow" className="text-sm font-medium">
          First row contains headers
        </label>
      </div>
    </div>
  );
};

const DatabaseStepConfig: React.FC<{
  config: DatabaseConfig;
  onUpdate: (config: DatabaseConfig) => void;
}> = ({ config, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Connection</label>
        <Select
          value={config.connection}
          onValueChange={(value) => onUpdate({ ...config, connection: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select connection" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="production_db">Production Database</SelectItem>
            <SelectItem value="analytics_db">Analytics Database</SelectItem>
            <SelectItem value="backup_db">Backup Database</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Query</label>
        <Textarea
          value={config.query}
          onChange={(e) => onUpdate({ ...config, query: e.target.value })}
          rows={4}
        />
      </div>
    </div>
  );
};

// Similar components would be defined for APIConfig, ConditionConfig, etc...

export default AddAutomation;
