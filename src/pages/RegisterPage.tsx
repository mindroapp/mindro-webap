import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { MaskedInput } from "@/components/ui/masked-input";
import { cn } from "@/lib/utils";
import { PROFESSIONS, getProfessionByValue } from "@/lib/professions";

type Step = 1 | 2;

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState<Step>(1);

  // Etapa 1 - básicas
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Etapa 2 - profissionais
  const [profession, setProfession] = useState("");
  const [registration, setRegistration] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const selectedProfession = useMemo(
    () => getProfessionByValue(profession),
    [profession]
  );

  const principais = PROFESSIONS.filter((p) => p.group === "principal");
  const complementares = PROFESSIONS.filter((p) => p.group === "complementar");

  const validateStep1 = () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos");
      return false;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return false;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return false;
    }
    const phoneNumbers = phone.replace(/\D/g, "");
    if (phoneNumbers.length < 10) {
      setError("Por favor, insira um telefone válido");
      return false;
    }
    setError("");
    return true;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) return;
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profession) {
      setError("Selecione sua profissão");
      return;
    }
    if (!registration.trim()) {
      setError("Informe seu registro profissional ou certificação");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await register(
        name,
        email,
        password,
        phone,
        profession,
        registration,
        selectedProfession?.council !== "OPTIONAL" && selectedProfession?.council !== "NONE"
          ? selectedProfession?.council
          : undefined,
      );

      const firstName = name.split(" ")[0];
      // Sempre redirecionar para thank-you, onde será mostrada mensagem apropriada
      navigate("/thank-you", { replace: true, state: { firstName } });
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        "Falha no registro. Por favor, tente novamente.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              mind<span className="text-indigo-600">ro</span>
            </span>
          </Link>
        </div>

        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              {step === 1 ? (
                <Link
                  to="/"
                  className="text-indigo-600 hover:text-indigo-700 transition-colors"
                  aria-label="Voltar"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setStep(1);
                  }}
                  className="text-indigo-600 hover:text-indigo-700 transition-colors"
                  aria-label="Etapa anterior"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <div className="flex-1 text-center">
                <CardTitle className="text-xl md:text-2xl">
                  Crie uma conta
                </CardTitle>
              </div>
              <div className="w-5"></div>
            </div>
            <CardDescription className="text-center">
              {step === 1
                ? "Etapa 1 de 2 — Informações básicas"
                : "Etapa 2 de 2 — Informações profissionais"}
            </CardDescription>

            {/* Stepper */}
            <div className="flex items-center justify-center gap-2 pt-3">
              <StepDot active={step >= 1} done={step > 1} label="1" />
              <div
                className={cn(
                  "h-0.5 w-10 transition-colors",
                  step > 1 ? "bg-indigo-600" : "bg-gray-200"
                )}
              />
              <StepDot active={step >= 2} done={false} label="2" />
            </div>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jane Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nome@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <MaskedInput
                    id="phone"
                    mask="(99) 9 9999-9999"
                    placeholder="(85) 9 9285-0222"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirme a senha *</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-psycho-primary hover:bg-psycho-primary/90"
                >
                  Continuar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profession">Profissão *</Label>
                  <Select
                    value={profession}
                    onValueChange={(v) => {
                      setProfession(v);
                      setRegistration("");
                    }}
                  >
                    <SelectTrigger id="profession">
                      <SelectValue placeholder="Selecione sua profissão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Profissões principais</SelectLabel>
                        {principais.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Profissões complementares</SelectLabel>
                        {complementares.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {selectedProfession && selectedProfession.council !== "OPTIONAL" && (
                  <div className="space-y-2">
                    <Label>Conselho</Label>
                    <Input
                      value={selectedProfession.councilLabel}
                      readOnly
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="registration">
                    {selectedProfession?.councilLabel
                      ? selectedProfession.councilLabel
                      : "Registro Profissional"}{" "}
                    {selectedProfession?.council === "OPTIONAL" ? "" : "*"}
                  </Label>
                  <Input
                    id="registration"
                    type="text"
                    placeholder={
                      selectedProfession?.placeholder || "Ex: CRP 11/00000"
                    }
                    value={registration}
                    onChange={(e) => setRegistration(e.target.value)}
                    required
                  />
                  {selectedProfession?.council === "OPTIONAL" && (
                    <p className="text-xs text-gray-500">
                      Para esta profissão, o registro em conselho não é
                      obrigatório. Informe sua formação ou certificação.
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-psycho-primary hover:bg-psycho-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      <span>Criando conta...</span>
                    </div>
                  ) : (
                    "Criar conta"
                  )}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter>
            <div className="w-full text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{" "}
                <Link
                  to="/login"
                  className="text-psycho-primary hover:underline font-medium"
                >
                  Entrar
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

const StepDot: React.FC<{ active: boolean; done: boolean; label: string }> = ({
  active,
  done,
  label,
}) => (
  <div
    className={cn(
      "h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors",
      done
        ? "bg-indigo-600 border-indigo-600 text-white"
        : active
        ? "bg-white border-indigo-600 text-indigo-600"
        : "bg-white border-gray-300 text-gray-400"
    )}
  >
    {done ? <Check className="h-4 w-4" /> : label}
  </div>
);

export default RegisterPage;
