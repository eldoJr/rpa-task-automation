import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  CircularProgress,
  Tooltip,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Send,
  SmartToy,
  Person,
  ExpandMore,
  AutoFixHigh,
  History,
  Clear,
  HelpOutline,
  SettingsSuggest,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Types
interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isSuggestion?: boolean;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  improvement?: string;
}

// Tab type
type TabType = "chat" | "suggestions";

// Styled components
const ChatContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  maxHeight: "calc(100vh - 200px)",
  overflow: "hidden",
});

const MessageList = styled(List)({
  flex: 1,
  overflowY: "auto",
  padding: 0,
});

const UserMessage = styled(ListItem)(({ theme }) => ({
  justifyContent: "flex-end",
  "& .MuiListItemText-root": {
    textAlign: "right",
  },
  "& .MuiListItemAvatar-root": {
    minWidth: "auto",
    marginLeft: theme.spacing(2),
  },
}));

const BotMessage = styled(ListItem)(({ theme }) => ({
  justifyContent: "flex-start",
  "& .MuiListItemText-root": {
    textAlign: "left",
  },
  "& .MuiListItemAvatar-root": {
    minWidth: "auto",
    marginRight: theme.spacing(2),
  },
}));

const MessageBubble = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  maxWidth: "70%",
  wordWrap: "break-word",
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
}));

const UserBubble = styled(MessageBubble)(({ theme }) => ({
  backgroundColor: theme.palette.grey[300],
  color: theme.palette.text.primary,
}));

// Sample data
const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    text: "Hello! I'm your RPA Assistant. How can I help you today?",
    sender: "bot",
    timestamp: new Date(),
  },
  {
    id: "2",
    text: 'Try asking me things like: "How do I create a new automation?" or "Show me reports from last week"',
    sender: "bot",
    timestamp: new Date(),
  },
];

const SAMPLE_SUGGESTIONS: Suggestion[] = [
  {
    id: "sug-1",
    title: "Optimize Invoice Processing",
    description:
      "I noticed your invoice processing automation could be 20% faster by adding parallel processing",
    action: "Show me how",
    improvement:
      "Applying parallel processing to your invoice handling would reduce processing time from 2 minutes to approximately 90 seconds per batch.",
  },
  {
    id: "sug-2",
    title: "New Template Available",
    description:
      "A new HR onboarding template was added that might match your recent automations",
    action: "View template",
    improvement:
      "This pre-built template includes document verification, system access provisioning, and email notification workflows.",
  },
  {
    id: "sug-3",
    title: "Error Pattern Detected",
    description:
      "Your CRM sync fails every Tuesday at 2am when maintenance occurs. Suggest rescheduling.",
    action: "Fix schedule",
    improvement:
      "Changing the sync schedule to 4am would avoid the maintenance window and improve reliability by approximately 15%.",
  },
];

const QUICK_QUESTIONS = [
  "How do I create a new automation?",
  "Show me failed executions",
  "Help with Microsoft Office integration",
  "Generate a monthly report",
];

