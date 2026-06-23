"use client";

import { useEffect, useState } from "react";
import { Estudiante, Sexo, Etnia } from "@/types/estudiante.interface";
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getSexos,
  getEtnias,
} from "@/actions";

export default function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [sexos, setSexos] = useState<Sexo[]>([]);
  const [etnias, setEtnias] = useState<Etnia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const inputClass =
    "w-full border border-neutral-200 rounded-md px-3 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent";
  const selectClass =
    "w-full border border-neutral-200 rounded-md px-3 py-2 text-sm text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent";

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Estudiante | null>(null);
  const [form, setForm] = useState({
    nombres: "",
    paterno: "",
    materno: "",
    direccion: "",
    sexo_id: 0,
    etnia_id: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [ests, sx, et] = await Promise.all([
        getAllStudents(),
        getSexos(),
        getEtnias(),
      ]);
      setEstudiantes(ests);
      setSexos(sx);
      setEtnias(et);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al cargar datos");
      setEstudiantes([]);
      setSexos([]);
      setEtnias([]);
    }
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({
      nombres: "",
      paterno: "",
      materno: "",
      direccion: "",
      sexo_id: sexos[0]?.id ?? 0,
      etnia_id: etnias[0]?.id ?? 0,
    });
    setShowForm(true);
  }

  function openEdit(est: Estudiante) {
    setEditing(est);
    setForm({
      nombres: est.nombres,
      paterno: est.paterno,
      materno: est.materno ?? "",
      direccion: est.direccion,
      sexo_id: est.sexo_id,
      etnia_id: est.etnia_id,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await updateStudent(editing.id, form);
      } else {
        await createStudent(form);
      }
      setShowForm(false);
      loadData();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar estudiante");
    }
  }

  async function handleDelete(id: number) {
    if (confirm("¿Eliminar este estudiante?")) {
      setError("");
      try {
        await deleteStudent(id);
        loadData();
      } catch (e: unknown) {
        setError(
          e instanceof Error ? e.message : "Error al eliminar estudiante",
        );
      }
    }
  }

  if (loading)
    return (
      <div className="max-w-5xl mx-auto px-6 py-8 text-neutral-400">
        Cargando...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-neutral-800">Estudiantes</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 text-sm font-medium bg-neutral-800 text-white rounded-md hover:bg-neutral-700 transition-colors"
        >
          + Nuevo
        </button>
      </div>

      {error && (
        <p className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
          {error}
        </p>
      )}

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="text-left px-4 py-3 font-medium text-neutral-500">
                Nombre
              </th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">
                Paterno
              </th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">
                Materno
              </th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">
                Dirección
              </th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">
                Sexo
              </th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">
                Etnia
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((est) => (
              <tr
                key={est.id}
                className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors"
              >
                <td className="px-4 py-3 text-neutral-800">{est.nombres}</td>
                <td className="px-4 py-3 text-neutral-800">{est.paterno}</td>
                <td className="px-4 py-3 text-neutral-500">
                  {est.materno ?? "-"}
                </td>
                <td className="px-4 py-3 text-neutral-500">{est.direccion}</td>
                <td className="px-4 py-3 text-neutral-500">
                  {est.sexo?.sexo ?? est.sexo_id}
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {est.etnia?.etnia ?? est.etnia_id}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => openEdit(est)}
                    className="text-xs text-neutral-500 hover:text-neutral-800 mr-3"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(est.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {estudiantes.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-neutral-300"
                >
                  Sin registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl border border-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">
              {editing ? "Editar estudiante" : "Nuevo estudiante"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                className={inputClass}
                placeholder="Nombres"
                value={form.nombres}
                onChange={(e) => setForm({ ...form, nombres: e.target.value })}
                required
              />
              <input
                className={inputClass}
                placeholder="Paterno"
                value={form.paterno}
                onChange={(e) => setForm({ ...form, paterno: e.target.value })}
                required
              />
              <input
                className={inputClass}
                placeholder="Materno"
                value={form.materno}
                onChange={(e) => setForm({ ...form, materno: e.target.value })}
              />
              <input
                className={inputClass}
                placeholder="Dirección"
                value={form.direccion}
                onChange={(e) =>
                  setForm({ ...form, direccion: e.target.value })
                }
                required
              />
              <select
                className={selectClass}
                value={form.sexo_id}
                onChange={(e) =>
                  setForm({ ...form, sexo_id: Number(e.target.value) })
                }
                required
              >
                <option value={0} disabled>
                  Seleccionar sexo
                </option>
                {sexos.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.sexo}
                  </option>
                ))}
              </select>
              <select
                className={selectClass}
                value={form.etnia_id}
                onChange={(e) =>
                  setForm({ ...form, etnia_id: Number(e.target.value) })
                }
                required
              >
                <option value={0} disabled>
                  Seleccionar etnia
                </option>
                {etnias.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.etnia}
                  </option>
                ))}
              </select>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm font-medium bg-neutral-800 text-white rounded-md hover:bg-neutral-700 transition-colors"
                >
                  {editing ? "Actualizar" : "Crear"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium border border-neutral-200 text-neutral-600 rounded-md hover:bg-neutral-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
