import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentType?: string;
  status?: 'processing' | 'completed' | 'error';
}

interface DemoScenario {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: string;
}

const demoScenarios: DemoScenario[] = [
  {
    id: 'vacation',
    title: 'Vacation Request',
    description: 'Request time off with automatic approval routing',
    prompt: 'I need to take vacation from December 20-30',
    icon: '🏖️'
  },
  {
    id: 'onboarding',
    title: 'Employee Onboarding',
    description: 'Onboard new employee across all systems',
    prompt: 'New engineer Sarah Chen starts Monday',
    icon: '👋'
  },
  {
    id: 'expense',
    title: 'Expense Reimbursement',
    description: 'Submit expenses for quick reimbursement',
    prompt: 'Reimburse my client dinner - $247.50',
    icon: '💰'
  },
  {
    id: 'equipment',
    title: 'Equipment Request',
    description: 'Order IT equipment and supplies',
    prompt: 'My team needs 3 more monitors',
    icon: '🖥️'
  },
  {
    id: 'access',
    title: 'Emergency Access',
    description: 'Grant urgent system access',
    prompt: 'URGENT - Need production DB access for hotfix',
    icon: '🚨'
  }
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to WorkFlow Wizard! 👋\n\nI can help you with:\n• Vacation & leave requests\n• Employee onboarding\n• Expense reimbursements\n• Equipment orders\n• IT access requests\n\nJust tell me what you need!',
      sender: 'agent',
      timestamp: new Date(),
      agentType: 'Coordinator'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAgentResponse = async (userMessage: string) => {
    // Simulate processing
    const processingId = Date.now().toString() + '-processing';
    setMessages(prev => [...prev, {
      id: processingId,
      text: 'Analyzing your request...',
      sender: 'agent',
      timestamp: new Date(),
      agentType: 'Coordinator',
      status: 'processing'
    }]);

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Remove processing message
    setMessages(prev => prev.filter(m => m.id !== processingId));

    // Determine intent and respond
    let response = '';
    let agentType = 'Coordinator';

    if (userMessage.toLowerCase().includes('vacation') || userMessage.toLowerCase().includes('leave')) {
      agentType = 'HR Agent';
      response = `✅ **Vacation Request Processed**\n\n📅 **Dates:** December 20-30, 2025 (11 days)\n✓ PTO Balance: 15 days available\n✓ Manager notified for approval\n✓ Calendar blocked\n\n**Status:** Pending manager approval\n**Expected approval:** Within 2 hours\n\nYou'll receive an email once approved! 🏖️`;
    } else if (userMessage.toLowerCase().includes('onboard') || userMessage.toLowerCase().includes('new employee')) {
      agentType = 'Multi-Agent';
      response = `🚀 **Employee Onboarding Initiated**\n\n👤 **Employee:** Sarah Chen\n📅 **Start Date:** Monday\n\n**Progress:**\n✅ IT Agent: Email created (sarah.chen@company.com)\n✅ IT Agent: Slack, GitHub accounts ready\n✅ HR Agent: Orientation scheduled (9am Monday)\n✅ HR Agent: Mentor assigned (John Smith)\n✅ Procurement: MacBook Pro ordered (arrives Friday)\n✅ Finance: Payroll setup initiated\n✅ Facilities: Desk assigned (A-3-42)\n\n**Sarah is all set for Monday!** 🎉`;
    } else if (userMessage.toLowerCase().includes('expense') || userMessage.toLowerCase().includes('reimburse')) {
      agentType = 'Finance Agent';
      response = `💰 **Expense Reimbursement**\n\n📄 **Details:**\n• Amount: $247.50\n• Category: Client Meals\n• Policy Limit: $250 ✓\n\n**Processing:**\n✅ Receipt validated\n✅ Within policy limits\n✅ Budget available\n✅ Routed to manager\n✅ Manager approved\n✅ Payment processing\n\n**Funds will arrive in 2 business days!** 💸`;
    } else if (userMessage.toLowerCase().includes('monitor') || userMessage.toLowerCase().includes('equipment')) {
      agentType = 'Procurement Agent';
      response = `🖥️ **Equipment Order**\n\n📦 **Items:** 3x Dell 27\" Monitors\n💵 **Cost:** $897 (3 × $299)\n\n**Order Details:**\n✅ Checked inventory (1 in stock)\n✅ Budget approved (Manager limit: $2000)\n✅ Purchase order created\n✅ Ordered from Dell\n📦 Shipping: 2-day delivery\n\n**Arriving Wednesday!** Your team will be notified. 📦`;
    } else if (userMessage.toLowerCase().includes('access') || userMessage.toLowerCase().includes('urgent')) {
      agentType = 'IT Agent';
      response = `🚨 **Emergency Access Granted**\n\n⚡ **Access Details:**\n• System: Production Database\n• Level: Read/Write\n• Duration: 4 hours\n• Expires: 5:30 PM\n\n**Security:**\n✅ Role verified (Senior Developer)\n✅ Incident ticket found (INC-12847)\n✅ On-call manager notified\n✅ Audit log created\n\n**Access granted!** Auto-revokes at 5:30 PM. 🔒`;
    } else {
      response = `I can help you with:\n\n🏖️ **Vacation requests** - "I need vacation next week"\n👋 **Employee onboarding** - "New employee starts Monday"\n💰 **Expense reimbursements** - "Reimburse my dinner - $50"\n🖥️ **Equipment orders** - "Order 2 laptops"\n🚨 **IT access** - "Need access to production"\n\nWhat would you like to do?`;
    }

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: response,
      sender: 'agent',
      timestamp: new Date(),
      agentType,
      status: 'completed'
    }]);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage = inputValue;
    setInputValue('');
    setIsProcessing(true);

    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    }]);

    // Simulate agent response
    await simulateAgentResponse(userMessage);
    setIsProcessing(false);
  };

  const handleScenarioClick = (scenario: DemoScenario) => {
    setInputValue(scenario.prompt);
  };

  return (
    <>
      <Head>
        <title>WorkFlow Wizard - AI Agent Orchestration Platform</title>
        <meta name="description" content="Automate workflows across departments with AI agents" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  W
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">WorkFlow Wizard</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Powered by IBM watsonx Orchestrate</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-medium rounded-full flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  5 Agents Active
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Demo Scenarios Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Demo Scenarios</h2>
                <div className="space-y-2">
                  {demoScenarios.map(scenario => (
                    <button
                      key={scenario.id}
                      onClick={() => handleScenarioClick(scenario)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{scenario.icon}</span>
                        <div>
                          <div className="font-medium text-sm text-gray-900 dark:text-white">{scenario.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{scenario.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col h-[calc(100vh-180px)]">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-3 ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        {message.sender === 'agent' && message.agentType && (
                          <div className="text-xs font-semibold mb-2 opacity-75">
                            {message.agentType}
                          </div>
                        )}
                        <div className="whitespace-pre-wrap text-sm">{message.text}</div>
                        {message.status === 'processing' && (
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type your request... (e.g., 'I need vacation next week')" 
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      disabled={isProcessing}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputValue.trim() || isProcessing}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
                    >
                      {isProcessing ? 'Processing...' : 'Send'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
