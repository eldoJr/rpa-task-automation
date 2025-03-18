import { useState } from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/inputs/input";
import Select  from "@/components/ui/select/Select";
import { Workflow, PlusCircle } from "lucide-react";

const AddAutomation = () => {
  const [automationName, setAutomationName] = useState("");
  const [trigger, setTrigger] = useState("");
  const [action, setAction] = useState("");

  const handleSubmit = () => {
    console.log("Automation Created:", { automationName, trigger, action });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <Workflow className="text-blue-600 mr-2" size={28} />
        New Process
      </h2>

      <div className="space-y-4">
        <Input
          label="Automation Name"
          placeholder="Enter automation name"
          value={automationName}
          onChange={(e) => setAutomationName(e.target.value)}
        />

        <Select
          label="Trigger Event"
          options={["User Sign-up", "New Order", "Payment Received"]}
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
        />

        <Select
          label="Action"
          options={["Send Email", "Notify Admin", "Create Report"]}
          value={action}
          onChange={(e) => setAction(e.target.value)}
        />

        <Button onClick={handleSubmit} className="bg-green-500 text-white mt-4 flex items-center">
          <PlusCircle className="mr-2" />
          Add Automation
        </Button>
      </div>
    </div>
  );
};

export default AddAutomation;
