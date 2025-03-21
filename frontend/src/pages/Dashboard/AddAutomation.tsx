import React, { useReducer, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip/tooltip";
import { Badge } from "@/components/ui/badge/badge";
import { Separator } from "@/components/ui/separator/separator";
import {
  Calendar,
  FileText,
  Settings,
  HelpCircle,
  Trash2,
  GripVertical,
  AlertCircle,
  Copy,
  Share2,
} from "lucide-react";
import {
  FaPlusCircle,
  FaSave,
  FaClock,
  FaDatabase,
  FaMailBulk,
} from "react-icons/fa";
// Types
type StepType = "email" | "excel" | "database" | "ocr" | "api" | "condition";
type TriggerType = "schedule" | "email" | "database" | "calendar";

interface EmailConfig {
  folder: string;
  filter: string;
}

interface ExcelConfig {
  file: string;
  sheet: string;
}

interface OCRConfig {
  dataPoints: string[];
}

interface DatabaseConfig {
  query: string;
  connection: string;
}

interface APIConfig {
  endpoint: string;
  method: string;
  headers: Record<string, string>;
}

interface ConditionConfig {
  field: string;
  operator: string;
  value: string;
}

type StepConfig =
  | EmailConfig
  | ExcelConfig
  | OCRConfig
  | DatabaseConfig
  | APIConfig
  | ConditionConfig
  | Record<string, unknown>;

interface AutomationStep {
  id: string;
  type: StepType;
  name: string;
  config: StepConfig;
}

interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  steps: AutomationStep[];
}

