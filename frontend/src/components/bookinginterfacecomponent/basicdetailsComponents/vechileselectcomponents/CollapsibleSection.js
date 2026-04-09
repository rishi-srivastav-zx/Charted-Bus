import { useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../../../app/lib/uitls";

const CollapsibleSection = ({
    title,
    items,
    type = "check",
    maxVisible = 4,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasMore = items.length > maxVisible;
    const visibleItems = isExpanded ? items : items.slice(0, maxVisible);
    const hiddenCount = items.length - maxVisible;

    return (
        <div>
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div
                    className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        type === "check" ? "bg-green-100" : "bg-red-100",
                    )}
                >
                    {type === "check" ? (
                        <Check className="w-4 h-4 text-green-600" />
                    ) : (
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                    )}
                </div>
                {title}
            </h4>
            <ul className="space-y-3">
                {visibleItems.map((item, idx) => (
                    <li
                        key={idx}
                        className="flex items-start gap-3 text-sm text-slate-700"
                    >
                        {type === "check" ? (
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-red-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
            {hasMore && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-3 flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp className="w-4 h-4" />
                            Show Less
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-4 h-4" />
                            Show {hiddenCount} More
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

export default CollapsibleSection;
