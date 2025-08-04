import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Star, Gift } from "lucide-react";

interface PlanStatusBadgeProps {
  planStatus: string;
  role?: string;
  showUpgrade?: boolean;
  onUpgrade?: () => void;
}

export function PlanStatusBadge({ planStatus, role, showUpgrade = true, onUpgrade }: PlanStatusBadgeProps) {
  const getPlanDetails = () => {
    switch (planStatus) {
      case "free":
        return {
          label: "Free Plan",
          icon: <Star className="w-4 h-4" />,
          variant: "secondary" as const,
          color: "text-gray-700",
          bgColor: "bg-gray-100",
          description: "Basic IEP management features"
        };
      case "heroOffer":
        return {
          label: "Hero Plan",
          icon: <Crown className="w-4 h-4" />,
          variant: "default" as const,
          color: "text-blue-700",
          bgColor: "bg-blue-100",
          description: "Full advocacy platform with AI features"
        };
      case "retainer":
        return {
          label: "Retainer Client",
          icon: <Gift className="w-4 h-4" />,
          variant: "destructive" as const,
          color: "text-purple-700",
          bgColor: "bg-purple-100",
          description: "Premium advocacy services included"
        };
      default:
        return {
          label: "Unknown Plan",
          icon: <Star className="w-4 h-4" />,
          variant: "outline" as const,
          color: "text-gray-700",
          bgColor: "bg-gray-100",
          description: "Plan status unclear"
        };
    }
  };

  const details = getPlanDetails();

  return (
    <div className="flex items-center gap-3">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${details.bgColor}`}>
        <span className={details.color}>{details.icon}</span>
        <div>
          <p className={`font-semibold text-sm ${details.color}`}>
            {details.label}
          </p>
          <p className={`text-xs ${details.color} opacity-80`}>
            {details.description}
          </p>
        </div>
      </div>

      {showUpgrade && planStatus === "free" && onUpgrade && (
        <Button
          variant="outline"
          size="sm"
          onClick={onUpgrade}
          className="text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
        >
          <Crown className="w-3 h-3 mr-1" />
          Upgrade to Hero
        </Button>
      )}
    </div>
  );
}

export function PlanStatusCard({ planStatus, role }: { planStatus: string; role?: string }) {
  const getPlanFeatures = () => {
    const baseFeatures = {
      free: [
        "Basic IEP goal tracking",
        "Document storage (up to 10 files)",
        "Calendar for IEP meetings",
        "Progress monitoring",
        "Email support"
      ],
      heroOffer: [
        "Everything in Free Plan",
        "AI-powered Memory Q&A",
        "Unlimited document storage",
        "Advocate collaboration",
        "Priority support",
        "Advanced analytics",
        "Expert consultations"
      ],
      retainer: [
        "Everything in Hero Plan",
        "Dedicated advocate assigned",
        "Legal consultation included",
        "Custom advocacy strategies",
        "Priority case handling",
        "Direct advocate contact"
      ]
    };

    // Add role-specific features
    if (role === "advocate" && planStatus === "heroOffer") {
      baseFeatures.heroOffer.push("Multi-family case management", "Professional resource library");
    } else if (role === "professional" && planStatus === "heroOffer") {
      baseFeatures.heroOffer.push("Team collaboration tools", "Student outcome analytics");
    } else if (role === "parent" && planStatus === "heroOffer") {
      baseFeatures.heroOffer.push("Monthly parent consultations", "Family advocacy tools");
    }

    return baseFeatures[planStatus as keyof typeof baseFeatures] || baseFeatures.free;
  };

  const details = getPlanDetails();
  const features = getPlanFeatures();

  function getPlanDetails() {
    switch (planStatus) {
      case "free":
        return {
          title: "Free Plan Active",
          subtitle: "You're using our free tier",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          iconColor: "text-gray-600"
        };
      case "heroOffer":
        return {
          title: "Hero Plan Active",
          subtitle: "$495/year - Full access unlocked",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          iconColor: "text-blue-600"
        };
      case "retainer":
        return {
          title: "Retainer Client",
          subtitle: "Premium advocacy services",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
          iconColor: "text-purple-600"
        };
      default:
        return {
          title: "Plan Status Unknown",
          subtitle: "Please contact support",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          iconColor: "text-yellow-600"
        };
    }
  }

  return (
    <div className={`border-2 ${details.borderColor} ${details.bgColor} rounded-lg p-6`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`${details.iconColor}`}>
          {planStatus === "heroOffer" ? <Crown className="w-6 h-6" /> : 
           planStatus === "retainer" ? <Gift className="w-6 h-6" /> :
           <Star className="w-6 h-6" />}
        </div>
        <div>
          <h3 className="font-bold text-lg">{details.title}</h3>
          <p className="text-sm text-gray-600">{details.subtitle}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-semibold text-sm">Your Features:</p>
        <ul className="grid grid-cols-1 gap-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <span className="text-green-500">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}