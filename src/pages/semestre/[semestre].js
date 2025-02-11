import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/semestre.module.css";

export default function SemestreDetalhes() {
    const router = useRouter();
    const [semestreNome, setSemestreNome] = useState("");
    const [semestreId, setSemestreId] = useState("");
    const [disciplinas, setDisciplinas] = useState([]);
    const [disciplinaNome, setDisciplinaNome] = useState("");
    const [error, setError] = useState("");

    // Carregar o ID e o nome do semestre do localStorage
    useEffect(() => {
        const id = localStorage.getItem("semestreId");
        const nome = localStorage.getItem("semestreNome");

        if (id && nome) {
            setSemestreId(id);
            setSemestreNome(nome);
        } else {
            setError("Semestre não encontrado.");
            router.push("/curso"); // Redireciona de volta se não houver dados
        }
    }, [router]);

    // Carregar as disciplinas do semestre
    useEffect(() => {
        if (!semestreId) return; // Sai se o ID do semestre não estiver disponível

        fetch(`https://organizador-academico-be.onrender.com/cadeiras/semestre/${semestreId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.token,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setDisciplinas(data); // Define a lista de disciplinas
                }
            })
            .catch(() => setError("Erro ao carregar disciplinas"));
    }, [semestreId]); // Executa sempre que o ID do semestre mudar

    // Função para gerar o código da disciplina
    const gerarCodigoDisciplina = (nome) => {
        // Pega as iniciais do nome da disciplina
        const iniciais = nome
            .split(" ")
            .map((palavra) => palavra[0].toUpperCase())
            .join("");

        // Gera um número sequencial baseado no número de disciplinas já cadastradas
        const numeroSequencial = disciplinas.length + 1;

        // Retorna o código no formato "INICIAIS + NÚMERO" (ex: "ES101")
        return `${iniciais}${numeroSequencial.toString().padStart(3, "0")}`;
    };

    const handleAddDisciplina = async () => {
        if (disciplinaNome.trim() === "") {
            setError("O nome da disciplina não pode estar vazio.");
            return;
        }

        try {
            // Gera o código da disciplina
            const codigo = gerarCodigoDisciplina(disciplinaNome);

            const response = await fetch(
                `https://organizador-academico-be.onrender.com/cadeiras/semestre/${semestreId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.token,
                    },
                    body: JSON.stringify({
                        nome: disciplinaNome,
                        codigo: codigo, // Código gerado automaticamente
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erro ao adicionar disciplina");
            }

            setDisciplinas((prev) => [...prev, data]); // Adiciona a nova disciplina à lista
            setDisciplinaNome("");
            setError("");
        } catch (error) {
            setError(error.message);
        }
    };

    const handleNavigateToDisciplina = (disciplina) => {
        // Armazena o ID e o nome da disciplina no localStorage
        localStorage.setItem("disciplinaId", disciplina.id);
        localStorage.setItem("disciplinaNome", disciplina.nome);

        // Navega para a página da disciplina
        router.push(`/disciplina/${disciplina.id}`);
    };

    const handleDeleteSemestre = async () => {
        try {
            const response = await fetch(
                `https://organizador-academico-be.onrender.com/semestres/${semestreId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.token,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao excluir semestre");
            }

            // Remove os dados do localStorage
            localStorage.removeItem("semestreId");
            localStorage.removeItem("semestreNome");

            // Redireciona para a página de curso
            router.push("/curso");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>
                    {semestreNome || "Carregando..."}
                </h1>

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.form}>
                    <input
                        type="text"
                        value={disciplinaNome}
                        onChange={(e) => setDisciplinaNome(e.target.value)}
                        placeholder="Nome da disciplina"
                        className={styles.input}
                    />
                    <button
                        onClick={handleAddDisciplina}
                        className={`${styles.addButton} ${styles.addButtonStyle}`}
                    >
                        OK
                    </button>
                </div>

                <h2 className={styles.subTitle}>DISCIPLINAS CADASTRADAS:</h2>
                <ul>
                    {disciplinas.length === 0 ? (
                        <li className={styles.semestreListItem}>
                            Nenhuma disciplina cadastrada.
                        </li>
                    ) : (
                        disciplinas.map((disciplina) => (
                            <li
                                key={disciplina.id}
                                className={styles.semestreListItem}
                                onClick={() =>
                                    handleNavigateToDisciplina(disciplina)
                                }
                            >
                                {disciplina.nome} - {disciplina.codigo}
                            </li>
                        ))
                    )}
                </ul>

                <div className={styles.actions}>
                    <button
                        onClick={() => router.push("/curso")}
                        className={`${styles.backButton} ${styles.backButtonStyle}`}
                    >
                        Voltar
                    </button>
                    <button
                        onClick={handleDeleteSemestre}
                        className={`${styles.button} ${styles.deleteButton}`}
                    >
                        Excluir Semestre
                    </button>
                </div>
            </div>
        </div>
    );
}