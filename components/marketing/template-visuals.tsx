"use client";

import { motion } from "framer-motion";
import { ScaledResume, ScaledCoverLetter } from "./template-preview";

// ── Shared: Floating Badge ────────────────────────────────────────────────────

interface BadgeProps {
  icon: React.ElementType;
  label: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  delay?: number;
  variant?: "default" | "success" | "accent" | "blue" | "amber" | "rose" | "teal";
}

function FloatingBadge({
  icon: Icon,
  label,
  position,
  delay = 0.7,
  variant = "default",
}: BadgeProps) {
  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  const initial = {
    "top-left": { opacity: 0, x: -20 },
    "top-right": { opacity: 0, x: 20 },
    "bottom-left": { opacity: 0, y: 20 },
    "bottom-right": { opacity: 0, y: 20 },
  };

  const animate = {
    "top-left": { opacity: 1, x: 0 },
    "top-right": { opacity: 1, x: 0 },
    "bottom-left": { opacity: 1, y: 0 },
    "bottom-right": { opacity: 1, y: 0 },
  };

  const variantStyles = {
    default: {
      className: "bg-white",
      iconColor: "text-gray-600",
      textColor: "text-gray-700",
      shadow:
        "0 4px 20px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
      border: "1px solid rgba(0,0,0,0.06)",
    },
    success: {
      className: "bg-emerald-50",
      iconColor: "text-emerald-600",
      textColor: "text-emerald-700",
      shadow:
        "0 4px 20px rgba(16,185,129,0.15), 0 2px 8px rgba(0,0,0,0.04)",
      border: "1px solid rgba(16,185,129,0.2)",
    },
    accent: {
      className: "bg-violet-50",
      iconColor: "text-violet-600",
      textColor: "text-violet-700",
      shadow:
        "0 4px 20px rgba(139,92,246,0.15), 0 2px 8px rgba(0,0,0,0.04)",
      border: "1px solid rgba(139,92,246,0.2)",
    },
    blue: {
      className: "bg-blue-50",
      iconColor: "text-blue-600",
      textColor: "text-blue-700",
      shadow:
        "0 4px 20px rgba(59,130,246,0.15), 0 2px 8px rgba(0,0,0,0.04)",
      border: "1px solid rgba(59,130,246,0.2)",
    },
    amber: {
      className: "bg-amber-50",
      iconColor: "text-amber-600",
      textColor: "text-amber-700",
      shadow:
        "0 4px 20px rgba(245,158,11,0.15), 0 2px 8px rgba(0,0,0,0.04)",
      border: "1px solid rgba(245,158,11,0.2)",
    },
    rose: {
      className: "bg-rose-50",
      iconColor: "text-rose-600",
      textColor: "text-rose-700",
      shadow:
        "0 4px 20px rgba(244,63,94,0.15), 0 2px 8px rgba(0,0,0,0.04)",
      border: "1px solid rgba(244,63,94,0.2)",
    },
    teal: {
      className: "bg-teal-50",
      iconColor: "text-teal-600",
      textColor: "text-teal-700",
      shadow:
        "0 4px 20px rgba(20,184,166,0.15), 0 2px 8px rgba(0,0,0,0.04)",
      border: "1px solid rgba(20,184,166,0.2)",
    },
  };

  const v = variantStyles[variant];

  return (
    <motion.div
      initial={initial[position]}
      whileInView={animate[position]}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className={`absolute ${positionClasses[position]} flex items-center gap-1.5 px-3 py-2 rounded-lg ${v.className} whitespace-nowrap z-20`}
      style={{ boxShadow: v.shadow, border: v.border }}
    >
      <Icon className={`w-4 h-4 ${v.iconColor}`} />
      <span className={`text-xs font-medium ${v.textColor}`}>{label}</span>
    </motion.div>
  );
}

// ── Visual 1: Fanned Documents ────────────────────────────────────────────────
// 3 documents fanned out with rotation on a gradient background

interface FannedCard {
  templateId: string;
  rotate: number;
  x: number;
  y: number;
  delay: number;
}

interface FannedDocumentsProps {
  cards: FannedCard[];
  type: "resume" | "cover-letter";
  gradient: string;
  badges?: BadgeProps[];
}

export function FannedDocuments({
  cards,
  type,
  gradient,
  badges = [],
}: FannedDocumentsProps) {
  const Renderer = type === "resume" ? ScaledResume : ScaledCoverLetter;

  return (
    <div
      className={`relative w-full h-full min-h-[400px] sm:min-h-[460px] flex items-center justify-center rounded-2xl ${gradient} overflow-hidden`}
    >
      <div className="relative w-[280px] sm:w-[320px] h-[360px] sm:h-[420px]">
        {cards.map((card, index) => (
          <motion.div
            key={card.templateId}
            className="absolute inset-0"
            initial={{ opacity: 0, y: 50, rotate: 0 }}
            whileInView={{ opacity: 1, y: card.y, rotate: card.rotate }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.6,
              delay: card.delay,
              ease: "easeOut",
            }}
            style={{
              x: card.x,
              zIndex: index,
              filter: `drop-shadow(0 ${14 + index * 6}px ${24 + index * 10}px rgba(0, 0, 0, ${0.1 + index * 0.04}))`,
            }}
          >
            <div className="block sm:hidden">
              <Renderer templateId={card.templateId} width={280} />
            </div>
            <div className="hidden sm:block">
              <Renderer templateId={card.templateId} width={320} />
            </div>
          </motion.div>
        ))}
      </div>
      {badges.map((badge) => (
        <FloatingBadge key={badge.label} {...badge} />
      ))}
    </div>
  );
}

