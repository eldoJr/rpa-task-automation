import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Add as AddIcon,
} from "@mui/icons-material";

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Advanced";
  lastUsed?: string;
  uses: number;
}

const Templates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);

  // Sample template data
  const templates: Template[] = [
    {
      id: "tpl-001",
      title: "Email Data Extraction",
      description:
        "Automatically extract data from incoming emails and populate spreadsheets",
      category: "Data Processing",
      difficulty: "Easy",
      uses: 1245,
    },
    {
      id: "tpl-002",
      title: "Invoice Processing",
      description:
        "Process PDF invoices, extract relevant data and update accounting systems",
      category: "Finance",
      difficulty: "Medium",
      lastUsed: "2 days ago",
      uses: 876,
    },
    {
      id: "tpl-003",
      title: "CRM Data Sync",
      description:
        "Synchronize customer data between CRM and marketing platforms",
      category: "Sales",
      difficulty: "Medium",
      uses: 532,
    },
    {
      id: "tpl-004",
      title: "HR Onboarding",
      description:
        "Automate new employee onboarding process across multiple systems",
      category: "HR",
      difficulty: "Advanced",
      uses: 321,
    },
    {
      id: "tpl-005",
      title: "Inventory Update",
      description: "Update inventory levels based on sales and purchase orders",
      category: "Logistics",
      difficulty: "Medium",
      uses: 689,
    },
    {
      id: "tpl-006",
      title: "Customer Support Ticket Routing",
      description:
        "Automatically route support tickets based on type and priority",
      category: "Customer Service",
      difficulty: "Easy",
      lastUsed: "1 week ago",
      uses: 1023,
    },
  ];

  const categories = [
    "All",
    "Data Processing",
    "Finance",
    "Sales",
    "HR",
    "Logistics",
    "Customer Service",
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template);
    setOpenDialog(true);
  };

  const handleUseTemplate = () => {
    // Logic to implement using the selected template
    console.log("Using template:", selectedTemplate);
    setOpenDialog(false);
    // Here you would typically navigate to the automation builder with this template pre-loaded
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "success";
      case "Medium":
        return "warning";
      case "Advanced":
        return "error";
      default:
        return "primary";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Automation Templates
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Select from pre-built templates to quickly create automations
      </Typography>

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
          placeholder="Search templates..."
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
          sx={{ width: 350 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FilterIcon color="action" sx={{ mr: 1 }} />
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              variant={selectedCategory === category ? "filled" : "outlined"}
              color={selectedCategory === category ? "primary" : "default"}
              onClick={() => setSelectedCategory(category)}
              sx={{ mx: 0.5 }}
            />
          ))}
        </Box>
      </Box>

      {filteredTemplates.length === 0 ? (
        <Box sx={{ textAlign: "center", p: 5 }}>
          <Typography variant="h6" color="text.secondary">
            No templates found matching your criteria
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredTemplates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: 3,
                    transform: "translateY(-2px)",
                    transition: "all 0.3s ease",
                  },
                }}
                onClick={() => handleTemplateClick(template)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {template.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {template.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: "auto",
                    }}
                  >
                    <Chip
                      label={template.category}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={template.difficulty}
                      size="small"
                      color={getDifficultyColor(template.difficulty)}
                    />
                  </Box>
                </CardContent>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "action.hover",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {template.uses} uses
                  </Typography>
                  {template.lastUsed && (
                    <Typography variant="caption" color="text.secondary">
                      Last used: {template.lastUsed}
                    </Typography>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedTemplate?.title}
          <Chip
            label={selectedTemplate?.difficulty}
            size="small"
            color={getDifficultyColor(selectedTemplate?.difficulty || "Easy")}
            sx={{ ml: 2 }}
          />
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Category: {selectedTemplate?.category}
          </Typography>
          <Typography variant="body1" paragraph>
            {selectedTemplate?.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This template has been used {selectedTemplate?.uses} times.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleUseTemplate}
          >
            Use This Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Templates;
