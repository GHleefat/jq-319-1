import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Calendar,
  Clock,
} from "lucide-react";
import { usePollStore } from "@/store/usePollStore";
import { getDefaultDeadline } from "@/utils/helpers";

export default function CreatePollPage() {
  const navigate = useNavigate();
  const { createPoll } = usePollStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState(() => {
    const d = new Date(getDefaultDeadline());
    return d.toISOString().slice(0, 16);
  });
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (images.length >= 6) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || images.length < 2) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const pollId = createPoll(
        title.trim(),
        new Date(deadline).toISOString(),
        images,
      );
      setIsSubmitting(false);
      navigate(`/success/${pollId}`);
    }, 500);
  };

  const canSubmit = title.trim().length > 0 && images.length >= 2;

  return (
    <div className="min-h-screen bg-ivory">
      <header className="border-b border-charcoal/10 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-ivory-dark/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display text-xl">创建投票</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <div className="bg-white p-6 shadow-sm border border-charcoal/5">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-wine-red" />
              <h2 className="font-display text-lg">搭配照片</h2>
              <span className="text-sm text-charcoal/50">
                （至少 2 张，最多 6 张）
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-[3/4] bg-ivory-dark overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`搭配 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1">
                    搭配 {index + 1}
                  </div>
                </motion.div>
              ))}

              {images.length < 6 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[3/4] border-2 border-dashed border-charcoal/20 hover:border-wine-red/50 transition-colors flex flex-col items-center justify-center text-charcoal/40 hover:text-wine-red bg-white"
                >
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-xs">上传照片</span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="bg-white p-6 shadow-sm border border-charcoal/5 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">投票标题</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：今天约会穿哪套？"
                className="input-underline text-lg font-medium"
                maxLength={50}
              />
              <div className="text-right text-xs text-charcoal/40 mt-1">
                {title.length}/50
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-wine-red" />
                截止时间
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-3 border border-charcoal/20 focus:border-wine-red focus:outline-none bg-white"
              />
            </div>
          </div>

          <div className="sticky bottom-0 -mx-4 px-4 py-4 bg-gradient-to-t from-ivory via-ivory to-transparent pt-8">
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  创建中...
                </>
              ) : (
                <>
                  创建投票
                  <Clock className="w-5 h-5" />
                </>
              )}
            </button>
            {images.length < 2 && (
              <p className="text-center text-sm text-charcoal/50 mt-2">
                请至少上传 2 张搭配照片
              </p>
            )}
          </div>
        </motion.form>
      </main>
    </div>
  );
}
