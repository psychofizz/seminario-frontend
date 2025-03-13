import { DetalleCursoCLient } from "./components/detalle-curso";

interface CourseParams {
  params: {
    id: string
  }
}

export default function PageDetalleCurso({ params }: CourseParams) {
  return <DetalleCursoCLient courseId={params.id} />;
}