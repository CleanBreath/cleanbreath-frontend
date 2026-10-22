"use client";

import { MessageSquare, Send } from "lucide-react";
import Link from "next/link";
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

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fieldClass =
  "w-full rounded-lg border border-input bg-background px-4 py-3 text-base transition-shadow focus-visible:ring-2 focus-visible:ring-ring/50";

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Trigger 없이 열리므로 Radix가 포커스를 돌려주지 못한다 → 연 요소를 기억해 직접 복원
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await addFeedback({ title, content });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setTitle("");
        setContent("");
        setIsSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("피드백 전송 실패:", error);
      setError("전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
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
        className="max-h-[90dvh] gap-0 overflow-y-auto overscroll-contain rounded-t-xl pb-[env(safe-area-inset-bottom)] data-[state=closed]:duration-150 data-[state=open]:duration-200 sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:border sm:pb-0 sm:data-[state=closed]:fade-out-0 sm:data-[state=closed]:slide-out-to-bottom-4 sm:data-[state=open]:fade-in-0 sm:data-[state=open]:slide-in-from-bottom-4"
      >
        <SheetHeader className="flex-row items-center gap-3 border-b pr-14">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MessageSquare size={20} aria-hidden />
          </div>
          <div className="space-y-0.5">
            <SheetTitle className="text-lg">피드백 보내기</SheetTitle>
            <SheetDescription>
              서비스 개선을 위한 의견을 남겨주세요
            </SheetDescription>
          </div>
        </SheetHeader>

        <div className="p-4 sm:p-6">
          {isSuccess ? (
            <div
              role="status"
              className="flex flex-col items-center gap-3 py-10 text-center"
            >
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Send size={28} aria-hidden />
              </div>
              <p className="text-lg font-semibold">피드백이 전송되었습니다!</p>
              <p className="text-muted-foreground">소중한 의견 감사합니다.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="feedback-title"
                  className="mb-2 block text-sm font-medium"
                >
                  제목 <span className="text-destructive">*</span>
                </label>
                <input
                  id="feedback-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="피드백 제목을 입력하세요"
                  className={fieldClass}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="feedback-content"
                  className="mb-2 block text-sm font-medium"
                >
                  내용 <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="feedback-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="서비스 개선을 위한 의견을 자유롭게 작성해주세요.&#10;버그 신고, 기능 제안, 불편 사항 등 무엇이든 좋습니다."
                  rows={6}
                  className={`${fieldClass} resize-none`}
                  required
                />
              </div>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                피드백 제목·내용과 작성 시각을 저장하며 1년 후 파기합니다.
                개인정보는 적지 마세요.{" "}
                {/* 새 탭: 같은 탭 이동 시 모달이 언마운트되어 작성 중인 내용이 사라짐 */}
                <Link
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  개인정보처리방침
                </Link>
              </p>
              <Button
                type="submit"
                size="lg"
                className="h-11 w-full gap-2"
                disabled={isSubmitting || !title.trim() || !content.trim()}
              >
                {isSubmitting ? (
                  <>
                    <span
                      aria-hidden
                      className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                    />
                    전송 중...
                  </>
                ) : (
                  <>
                    <Send size={16} aria-hidden />
                    피드백 보내기
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
