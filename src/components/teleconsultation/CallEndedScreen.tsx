import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart, Star, Send, Home } from "lucide-react";

interface CallEndedScreenProps {
  professionalName?: string;
  onClose: () => void;
}

const CallEndedScreen: React.FC<CallEndedScreenProps> = ({ 
  professionalName = "seu profissional",
  onClose 
}) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // Aqui seria enviado o feedback para o backend
    console.log("Feedback submitted:", { rating, feedback });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-6 space-y-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Heart className="h-10 w-10 text-primary fill-primary" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Obrigado!</h2>
              <p className="text-muted-foreground">
                Sua avaliação foi enviada com sucesso. Agradecemos seu feedback!
              </p>
            </div>

            <Button onClick={onClose} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Voltar para o início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Atendimento Encerrado</CardTitle>
          <p className="text-muted-foreground text-sm mt-2">
            Obrigado por utilizar nossa plataforma de teleconsulta!
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Rating Stars */}
          <div className="space-y-2">
            <Label className="text-sm text-center block">
              Como você avalia o atendimento de {professionalName}?
            </Label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                >
                  <Star 
                    className={`h-8 w-8 ${
                      star <= rating 
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Text */}
          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-sm">
              Deixe um comentário (opcional)
            </Label>
            <Textarea
              id="feedback"
              placeholder="Conte-nos sobre sua experiência..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleSubmit}
              disabled={rating === 0}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar Avaliação
            </Button>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="w-full text-muted-foreground"
            >
              Pular avaliação
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Sua avaliação nos ajuda a melhorar continuamente o atendimento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallEndedScreen;
