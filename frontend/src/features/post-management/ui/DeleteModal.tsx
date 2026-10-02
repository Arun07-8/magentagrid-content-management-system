import { Trash2 } from 'lucide-react';
import { Modal, Button } from '../../../shared/ui';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  postTitle?: string;
  isDeleting?: boolean;
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  postTitle,
  isDeleting = false,
}: DeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm" showCloseButton={false}>
      <div className="text-center pt-2">
        <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3.5 border border-rose-100">
          <Trash2 className="w-5 h-5 stroke-[1.75]" />
        </div>

        <h3 className="text-base font-semibold text-slate-900 mb-1.5">Delete post</h3>

        <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
          {postTitle ? (
            <>
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-slate-700">&quot;{postTitle}&quot;</span>? This action
              cannot be undone.
            </>
          ) : (
            'Are you sure you want to delete this post? This action cannot be undone.'
          )}
        </p>

        <div className="flex items-center justify-center gap-2.5">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={onConfirm}
            isLoading={isDeleting}
          >
            Delete Post
          </Button>
        </div>
      </div>
    </Modal>
  );
}
