import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/disciplina.module.css";

export default function DisciplinaDetalhes() {
    const router = useRouter();
    const [nomeDisciplina, setNomeDisciplina] = useState("");
    const [itens, setItens] = useState([]);
    const [itemNome, setItemNome] = useState("");
    const [error, setError] = useState("");

    // Carregar o ID e o nome da disciplina do localStorage
    useEffect(() => {
        const id = localStorage.getItem("disciplinaId");
        const nome = localStorage.getItem("disciplinaNome");

        if (id && nome) {
            setNomeDisciplina(nome); // Define o nome da disciplina
        } else {
            setError("Disciplina não encontrada.");
            router.push(`/semestre/${localStorage.getItem("semestreId")}`); // Redireciona de volta se não houver dados
        }
    }, [router]);

    const handleAddItem = () => {
        if (itemNome.trim() !== "") {
            setItens((prev) => [...prev, itemNome]);
            setItemNome("");
        }
    };

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

            // Remove os dados do localStorage
            localStorage.removeItem("disciplinaId");
            localStorage.removeItem("disciplinaNome");

            // Redireciona para a página do semestre
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
                </div>
                
                <button
                        onClick={handleDeleteDisciplina}
                        className={`${styles.deleteButton} ${styles.deleteButtonStyle}`}
                    >
                        Excluir Disciplina
                </button>
                    <button
                        onClick={() =>
                            router.push(
                                `/semestre/${localStorage.getItem("semestreId")}`
                            )
                        }
                        className={`${styles.backButton} ${styles.backButtonStyle}`}
                    >
                        Voltar
                    </button>
                    
                
        </div>
    );
}