interface ImageSectionProps {
  // ImageSection 컴포넌트가 받을 props의 타입을 정의합니다.
  imageUrl: string;
  altText: string;
}

export default function ImageSection({ imageUrl, altText }: ImageSectionProps) {
  return (
    <div className="relative w-full h-auto aspect-video">
      {/* Next.js 프로젝트가 아니라면 <Image ... /> 대신 <img src={imageUrl} alt={altText} ... /> 사용 */}
      <img
        src={imageUrl}
        alt={altText}
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
}
