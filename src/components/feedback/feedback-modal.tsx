"use client";

import { MessageSquare, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { addFeedback } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/navigation";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fieldClass =
  "w-full rounded-lg border border-input bg-background px-4 py-3 text-base transition-shadow focus-visible:ring-2 focus-visible:ring-ring/50 aria-invalid:border-destructive";

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const t = useTranslations("overlays.feedback");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 제출을 한 번 시도한 뒤부터 공백만 있는 칸을 오류로 표시 (빈 칸은 네이티브 required가 먼저 막는다)
  const [showErrors, setShowErrors] = useState(false);
  const titleInvalid = showErrors && !title.trim();
  const contentInvalid = showErrors && !content.trim();
  // Trigger 없이 열리므로 Radix가 포커스를 돌려주지 못한다 → 연 요소를 기억해 직접 복원
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // aria-disabled는 Enter 제출을 막지 않으므로 전송 중 중복 제출은 여기서 막는다
    if (isSubmitting) return;
    // 빈 칸은 네이티브 required가 막고, 공백만 입력한 칸은 오류 문구를 붙이고 첫 번째 칸으로 포커스를 보낸다
    if (!title.trim() || !content.trim()) {
      setShowErrors(true);
      (title.trim() ? contentRef : titleRef).current?.focus();
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await addFeedback({ title, content });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setTitle("");
        setContent("");
        setShowErrors(false);
        setIsSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("피드백 전송 실패:", error);
      setError(t("submitFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        aria-modal="true"
        onOpenAutoFocus={() => {
          returnFocusRef.current = document.activeElement as HTMLElement | null;
        }}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          returnFocusRef.current?.focus();
        }}
        className="max-h-[90dvh] gap-0 rounded-t-xl pb-[env(safe-area-inset-bottom)] data-[state=closed]:duration-150 data-[state=open]:duration-200 sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:border sm:pb-0 sm:data-[state=closed]:fade-out-0 sm:data-[state=closed]:slide-out-to-bottom-4 sm:data-[state=open]:fade-in-0 sm:data-[state=open]:slide-in-from-bottom-4"
      >
        <SheetHeader className="shrink-0 flex-row items-center gap-3 border-b pr-14">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MessageSquare size={20} aria-hidden />
          </div>
          <div className="space-y-0.5">
            <SheetTitle className="text-lg">{t("title")}</SheetTitle>
            <SheetDescription>{t("description")}</SheetDescription>
          </div>
        </SheetHeader>

        {/* 항상 렌더되는 live region: 폼이 보일 때는 비어 있고(높이 0), 성공 시 문구가 채워진다 */}
        <div
          role="status"
          className={
            isSuccess
              ? "flex min-h-0 flex-1 flex-col items-center gap-3 overflow-y-auto px-4 py-10 text-center"
              : undefined
          }
        >
          {isSuccess && (
            <>
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Send size={28} aria-hidden />
              </div>
              <p className="text-lg font-semibold">{t("successTitle")}</p>
              <p className="text-muted-foreground">{t("successMessage")}</p>
            </>
          )}
        </div>

        {!isSuccess && (
          // 헤더(닫기 버튼)와 제출 버튼은 고정하고 입력 영역만 스크롤
          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4">
              <div>
                <label
                  htmlFor="feedback-title"
                  className="mb-2 block text-sm font-medium"
                >
                  {t("titleLabel")}{" "}
                  <span aria-hidden className="text-destructive">
                    *
                  </span>
                </label>
                <input
                  id="feedback-title"
                  ref={titleRef}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("titlePlaceholder")}
                  className={fieldClass}
                  required
                  aria-invalid={titleInvalid || undefined}
                  aria-describedby={
                    titleInvalid ? "feedback-title-error" : undefined
                  }
                />
                {titleInvalid && (
                  <p
                    id="feedback-title-error"
                    className="mt-1.5 text-sm text-destructive"
                  >
                    {t("titleRequired")}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="feedback-content"
                  className="mb-2 block text-sm font-medium"
                >
                  {t("contentLabel")}{" "}
                  <span aria-hidden className="text-destructive">
                    *
                  </span>
                </label>
                <textarea
                  id="feedback-content"
                  ref={contentRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t("contentPlaceholder")}
                  rows={6}
                  className={`${fieldClass} resize-none`}
                  required
                  aria-invalid={contentInvalid || undefined}
                  aria-describedby={
                    contentInvalid ? "feedback-content-error" : undefined
                  }
                />
                {contentInvalid && (
                  <p
                    id="feedback-content-error"
                    className="mt-1.5 text-sm text-destructive"
                  >
                    {t("contentRequired")}
                  </p>
                )}
              </div>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                {t("privacyNotice")}{" "}
                {/* 새 탭: 같은 탭 이동 시 모달이 언마운트되어 작성 중인 내용이 사라짐 */}
                <Link
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  {t("privacyLink")}
                </Link>
              </p>
            </div>
            <div className="shrink-0 border-t p-4">
              {/* 전송 중에도 포커스를 잃지 않도록 native disabled 대신 aria-disabled (중복 제출은 handleSubmit에서 막음) */}
              <Button
                type="submit"
                size="lg"
                className="h-11 w-full gap-2"
                aria-disabled={isSubmitting || undefined}
              >
                {isSubmitting ? (
                  <>
                    <span
                      aria-hidden
                      className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                    />
                    {t("submitting")}
                  </>
                ) : (
                  <>
                    <Send size={16} aria-hidden />
                    {t("submit")}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
