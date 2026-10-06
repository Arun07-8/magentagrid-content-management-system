import { useState, useRef, useCallback, useEffect } from 'react';
import { X, Check, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropModalProps {
  imageSrc: string;
  fileName: string;
  onConfirm: (croppedFile: File) => void;
  onCancel: () => void;
}

export function ImageCropModal({ imageSrc, fileName, onConfirm, onCancel }: ImageCropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cropArea] = useState<CropArea>({ x: 0, y: 0, width: 320, height: 200 });

  // Draw canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw dark overlay
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save, translate, rotate, draw image
    ctx.save();
    ctx.translate(canvas.width / 2 + offset.x, canvas.height / 2 + offset.y);
    ctx.rotate((rotation * Math.PI) / 180);

    const scaledW = img.naturalWidth * zoom;
    const scaledH = img.naturalHeight * zoom;
    ctx.drawImage(img, -scaledW / 2, -scaledH / 2, scaledW, scaledH);
    ctx.restore();

    // Clear the crop rectangle to show image through it
    const cx = (canvas.width - cropArea.width) / 2;
    const cy = (canvas.height - cropArea.height) / 2;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(cx, cy, cropArea.width, cropArea.height);
    ctx.restore();

    // Re-draw image in the crop area (to make it visible)
    ctx.save();
    ctx.beginPath();
    ctx.rect(cx, cy, cropArea.width, cropArea.height);
    ctx.clip();

    ctx.translate(canvas.width / 2 + offset.x, canvas.height / 2 + offset.y);
    ctx.rotate((rotation * Math.PI) / 180);
    const scaledW2 = img.naturalWidth * zoom;
    const scaledH2 = img.naturalHeight * zoom;
    ctx.drawImage(img, -scaledW2 / 2, -scaledH2 / 2, scaledW2, scaledH2);
    ctx.restore();

    // Draw crop border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx, cy, cropArea.width, cropArea.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 0.5;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + (cropArea.width / 3) * i, cy);
      ctx.lineTo(cx + (cropArea.width / 3) * i, cy + cropArea.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx, cy + (cropArea.height / 3) * i);
      ctx.lineTo(cx + cropArea.width, cy + (cropArea.height / 3) * i);
      ctx.stroke();
    }

    // Corner handles
    ctx.fillStyle = '#fff';
    const corners = [
      [cx, cy], [cx + cropArea.width, cy],
      [cx, cy + cropArea.height], [cx + cropArea.width, cy + cropArea.height],
    ];
    for (const [hx, hy] of corners) {
      ctx.beginPath();
      ctx.arc(hx, hy, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [zoom, rotation, offset, cropArea, imageLoaded]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setImageLoaded(true);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const t = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: t.clientX - offset.x, y: t.clientY - offset.y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const t = e.touches[0];
    setOffset({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y });
  };

  const handleConfirm = async () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    setIsProcessing(true);

    const cropCanvas = document.createElement('canvas');
    const outputSize = 800;
    cropCanvas.width = outputSize;
    cropCanvas.height = Math.round(outputSize * (cropArea.height / cropArea.width));
    const ctx = cropCanvas.getContext('2d');
    if (!ctx) return;

    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const cx = (canvasW - cropArea.width) / 2;
    const cy = (canvasH - cropArea.height) / 2;

    // Scale factors from canvas crop area to output
    const scaleX = outputSize / cropArea.width;
    const scaleY = cropCanvas.height / cropArea.height;

    ctx.save();
    ctx.translate(
      (outputSize / 2) + (offset.x - cx - cropArea.width / 2 + canvasW / 2 - canvasW / 2) * scaleX,
      (cropCanvas.height / 2) + (offset.y - cy - cropArea.height / 2 + canvasH / 2 - canvasH / 2) * scaleY
    );
    ctx.rotate((rotation * Math.PI) / 180);
    const scaledW = img.naturalWidth * zoom * scaleX;
    const scaledH = img.naturalHeight * zoom * scaleY;
    ctx.drawImage(img, -scaledW / 2, -scaledH / 2, scaledW, scaledH);
    ctx.restore();

    cropCanvas.toBlob((blob) => {
      if (!blob) { setIsProcessing(false); return; }
      const ext = fileName.split('.').pop() || 'jpg';
      const croppedFile = new File([blob], `cropped-${Date.now()}.${ext}`, {
        type: blob.type || 'image/jpeg',
      });
      setIsProcessing(false);
      onConfirm(croppedFile);
    }, 'image/jpeg', 0.92);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[calc(100dvh-1.5rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-zinc-200 shrink-0">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">Crop Image</h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">Drag to reposition · Zoom and rotate as needed</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas */}
        <div ref={containerRef} className="bg-zinc-900 flex items-center justify-center overflow-hidden shrink-0" style={{ height: 260 }}>
          <canvas
            ref={canvasRef}
            width={420}
            height={280}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className="cursor-move touch-none max-w-full max-h-full object-contain"
          />
        </div>

        {/* Controls */}
        <div className="px-4 sm:px-5 py-3 border-t border-zinc-100 space-y-3 overflow-y-auto flex-1">
          {/* Zoom */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setZoom(z => Math.max(0.3, z - 0.1))}
              className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5 text-zinc-600" />
            </button>
            <div className="flex-1">
              <input
                type="range"
                min="0.3"
                max="3"
                step="0.05"
                value={zoom}
                onChange={e => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-zinc-900"
              />
            </div>
            <button
              type="button"
              onClick={() => setZoom(z => Math.min(3, z + 0.1))}
              className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5 text-zinc-600" />
            </button>
          </div>

          {/* Rotate */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-zinc-400 w-10 shrink-0">Rotate</span>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={rotation}
              onChange={e => setRotation(parseInt(e.target.value))}
              className="flex-1 h-1.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-zinc-900"
            />
            <button
              type="button"
              onClick={() => setRotation(r => (r + 90) % 360)}
              className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 text-zinc-600" />
            </button>
            <span className="text-[11px] text-zinc-500 w-8 text-right font-mono">{rotation}°</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-200 gap-3">
          <button
            type="button"
            onClick={() => { setZoom(1); setRotation(0); setOffset({ x: 0, y: 0 }); }}
            className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
          >
            Reset
          </button>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!imageLoaded || isProcessing}
              className="px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-3.5 h-3.5" />
              {isProcessing ? 'Processing...' : 'Apply Crop'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
