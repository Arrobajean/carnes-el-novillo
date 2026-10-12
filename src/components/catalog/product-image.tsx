import { CowIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

interface ProductImageProps {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
}

/** Fotografía del producto, o un marcador neutro cuando no hay foto. */
export function ProductImage({ src, alt, sizes, priority = false }: ProductImageProps) {
  if (!src) {
    return (
      <div role="img" aria-label={`Sin fotografía disponible: ${alt}`} className="flex size-full items-center justify-center bg-paper text-muted">
        <CowIcon size={48} aria-hidden="true" />
      </div>
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />;
}
