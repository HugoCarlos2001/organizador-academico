// pages/disciplina/[id].js (ou o arquivo que você estiver utilizando)
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/disciplina.module.css";

// Importa os componentes das funcionalidades
import Notebook from "../../components/Notebook";
import StudyPlan from "../../components/StudyPlan";
import GradeCalculator from "../../components/GradeCalculator";

export default function DisciplinaDetalhes() {
    const router = useRouter();
    const [nomeDisciplina, setNomeDisciplina] = useState("");
    const [error, setError] = useState("");
    // Estado para controlar a aba ativa: "notebook", "studyPlan", ou "gradeCalc"
    const [activeTab, setActiveTab] = useState("notebook");

    // Carregar os dados da disciplina do localStorage
    useEffect(() => {
        const id = localStorage.getItem("disciplinaId");
        const nome = localStorage.getItem("disciplinaNome");

        if (id && nome) {
            setNomeDisciplina(nome);
        } else {
            setError("Disciplina não encontrada.");
            router.push(`/semestre/${localStorage.getItem("semestreId")}`);
        }
    }, [router]);

    const handleDeleteDisciplina = async () => {
        const disciplinaId = localStorage.getItem("disciplinaId");

        try {
            const response = await fetch(
                `https://organizador-academico-be.onrender.com/cadeiras/${disciplinaId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.token,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao excluir disciplina");
            }

            // Remove os dados do localStorage e redireciona
            localStorage.removeItem("disciplinaId");
            localStorage.removeItem("disciplinaNome");
            router.push(`/semestre/${localStorage.getItem("semestreId")}`);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <h1 className={styles.title}>
                    {nomeDisciplina || "Carregando..."}
                </h1>
                {error && <p className={styles.error}>{error}</p>}

                <button
                onClick={handleDeleteDisciplina}
                className={`${styles.deleteButton} ${styles.deleteButtonStyle}`}
            >
                Excluir Disciplina
                </button>
                <button
                    onClick={() =>
                        router.push(`/semestre/${localStorage.getItem("semestreId")}`)
                    }
                    className={`${styles.backButton} ${styles.backButtonStyle}`}
            >
                    Voltar
                </button>
            </div>

            {/* Botões para alternar entre as funcionalidades */}
            <div>
                <button onClick={() => setActiveTab("notebook")}
                className={`${styles.tabButton} ${styles.tabButtonStyle}`}    
                    >
                    Caderno Virtual
                </button>

                <button onClick={() => setActiveTab("studyPlan")}
                    className={`${styles.tabButton} ${styles.tabButtonStyle}`}>
                    Plano de Estudo
                </button>
                
                <button onClick={() => setActiveTab("gradeCalc")}
                    className={`${styles.tabButton} ${styles.tabButtonStyle}`}>
                    Calculadora de Notas
                </button>
                
            </div>

            {/* Renderização condicional do conteúdo da aba ativa */}
            <div className={styles.tabContent}>
                {activeTab === "notebook" && <Notebook />}
                {activeTab === "studyPlan" && <StudyPlan />}
                {activeTab === "gradeCalc" && <GradeCalculator />}
            </div>
        </div>
    );
}
