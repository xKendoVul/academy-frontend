export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-neutral-800 mb-2">Academy</h1>
      <p className="text-neutral-500 mb-8">Sistema de gestión académica</p>
      <div className="grid grid-cols-2 gap-4 max-w-md">
        <a href="/estudiantes" className="block p-5 bg-white border border-neutral-200 rounded-lg hover:border-neutral-400 transition-colors">
          <p className="font-semibold text-neutral-800">Estudiantes</p>
          <p className="text-sm text-neutral-400 mt-1">Gestionar estudiantes</p>
        </a>
        <a href="/docentes" className="block p-5 bg-white border border-neutral-200 rounded-lg hover:border-neutral-400 transition-colors">
          <p className="font-semibold text-neutral-800">Docentes</p>
          <p className="text-sm text-neutral-400 mt-1">Gestionar docentes</p>
        </a>
      </div>
    </div>
  )
}