import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from "react-beautiful-dnd";
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
import { Select } from "@/components/ui/select/select";
import { Textarea } from "@/components/ui/textarea/textarea";
import { Switch } from "@/components/ui/switch/switch";
import { Tooltip } from "@/components/ui/tooltip/tooltip";
import {
  PlusCircle,
  Save,
  Clock,
  Database,
  Mail,
  Calendar,
  FileText,
  Settings,
  HelpCircle,
  Trash2,
} from "lucide-react";

type EmailConfig = {
  folder: string;
  filter: string;
};

type ExcelConfig = {
  file: string;
  sheet: string;
};

type OCRConfig = {
  dataPoints: string[];
};

type DatabaseConfig = {
  query: string;
  connection: string;
};

type APIConfig = {
  endpoint: string;
  method: string;
  headers: Record<string, string>;
};

type ConditionConfig = {
  field: string;
  operator: string;
  value: string;
};

// Union type for all possible configs
type StepConfig = 
  | EmailConfig
  | ExcelConfig
  | OCRConfig
  | DatabaseConfig
  | APIConfig
  | ConditionConfig
  | Record<string, string | string[] | number | boolean>;

// Step type with specific config
interface AutomationStep {
  id: string;
  type: string;
  name: string;
  config: StepConfig;
}

// Template interface
interface AutomationTemplate {
  id: string;
  name: string;
}

// Available step interface
interface AvailableStep {
  id: string;
  name: string;
  icon: React.ReactNode;
}

// Trigger type interface
interface TriggerType {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const AddAutomation: React.FC = () => {
  const [automationName, setAutomationName] = useState<string>("");
  const [automationDescription, setAutomationDescription] = useState<string>("");
  const [steps, setSteps] = useState<AutomationStep[]>([]);
  const [selectedTrigger, setSelectedTrigger] = useState<string>("schedule");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(false);

  // Template categories
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  // Available step types
  const availableSteps: AvailableStep[] = [
    { id: "email", name: "Email Integration", icon: <Mail size={20} /> },
    { id: "excel", name: "Excel Processing", icon: <FileText size={20} /> },
    { id: "database", name: "Database Query", icon: <Database size={20} /> },
    { id: "ocr", name: "OCR Recognition", icon: <FileText size={20} /> },
    { id: "api", name: "API Request", icon: <Settings size={20} /> },
    { id: "condition", name: "Condition", icon: <Settings size={20} /> },
  ];

  // Available templates
  const templates: AutomationTemplate[] = [
    { id: "data-extraction", name: "Data Extraction from Emails" },
    { id: "form-filling", name: "Automated Form Filling" },
    { id: "invoice-processing", name: "Invoice Processing" },
    { id: "customer-service", name: "Customer Service Automation" },
  ];

  // Trigger types
  const triggerTypes: TriggerType[] = [
    { id: "schedule", name: "Schedule Based", icon: <Clock size={16} /> },
    { id: "email", name: "Email Trigger", icon: <Mail size={16} /> },
    { id: "database", name: "Database Change", icon: <Database size={16} /> },
    { id: "calendar", name: "Calendar Event", icon: <Calendar size={16} /> },
  ];

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSteps(items);
  };

  const addStep = (stepType: string) => {
    const step = availableSteps.find((s) => s.id === stepType);
    if (!step) return;

    const newStep: AutomationStep = {
      id: `step-${Date.now()}`,
      type: stepType,
      name: step.name,
      config: {},
    };

    setSteps([...steps, newStep]);
  };

  const removeStep = (stepId: string) => {
    setSteps(steps.filter((step) => step.id !== stepId));
  };

