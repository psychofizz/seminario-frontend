import ViewAsignacion from "../components/view-asignacion";

interface AsignacionParams {
  params: {
    id: string
  }
}

export default async function PageAsignacion({ params }: AsignacionParams) {
  const resolvedParams = await params;
  
  return <ViewAsignacion assignmentId={resolvedParams.id} />;
}