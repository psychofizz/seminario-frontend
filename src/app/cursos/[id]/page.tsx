import { DetalleCursoCLient } from "./components/detalle-curso";

interface CourseParams {
  params: {
    id: string
  }
}

export default async function PageDetalleCurso({ params }: CourseParams) {
  const resolvedParams = await params;
  
  return <DetalleCursoCLient courseId={resolvedParams.id} />;
}