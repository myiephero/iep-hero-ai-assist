import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tag, Brain, Shield, RefreshCw } from "lucide-react";

interface DocumentTagsDisplayProps {
  document: any;
  onRetag?: (documentId: string) => void;
  isRetagging?: boolean;
}

const CATEGORY_ICONS = {
  academic: "📚",
  behavioral: "🧠", 
  medical: "⚕️",
  legal: "⚖️",
  administrative: "📋",
  communication: "💬",
  transition: "🎓",
  assessment: "📊",
  services: "🛠️",
  advocacy: "🗣️"
};

const CATEGORY_COLORS = {
  academic: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  behavioral: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  medical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  legal: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  administrative: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  communication: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  transition: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  assessment: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  services: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
  advocacy: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
};

export function DocumentTagsDisplay({ document, onRetag, isRetagging = false }: DocumentTagsDisplayProps) {
  const hasSmartTags = document.category || (document.tags && document.tags.length > 0);
  const categoryIcon = CATEGORY_ICONS[document.category as keyof typeof CATEGORY_ICONS] || "📄";
  const categoryColor = CATEGORY_COLORS[document.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.administrative;

  if (!hasSmartTags) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Tag className="w-4 h-4" />
        <span>No smart tags</span>
        {onRetag && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onRetag(document.id)}
            disabled={isRetagging}
            className="h-6 px-2 text-xs"
          >
            {isRetagging ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Auto-tag"}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Category Badge */}
        {document.category && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge className={`${categoryColor} text-xs font-medium`}>
                  <span className="mr-1">{categoryIcon}</span>
                  {document.category}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>AI Category: {document.category}</p>
                {document.confidence && (
                  <p className="text-xs">Confidence: {document.confidence}%</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* AI Confidence Indicator */}
        {document.confidence && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Brain className="w-3 h-3" />
                  <span>{document.confidence}%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>AI Categorization Confidence</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Retag Button */}
        {onRetag && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onRetag(document.id)}
            disabled={isRetagging}
            className="h-6 px-2 text-xs"
          >
            {isRetagging ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          </Button>
        )}
      </div>

      {/* Tags */}
      {document.tags && document.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {document.tags.slice(0, 8).map((tag: string, index: number) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {tag}
            </Badge>
          ))}
          {document.tags.length > 8 && (
            <Badge 
              variant="secondary" 
              className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            >
              +{document.tags.length - 8} more
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

export default DocumentTagsDisplay;