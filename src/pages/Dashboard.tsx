export default function Dashboard() {
  return (
    <div className="container mx-auto p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-6">Kerigma Hub</h1>
        <p className="text-muted-foreground mb-8">
          Bem-vindo ao sistema de gestão da sua igreja!
        </p>
        <div className="bg-card p-6 rounded-lg border shadow-kerigma max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Projeto Conectado</h2>
          <p className="text-sm text-muted-foreground">
            ✅ Supabase configurado<br/>
            ✅ React App funcionando<br/>
            ✅ Design system ativo
          </p>
        </div>
      </div>
    </div>
  )
}