// ── Visual 2: Stacked Documents with Sparkle ──────────────────────────────────
// 2 documents stacked with a pulsing sparkle icon

interface StackedDocumentsProps {
  cards: { templateId: string; rotate: number; x: number; y: number; delay: number }[];
  type: "resume" | "cover-letter";
  gradient: string;
  sparkleColor?: string;
  badges?: BadgeProps[];
}

export function StackedDocuments({
  cards,
  type,
  gradient,
  sparkleColor = "text-teal-500",
  badges = [],
}: StackedDocumentsProps) {
  const Renderer = type === "resume" ? ScaledResume : ScaledCoverLetter;

  return (
    <div
      className={`relative w-full h-full min-h-[400px] sm:min-h-[460px] flex items-center justify-center rounded-2xl ${gradient} overflow-hidden`}
    >
      <div className="relative w-[280px] sm:w-[320px] h-[360px] sm:h-[420px]">
        {cards.map((card, index) => (
          <motion.div
            key={card.templateId}
            className="absolute inset-0"
            initial={{ opacity: 0, y: 40, rotate: 0 }}
            whileInView={{
              opacity: 1,
              y: card.y,
              rotate: card.rotate,
            }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.6,
              delay: card.delay,
              ease: "easeOut",
            }}
            style={{
              x: card.x,
              zIndex: index,
              filter: `drop-shadow(0 ${16 + index * 8}px ${28 + index * 12}px rgba(0, 0, 0, ${0.1 + index * 0.05}))`,
            }}
          >
            <div className="block sm:hidden">
              <Renderer templateId={card.templateId} width={280} />
            </div>
            <div className="hidden sm:block">
              <Renderer templateId={card.templateId} width={320} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sparkle pulse */}
      <motion.div
        className="absolute top-[28%] right-[12%] z-10"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <div className="relative">
          <svg
            className={`w-6 h-6 ${sparkleColor}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" />
          </svg>
          <motion.div
            className={`absolute -inset-2 rounded-full ${sparkleColor.replace("text-", "bg-").replace("500", "400")}/20`}
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {badges.map((badge) => (
        <FloatingBadge key={badge.label} {...badge} />
      ))}
    </div>
  );
}

// ── Visual 3: Template Grid ───────────────────────────────────────────────────
// 2x2 grid of documents with subtle rotations and stagger

interface TemplateGridProps {
  templates: { id: string; rotate: number; x: number; y: number; delay: number }[];
  type: "resume" | "cover-letter";
  gradient: string;
  badges?: BadgeProps[];
}

export function TemplateGrid({
  templates,
  type,
  gradient,
  badges = [],
}: TemplateGridProps) {
  const Renderer = type === "resume" ? ScaledResume : ScaledCoverLetter;

  return (
    <div
      className={`relative w-full h-full min-h-[440px] sm:min-h-[500px] flex items-center justify-center rounded-2xl ${gradient} overflow-hidden py-6`}
    >
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {templates.map((tpl, index) => (
          <motion.div
            key={tpl.id}
            initial={{ opacity: 0, y: 35, rotate: 0 }}
            whileInView={{ opacity: 1, y: tpl.y, rotate: tpl.rotate }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: tpl.delay,
              ease: "easeOut",
            }}
            style={{
              x: tpl.x,
              filter: `drop-shadow(0 10px 28px rgba(0, 0, 0, ${0.08 + index * 0.02}))`,
            }}
          >
            <div className="block sm:hidden">
              <Renderer templateId={tpl.id} width={155} />
            </div>
            <div className="hidden sm:block">
              <Renderer templateId={tpl.id} width={195} />
            </div>
          </motion.div>
        ))}
      </div>
      {badges.map((badge) => (
        <FloatingBadge key={badge.label} {...badge} />
      ))}
    </div>
  );
}

// ── Visual 4: Single Tilted Document ──────────────────────────────────────────
// One large document tilted with floating badges around it

interface SingleDocumentProps {
  templateId: string;
  type: "resume" | "cover-letter";
  gradient: string;
  rotate?: number;
  badges?: BadgeProps[];
}

export function SingleDocument({
  templateId,
  type,
  gradient,
  rotate = 3,
  badges = [],
}: SingleDocumentProps) {
  const Renderer = type === "resume" ? ScaledResume : ScaledCoverLetter;

  return (
    <div
      className={`relative w-full h-full min-h-[400px] sm:min-h-[460px] flex items-center justify-center rounded-2xl ${gradient} overflow-hidden`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: 0 }}
        whileInView={{ opacity: 1, y: 0, rotate }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))",
        }}
      >
        <div className="block sm:hidden">
          <Renderer templateId={templateId} width={280} />
        </div>
        <div className="hidden sm:block">
          <Renderer templateId={templateId} width={340} />
        </div>
      </motion.div>
      {badges.map((badge) => (
        <FloatingBadge key={badge.label} {...badge} />
      ))}
    </div>
  );
}
