interface ImageSectionProps {
  // ImageSection 컴포넌트가 받을 props의 타입을 정의합니다.
  imageUrl: string;
  altText: string;
}

export default function ImageSection({ imageUrl, altText }: ImageSectionProps) {
  return (
    <div className="relative w-full h-64 overflow-hidden rounded-lg">
      <img
        src={imageUrl}
        alt={altText}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
