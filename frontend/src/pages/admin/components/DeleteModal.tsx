import { Trash2 } from 'lucide-react'

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  postTitle?: string
}

export function DeleteModal({ isOpen, onClose, onConfirm, postTitle }: DeleteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Soft red icon circle */}
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-7 h-7 stroke-[1.75]" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Post</h3>

        {/* Warning text */}
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          {postTitle ? (
            <>
              Are you sure you want to delete <span className="font-semibold text-slate-700">&quot;{postTitle}&quot;</span>? This action cannot be undone.
            </>
          ) : (
            'Are you sure you want to delete this post? This action cannot be undone.'
          )}
        </p>

        {/* Actions buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-medium text-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors shadow-sm shadow-red-600/30 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
