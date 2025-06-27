import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Mic, MicOff, Video, VideoOff, ScreenShare, PhoneOff, Volume, VolumeX, Camera } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';

const VideoMeeting = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [token, setToken] = useState(searchParams.get('token') || '');
  const [room, setRoom] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [frontCamera, setFrontCamera] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const setupStream = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        toast({
          title: "Erro",
          description: "Não foi possível acessar sua câmera ou microfone.",
          variant: "destructive",
        });
      }
    };
    setupStream();
    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const s = localVideoRef.current.srcObject as MediaStream;
        s.getTracks().forEach(track => track.stop());
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [room, toast]);

  const handleJoinCall = () => {
    setRoom(true);
    toast({
      title: "Conectado",
      description: "Você entrou na sala.",
    });
  };

  const handleEndCall = () => {
    setRoom(false);
    toast({
      title: "Reunião encerrada",
      description: "Você saiu da reunião.",
    });
    navigate('/meeting');
  };

  const toggleMic = () => setMicOn((v) => !v);
  const toggleVideo = () => setVideoOn((v) => !v);
  const toggleAudio = () => setAudioOn((v) => !v);
  const toggleCamera = () => setFrontCamera((v) => !v);

  // Layout responsivo para 1 participante
  const getGridCols = () => 'grid-cols-1';

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
    <div className="fixed inset-0 w-screen h-screen bg-gray-900 flex flex-col items-center justify-center overflow-hidden">
      <div className="flex-1 w-full flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl" style={{ aspectRatio: '16/9', minHeight: 180 }}>
          {[0, 1].map((idx) => (
            <div key={idx} className="relative bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
              <AspectRatio ratio={16/9} className="w-full h-full flex items-center justify-center">
                {videoOn ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
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
          ))}
        </div>
      </div>
      <div className="w-full flex justify-center bg-gray-800 p-3 md:p-4">
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          <Button variant="ghost" size={isMobile ? "sm" : "icon"} className={`rounded-full ${micOn ? 'bg-gray-700' : 'bg-red-600'}`} onClick={toggleMic}>
            {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size={isMobile ? "sm" : "icon"} className={`rounded-full ${videoOn ? 'bg-gray-700' : 'bg-red-600'}`} onClick={toggleVideo}>
            {videoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size={isMobile ? "sm" : "icon"} className={`rounded-full bg-gray-700`} onClick={toggleCamera}>
            <Camera className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size={isMobile ? "sm" : "icon"} className={`rounded-full ${audioOn ? 'bg-gray-700' : 'bg-red-600'}`} onClick={toggleAudio}>
            {audioOn ? <Volume className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          <Button variant="destructive" size={isMobile ? "sm" : "default"} className="rounded-full" onClick={handleEndCall}>
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoMeeting;