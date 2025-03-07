import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/graphql";

export const fetchCursosDeEstudiante = async (estudianteId: number) => {
  const query = `
    query {
      cursosDeEstudiante(estudianteId: ${estudianteId}) {
        id
        nombre
        descripcion
      }
    }
  `;

  try {
    const response = await axios.post(API_URL, { query }, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data.data.cursosDeEstudiante;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};
