import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../styles/createCourse.module.css"; // Importa o CSS

export default function createCourse() {
    const router = useRouter();
    const [course, setCourse] = useState("");

    function handleCourseSubmit(e) {
        e.preventDefault();

        if (course.trim() !== "") {
            // Aqui você pode implementar a lógica de cadastro do curso
            // Por exemplo, salvando no banco ou passando como parâmetro na rota
            router.push(`/course?name=${encodeURIComponent(course)}`);
        } else {
            alert("Por favor, insira o nome do curso.");
        }
    }

    return (
        <div className={styles.Container}>
            <p className={styles.title}>Organizador Acadêmico</p>

            <div className={styles.dashboardCard}>
                <h1 className={styles.titleCard}>Seja Bem-vindo!</h1>

                <div className={styles.inputForms}>
                    {/* Formulário para cadastro de curso */}
                    <form
                        onSubmit={handleCourseSubmit}

                    >
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
