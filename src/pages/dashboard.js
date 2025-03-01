import { useRouter } from "next/router";
import styles from "../styles/dashboard.module.css"; // Importa o CSS

export default function Dashboard() {
    const router = useRouter();

    const handleNavigateToCourse = async () => {
        try {
            const response = await fetch("https://organizador-academico-be.onrender.com/cursos", {
                method: "GET",
                headers: {
                    Authorization: localStorage.token,
                    "Content-Type": "application/json",
                },
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || "Erro ao acessar cursos");
            }
    
            // Verifica se há cursos e pega o primeiro
            if (data.length > 0) {
                const curso = data[0]; // Pega o primeiro curso
                localStorage.setItem("idCurso", curso.id);
                localStorage.setItem("nomeCurso", curso.nome);
                router.push("/curso");
            } else {
                throw new Error("Nenhum curso encontrado.");
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleLogout = () => {
        // Remove o token do localStorage
        localStorage.removeItem("token");
    
        // Redireciona para a página de login
        router.push("/login");
    };

    return (
        <div className={styles.dashboardContainer}>
            <p className={styles.title}>Organizador Acadêmico</p>
            
            <div className={styles.dashboardCard}>
                <h1 className={styles.titleCard}>Seja Bem-vindo!</h1>

                    {/* Botão para visão de curso */}
                    <button
                        onClick={handleNavigateToCourse}
                        className={`${styles.button} ${styles.viewCourseButton}`}
                    >
                        Acessar Curso
                    </button>

                    {/* Botão de logout */}
                    <button onClick={handleLogout}
                        className={`${styles.button} ${styles.logoutButton}`}
                    >
                        Sair
                    </button>
            </div>
        </div>
    );
}
