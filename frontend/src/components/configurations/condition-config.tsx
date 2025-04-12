import { Input } from "@/components/ui/input/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";
import { Button } from "@/components/ui/button/Button";
import { ConditionConfig } from "./automation";

interface ConditionConfigProps {
  config: ConditionConfig;
  onUpdate: (config: ConditionConfig) => void;
}

const operators = [
  { value: "equals", label: "Equals" },
  { value: "notEquals", label: "Not Equals" },
  { value: "contains", label: "Contains" },
  { value: "notContains", label: "Does Not Contain" },
  { value: "startsWith", label: "Starts With" },
  { value: "endsWith", label: "Ends With" },
  { value: "greaterThan", label: "Greater Than" },
  { value: "lessThan", label: "Less Than" },
  { value: "greaterThanOrEqual", label: "Greater Than Or Equal" },
  { value: "lessThanOrEqual", label: "Less Than Or Equal" },
  { value: "isEmpty", label: "Is Empty" },
  { value: "isNotEmpty", label: "Is Not Empty" },
];

export const ConditionConfigForm = ({
  config,
  onUpdate,
}: ConditionConfigProps) => {
  const handleConditionChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newConditions = [...config.conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    onUpdate({ ...config, conditions: newConditions });
  };

  const addCondition = () => {
    onUpdate({
      ...config,
      conditions: [
        ...config.conditions,
        { field: "", operator: "equals", value: "" },
      ],
    });
  };

  const removeCondition = (index: number) => {
    const newConditions = [...config.conditions];
    newConditions.splice(index, 1);
    onUpdate({ ...config, conditions: newConditions });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {config.conditions.map((condition, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-5">
              <label className="text-sm font-medium">Field</label>
              <Input
                value={condition.field}
                onChange={(e) =>
                  handleConditionChange(index, "field", e.target.value)
                }
                placeholder="Field name"
              />
            </div>

            <div className="col-span-3">
              <label className="text-sm font-medium">Operator</label>
              <Select
                value={condition.operator}
                onValueChange={(value) =>
                  handleConditionChange(index, "operator", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {operators.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-3">
              {!["isEmpty", "isNotEmpty"].includes(condition.operator) && (
                <>
                  <label className="text-sm font-medium">Value</label>
                  <Input
                    value={condition.value}
                    onChange={(e) =>
                      handleConditionChange(index, "value", e.target.value)
                    }
                    placeholder="Comparison value"
                  />
                </>
              )}
            </div>

            <div className="col-span-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCondition(index)}
                className="text-red-500"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={addCondition}
          className="mt-2"
        >
          Add Condition
        </Button>
      </div>

      <div>
        <label className="text-sm font-medium">Logical Operator</label>
        <div className="flex space-x-4 mt-1">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={config.logicalOperator === "and"}
              onChange={() => onUpdate({ ...config, logicalOperator: "and" })}
              className="h-4 w-4"
            />
            <span>AND (All conditions must be true)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={config.logicalOperator === "or"}
              onChange={() => onUpdate({ ...config, logicalOperator: "or" })}
              className="h-4 w-4"
            />
            <span>OR (Any condition can be true)</span>
          </label>
        </div>
      </div>
    </div>
  );
};
