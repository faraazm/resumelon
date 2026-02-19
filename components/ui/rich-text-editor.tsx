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
  onUseGeneration?: (content: string) => void;
  showAI?: boolean;
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
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [customPromptOpen, setCustomPromptOpen] = useState(false);
  const [currentGenerationIndex, setCurrentGenerationIndex] = useState(0);
  const [selectedTone, setSelectedTone] = useState<string | null>(null);

  // Track if AI content has been used (to hide AI section and show revert)
  const [hasUsedAI, setHasUsedAI] = useState(false);
  // Store original content before AI was applied for revert functionality
  const [originalContent, setOriginalContent] = useState<string | null>(null);

  // Track if user is actively editing to prevent external updates from resetting cursor
  const isUserEditing = useRef(false);

  // Keep track of generations and update index when new ones arrive
  useEffect(() => {
    if (aiGenerations.length > 0) {
      setCurrentGenerationIndex(aiGenerations.length - 1);
      const latestGen = aiGenerations[aiGenerations.length - 1];
      setSelectedTone(latestGen.tone);
      // When new generations arrive, reset the "used" state to show AI section again
      setHasUsedAI(false);
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
          "prose prose-sm max-w-none focus:outline-none",
          "prose-p:my-1 prose-ul:my-1 prose-ol:my-1",
          "prose-li:my-0",
          "[&_ul]:list-disc [&_ul]:pl-4",
          "[&_ol]:list-decimal [&_ol]:pl-4"
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
    onGenerate?.(tone);
  }, [onGenerate]);

  const handleCustomPromptSubmit = useCallback(() => {
    if (customPrompt.trim() && onCustomPrompt) {
      onCustomPrompt(customPrompt.trim());
      setCustomPrompt("");
      setCustomPromptOpen(false);
    }
  }, [customPrompt, onCustomPrompt]);

  const handleUseGeneration = useCallback(() => {
    if (aiGenerations.length > 0 && onUseGeneration) {
      // Store original content before applying AI
      setOriginalContent(content);
      const generation = aiGenerations[currentGenerationIndex];
      onUseGeneration(generation.content);
      // Hide AI section after using
      setHasUsedAI(true);
    }
  }, [aiGenerations, currentGenerationIndex, onUseGeneration, content]);

  const handleRevertToOriginal = useCallback(() => {
    if (originalContent !== null && onChange) {
      onChange(originalContent);
      setHasUsedAI(false);
      setOriginalContent(null);
    }
  }, [originalContent, onChange]);

  const handlePrevGeneration = useCallback(() => {
    setCurrentGenerationIndex((i) => Math.max(0, i - 1));
  }, []);

  const handleNextGeneration = useCallback(() => {
    setCurrentGenerationIndex((i) => Math.min(aiGenerations.length - 1, i + 1));
  }, [aiGenerations.length]);

  const currentGeneration = aiGenerations[currentGenerationIndex];
  const hasGenerations = aiGenerations.length > 0;

  // Check if there's actual content (not just empty HTML tags)
  const hasContent = content && content.replace(/<[^>]*>/g, "").trim().length > 0;

  if (!editor) {
    return null;
  }

  return (
    <div className="rounded-md border bg-background">
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

      {/* Editor Content - auto height with min-height when empty */}
      <div className={cn("px-3 py-2 relative", !hasContent && "min-h-[60px]")}>
        <EditorContent
          editor={editor}
          className="focus-within:outline-none"
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
            {!hasUsedAI && (
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
            {!hasUsedAI && (
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
                  ) : hasGenerations ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      className="px-4 py-4"
                    >
                      <div
                        className="prose prose-sm max-w-none text-foreground"
                        dangerouslySetInnerHTML={{
                          __html: currentGeneration?.content || "",
                        }}
                      />
                    </motion.div>
                  ) : (
                    <div
                      className="px-4 py-3 flex items-center"
                      style={{ minHeight: AI_SECTION_MIN_HEIGHT }}
                    >
                      <p className="text-sm text-muted-foreground">
                        Click Rewrite to generate AI suggestions
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Controls Footer - White background */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-background rounded-b-md">
            {/* Left: Tone Badge (only show when not hasUsedAI) or Revert button */}
            <div className="flex items-center gap-2 min-h-[32px]">
              <AnimatePresence mode="wait" initial={false}>
                {hasUsedAI ? (
                  <motion.div
                    key="revert"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleRevertToOriginal}
                    >
                      <Undo2 className="mr-1 h-3.5 w-3.5" />
                      Revert
                    </Button>
                  </motion.div>
                ) : (
                  selectedTone && (
                    <motion.span
                      key="tone-badge"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      <Check className="h-3 w-3" />
                      {TONE_OPTIONS.find((t) => t.id === selectedTone)?.label ||
                        selectedTone}
                    </motion.span>
                  )
                )}
              </AnimatePresence>
            </div>

            {/* Right: Pagination, Rewrite, Use */}
            <div className="flex items-center gap-2">
              {/* Pagination - only show when AI content visible */}
              {!hasUsedAI && hasGenerations && aiGenerations.length > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevGeneration}
                    disabled={currentGenerationIndex === 0}
                    className="rounded p-1 hover:bg-muted disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-muted-foreground">
                    {currentGenerationIndex + 1}/{aiGenerations.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextGeneration}
                    disabled={currentGenerationIndex === aiGenerations.length - 1}
                    className="rounded p-1 hover:bg-muted disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Rewrite Dropdown Menu - only show when custom prompt popover is closed */}
              {!customPromptOpen && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" disabled={isGenerating}>
                      <SparklesOutlineIcon className="mr-1 h-3.5 w-3.5" />
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

              {/* Custom Prompt Popover - shows independently when open */}
              {customPromptOpen && (
                <Popover
                  open={customPromptOpen}
                  onOpenChange={setCustomPromptOpen}
                >
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <ChatBubbleLeftRightIcon className="mr-1 h-3.5 w-3.5" />
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

              {/* Use Button - only show when AI content visible and not used yet */}
              {!hasUsedAI && hasGenerations && (
                <Button
                  size="sm"
                  onClick={handleUseGeneration}
                  disabled={isGenerating}
                >
                  <Check className="mr-1 h-3.5 w-3.5" />
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
