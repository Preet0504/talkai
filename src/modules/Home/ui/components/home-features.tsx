import { Video, Mic, Brain, FileText, MessageSquare, Zap, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Custom AI Specialists",
    description: "Create AI agents with specialized knowledge for customer support, sales, technical consulting, and more",
    icon: <Brain className="h-6 w-6" />,
  },
  {
    title: "Video Conversations",
    description: "Customers connect directly with your AI agents through HD video calls with natural voice interaction",
    icon: <Video className="h-6 w-6" />,
  },
  {
    title: "Natural Voice Chat",
    description: "AI agents speak naturally and understand complex customer questions in real-time conversations",
    icon: <Mic className="h-6 w-6" />,
  },
  {
    title: "Conversation Analytics",
    description: "Get detailed summaries of customer interactions, key insights, and follow-up actions automatically",
    icon: <FileText className="h-6 w-6" />,
  },
  {
    title: "Real-time Processing",
    description: "Instant transcription and processing during live conversations with immediate response capabilities",
    icon: <Zap className="h-6 w-6" />,
  },
  {
    title: "Enterprise Security",
    description: "Bank-level encryption and privacy protection for all customer conversations and data",
    icon: <Shield className="h-6 w-6" />,
  },
  {
    title: "Quick Setup",
    description: "Get your AI agents up and running in minutes with our intuitive setup process",
    icon: <Clock className="h-6 w-6" />,
  },
  {
    title: "Smart Summaries",
    description: "AI-generated summaries capture key points, decisions, and next steps from every conversation",
    icon: <MessageSquare className="h-6 w-6" />,
  },
];

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-border",
        (index === 0 || index === 4) && "lg:border-l border-border",
        index < 4 && "lg:border-b border-border"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-primary">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-border group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-foreground">
          {title}
        </span>
      </div>
      <p className="text-sm text-muted-foreground max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};

export const HomeFeatures = () => {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Powerful features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create specialized AI agents for customer conversations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};