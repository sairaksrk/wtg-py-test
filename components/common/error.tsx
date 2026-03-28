import { ImageResponsive } from "../ui/image-reponsive";

function ErrorComponent({ statusCode, message }: any) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <ImageResponsive
        src={`/error/${statusCode}.png`}
        alt="error"
        containerClassName="w-[300px] h-[300px]"
      />
      <p className="text-3xl font-medium">{message}</p>
    </div>
  );
}

export default ErrorComponent;
