export interface FileRecord {
  id: number;
  model_type: string;
  model_id: number;
  file_type: string;
  original_name: string;
  file_name: string;
  file_path: string;
  mime: string;
  size: number;
  created_at: string;
}

export interface Estudiante {
  id: number;
  etnia_id: number;
  sexo_id: number;
  nombres: string;
  paterno: string;
  materno?: string;
  direccion: string;
  sexo?: { id: number; sexo: string };
  etnia?: { id: number; etnia: string };
  created_at?: string;
  updated_at?: string;
}

export interface Sexo {
  id: number;
  sexo: string;
}

export interface Etnia {
  id: number;
  etnia: string;
}

export interface Cargo {
  id: number;
  cargo: string;
}

export interface Docente {
  id: number;
  nombres: string;
  apellidos: string;
  email?: string;
  direccion?: string;
  cedula?: string;
  telefono?: string;
  etnia_id: number;
  cargo_id: number;
  sexo_id: number;
  sexo?: Sexo;
  etnia?: Etnia;
  cargo?: Cargo;
  created_at?: string;
  updated_at?: string;
}