  const loadTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);

    if (templateId === "data-extraction") {
      setSteps([
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
          config: { dataPoints: ["invoice_number", "total_amount", "date"] } as OCRConfig,
        },
        {
          id: "step-3",
          type: "excel",
          name: "Update Spreadsheet",
          config: { file: "invoices.xlsx", sheet: "Processed" } as ExcelConfig,
        },
      ]);
      setAutomationName("Email Data Extraction");
      setAutomationDescription(
        "Automatically extract data from incoming emails and update Excel spreadsheet"
      );
    }
  };

  const toggleAIAssistant = () => {
    setShowAIAssistant(!showAIAssistant);
  };

  const saveAutomation = () => {
    const automation = {
      name: automationName,
      description: automationDescription,
      trigger: selectedTrigger,
      isActive,
      steps,
    };

    console.log("Saving automation:", automation);
    alert("Automation saved successfully!");
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold flex-grow">Create New Automation</h1>
        <Button variant="outline" onClick={toggleAIAssistant} className="mr-2">
          AI Assistant {showAIAssistant ? "ON" : "OFF"}
        </Button>
        <Button
          onClick={saveAutomation}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Save size={16} className="mr-2" /> Save Automation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Available Components */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Components</CardTitle>
              <CardDescription>
                Drag and drop to build your automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                {availableSteps.map((step) => (
                  <Button
                    key={step.id}
                    variant="outline"
                    className="justify-start text-left"
                    onClick={() => addStep(step.id)}
                  >
                    <div className="mr-2">{step.icon}</div>
                    {step.name}
                    <PlusCircle size={16} className="ml-auto" />
                  </Button>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full">
                <p className="text-sm font-medium mb-2">Templates</p>
                <Select
                  value={selectedTemplate}
                  onValueChange={loadTemplate}
                >
                  <option value="" disabled>
                    Load Template...
                  </option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </Select>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content - Automation Builder */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Automation Details</CardTitle>
              <CardDescription>
                Configure your automation properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Automation Name
                  </label>
                  <Input
                    value={automationName}
                    onChange={(e) => setAutomationName(e.target.value)}
                    placeholder="Enter automation name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Trigger Type
                  </label>
                  <Select
                    value={selectedTrigger}
                    onValueChange={setSelectedTrigger}
                  >
                    {triggerTypes.map((trigger) => (
                      <option key={trigger.id} value={trigger.id}>
                        {trigger.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <Textarea
                    value={automationDescription}
                    onChange={(e) => setAutomationDescription(e.target.value)}
                    placeholder="Describe what this automation does"
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <label className="mr-2 text-sm font-medium">
                      Activate Immediately
                    </label>
                    <Switch checked={isActive} onCheckedChange={setIsActive} />
                  </div>
                  <Tooltip content="Set whether this automation should be active immediately after saving">
                    <Button variant="ghost" size="sm" className="p-1">
                      <HelpCircle size={16} />
                    </Button>
                  </Tooltip>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Automation Flow</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Add and arrange steps to create your automation workflow
                </p>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="steps">
                  {(provided: DroppableProvided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3"
                    >
                      {steps.length === 0 ? (
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                          <p className="text-gray-500">
                            Drag components here or select a template to start
                            building your automation
                          </p>
                        </div>
                      ) : (
                        steps.map((step, index) => (
                          <Draggable
                            key={step.id}
                            draggableId={step.id}
                            index={index}
                          >
                            {(provided: DraggableProvided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="border rounded-lg p-4 bg-white shadow-sm"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                                      {index + 1}
                                    </span>
                                    <div>
                                      <h4 className="font-medium">
                                        {step.name}
                                      </h4>
                                      <p className="text-sm text-gray-500">
                                        Type: {step.type}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-gray-400 hover:text-gray-500"
                                    >
                                      <Settings size={16} />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-400 hover:text-red-500"
                                      onClick={() => removeStep(step.id)}
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </div>
                                </div>
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
            </CardContent>
          </Card>

          {/* AI Assistant Panel (conditionally rendered) */}
          {showAIAssistant && (
            <Card className="mt-6 border-blue-200 bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">AI Assistant</CardTitle>
                <CardDescription>
                  I can help you build your automation workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-3 rounded-md">
                  <p className="text-sm">
                    Based on your automation name and description, I suggest
                    adding these steps:
                  </p>
                  <ul className="mt-2 text-sm pl-5 list-disc">
                    {automationName.toLowerCase().includes("email") && (
                      <li className="mb-1">
                        Start with an Email Trigger to monitor incoming messages
                      </li>
                    )}
                    {automationDescription
                      .toLowerCase()
                      .includes("extract") && (
                      <li className="mb-1">
                        Add OCR Recognition to extract text from documents
                      </li>
                    )}
                    {automationDescription.toLowerCase().includes("excel") && (
                      <li className="mb-1">
                        Include Excel Processing to update your spreadsheets
                      </li>
                    )}
                    <li className="mb-1">
                      Consider adding a condition to handle different scenarios
                    </li>
                  </ul>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-xs w-full"
                  >
                    Generate Complete Workflow
                  </Button>
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