interface AvailableStep {
  id: StepType;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface TriggerTypeOption {
  id: TriggerType;
  name: string;
  description: string;
  icon: React.ReactNode;
}

// State Types
interface AutomationState {
  name: string;
  description: string;
  steps: AutomationStep[];
  trigger: TriggerType;
  isActive: boolean;
  selectedTemplate: string;
}

// Action Types
type AutomationAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_TRIGGER"; payload: TriggerType }
  | { type: "SET_ACTIVE"; payload: boolean }
  | { type: "ADD_STEP"; payload: AutomationStep }
  | { type: "REMOVE_STEP"; payload: string }
  | { type: "REORDER_STEPS"; payload: AutomationStep[] }
  | { type: "LOAD_TEMPLATE"; payload: { template: AutomationTemplate } }
  | { type: "RESET" };

// Constant Data
const AVAILABLE_STEPS: AvailableStep[] = [
  {
    id: "email",
    name: "Email Integration",
    description: "Process incoming emails or send notifications",
    icon: <FaMailBulk size={20} />,
  },
  {
    id: "excel",
    name: "Excel Processing",
    description: "Read from or write to Excel spreadsheets",
    icon: <FileText size={20} />,
  },
  {
    id: "database",
    name: "Database Query",
    description: "Execute SQL queries or database operations",
    icon: <FaDatabase size={20} />,
  },
  {
    id: "ocr",
    name: "OCR Recognition",
    description: "Extract text from images or documents",
    icon: <FileText size={20} />,
  },
  {
    id: "api",
    name: "API Request",
    description: "Make HTTP requests to external services",
    icon: <Settings size={20} />,
  },
  {
    id: "condition",
    name: "Condition",
    description: "Add branching logic to your workflow",
    icon: <AlertCircle size={20} />,
  },
];

const TRIGGER_TYPES: TriggerTypeOption[] = [
  {
    id: "schedule",
    name: "Schedule Based",
    description: "Run on a defined schedule",
    icon: <FaClock size={16} />,
  },
  {
    id: "email",
    name: "Email Trigger",
    description: "Triggered when emails arrive",
    icon: <FaMailBulk size={16} />,
  },
  {
    id: "database",
    name: "Database Change",
    description: "Triggered on database updates",
    icon: <FaDatabase size={16} />,
  },
  {
    id: "calendar",
    name: "Calendar Event",
    description: "Triggered by calendar events",
    icon: <Calendar size={16} />,
  },
];

const TEMPLATES: AutomationTemplate[] = [
  {
    id: "data-extraction",
    name: "Data Extraction from Emails",
    description:
      "Extract information from incoming emails and save to spreadsheets",
    steps: [
      {
        id: "step-1",
        type: "email",
        name: "Fetch Emails",
        config: { folder: "Inbox", filter: "unread" } as EmailConfig,
      },
      {
        id: "step-2",
        type: "ocr",
        name: "Extract Data",
        config: {
          dataPoints: ["invoice_number", "total_amount", "date"],
        } as OCRConfig,
      },
      {
        id: "step-3",
        type: "excel",
        name: "Update Spreadsheet",
        config: { file: "invoices.xlsx", sheet: "Processed" } as ExcelConfig,
      },
    ],
  },
  {
    id: "form-filling",
    name: "Automated Form Filling",
    description: "Automatically fill forms using data from various sources",
    steps: [
      {
        id: "step-1",
        type: "database",
        name: "Fetch Customer Data",
        config: {
          connection: "customers_db",
          query: "SELECT * FROM customers WHERE status = 'pending'",
        } as DatabaseConfig,
      },
      {
        id: "step-2",
        type: "api",
        name: "Submit Form Data",
        config: {
          endpoint: "https://api.example.com/forms",
          method: "POST",
          headers: { "Content-Type": "application/json" },
        } as APIConfig,
      },
    ],
  },
  {
    id: "invoice-processing",
    name: "Invoice Processing",
    description:
      "Automatically process and record invoices from various sources",
    steps: [
      {
        id: "step-1",
        type: "email",
        name: "Monitor Invoice Emails",
        config: {
          folder: "Invoices",
          filter: "subject:invoice OR subject:receipt",
        } as EmailConfig,
      },
      {
        id: "step-2",
        type: "ocr",
        name: "Extract Invoice Details",
        config: {
          dataPoints: [
            "invoice_number",
            "date",
            "amount",
            "vendor",
            "due_date",
          ],
        } as OCRConfig,
      },
      {
        id: "step-3",
        type: "condition",
        name: "Check Amount Threshold",
        config: {
          field: "amount",
          operator: ">",
          value: "1000",
        } as ConditionConfig,
      },
      {
        id: "step-4",
        type: "database",
        name: "Record in Accounting System",
        config: {
          connection: "accounting_db",
          query: "INSERT INTO invoices VALUES (?, ?, ?, ?, ?)",
        } as DatabaseConfig,
      },
    ],
  },
];

// Reducer Function
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
    case "SET_ACTIVE":
      return { ...state, isActive: action.payload };
    case "ADD_STEP":
      return { ...state, steps: [...state.steps, action.payload] };
    case "REMOVE_STEP":
      return {
        ...state,
        steps: state.steps.filter((step) => step.id !== action.payload),
      };
    case "REORDER_STEPS":
      return { ...state, steps: action.payload };
    case "LOAD_TEMPLATE":
      return {
        ...state,
        name: action.payload.template.name,
        description: action.payload.template.description,
        steps: action.payload.template.steps,
        selectedTemplate: action.payload.template.id,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

// Initial State
const initialState: AutomationState = {
  name: "",
  description: "",
  steps: [],
  trigger: "schedule",
  isActive: true,
  selectedTemplate: "",
};

// Custom Hooks
const useAIAssistant = (
  automationName: string,
  automationDescription: string
) => {
  const getSuggestions = () => {
    const suggestions = [];

    if (automationName.toLowerCase().includes("email")) {
      suggestions.push(
        "Start with an Email Trigger to monitor incoming messages"
      );
    }

    if (automationDescription.toLowerCase().includes("extract")) {
      suggestions.push("Add OCR Recognition to extract text from documents");
    }

    if (automationDescription.toLowerCase().includes("excel")) {
      suggestions.push("Include Excel Processing to update your spreadsheets");
    }

    suggestions.push(
      "Consider adding a condition to handle different scenarios"
    );

    return suggestions;
  };

  return { getSuggestions };
};

// Component Functions
const findStepById = (id: StepType): AvailableStep | undefined => {
  return AVAILABLE_STEPS.find((step) => step.id === id);
};

const findTemplateById = (id: string): AutomationTemplate | undefined => {
  return TEMPLATES.find((template) => template.id === id);
};

// Main Component
const AddAutomation: React.FC = () => {
  const [state, dispatch] = useReducer(automationReducer, initialState);
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(false);
  const { getSuggestions } = useAIAssistant(state.name, state.description);

  // Event Handlers
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(state.steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    dispatch({ type: "REORDER_STEPS", payload: items });
  };

  const addStep = (stepType: StepType) => {
    const stepDefinition = findStepById(stepType);
    if (!stepDefinition) return;

    const newStep: AutomationStep = {
      id: `step-${Date.now()}`,
      type: stepType,
      name: stepDefinition.name,
      config: {},
    };

    dispatch({ type: "ADD_STEP", payload: newStep });
  };

  const removeStep = (stepId: string) => {
    dispatch({ type: "REMOVE_STEP", payload: stepId });
  };

  const loadTemplate = (templateId: string) => {
    const template = findTemplateById(templateId);
    if (!template) return;

    dispatch({ type: "LOAD_TEMPLATE", payload: { template } });
  };

  const toggleAIAssistant = () => {
    setShowAIAssistant(!showAIAssistant);
  };

  const saveAutomation = () => {
    const automation = {
      name: state.name,
      description: state.description,
      trigger: state.trigger,
      isActive: state.isActive,
      steps: state.steps,
    };

    console.log("Saving automation:", automation);
    alert("Automation saved successfully!");
  };

  // UI Component: Step Card
  const StepCard = ({
    step,
    index,
    onRemove,
  }: {
    step: AutomationStep;
    index: number;
    onRemove: () => void;
  }) => (
    <Card className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Left Side: Step Details */}
          <div className="flex items-center gap-3">
            {/* Drag Handle and Step Number */}
            <div className="flex flex-col items-center">
              <GripVertical className="h-5 w-5 text-gray-300 cursor-move hover:text-gray-500 transition-colors" />
              <Badge
                variant="outline"
                className="mt-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-100"
              >
                {index + 1}
              </Badge>
            </div>

            {/* Step Name and Type */}
            <div>
              <h4 className="font-semibold text-gray-800">{step.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className="text-xs bg-blue-100 text-blue-700"
                >
                  {step.type}
                </Badge>
                {Object.keys(step.config).length > 0 && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-green-50 text-green-700 border-green-100"
                  >
                    Configured
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Action Buttons */}
          <div className="flex gap-2">
            {/* Configure Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-white border border-gray-200 shadow-sm">
                  Configure step
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Remove Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    onClick={onRemove}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-white border border-gray-200 shadow-sm">
                  Remove step
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Create New Automation</h1>
          <p className="text-gray-500 mt-1">
            Design a custom workflow to automate your business processes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={toggleAIAssistant}
            className="gap-2"
          >
            <HelpCircle size={16} />
            AI Assistant {showAIAssistant ? "ON" : "OFF"}
          </Button>
          <Button variant="outline" className="gap-2">
            <Copy size={16} />
            Duplicate
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 size={16} />
            Share
          </Button>
          <Button
            onClick={saveAutomation}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <FaSave size={16} />
            Save Automation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar - Available Components */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Settings size={18} />
                Components
              </CardTitle>
              <CardDescription>
                Add steps to build your automation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {AVAILABLE_STEPS.map((step) => (
                <Button
                  key={step.id}
                  variant="outline"
                  className="w-full justify-start text-left hover:bg-blue-50 transition-colors group"
                  onClick={() => addStep(step.id)}
                >
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-3">
                      <div className="text-blue-600 bg-blue-50 p-2 rounded-md">
                        {step.icon}
                      </div>
                      <div>
                        <div className="font-medium">{step.name}</div>
                        <div className="text-xs text-gray-500">
                          {step.description}
                        </div>
                      </div>
                    </div>
                    <FaPlusCircle
                      size={16}
                      className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </Button>
              ))}
            </CardContent>
            <Separator />
            <CardFooter className="pt-4">
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">Templates</h3>
                  <Badge variant="outline" className="text-xs">
                    Save Time
                  </Badge>
                </div>
                <Select
                  value={state.selectedTemplate}
                  onValueChange={loadTemplate}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Load Template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATES.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardFooter>
          </Card>

          {/* Documentation Card */}
          <Card className="bg-gray-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-gray-600">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <FaMailBulk size={14} />
                  <span>Email triggers monitor for incoming messages</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaDatabase size={14} />
                  <span>Database steps execute SQL queries</span>
                </li>
                <li className="flex items-center gap-2">
                  <FileText size={14} />
                  <span>OCR extracts text from documents & images</span>
                </li>
              </ul>
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto mt-2 text-blue-600"
              >
                View full documentation
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Automation Builder */}
        <div className="lg:col-span-3">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Automation Details
              </CardTitle>
              <CardDescription>
                Configure the basic properties for your workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Automation Name
                  </label>
                  <Input
                    value={state.name}
                    onChange={(e) =>
                      dispatch({ type: "SET_NAME", payload: e.target.value })
                    }
                    placeholder="Enter automation name"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Trigger Type
                  </label>
                  <Select
                    value={state.trigger}
                    onValueChange={(value) =>
                      dispatch({
                        type: "SET_TRIGGER",
                        payload: value as TriggerType,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a trigger type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRIGGER_TYPES.map((trigger) => (
                        <SelectItem key={trigger.id} value={trigger.id}>
                          <div className="flex items-center gap-2">
                            {trigger.icon}
                            <span>{trigger.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <Textarea
                    value={state.description}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_DESCRIPTION",
                        payload: e.target.value,
                      })
                    }
                    placeholder="Describe what this automation does"
                    rows={3}
                    className="w-full resize-y"
                  />
                </div>
                <div className="md:col-span-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={state.isActive}
                      onCheckedChange={(checked) =>
                        dispatch({ type: "SET_ACTIVE", payload: checked })
                      }
                    />
                    <label className="font-medium text-sm">
                      Activate Immediately
                    </label>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <HelpCircle size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        When enabled, this automation will start running
                        immediately after saving. Otherwise, you'll need to
                        manually activate it later.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Automation Flow</h3>
                  <Badge variant="secondary">{state.steps.length} Steps</Badge>
                </div>

                <p className="text-sm text-gray-500">
                  {state.steps.length === 0
                    ? "Add steps from the components panel to create your workflow"
                    : "Drag to reorder steps in your workflow sequence"}
                </p>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="steps">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-3 mt-3"
                      >
                        {state.steps.length === 0 ? (
                          <div className="border-2 border-dashed rounded-lg p-8 text-center bg-gray-50">
                            <p className="text-gray-500 mb-2">
                              Your workflow is empty
                            </p>
                            <p className="text-sm text-gray-400">
                              Add components from the left sidebar or select a
                              template to get started
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
                                  {...provided.dragHandleProps}
                                >
                                  <StepCard
                                    step={step}
                                    index={index}
                                    onRemove={() => removeStep(step.id)}
                                  />
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
              </div>
            </CardContent>
          </Card>

          {showAIAssistant && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle size={18} className="text-blue-600" />
                  AI Assistant
                </CardTitle>
                <CardDescription>
                  Smart suggestions to help build your automation workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <p className="text-sm font-medium mb-3">
                    Based on your automation details, I recommend:
                  </p>
                  <ul className="space-y-2 pl-5 list-disc text-sm">
                    {getSuggestions().map((suggestion, index) => (
                      <li key={index} className="text-gray-700">
                        {suggestion}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-center text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <FaPlusCircle size={14} className="mr-2" />
                      Generate Complete Workflow
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full justify-center text-gray-700"
                    >
                      <Settings size={14} className="mr-2" />
                      Optimize Current Workflow
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAutomation;
