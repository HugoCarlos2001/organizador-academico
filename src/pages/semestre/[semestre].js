import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import styles from "../../styles/semestre.module.css";

export default function SemestreDetalhes() {
    const router = useRouter();
    const [semestreNome, setSemestreNome] = useState("");
    const [semestreId, setSemestreId] = useState("");
    const [disciplinas, setDisciplinas] = useState([]);
    const [disciplinaNome, setDisciplinaNome] = useState("");
    const [error, setError] = useState("");
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const id = localStorage.getItem("semestreId");
        const nome = localStorage.getItem("semestreNome");

        if (id && nome) {
            setSemestreId(id);
            setSemestreNome(nome);
        } else {
            setError("Semestre não encontrado.");
            router.push("/curso");
        }
    }, [router]);

    useEffect(() => {
        if (!semestreId) return;

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
                    setDisciplinas(data);
                }
            })
            .catch(() => setError("Erro ao carregar disciplinas"));
    }, [semestreId]);

    const gerarCodigoDisciplina = (nome) => {
        const iniciais = nome
            .split(" ")
            .map((palavra) => palavra[0].toUpperCase())
            .join("");
        const numeroSequencial = disciplinas.length + 1;
        return `${iniciais}${numeroSequencial.toString().padStart(3, "0")}`;
    };

    const handleAddDisciplina = async () => {
        if (disciplinaNome.trim() === "") {
            setError("O nome da disciplina não pode estar vazio.");
            return;
        }

        try {
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
                        codigo: codigo,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erro ao adicionar disciplina");
            }

            setDisciplinas((prev) => [...prev, data]);
            setDisciplinaNome("");
            setError("");
        } catch (error) {
            setError(error.message);
        }
    };

    const handleNavigateToDisciplina = (disciplina) => {
        localStorage.setItem("disciplinaId", disciplina.id);
        localStorage.setItem("disciplinaNome", disciplina.nome);
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

            localStorage.removeItem("semestreId");
            localStorage.removeItem("semestreNome");
            router.push("/curso");
        } catch (error) {
            setError(error.message);
        }
    };

    // Função para adicionar evento ao selecionar uma data
    const handleDateSelect = (selectedDate) => {
        setDate(selectedDate);
        const disciplina = prompt("Insira a descrição ou nome do evento associado à data:");
        if (disciplina) {
            const novoEvento = {
                title: disciplina, // Sem prefixo "Evento de"
                date: selectedDate.toLocaleDateString("pt-BR"), // Formata a data para DIA/MÊS/ANO
                disciplineId: disciplina, // Se necessário, pode manter ou ajustar conforme a lógica desejada
            };
            setEvents((prevEvents) => [...prevEvents, novoEvento]);
        }
    };
    

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <h1 className={styles.title}>
                    {semestreNome || "Carregando..."}
                </h1>
                <div className={styles.inputForms}>
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
                        Ok
                    </button>
                </div>
                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.semestreList}>
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
                                    onClick={() => handleNavigateToDisciplina(disciplina)}
                                >
                                    {disciplina.nome} - {disciplina.codigo}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>

            <button
                onClick={handleDeleteSemestre}
                className={`${styles.deleteButton} ${styles.deleteButtonStyle}`}
            >
                Excluir Semestre
            </button>
            <button
                onClick={() => router.push("/curso")}
                className={`${styles.backButton} ${styles.backButtonStyle}`}
            >
                Voltar
            </button>

            {/* Calendário simples com react-calendar */}
            <div className={styles.calendarContainer}>
                    <Calendar
                        onChange={handleDateSelect}
                        value={date}
                    />
                    {/* Exemplo para exibir eventos cadastrados */}
                    <div className={styles.eventList}>
                        <h3>Eventos cadastrados:</h3>
                        <ul>
                            {events.map((evento, index) => (
                                <li key={index}>
                                    {evento.date}: {evento.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
        </div>
    );
}
