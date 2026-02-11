import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  title?: string;
  description?: string;
  onPrev?: () => void;
  onNext?: () => void;
}

const ImageModal = ({ isOpen, onClose, imageSrc, title, description, onPrev, onNext }: ImageModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.2 }}
          className="relative max-h-[90vh] max-w-5xl w-full overflow-hidden rounded-2xl bg-card shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-foreground/20 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-foreground/40"
          >
            <X size={18} />
          </button>

          {onPrev && (
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-foreground/20 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-foreground/40"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {onNext && (
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-foreground/20 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-foreground/40"
            >
              <ChevronRight size={20} />
            </button>
          )}

          <img
            src={imageSrc}
            alt={title || "Image"}
            className="h-auto max-h-[70vh] w-full object-contain"
          />

          {(title || description) && (
            <div className="p-6">
              {title && <h3 className="font-display text-lg font-semibold text-card-foreground">{title}</h3>}
              {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
            </div>
          )}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ImageModal;
