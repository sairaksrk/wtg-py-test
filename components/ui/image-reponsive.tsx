import Image, { ImageProps } from "next/image"

interface ImageResponsiveProps extends Omit<ImageProps, "fill" | "width" | "height"> {
	containerClassName?: string
	imageClassName?: string
	aspectRatio?: string
	objectFit?: "object-cover" | "object-contain" | "object-fill"
}

export function ImageResponsive({
	src,
	alt,
	containerClassName = "w-full", // <-- Moved w-full here so you can override it!
	imageClassName = "",
	aspectRatio = "aspect-video",
	objectFit = "object-cover",
	sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
	...props
}: ImageResponsiveProps) {
	return (
	// Removed the hardcoded w-full from this line
		<div className={`relative overflow-hidden ${aspectRatio} ${containerClassName}`}>
			<Image
				src={src}
				alt={alt || "Responsive image"}
				fill
				sizes={sizes}
				className={`${objectFit} ${imageClassName}`}
				{...props}
			/>
		</div>
	)
}
