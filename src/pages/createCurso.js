import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../styles/createCourse.module.css"; // Importa o CSS

export default function CreateCourse() {
    const router = useRouter();
    const [course, setCourse] = useState("");

    async function handleCourseSubmit(e) {
        e.preventDefault();

        if (course.trim() !== "") {
            try {
                // Faz a requisição para criar o curso
                const response = await fetch("https://organizador-academico-be.onrender.com/cursos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.token,
                    },
                    body: JSON.stringify({ nome: course, descricao: "" }), // Adicione a descrição se necessário
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Erro ao criar curso");
                }

                // Redireciona para o dashboard após a criação do curso
                router.push("/dashboard");
            } catch (error) {
                alert(error.message);
            }
        } else {
            alert("Por favor, insira o nome do curso.");
        }
    }

    return (
        <div className={styles.container}>
            <p className={styles.title}>Organizador Acadêmico</p>

            <div className={styles.dashboardCard}>
                <h1 className={styles.titleCard}>Seja Bem-vindo!</h1>

                <div className={styles.inputForms}>
                    {/* Formulário para cadastro de curso */}
                    <form onSubmit={handleCourseSubmit}>
                        <input
                            type="text"
                            placeholder="Digite o nome do curso"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            className={styles.input}
                        />

                        <button
                            type="submit"
                            className={`${styles.button} ${styles.submitCourseButton}`}
                        >
                            Cadastrar Curso
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}