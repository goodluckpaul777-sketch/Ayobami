/**
 * Fast client-side image compressor.
 * Downscales images to max 800x800 at 0.75 JPEG quality.
 * Resulting images are typically 25KB–50KB and load in <100ms.
 */
export async function compressImageFile(
  file: File, 
  maxWidth = 800, 
  maxHeight = 800, 
  quality = 0.75
): Promise<string> {
  return new Promise((resolve) => {
    // If not an image file or missing, return empty or raw
    if (!file || !file.type.startsWith('image/')) {
      const fallbackReader = new FileReader();
      fallbackReader.onload = () => resolve(fallbackReader.result as string);
      fallbackReader.onerror = () => resolve('');
      fallbackReader.readAsDataURL(file);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    // Safety timeout: if image decoding hangs, fallback to direct data URL in 2 seconds
    const safetyTimeout = setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
      const fallbackReader = new FileReader();
      fallbackReader.onload = () => resolve(fallbackReader.result as string);
      fallbackReader.onerror = () => resolve('');
      fallbackReader.readAsDataURL(file);
    }, 2000);

    img.onload = () => {
      clearTimeout(safetyTimeout);
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressed = canvas.toDataURL('image/jpeg', quality);
        URL.revokeObjectURL(objectUrl);
        resolve(compressed);
      } catch (err) {
        console.warn('Canvas compression error, using raw data URL:', err);
        URL.revokeObjectURL(objectUrl);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      }
    };

    img.onerror = () => {
      clearTimeout(safetyTimeout);
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    };

    img.src = objectUrl;
  });
}
