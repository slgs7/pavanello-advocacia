import { avaliacoesGoogle } from './avaliacoes-google';
export type Avaliacao = {
  id: string;
  autor: string;
  texto: string;
  nota: number;
  origem: string;
  incompleto?: boolean;
  quando?: string;
  url?: string;
  exemplo: boolean;
};
export const avaliacoes: Avaliacao[] = avaliacoesGoogle;
