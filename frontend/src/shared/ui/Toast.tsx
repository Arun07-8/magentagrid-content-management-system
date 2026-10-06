import { useEffect, useState } from 'react';
import { useToast, type ToastItemData } from '../../app/context/ToastContext';

interface ToastItemProps {
  toast: ToastItemData;
  onClose: () => void;
}

export function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t: ToastItemData) => (
        <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // animate in
    const raf = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const isSuccess = toast.type === 'success';
  const bgColor = isSuccess ? '#ecfdf5' : '#fef2f2';
  const iconColor = isSuccess ? '#10b981' : '#ef4444';
  const iconBg = isSuccess ? '#d1fae5' : '#fee2e2';
  const borderColor = isSuccess ? '#a7f3d0' : '#fecaca';
  const textColor = '#1f2937';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 8,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        minWidth: 280,
        maxWidth: 420,
        gap: 12,
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(-12px)',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: 'auto',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          backgroundColor: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isSuccess ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        )}
      </div>

      {/* Message */}
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: textColor,
          flex: 1,
          lineHeight: '1.4',
        }}
      >
        {toast.message}
      </span>

      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          padding: 4,
          cursor: 'pointer',
          color: '#9ca3af',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#4b5563')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
