import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface ProfileAvatarEditorProps {
  name: string;
  avatar: string | null;
  isAdmin?: boolean;
  onAvatarChange: (imageData: string) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const ProfileAvatarEditor: React.FC<ProfileAvatarEditorProps> = ({
  name,
  avatar,
  isAdmin = false,
  onAvatarChange,
  readonly = false,
  size = "lg",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24",
  };

  const textSizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-3xl font-semibold",
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAvatarChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onAvatarChange("");
  };

  const avatarBgClass = isAdmin ? "bg-amber-500" : "bg-psycho-primary";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Display */}
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={avatar || ""} alt={name} />
        <AvatarFallback className={`${avatarBgClass} text-white ${textSizeClasses[size]}`}>
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>

      {/* Controls (only if not readonly) */}
      {!readonly && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Fazer Upload
          </Button>

          {avatar && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveImage}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4 mr-2" />
              Remover
            </Button>
          )}
        </div>
      )}

      {/* Hidden Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default ProfileAvatarEditor;
