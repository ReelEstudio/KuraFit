import { createClient } from '../../utils/supabase/server';
import { redirect } from 'next/navigation';
import ProfileDashboard from '../components/ProfileDashboard';

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Verificar sesión
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect('/login');
  }

  // 2. Traer datos del usuario Y sus sesiones de entrenamiento
  const { data: userData } = await supabase
    .from('users')
    .select(`
      *,
      workout_sessions (
        id,
        status,
        focus,
        created_at
      )
    `)
    .eq('id', user.id)
    .single();

  // Función para manejar nuevas métricas (opcional por ahora)
  const handleAddMetric = async (metric: any) => {
    'use server';
    // Lógica para guardar peso/grasa si lo deseas
  };

  return (
    <main>
      <ProfileDashboard 
        user={userData} 
        onAddMetric={handleAddMetric} 
      />
    </main>
  );
}