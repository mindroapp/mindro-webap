
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';

const MeetingButton = () => {
  const navigate = useNavigate();
  
  const handleStartMeeting = () => {
    // Generate a random token
    const randomToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    navigate(`/meeting?token=${randomToken}`);
  };
  
  return (
    <Button
      onClick={handleStartMeeting}
      className="bg-primary hover:bg-primary/90 text-white flex items-center space-x-2 w-full my-4"
    >
      <Video className="h-4 w-4" />
      <span>Start Meeting</span>
    </Button>
  );
};

export default MeetingButton;
