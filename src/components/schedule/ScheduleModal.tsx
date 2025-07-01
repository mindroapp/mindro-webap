
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Schedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  available: boolean;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  schedules: Schedule[];
  onDeleteSchedule: (scheduleId: string) => void;
  canDeleteSchedule: (schedule: Schedule) => boolean;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  date,
  schedules,
  onDeleteSchedule,
  canDeleteSchedule
}) => {
  if (!date) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Agendas - {format(new Date(date), "dd/MM/yyyy")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {schedules.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nenhuma agenda encontrada para este dia.
            </p>
          ) : (
            <div className="space-y-3">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {schedule.startTime} - {schedule.endTime}
                    </p>
                    <Badge variant="outline">
                      {schedule.slotDuration} min por consulta
                    </Badge>
                  </div>
                  {canDeleteSchedule(schedule) && (
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => {
                        onDeleteSchedule(schedule.id);
                        onClose();
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleModal;
