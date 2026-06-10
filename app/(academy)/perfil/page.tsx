'use client'

import { useEffect, useState, useRef } from 'react'
import { getStudent, getDocente, getFilesByModel, uploadProfilePhoto, deleteProfilePhotoByModel, getFileUrl, FileRecord } from '@/actions'

export default function PerfilPage() {
  const [modelType, setModelType] = useState<'estudiante' | 'docente'>('estudiante')
  const [modelId, setModelId] = useState<number>(1)
  const [user, setUser] = useState<any>(null)
  const [files, setFiles] = useState<FileRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadData()
  }, [modelType, modelId])

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const userData = modelType === 'estudiante'
        ? await getStudent(modelId)
        : await getDocente(modelId)
      setUser(userData)

      const photoFiles = await getFilesByModel(modelType, modelId, 'foto_perfil')
      setFiles(photoFiles)
    } catch (e: any) {
      setError(e.message || 'Error al cargar datos')
      setUser(null)
    }
    setLoading(false)
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')
    try {
      await deleteProfilePhotoByModel(modelType, modelId)
      await uploadProfilePhoto(modelType, modelId, file, modelId)
      await loadData()
    } catch (err: any) {
      setError(err.message || 'Error al subir archivo')
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleDeletePhoto() {
    if (!confirm('¿Eliminar la foto de perfil?')) return
    setError('')
    try {
      await deleteProfilePhotoByModel(modelType, modelId)
      await loadData()
    } catch (err: any) {
      setError(err.message || 'Error al eliminar archivo')
    }
  }

  const currentPhoto = files.find(f => f.file_type === 'foto_perfil')
  const displayName = user
    ? modelType === 'estudiante'
      ? `${user.nombres} ${user.paterno}${user.materno ? ' ' + user.materno : ''}`
      : `${user.nombres} ${user.apellidos}`
    : ''

  return (
    <div className="max-w-md mx-auto px-6 py-8">
      <h1 className="text-xl font-bold text-neutral-800 mb-6">Mi Perfil</h1>

      <div className="flex gap-4 mb-6">
        <select
          className="flex-1 border border-neutral-200 rounded-md px-3 py-2 text-sm bg-white"
          value={modelType}
          onChange={e => setModelType(e.target.value as 'estudiante' | 'docente')}
        >
          <option value="estudiante">Estudiante</option>
          <option value="docente">Docente</option>
        </select>
        <input
          type="number"
          min={1}
          className="w-24 border border-neutral-200 rounded-md px-3 py-2 text-sm"
          value={modelId}
          onChange={e => setModelId(Number(e.target.value))}
        />
        <button
          onClick={loadData}
          className="px-3 py-2 text-sm bg-neutral-100 text-neutral-600 rounded-md hover:bg-neutral-200"
        >
          Buscar
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-neutral-400">Cargando...</div>
      ) : user ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              {currentPhoto ? (
                <img
                  src={getFileUrl(currentPhoto.file_name)}
                  alt="Foto de perfil"
                  className="w-32 h-32 rounded-full object-cover border-4 border-neutral-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-neutral-100 border-4 border-neutral-200 flex items-center justify-center">
                  <span className="text-4xl text-neutral-400">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <h2 className="text-lg font-semibold text-neutral-800 mb-1">{displayName}</h2>
            <p className="text-sm text-neutral-500 capitalize">{modelType}</p>

            <div className="mt-6 flex gap-3">
              <label className="px-4 py-2 text-sm font-medium bg-neutral-800 text-white rounded-md hover:bg-neutral-700 cursor-pointer">
                {currentPhoto ? 'Cambiar' : 'Subir'} foto
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              {currentPhoto && (
                <button
                  onClick={handleDeletePhoto}
                  className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-neutral-400">Usuario no encontrado</div>
      )}
    </div>
  )
}