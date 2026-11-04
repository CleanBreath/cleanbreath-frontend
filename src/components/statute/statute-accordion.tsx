"use client";

import { useState } from "react";
import { StatuteCard } from "./statute-card";

interface StatuteAccordionProps {
  items: {
    category: string;
    designated_no_smoking_areas: string[];
    content: string[];
  }[];
  /** items와 같은 순서의 시설 아이콘 */
  icons: React.ReactNode[];
}

/** 시설별 금연구역 아코디언. 한 번에 하나만 펼친다 (페이지 본문은 서버 컴포넌트) */
export function StatuteAccordion({ items, icons }: StatuteAccordionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((statute, index) => (
        <StatuteCard
          key={statute.category}
          category={statute.category}
          designatedNoSmokingAreas={statute.designated_no_smoking_areas}
          content={statute.content}
          icon={icons[index]}
          isExpanded={expandedIndex === index}
          onToggle={() =>
            setExpandedIndex((prev) => (prev === index ? null : index))
          }
          index={index}
        />
      ))}
    </div>
  );
}
