import { useLocation } from 'wouter';

const tools = [
  {
    title: "Goal Generator",
    description: "Generate AI-powered IEP goals based on diagnosis",
    icon: "🎯",
    route: "/goal-generator"
  },
  {
    title: "IEP Goal Generator",
    description: "Generate AI-powered IEP goals",
    icon: "🧠",
    route: "/iep-goal-generator"
  },
  {
    title: "Advocate Matcher",
    description: "Get matched with a special ed advocate",
    icon: "🤝",
    route: "/matcher"
  },
  {
    title: "Messages",
    description: "Chat with your advocate",
    icon: "💬",
    route: "/chat"
  },
  {
    title: "Progress Notes",
    description: "Track your child's progress",
    icon: "📊",
    route: "/progress-notes"
  },
  {
    title: "Smart Letter Generator",
    description: "Generate formal letters for school requests",
    icon: "✉️",
    route: "/smart-letter-generator"
  },
  {
    title: "AI IEP Review",
    description: "Get AI analysis of your IEP documents",
    icon: "🔍",
    route: "/ai-iep-review"
  }
];

export default function ToolsGrid() {
  const [, setLocation] = useLocation();

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {tools.map((tool) => (
        <div
          key={tool.title}
          className="bg-white shadow rounded-xl p-4 hover:shadow-md transition cursor-pointer"
          onClick={() => setLocation(tool.route)}
        >
          <div className="text-3xl">{tool.icon}</div>
          <h2 className="text-xl font-semibold mt-2">{tool.title}</h2>
          <p className="text-gray-600">{tool.description}</p>
        </div>
      ))}
    </div>
  );
}