// Bot response generator
const generateBotResponse = (userQuery: string): string => {
  const responses = {
    default: [
      "I'm analyzing your request...",
      "Based on your automation history, I recommend checking the templates section.",
      "Here's what I found for your query:",
      "I can help you with that. Let me check the documentation.",
    ],
    automation: [
      "To create a new automation, go to the 'Create' tab and select a template or start from scratch. Would you like me to show you the available templates?",
      "Creating a new automation is easy! Start by defining your triggers and then add actions in sequence. Would you like a step-by-step guide?",
    ],
    executions: [
      "I found 3 failed executions in the last 24 hours. The most common error was 'Connection timeout'. Would you like to see the detailed error logs?",
      "There were 5 failed executions this week. I've analyzed the patterns and noticed they all relate to the CRM integration. Would you like recommendations to fix this?",
    ],
    integration: [
      "For Microsoft Office integration, you'll need to connect your Office 365 account. I can guide you through the setup process if you'd like.",
      "The Microsoft Office connector supports Word, Excel, Outlook, and SharePoint automation. Which specific application are you interested in?",
    ],
    report: [
      "I've prepared a monthly summary report showing 243 successful automations and 18 failures. Would you like me to export this as a PDF?",
      "Your monthly report is ready. Overall efficiency has improved by 12% compared to last month. Would you like to schedule this report to run automatically?",
    ],
  };

  // Simple query matching
  if (userQuery.toLowerCase().includes("automation")) {
    return responses.automation[
      Math.floor(Math.random() * responses.automation.length)
    ];
  } else if (
    userQuery.toLowerCase().includes("execution") ||
    userQuery.toLowerCase().includes("failed")
  ) {
    return responses.executions[
      Math.floor(Math.random() * responses.executions.length)
    ];
  } else if (
    userQuery.toLowerCase().includes("office") ||
    userQuery.toLowerCase().includes("microsoft")
  ) {
    return responses.integration[
      Math.floor(Math.random() * responses.integration.length)
    ];
  } else if (userQuery.toLowerCase().includes("report")) {
    return responses.report[
      Math.floor(Math.random() * responses.report.length)
    ];
  }

  return responses.default[
    Math.floor(Math.random() * responses.default.length)
  ];
};

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [suggestions, setSuggestions] =
    useState<Suggestion[]>(SAMPLE_SUGGESTIONS);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Generate contextual response based on user input
    const userQuery = inputValue;

    // Simulate bot response after delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(userQuery),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  const handleApplySuggestion = (suggestion: Suggestion) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `Apply suggestion: ${suggestion.title}`,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setActiveTab("chat");
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Applying suggestion: ${suggestion.title}. I've prepared the changes for your review.`,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);

    // Remove applied suggestion
    setSuggestions((prevSuggestions) =>
      prevSuggestions.filter((item) => item.id !== suggestion.id)
    );
  };

  const handleDismissSuggestion = (
    suggestionId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setSuggestions((prevSuggestions) =>
      prevSuggestions.filter((suggestion) => suggestion.id !== suggestionId)
    );
  };

  const handleClearChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderChatTab = () => (
    <>
      <CardContent sx={{ flex: 1, p: 0, overflowY: "auto" }}>
        <ChatContainer>
          <MessageList>
            {messages.map((message) => (
              <React.Fragment key={message.id}>
                {message.sender === "user" ? (
                  <UserMessage>
                    <ListItemText
                      primary={message.text}
                      secondary={message.timestamp.toLocaleTimeString()}
                    />
                    <ListItemAvatar>
                      <Avatar>
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                  </UserMessage>
                ) : (
                  <BotMessage>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        <SmartToy />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={message.text}
                      secondary={message.timestamp.toLocaleTimeString()}
                    />
                  </BotMessage>
                )}
              </React.Fragment>
            ))}
            {isTyping && (
              <BotMessage>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <SmartToy />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Typing...
                    </Box>
                  }
                />
              </BotMessage>
            )}
            <div ref={messagesEndRef} />
          </MessageList>
        </ChatContainer>
      </CardContent>

      <Box sx={{ p: 2, borderTop: "1px solid rgba(0, 0, 0, 0.12)" }}>
        <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {QUICK_QUESTIONS.map((question, index) => (
            <Chip
              key={index}
              label={question}
              onClick={() => handleQuickQuestion(question)}
              icon={<HelpOutline fontSize="small" />}
              variant="outlined"
              size="small"
            />
          ))}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            multiline
            maxRows={4}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              endAdornment: (
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                >
                  <Send />
                </IconButton>
              ),
            }}
          />
        </Box>
      </Box>
    </>
  );

  const renderSuggestionsTab = () => (
    <CardContent>
      <Typography variant="subtitle1" gutterBottom>
        AI-Powered Suggestions
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Based on your usage patterns and system data
      </Typography>

      {suggestions.length > 0 ? (
        <List>
          {suggestions.map((suggestion) => (
            <Accordion key={suggestion.id} elevation={0} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <SettingsSuggest color="primary" sx={{ mr: 2 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography>{suggestion.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {suggestion.description}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplySuggestion(suggestion);
                    }}
                  >
                    {suggestion.action}
                  </Button>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  {suggestion.improvement ||
                    "This suggestion is based on analysis of your recent automation executions and system performance metrics. Applying this change could improve efficiency by 15-20%."}
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                  }}
                >
                  <Button
                    size="small"
                    color="error"
                    onClick={(e) => handleDismissSuggestion(suggestion.id, e)}
                  >
                    Dismiss
                  </Button>
                  <Button size="small" variant="contained">
                    Learn More
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </List>
      ) : (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No active suggestions at this time
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Check back later for new optimization recommendations
          </Typography>
        </Box>
      )}
    </CardContent>
  );

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <SmartToy />
          </Avatar>
        }
        title="RPA Assistant"
        subheader="AI-powered suggestions and support"
        action={
          <Box>
            <Tooltip title="Suggestions">
              <IconButton
                onClick={() => setActiveTab("suggestions")}
                color={activeTab === "suggestions" ? "primary" : "default"}
              >
                <Badge badgeContent={suggestions.length} color="error">
                  <AutoFixHigh />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Chat History">
              <IconButton
                onClick={() => setActiveTab("chat")}
                color={activeTab === "chat" ? "primary" : "default"}
              >
                <History />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear Chat">
              <IconButton onClick={handleClearChat}>
                <Clear />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
      <Divider />

      {activeTab === "chat" ? renderChatTab() : renderSuggestionsTab()}
    </Card>
  );
};

export default ChatBot;
