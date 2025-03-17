import ViewAsignacion from "../components/view-asignacion";


export default async function PageAsignacion({ params }:{ params: { idasignacion: string } }) {
  const resolvedParams = await params;
  
  return <ViewAsignacion assignmentId={resolvedParams.idasignacion} />;
}