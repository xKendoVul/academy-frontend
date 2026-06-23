import {
  Estudiante,
  Docente,
  Sexo,
  Etnia,
  Cargo,
} from "@/types/estudiante.interface";
import type { FileRecord } from "@/types/estudiante.interface";

const URL = `${process.env.NEXT_PUBLIC_GATEWAY_URL}`;

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
  const response = await fetch(`${URL}/estudiantes/sexo`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Error al obtener sexos");
  const data = await response.json();
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
}

export async function getEtnias(): Promise<Etnia[]> {
  const response = await fetch(`${URL}/estudiantes/etnia`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Error al obtener etnias");
  const data = await response.json();
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
}

export async function getCargos(): Promise<Cargo[]> {
  const response = await fetch(`${URL}/docentes/cargo`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Error al obtener cargos");
  const data = await response.json();
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
}

export async function getFilesByModel(
  modelType: "estudiante" | "docente",
  modelId: number,
  fileType?: string,
): Promise<FileRecord[]> {
  const params = new URLSearchParams({
    model_type: modelType,
    model_id: String(modelId),
  });
  if (fileType) params.append("file_type", fileType);
  const response = await fetch(`${URL}/files/model?${params}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Error al obtener archivos");
  const data = await response.json();
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
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

  const response = await fetch(`${URL}/files/upload`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.text().catch(() => "");
    throw new Error(
      `Error al subir archivo (${response.status}): ${errorData}`,
    );
  }
  let data: FileRecord;
  try {
    data = await response.json();
  } catch (e: unknown) {
    throw new Error(
      `Error al procesar respuesta de upload: ${e instanceof Error ? e.message : "Respuesta inválida"}`,
    );
  }
  return data;
}

export async function deleteProfilePhoto(fileId: number): Promise<void> {
  const response = await fetch(`${URL}/files/${fileId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar archivo");
}

export async function deleteProfilePhotoByModel(
  modelType: "estudiante" | "docente",
  modelId: number,
): Promise<void> {
  try {
    const response = await fetch(
      `${URL}/files/model/${modelType}/${modelId}?file_type=foto_perfil`,
      {
        method: "DELETE",
      },
    );
    // No lanzar error si no habia archivo (404) o si no habia nada que eliminar
    if (!response.ok && response.status !== 404) {
      throw new Error("Error al eliminar archivo");
    }
  } catch (e: unknown) {
    // Solo relanzar si no es un error de "no encontrado"
    const message = e instanceof Error ? e.message : "Error";
    if (message !== "Error al eliminar archivo") throw e;
  }
}

export function getFileUrl(fileName: string): string {
  return `${URL}/files/static/${fileName}`;
}
