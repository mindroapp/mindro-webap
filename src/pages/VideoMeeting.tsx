import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { connect, Room } from 'twilio-video';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Mic, MicOff, Video, VideoOff, ScreenShare, PhoneOff, Volume, VolumeX } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';

const VideoMeeting = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [token, setToken] = useState(searchParams.get('token') || '');
  const [roomName, setRoomName] = useState('');
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setRoomName(tokenFromUrl);
    }

    // Request camera and mic permissions early
    if (!room) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error('Could not access camera:', err);
          toast({
            title: "Erro",
            description: "Não foi possível acessar sua câmera ou microfone.",
            variant: "destructive",
          });
        });
    }

    // Cleanup function for video resources
    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [searchParams, toast]);

  const handleJoinCall = () => {
    // Mock: Simula entrada na sala sem API/token
    setRoom({} as Room); // apenas para renderizar a interface de reunião
    toast({
      title: "Conectado",
      description: "Você entrou na sala (mock).",
    });
  };

  const handleEndCall = () => {
    if (room) {
      room.disconnect();
      setRoom(null);
      toast({
        title: "Reunião encerrada",
        description: "Você saiu da reunião.",
      });
      navigate('/meeting');
    }
  };

  const toggleMic = () => {
    setMicOn(!micOn);
    room?.localParticipant.audioTracks.forEach((publication) => {
      publication.track.enable(!micOn);
    });
    toast({
      description: `Microfone ${!micOn ? 'ativado' : 'desativado'}`,
    });
  };

  const toggleVideo = () => {
    setVideoOn(!videoOn);
    room?.localParticipant.videoTracks.forEach((publication) => {
      publication.track.enable(!videoOn);
    });
    toast({
      description: `Câmera ${!videoOn ? 'ativada' : 'desativada'}`,
    });
  };

  const toggleAudio = () => {
    setAudioOn(!audioOn);
    room?.participants.forEach(participant => {
      participant.audioTracks.forEach((publication: any) => {
        publication.track.enable(!audioOn);
      });
    });
    toast({
      description: `Áudio ${!audioOn ? 'ativado' : 'desativado'}`,
    });
  };

  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center justify-center flex-shrink-0 px-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  mind<span className="text-indigo-600">ro</span>
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <AspectRatio ratio={16/9} className="bg-black rounded-lg overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </AspectRatio>
            <div className="space-y-2">
              <label htmlFor="token" className="text-sm font-medium">Token da reunião</label>
              <Input
                id="token"
                value={token}
                disabled
                className="w-full"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleJoinCall} className="w-full">
              Entrar
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex-1 p-2 md:p-4">
        <div className={`grid ${participants.length > 0 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-2 md:gap-4 h-full`}>
          <div className="relative w-full h-full min-h-[200px] bg-gray-800 rounded-lg overflow-hidden">
            <AspectRatio ratio={16/9} className="w-full h-full">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${!videoOn ? 'invisible' : ''}`}
              />
              {!videoOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                  <div className="h-20 w-20 rounded-full bg-gray-600 flex items-center justify-center text-white text-2xl">
                    Você
                  </div>
                </div>
              )}
            </AspectRatio>
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded">
              Você
            </div>
          </div>

          {participants.length > 0 && (
            <div className="relative w-full h-full min-h-[200px] bg-gray-800 rounded-lg overflow-hidden">
              <AspectRatio ratio={16/9} className="w-full h-full">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded">
                Participante
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="bg-gray-800 p-3 md:p-4">
        <div className="flex justify-center space-x-2 md:space-x-4">
          <Button variant="ghost" size={isMobile ? "sm" : "icon"} className={`rounded-full ${micOn ? 'bg-gray-700' : 'bg-red-600'}`} onClick={toggleMic}>
            {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            {isMobile ? null : <span className="ml-2">Microfone</span>}
          </Button>
          <Button variant="ghost" size={isMobile ? "sm" : "icon"} className={`rounded-full ${videoOn ? 'bg-gray-700' : 'bg-red-600'}`} onClick={toggleVideo}>
            {videoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            {isMobile ? null : <span className="ml-2">Câmera</span>}
          </Button>
          <Button variant="ghost" size={isMobile ? "sm" : "icon"} className={`rounded-full ${audioOn ? 'bg-gray-700' : 'bg-red-600'}`} onClick={toggleAudio}>
            {audioOn ? <Volume className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            {isMobile ? null : <span className="ml-2">Áudio</span>}
          </Button>
          <Button variant="destructive" size={isMobile ? "sm" : "default"} className="rounded-full" onClick={handleEndCall}>
            <PhoneOff className="h-5 w-5" />
            {isMobile ? null : <span className="ml-2">Encerrar</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoMeeting;
