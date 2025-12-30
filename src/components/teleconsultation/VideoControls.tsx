import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, 
  Volume2, VolumeX 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoControlsProps {
  micOn: boolean;
  videoOn: boolean;
  audioOn: boolean;
  onToggleMic: () => void;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onEndCall?: () => void;
  showEndCall?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  micOn,
  videoOn,
  audioOn,
  onToggleMic,
  onToggleVideo,
  onToggleAudio,
  onEndCall,
  showEndCall = true,
  size = "md",
  className
}) => {
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-14 w-14"
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  const buttonSize = sizeClasses[size];
  const iconSize = iconSizes[size];

  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      {/* Microphone */}
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn(
          buttonSize,
          "rounded-full transition-all",
          micOn 
            ? "bg-muted hover:bg-muted/80" 
            : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
        )}
        onClick={onToggleMic}
        title={micOn ? "Desativar microfone" : "Ativar microfone"}
      >
        {micOn ? <Mic className={iconSize} /> : <MicOff className={iconSize} />}
      </Button>

      {/* Video */}
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn(
          buttonSize,
          "rounded-full transition-all",
          videoOn 
            ? "bg-muted hover:bg-muted/80" 
            : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
        )}
        onClick={onToggleVideo}
        title={videoOn ? "Desativar câmera" : "Ativar câmera"}
      >
        {videoOn ? <Video className={iconSize} /> : <VideoOff className={iconSize} />}
      </Button>

      {/* Audio Output */}
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn(
          buttonSize,
          "rounded-full transition-all",
          audioOn 
            ? "bg-muted hover:bg-muted/80" 
            : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
        )}
        onClick={onToggleAudio}
        title={audioOn ? "Desativar áudio" : "Ativar áudio"}
      >
        {audioOn ? <Volume2 className={iconSize} /> : <VolumeX className={iconSize} />}
      </Button>

      {/* End Call */}
      {showEndCall && onEndCall && (
        <Button 
          variant="destructive" 
          size="icon" 
          className={cn(buttonSize, "rounded-full")}
          onClick={onEndCall}
          title="Encerrar chamada"
        >
          <PhoneOff className={iconSize} />
        </Button>
      )}
    </div>
  );
};

export default VideoControls;
