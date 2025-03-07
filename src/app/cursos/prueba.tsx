'use client'

import { useEffect, useState } from "react";
import { getCursosEstudiante } from "../api/graphql/api";

const CursosEstudiante = ({ idEstudiante }: { idEstudiante: number }) => {
  const [cursos, setCursos] = useState<{ id: number; nombre: string; descripcion: string }[]>([]);

  useEffect(() => {
    const fetchCursos = async () => {
      const data = await getCursosEstudiante(idEstudiante);
      setCursos(data);
    };
    fetchCursos();
  }, [idEstudiante]);

  return (
    <div>
      <h2 className="text-xl font-bold">Cursos del Estudiante</h2>
      {cursos.length > 0 ? (
        <ul>
          {cursos.map((curso) => (
            <li key={curso.id} className="border p-2 my-2 rounded">
              <h3 className="text-lg font-semibold">{curso.nombre}</h3>
              <p>{curso.descripcion}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay cursos disponibles.</p>
      )}
    </div>
  );
};

export default CursosEstudiante;
