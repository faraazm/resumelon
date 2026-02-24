"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useState, useEffect, useCallback, useRef, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Undo2,
} from "lucide-react";
import {
  RocketLaunchIcon,
  LightBulbIcon,
  UserGroupIcon,
  AcademicCapIcon,
  FireIcon,
  SparklesIcon as SparklesOutlineIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";

// Minimum height for AI section to prevent layout shift during loading
const AI_SECTION_MIN_HEIGHT = 80;

// Tone options for AI rewriting - defined outside component to prevent recreation
const TONE_OPTIONS = [
  { id: "expert", label: "Expert", Icon: AcademicCapIcon },
  { id: "results-oriented", label: "Results-oriented", Icon: RocketLaunchIcon },
  { id: "innovative", label: "Innovative", Icon: LightBulbIcon },
  { id: "collaborative", label: "Collaborative", Icon: UserGroupIcon },
  { id: "enthusiastic", label: "Enthusiastic", Icon: FireIcon },
  { id: "random", label: "Random", Icon: SparklesOutlineIcon },
] as const;

// Default tone for generation
const DEFAULT_TONE = "expert";

export type ToneType = (typeof TONE_OPTIONS)[number]["id"];

interface AIGeneration {
  content: string;
  tone: string;
  prompt?: string;
  createdAt: number;
}

// Persisted AI state that survives component remounts (tab switches)
export interface AIUsageState {
  hasUsedAI: boolean;
  originalContent: string | null;
  activeItemIndex: number | null;
}

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
  // AI-related props
  resumeId?: string;
  fieldType?: string;
  fieldId?: string;
  aiGenerations?: AIGeneration[];
  isGenerating?: boolean;
  onGenerate?: (tone: ToneType) => void;
  onCustomPrompt?: (prompt: string) => void;
  onUseGeneration?: (content: string, generationIndex: number) => void;
  showAI?: boolean;
  // Persisted AI usage state (lifted to parent so it survives remounts)
  aiUsageState?: AIUsageState;
  onAIUsageStateChange?: (state: AIUsageState) => void;
}

