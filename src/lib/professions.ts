export type CouncilType =
  | "CRP"
  | "CRM"
  | "CREFITO"
  | "CRFa"
  | "CRESS"
  | "COREN"
  | "CRN"
  | "CRP_PEDAGOGICO"
  | "OPTIONAL"
  | "NONE";

export interface ProfessionOption {
  value: string;
  label: string;
  group: "principal" | "complementar";
  council: CouncilType;
  councilLabel: string;
  placeholder: string;
}

export const PROFESSIONS: ProfessionOption[] = [
  // Principais
  { value: "psicologo", label: "Psicólogo(a)", group: "principal", council: "CRP", councilLabel: "CRP", placeholder: "CRP 11/00000" },
  { value: "psicanalista", label: "Psicanalista", group: "principal", council: "OPTIONAL", councilLabel: "Formação/Certificação", placeholder: "Instituição e nº de formação" },
  { value: "psiquiatra", label: "Psiquiatra", group: "principal", council: "CRM", councilLabel: "CRM", placeholder: "CRM 000000" },
  { value: "neuropsicologo", label: "Neuropsicólogo(a)", group: "principal", council: "CRP", councilLabel: "CRP", placeholder: "CRP 11/00000" },
  { value: "terapeuta_ocupacional", label: "Terapeuta Ocupacional", group: "principal", council: "CREFITO", councilLabel: "CREFITO", placeholder: "CREFITO 00000" },
  { value: "psicopedagogo", label: "Psicopedagogo(a)", group: "principal", council: "OPTIONAL", councilLabel: "Registro Opcional", placeholder: "ABPp 00000 (opcional)" },
  { value: "terapeuta_integrativo", label: "Terapeuta Integrativo(a)", group: "principal", council: "OPTIONAL", councilLabel: "Formação/Certificação", placeholder: "Certificação" },
  { value: "counselor", label: "Counselor / Conselheiro(a)", group: "principal", council: "OPTIONAL", councilLabel: "Formação/Certificação", placeholder: "Certificação" },
  { value: "coach_emocional", label: "Coach Emocional", group: "principal", council: "OPTIONAL", councilLabel: "Formação/Certificação", placeholder: "Certificação" },
  { value: "arteterapeuta", label: "Arteterapeuta", group: "principal", council: "OPTIONAL", councilLabel: "Formação/Certificação", placeholder: "UBAAT 00000 (opcional)" },
  { value: "musicoterapeuta", label: "Musicoterapeuta", group: "principal", council: "OPTIONAL", councilLabel: "Formação/Certificação", placeholder: "UBAM 00000 (opcional)" },
  { value: "fonoaudiologo", label: "Fonoaudiólogo(a)", group: "principal", council: "CRFa", councilLabel: "CRFa", placeholder: "CRFa 00000" },
  { value: "assistente_social", label: "Assistente Social", group: "principal", council: "CRESS", councilLabel: "CRESS", placeholder: "CRESS 00000" },
  { value: "enfermeiro_saude_mental", label: "Enfermeiro(a) em Saúde Mental", group: "principal", council: "COREN", councilLabel: "COREN", placeholder: "COREN 000000" },
  // Complementares
  { value: "medico", label: "Médico(a)", group: "complementar", council: "CRM", councilLabel: "CRM", placeholder: "CRM 000000" },
  { value: "neurologista", label: "Neurologista", group: "complementar", council: "CRM", councilLabel: "CRM", placeholder: "CRM 000000" },
  { value: "nutricionista", label: "Nutricionista", group: "complementar", council: "CRN", councilLabel: "CRN", placeholder: "CRN 00000" },
  { value: "fisioterapeuta", label: "Fisioterapeuta", group: "complementar", council: "CREFITO", councilLabel: "CREFITO", placeholder: "CREFITO 00000" },
  { value: "pedagogo", label: "Pedagogo(a)", group: "complementar", council: "OPTIONAL", councilLabel: "Formação/Certificação", placeholder: "Certificação" },
  { value: "educador", label: "Educador(a)", group: "complementar", council: "OPTIONAL", councilLabel: "Formação/Certificação", placeholder: "Certificação" },
  { value: "analista_aba", label: "Analista do Comportamento (ABA)", group: "complementar", council: "OPTIONAL", councilLabel: "Formação/Certificação", placeholder: "Certificação ABA" },
  { value: "acompanhante_terapeutico", label: "Acompanhante Terapêutico(a)", group: "complementar", council: "OPTIONAL", councilLabel: "Formação/Certificação", placeholder: "Certificação" },
];

export const getProfessionByValue = (value: string) =>
  PROFESSIONS.find((p) => p.value === value);
