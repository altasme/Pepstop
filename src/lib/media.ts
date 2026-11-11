import { MEDIA } from "../content/site";

const WIDTHS = [320, 480, 640, 800, 1024, 1280, 1600];

/** Cloudinary delivery URL with automatic format and quality. Returns null until a cloud name is set. */
export function cloudinaryUrl(publicId: string, width: number): string | null {
  if (!MEDIA.cloudName) return null;
  return `https://res.cloudinary.com/${MEDIA.cloudName}/image/upload/f_auto,q_auto,w_${width}/${publicId}`;
}

export function cloudinarySrcSet(publicId: string, maxWidth: number): string | null {
  if (!MEDIA.cloudName) return null;
  return WIDTHS.filter((w) => w <= maxWidth)
    .map((w) => `${cloudinaryUrl(publicId, w)} ${w}w`)
    .join(", ");
}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** "1200 x 1500" -> "4:5". */
export function aspectRatioLabel(width: number, height: number): string {
  const d = gcd(width, height);
  return `${width / d}:${height / d}`;
}

export function orientationLabel(width: number, height: number): string {
  if (width === height) return "square";
  return width > height ? "landscape" : "portrait";
}