// Memoized Toolbar button component
const ToolbarButton = memo(function ToolbarButton({
  onClick,
  isActive,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {children}
    </button>
  );
});

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start typing...",
  minHeight,
  resumeId,
  fieldType,
  fieldId,
  aiGenerations = [],
  isGenerating = false,
  onGenerate,
  onCustomPrompt,
  onUseGeneration,
  showAI = true,
  aiUsageState,
  onAIUsageStateChange,
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [customPromptOpen, setCustomPromptOpen] = useState(false);
  const [currentGenerationIndex, setCurrentGenerationIndex] = useState(0);
  const [selectedTone, setSelectedTone] = useState<string | null>(null);

  // AI usage state - use lifted state from parent if provided, otherwise local
  const hasUsedAI = aiUsageState?.hasUsedAI ?? false;
  const originalContent = aiUsageState?.originalContent ?? null;
  const activeItemIndex = aiUsageState?.activeItemIndex ?? null;

  // Helper to update AI usage state (persisted in parent)
  const updateAIUsageState = useCallback((updates: Partial<AIUsageState>) => {
    const current: AIUsageState = {
      hasUsedAI: aiUsageState?.hasUsedAI ?? false,
      originalContent: aiUsageState?.originalContent ?? null,
      activeItemIndex: aiUsageState?.activeItemIndex ?? null,
    };
    onAIUsageStateChange?.({ ...current, ...updates });
  }, [aiUsageState, onAIUsageStateChange]);

  // Track if user is actively editing to prevent external updates from resetting cursor
  const isUserEditing = useRef(false);

  // Keep track of generations and update index when new ones arrive
  useEffect(() => {
    if (aiGenerations.length > 0) {
      const latestIndex = aiGenerations.length - 1;
      setCurrentGenerationIndex(latestIndex);
      const latestGen = aiGenerations[latestIndex];
      setSelectedTone(latestGen.tone);
    }
  }, [aiGenerations.length]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
    ],
    content: content || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none overflow-hidden break-words [overflow-wrap:anywhere] text-sm",
          "prose-p:my-1 prose-ul:my-1 prose-ol:my-1",
          "prose-li:my-0",
          "[&_ul]:list-disc [&_ul]:pl-3",
          "[&_ol]:list-decimal [&_ol]:pl-3"
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onFocus: () => {
      isUserEditing.current = true;
    },
    onBlur: () => {
      // Small delay to allow any pending updates to complete
      setTimeout(() => {
        isUserEditing.current = false;
      }, 100);
    },
  });

  // Only update editor when content changes from EXTERNAL source
  // (e.g., "Use" button, initial load, or prop change from parent)
  useEffect(() => {
    if (!editor) return;

    // Never update while user is actively editing - this prevents cursor jumping
    if (isUserEditing.current) {
      return;
    }

    // Check if editor content differs from prop
    const currentEditorContent = editor.getHTML();
    if (content !== currentEditorContent) {
      editor.commands.setContent(content || "", { emitUpdate: false });
    }
  }, [content, editor]);

  const addLink = useCallback(() => {
    if (linkUrl && editor) {
      const { from, to } = editor.state.selection;
      if (from === to) {
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${linkUrl}">${linkUrl}</a>`)
          .run();
      } else {
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: linkUrl })
          .run();
      }
      setLinkUrl("");
      setLinkPopoverOpen(false);
    }
  }, [editor, linkUrl]);

  const handleRewrite = useCallback((tone: ToneType) => {
    // Show AI preview section again for new generation
    updateAIUsageState({ hasUsedAI: false });
    onGenerate?.(tone);
  }, [onGenerate, updateAIUsageState]);

  const handleCustomPromptSubmit = useCallback(() => {
    if (customPrompt.trim() && onCustomPrompt) {
      // Show AI preview section again for new generation
      updateAIUsageState({ hasUsedAI: false });
      onCustomPrompt(customPrompt.trim());
      setCustomPrompt("");
      setCustomPromptOpen(false);
    }
  }, [customPrompt, onCustomPrompt, updateAIUsageState]);

  const handleUseGeneration = useCallback(() => {
    if (aiGenerations.length > 0 && onUseGeneration) {
      const generation = aiGenerations[currentGenerationIndex];
      onUseGeneration(generation.content, currentGenerationIndex);
      // Store original content before applying AI (only on first use), hide preview, set active index
      updateAIUsageState({
        hasUsedAI: true,
        originalContent: originalContent === null ? content : originalContent,
        activeItemIndex: currentGenerationIndex + 1,
      });
    }
  }, [aiGenerations, currentGenerationIndex, onUseGeneration, content, originalContent, updateAIUsageState]);

  // Navigate the combined list: 0 = original, 1+ = AI generations
  const totalItems = hasUsedAI && originalContent !== null ? aiGenerations.length + 1 : aiGenerations.length;
  const currentItemIndex = hasUsedAI && activeItemIndex !== null ? activeItemIndex : currentGenerationIndex;

  const handlePrevItem = useCallback(() => {
    if (hasUsedAI && originalContent !== null) {
      // Combined pagination: 0 = original, 1+ = AI gens
      const newIndex = Math.max(0, (activeItemIndex ?? 1) - 1);
      updateAIUsageState({ activeItemIndex: newIndex });
      if (newIndex === 0) {
        onChange(originalContent);
      } else if (onUseGeneration && aiGenerations[newIndex - 1]) {
        onUseGeneration(aiGenerations[newIndex - 1].content, newIndex - 1);
      }
    } else {
      const newIndex = Math.max(0, currentGenerationIndex - 1);
      setCurrentGenerationIndex(newIndex);
    }
  }, [hasUsedAI, originalContent, activeItemIndex, currentGenerationIndex, onChange, onUseGeneration, aiGenerations, updateAIUsageState]);

  const handleNextItem = useCallback(() => {
    if (hasUsedAI && originalContent !== null) {
      const maxIndex = aiGenerations.length; // 0 = original, so max = aiGenerations.length
      const newIndex = Math.min(maxIndex, (activeItemIndex ?? 0) + 1);
      updateAIUsageState({ activeItemIndex: newIndex });
      if (newIndex === 0) {
        onChange(originalContent);
      } else if (onUseGeneration && aiGenerations[newIndex - 1]) {
        onUseGeneration(aiGenerations[newIndex - 1].content, newIndex - 1);
      }
    } else {
      const newIndex = Math.min(aiGenerations.length - 1, currentGenerationIndex + 1);
      setCurrentGenerationIndex(newIndex);
    }
  }, [hasUsedAI, originalContent, activeItemIndex, currentGenerationIndex, onChange, onUseGeneration, aiGenerations, updateAIUsageState]);

  // Label for current item in pagination
  const currentItemLabel = hasUsedAI && activeItemIndex === 0 ? "Original" : null;

  const prevItemIndexRef = useRef(currentItemIndex);

  const currentGeneration = aiGenerations[currentGenerationIndex];
  const hasGenerations = aiGenerations.length > 0;

  // Check if there's actual content (not just empty HTML tags)
  const hasContent = content && content.replace(/<[^>]*>/g, "").trim().length > 0;

  if (!editor) {
    return (
      <div className="rounded-md border bg-background overflow-hidden">
        <div className="flex items-center gap-0.5 border-b px-2 py-1 h-10" />
        <div className={cn("px-3 py-2", "min-h-[60px]")} />
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-background overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 border-b px-2 py-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold (Cmd+B)"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic (Cmd+I)"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <div className="mx-1 h-4 w-px bg-border" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <div className="mx-1 h-4 w-px bg-border" />

        <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded text-sm transition-colors",
                editor.isActive("link")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title="Add Link"
            >
              <Link2 className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Link URL</label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLink();
                    }
                  }}
                />
                <Button size="sm" onClick={addLink}>
                  Add
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Editor Content */}
      <div className={cn("px-3 py-2 relative overflow-hidden", !hasContent && "min-h-[60px]")}>
        <EditorContent
          editor={editor}
          className="focus-within:outline-none overflow-hidden [&_.ProseMirror]:overflow-hidden"
        />
        {!hasContent && (
          <p className="pointer-events-none absolute top-2 left-3 text-sm text-muted-foreground">
            {placeholder}
          </p>
        )}
      </div>

      {/* AI Generation Section - only show when there's content */}
      {showAI && hasContent && (
        <>
          {/* AI Content Section - Light blue background with sparkle divider */}
          {/* Animated expand/collapse when toggling between Use and Revert */}
          {/* Sparkle divider - positioned outside the animated container to avoid clipping */}
          <AnimatePresence initial={false}>
            {!hasUsedAI && (isGenerating || hasGenerations) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative h-0"
              >
                <div className="absolute inset-x-4 top-0 border-t-2 border-dashed border-primary/30" />
                <div className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-background px-1">
                  <SparklesIcon className="h-5 w-5 text-primary" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {!hasUsedAI && (isGenerating || hasGenerations) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.2, ease: "easeInOut" },
                }}
                className="overflow-hidden"
              >
                <div
                  className="bg-primary/5 relative"
                  style={{ minHeight: AI_SECTION_MIN_HEIGHT }}
                >
                  {/* AI Generated Content */}
                  {isGenerating ? (
                    <div
                      className="px-4 py-4 flex items-center justify-center"
                      style={{ minHeight: AI_SECTION_MIN_HEIGHT }}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <p className="text-sm font-medium text-muted-foreground">
                          Generating improved content...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      className="px-4 py-4"
                    >
                      <div
                        className={cn(
                          "prose prose-sm max-w-none text-foreground break-words [overflow-wrap:anywhere] text-sm",
                          "prose-p:my-1 prose-ul:my-1 prose-ol:my-1",
                          "prose-li:my-0",
                          "[&_ul]:list-disc [&_ul]:pl-3",
                          "[&_ol]:list-decimal [&_ol]:pl-3"
                        )}
                        dangerouslySetInnerHTML={{
                          __html: currentGeneration?.content || "",
                        }}
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Controls Footer */}
          <div className="grid grid-cols-3 items-center gap-1 px-3 py-1.5 border-t border-border bg-background rounded-b-md">
            {/* Left - tone badge */}
            <div className="flex items-center gap-1.5 min-w-0">
              {hasUsedAI ? (
                currentItemLabel ? (
                  <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground truncate">
                    <Undo2 className="h-3 w-3 shrink-0" />
                    <span className="truncate">Original</span>
                  </span>
                ) : (
                  selectedTone && (
                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary truncate">
                      <SparklesOutlineIcon className="h-3 w-3 shrink-0" />
                      <span className="truncate">{TONE_OPTIONS.find((t) => t.id === selectedTone)?.label || selectedTone}</span>
                    </span>
                  )
                )
              ) : (
                selectedTone && (
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary truncate">
                    <Check className="h-3 w-3 shrink-0" />
                    <span className="truncate">{TONE_OPTIONS.find((t) => t.id === selectedTone)?.label || selectedTone}</span>
                  </span>
                )
              )}
            </div>

            {/* Center - pagination */}
            <div className="flex items-center justify-center">
              {hasGenerations && totalItems > 1 && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevItem}
                    disabled={currentItemIndex === 0}
                    className="h-7 w-7"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {currentItemIndex + 1}/{totalItems}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextItem}
                    disabled={currentItemIndex === totalItems - 1}
                    className="h-7 w-7"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Right - actions */}
            <div className="flex items-center gap-1 justify-end">
              {/* Rewrite Dropdown */}
              {!customPromptOpen && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" disabled={isGenerating} className="gap-1.5 h-7 px-2.5 text-xs">
                      <SparklesOutlineIcon className="h-3.5 w-3.5" />
                      Rewrite
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    {TONE_OPTIONS.map((tone) => (
                      <DropdownMenuItem
                        key={tone.id}
                        onClick={() => handleRewrite(tone.id)}
                      >
                        <tone.Icon className="mr-1.5 h-4 w-4 text-muted-foreground" />
                        {tone.label}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setCustomPromptOpen(true);
                      }}
                    >
                      <ChatBubbleLeftRightIcon className="mr-1.5 h-4 w-4 text-muted-foreground" />
                      Ask AI to...
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Custom Prompt Popover */}
              {customPromptOpen && (
                <Popover
                  open={customPromptOpen}
                  onOpenChange={setCustomPromptOpen}
                >
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1.5 h-7 px-2.5 text-xs">
                      <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" />
                      Ask AI
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-80"
                    align="end"
                    sideOffset={8}
                  >
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">
                        Write your request...
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Make it more concise..."
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleCustomPromptSubmit();
                            }
                          }}
                          autoFocus
                        />
                        <Button
                          size="icon"
                          onClick={handleCustomPromptSubmit}
                          className="shrink-0"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              {/* Use Button - only before using */}
              {!hasUsedAI && hasGenerations && (
                <Button
                  size="sm"
                  onClick={handleUseGeneration}
                  disabled={isGenerating}
                  title="Use this suggestion"
                  className="gap-1.5 h-7 px-2.5 text-xs"
                >
                  <Check className="h-3.5 w-3.5" />
                  Use
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
