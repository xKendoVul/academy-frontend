import {
  Estudiante,
  Docente,
  Sexo,
  Etnia,
  Cargo,
} from "@/types/estudiante.interface";

const URL = process.env.NEXT_PUBLIC_GATEWAY_URL;
const FILES_URL = process.env.NEXT_PUBLIC_FILES_SERVICE_URL || "http://localhost:3004";

export async function getAllStudents(): Promise<Estudiante[]> {
  const response = await fetch(`${URL}/estudiantes`, { cache: "no-store" });
  if (!response.ok) throw new Error("Error al obtener los estudiantes");
  const data = await response.json();
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
}

export async function getStudent(id: number): Promise<Estudiante> {
  const response = await fetch(`${URL}/estudiantes/${id}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Error al obtener el estudiante");
  const data = await response.json();
  return data?.data ?? data;
}

export async function createStudent(
  estudiante: Partial<Estudiante>,
): Promise<Estudiante> {
  const response = await fetch(`${URL}/estudiantes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(estudiante),
  });
  if (!response.ok) throw new Error("Error al crear estudiante");
  const data = await response.json();
  return data?.data ?? data;
}

export async function updateStudent(
  id: number,
  estudiante: Partial<Estudiante>,
): Promise<Estudiante> {
  const response = await fetch(`${URL}/estudiantes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(estudiante),
  });
  if (!response.ok) throw new Error("Error al actualizar estudiante");
  const data = await response.json();
  return data?.data ?? data;
}

export async function deleteStudent(id: number): Promise<void> {
  const response = await fetch(`${URL}/estudiantes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar estudiante");
}

export async function getAllDocentes(): Promise<Docente[]> {
  const response = await fetch(`${URL}/docentes`, { cache: "no-store" });
  if (!response.ok) throw new Error("Error al obtener los docentes");
  const data = await response.json();
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
}

export async function getDocente(id: number): Promise<Docente> {
  const response = await fetch(`${URL}/docentes/${id}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Error al obtener el docente");
  const data = await response.json();
  return data?.data ?? data;
}

export async function createDocente(
  docente: Partial<Docente>,
): Promise<Docente> {
  const response = await fetch(`${URL}/docentes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(docente),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? JSON.stringify(data));
  return data?.data ?? data;
}

export async function updateDocente(
  id: number,
  docente: Partial<Docente>,
): Promise<Docente> {
  const response = await fetch(`${URL}/docentes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(docente),
  });
  if (!response.ok) throw new Error("Error al actualizar docente");
  const data = await response.json();
  return data?.data ?? data;
}

export async function deleteDocente(id: number): Promise<void> {
  const response = await fetch(`${URL}/docentes/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Error al eliminar docente");
}

export async function getSexos(): Promise<Sexo[]> {
  try {
    const response = await fetch(`${URL}/estudiantes/sexo`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    const data = await response.json();
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
  } catch {}
  return [];
}

export async function getEtnias(): Promise<Etnia[]> {
  try {
    const response = await fetch(`${URL}/estudiantes/etnia`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    const data = await response.json();
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
  } catch {}
  return [];
}

export async function getCargos(): Promise<Cargo[]> {
  try {
    const response = await fetch(`${URL}/docentes/cargo`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    const data = await response.json();
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
  } catch {}
  return [];
}

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

export async function getFilesByModel(
  modelType: "estudiante" | "docente",
  modelId: number,
  fileType?: string,
): Promise<FileRecord[]> {
  try {
    const params = new URLSearchParams({
      model_type: modelType,
      model_id: String(modelId),
    });
    if (fileType) params.append("file_type", fileType);
    const response = await fetch(`${FILES_URL}/files/model?${params}`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    const data = await response.json();
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  } catch {}
  return [];
}

export async function uploadProfilePhoto(
  modelType: "estudiante" | "docente",
  modelId: number,
  file: File,
  userId: number,
): Promise<FileRecord> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("model_type", modelType);
  formData.append("model_id", String(modelId));
  formData.append("file_type", "foto_perfil");
  formData.append("user_updated_id", String(userId));

  const response = await fetch(`${FILES_URL}/files/upload`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Error al subir archivo");
  const data = await response.json();
  return data;
}

export async function deleteProfilePhoto(fileId: number): Promise<void> {
  const response = await fetch(`${FILES_URL}/files/${fileId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar archivo");
}

export async function deleteProfilePhotoByModel(
  modelType: "estudiante" | "docente",
  modelId: number,
): Promise<void> {
  const response = await fetch(
    `${FILES_URL}/files/model/${modelType}/${modelId}?file_type=foto_perfil`,
    {
      method: "DELETE",
    },
  );
  if (!response.ok) throw new Error("Error al eliminar archivo");
}

export function getFileUrl(fileName: string): string {
  return `${FILES_URL}/static/${fileName}`;
}
