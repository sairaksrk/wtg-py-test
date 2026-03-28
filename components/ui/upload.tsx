import type { JSX } from "react";
import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
import { cn } from "@/utils/helpers";

type FileUploadProps = {
  label?: string;
  required?: boolean;
  error?: string;
  isUploading?: boolean;
  isSaving?: boolean;
  uploadedFileUrl?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  accept?: string;
  acceptMessage?: string;
  errorFile?: string;
};

function FileUpload({
  label,
  required = false,
  error,
  isUploading = false,
  isSaving = false,
  uploadedFileUrl,
  onChange,
  className,
  id,
  accept,
  acceptMessage,
  errorFile,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
    onChange?.(e);
  };

  const handleClick = () => {
    if (!isUploading && !isSaving) {
      fileInputRef.current?.click();
    }
  };

  // Label จะลอยเมื่อ: กำลังโหลด, มีไฟล์ที่เลือกแล้ว, หรือมี URL ไฟล์ที่อัปโหลดสำเร็จแล้ว
  const hasContent = isUploading || fileName || uploadedFileUrl;
  const isLabelFloating = !!label && !!hasContent;

  return (
    <div className="relative w-full">
      <div
        className={cn(
          "relative flex w-full h-14 cursor-pointer items-center rounded-xl border border-input bg-background px-4 transition-[color,box-shadow] outline-none",
          "hover:bg-muted/10",
          "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
          error ? "border-destructive" : "",
          isUploading || isSaving ? "cursor-not-allowed opacity-70" : "",
          className,
        )}
        onClick={handleClick}
      >
        {/* Hidden Real Input */}
        <input
          id={id}
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading || isSaving}
          accept={accept}
        />

        {/* Floating Label */}
        {label && (
          <label
            className={cn(
              "absolute left-4 transition-all duration-200 ease-out pointer-events-none z-10",
              isLabelFloating
                ? "top-2 text-sm text-subdude"
                : "top-1/2 -translate-y-1/2 text-base text-foreground",
            )}
          >
            {label}
            {required && <span className="text-destructive"> *</span>}
          </label>
        )}

        {/* Content Area */}
        <div
          className={cn(
            "flex w-full items-center justify-between gap-2",
            isLabelFloating ? "pt-5" : "",
          )}
        >
          <div className="flex-1 truncate text-base">
            {isUploading ? (
              <span className="flex items-center text-muted-foreground italic">
                <Icon
                  icon="line-md:loading-twotone-loop"
                  className="mr-2 h-4 w-4 shrink-0"
                />
                กำลังอัปโหลด...
              </span>
            ) : uploadedFileUrl ? (
              <span className="flex items-center text-success font-medium truncate">
                <Icon
                  icon="solar:check-circle-bold"
                  className="mr-2 h-4 w-4 shrink-0"
                />
                {fileName || "อัปโหลดสำเร็จแล้ว"}
              </span>
            ) : fileName ? (
              <span className="text-foreground truncate">{fileName}</span>
            ) : (
              // แสดง Placeholder เฉพาะตอน Label ไม่ลอย หรือไม่มี Label
              !isLabelFloating && (
                // <span className="text-muted-foreground">
                //   คลิกเพื่อแนบไฟล์...
                // </span>>
                <></>
              )
            )}
          </div>

          {!uploadedFileUrl && (
            <div className="flex items-center justify-center gap-1 bg-[#F4F4F5] py-1 px-3 rounded-full">
              <Icon
                icon={"solar:file-send-linear"}
                className="h-4 w-4 text-muted-foreground"
              />

              <p className="text-sm font-normal text-black">อัปโหลด</p>
            </div>
          )}

          {/* <Icon
            icon={"solar:document-bold"}
            className={cn("h-5 w-5 shrink-0 text-success")}
          /> */}
        </div>
      </div>
      <p className="mt-2 text-sm font-normal text-subdude ">
        {acceptMessage}
      </p>
      {/* Error Message  */}

      {error && <p className="text-destructive mt-1.5 text-sm">{error}</p>}

      {errorFile && (
        <p className="text-destructive mt-1.5 text-sm">{errorFile}</p>
      )}
    </div>
  );
}

export { FileUpload };
