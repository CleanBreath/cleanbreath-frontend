"use client";

import { useState } from "react";
import * as motion from "motion/react-client";
import { X, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addFeedback } from "@/api";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg"
      >
        <Card className="shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare size={24} className="text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">피드백 보내기</CardTitle>
                <p className="text-sm text-muted-foreground">
                  서비스 개선을 위한 의견을 남겨주세요
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X size={20} />
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            {isSuccess ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-4 py-12"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <Send size={36} className="text-green-600" />
                </div>
                <p className="text-xl font-semibold">
                  피드백이 전송되었습니다!
                </p>
                <p className="text-muted-foreground">소중한 의견 감사합니다.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    제목 <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="피드백 제목을 입력하세요"
                    className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    내용 <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="서비스 개선을 위한 의견을 자유롭게 작성해주세요.&#10;버그 신고, 기능 제안, 불편 사항 등 무엇이든 좋습니다."
                    rows={6}
                    className="w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 rounded-xl"
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      전송 중...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      피드백 보내기
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
