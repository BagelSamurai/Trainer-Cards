"use client";

import Image from "next/image";
import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTeam } from "../lib/teamContext";
import type { Pokemon } from "../types/index";

function pad3(n: number): string {
  return n.toString().padStart(3, "0");
}

function FilledSlot({
  p,
  onRemove,
}: {
  p: Pokemon;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: p.id });

  const [hover, setHover] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 5 : 1,
  } as const;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative rounded-[14px] bg-[var(--color-subtle)] aspect-[1/1.05] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...attributes}
      {...listeners}
    >
      <span
        className="absolute top-1.5 left-2 text-[9px]"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-ink-3)",
        }}
      >
        #{pad3(p.id)}
      </span>

      <div className="relative w-12 h-12">
        <Image
          src={p.image}
          alt={p.name}
          fill
          sizes="48px"
          className="object-contain pointer-events-none"
          unoptimized
        />
      </div>

      <span
        className="text-[11px] font-semibold capitalize mt-1 truncate w-full text-center px-1"
        style={{ color: "var(--color-ink-1)" }}
      >
        {p.name}
      </span>

      {/* Hover red remove overlay */}
      {hover && !isDragging && (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute inset-0 rounded-[14px] flex items-center justify-center text-white text-[12px] font-semibold tracking-wide"
          style={{ background: "rgba(238, 21, 21, 0.92)" }}
          aria-label={`Remove ${p.name}`}
        >
          ✕ remove
        </button>
      )}
    </div>
  );
}

function EmptySlot({ index }: { index: number }) {
  return (
    <div
      className="aspect-[1/1.05] rounded-[14px] flex flex-col items-center justify-center"
      style={{
        border: "1.5px dashed var(--color-hairline)",
      }}
    >
      <span
        className="text-[10px] tracking-[0.2em] uppercase"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-ink-3)",
        }}
      >
        0{index + 1}
      </span>
      <span
        className="text-[20px] leading-none mt-1"
        style={{ color: "var(--color-ink-3)" }}
      >
        +
      </span>
      <span
        className="text-[10px] mt-1"
        style={{ color: "var(--color-ink-3)" }}
      >
        empty
      </span>
    </div>
  );
}

export default function Team() {
  const { team, removeFromTeam, reorderTeam } = useTeam();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    reorderTeam(Number(active.id), Number(over.id));
  }

  const filledIds = team.map((p) => p.id);
  const emptyCount = Math.max(0, 6 - team.length);

  return (
    <section className="rounded-[var(--radius-pane)] hairline bg-[var(--color-surface)] p-[18px]">
      <div className="flex items-center justify-between mb-3">
        <div
          className="text-[10px] tracking-[0.2em] uppercase"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-ink-3)",
          }}
        >
          Your team
        </div>
        <div
          className="text-[11px]"
          style={{ color: "var(--color-ink-3)" }}
        >
          click slot to remove · drag to reorder
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={filledIds} strategy={horizontalListSortingStrategy}>
          <div className="grid grid-cols-6 gap-3">
            {team.map((p) => (
              <FilledSlot
                key={p.id}
                p={p}
                onRemove={() => removeFromTeam(p.id)}
              />
            ))}
            {Array.from({ length: emptyCount }).map((_, i) => (
              <EmptySlot key={`empty-${i}`} index={team.length + i} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
}
