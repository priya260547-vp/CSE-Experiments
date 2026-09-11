import { useEffect, useState } from "react";
import api from "./api";

function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await api.get("/api/students");

      setStudents(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await api.delete(`/api/students/${id}`);

      loadStudents();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Delete failed"
      );
    }
  };

  return (
    <div className="page">
      <h1>👩‍💼 Manage Students</h1>

      <p>
        Only administrators can access this page.
      </p>

      <div className="student-list">

        {students.map((student) => (
          <div
            className="student-card"
            key={student.id}
          >
            <h3>{student.name}</h3>

            <p>
              Course: {student.course}
            </p>

            <button
              onClick={() =>
                deleteStudent(student.id)
              }
            >
              Delete
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Students;