"use client";

import { useEffect, useState } from "react";
import { Docente, Sexo, Etnia, Cargo } from "@/types/estudiante.interface";
import {
  getAllDocentes,
  createDocente,
  updateDocente,
  deleteDocente,
  getSexos,
  getEtnias,
  getCargos,
} from "@/actions";

export default function DocentesPage() {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [sexos, setSexos] = useState<Sexo[]>([]);
  const [etnias, setEtnias] = useState<Etnia[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const inputClass =
    "w-full border border-neutral-200 rounded-md px-3 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent";
  const selectClass =
    "w-full border border-neutral-200 rounded-md px-3 py-2 text-sm text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent";

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Docente | null>(null);
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    direccion: "",
    cedula: "",
    telefono: "",
    sexo_id: 0,
    etnia_id: 0,
    cargo_id: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [docs, sx, et, cg] = await Promise.all([
      getAllDocentes(),
      getSexos(),
      getEtnias(),
      getCargos(),
    ]);
    setDocentes(docs);
    setSexos(sx);
    setEtnias(et);
    setCargos(cg);
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({
      nombres: "",
      apellidos: "",
      email: "",
      direccion: "",
      cedula: "",
      telefono: "",
      sexo_id: sexos[0]?.id ?? 0,
      etnia_id: etnias[0]?.id ?? 0,
      cargo_id: cargos[0]?.id ?? 0,
    });
    setShowForm(true);
  }

  function openEdit(doc: Docente) {
    setEditing(doc);
    setForm({
      nombres: doc.nombres,
      apellidos: doc.apellidos,
      email: doc.email ?? "",
      direccion: doc.direccion ?? "",
      cedula: doc.cedula ?? "",
      telefono: doc.telefono ?? "",
      sexo_id: doc.sexo_id,
      etnia_id: doc.etnia_id,
      cargo_id: doc.cargo_id,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await updateDocente(editing.id, form);
      } else {
        await createDocente(form);
      }
      setShowForm(false);
      loadData();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar docente");
    }
  }

  async function handleDelete(id: number) {
    if (confirm("¿Eliminar este docente?")) {
      setError("");
      try {
        await deleteDocente(id);
        loadData();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error al eliminar docente");
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
        <h1 className="text-xl font-bold text-neutral-800">Docentes</h1>
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
                Nombres
              </th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">
                Apellidos
              </th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">
                Email
              </th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">
                Teléfono
              </th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">
                Sexo
              </th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">
                Etnia
              </th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">
                Cargo
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {docentes.map((doc) => (
              <tr
                key={doc.id}
                className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors"
              >
                <td className="px-4 py-3 text-neutral-800">{doc.nombres}</td>
                <td className="px-4 py-3 text-neutral-800">{doc.apellidos}</td>
                <td className="px-4 py-3 text-neutral-500">
                  {doc.email ?? "-"}
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {doc.telefono ?? "-"}
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {doc.sexo?.sexo ?? doc.sexo_id}
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {doc.etnia?.etnia ?? doc.etnia_id}
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {doc.cargo?.cargo ?? doc.cargo_id}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => openEdit(doc)}
                    className="text-xs text-neutral-500 hover:text-neutral-800 mr-3"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {docentes.length === 0 && (
              <tr>
                <td
                  colSpan={8}
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
              {editing ? "Editar docente" : "Nuevo docente"}
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
                placeholder="Apellidos"
                value={form.apellidos}
                onChange={(e) =>
                  setForm({ ...form, apellidos: e.target.value })
                }
                required
              />
              <input
                className={inputClass}
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                className={inputClass}
                placeholder="Dirección"
                value={form.direccion}
                onChange={(e) =>
                  setForm({ ...form, direccion: e.target.value })
                }
              />
              <input
                className={inputClass}
                placeholder="Cédula"
                value={form.cedula}
                onChange={(e) => setForm({ ...form, cedula: e.target.value })}
              />
              <input
                className={inputClass}
                placeholder="Teléfono"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
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
              <select
                className={selectClass}
                value={form.cargo_id}
                onChange={(e) =>
                  setForm({ ...form, cargo_id: Number(e.target.value) })
                }
                required
              >
                <option value={0} disabled>
                  Seleccionar cargo
                </option>
                {cargos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.cargo}
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
