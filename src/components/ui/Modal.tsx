interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex justify-center items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface border border-border rounded-2xl p-6 w-[min(600px,90vw)] max-h-[80vh] overflow-y-auto max-md:w-[95vw] max-md:p-4 max-md:m-2.5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base">{title}</h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-muted text-xl cursor-pointer"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
