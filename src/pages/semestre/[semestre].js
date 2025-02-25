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
    
        // Carregar eventos
        fetch(`https://organizador-academico-be.onrender.com/eventos/semestre/${semestreId}`, {
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
                    // Mapear os eventos para o formato esperado
                    const formattedEvents = data.map(event => ({
                        id: event.id,
                        title: event.titulo,
                        date: new Date(event.data), // Converte a string ISO para Date
                        formattedDate: new Date(event.data).toLocaleDateString("pt-BR", { timeZone: "UTC" }), // Formata a data no fuso UTC
                    }));
                    setEvents(formattedEvents);
                }
            })
            .catch(() => setError("Erro ao carregar eventos"));
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

    const handleDateSelect = async (selectedDate) => {
        setDate(selectedDate);
    
        const descricao = prompt("Insira a descrição ou nome do evento associado à data:");
        if (!descricao) return;
    
        const novoEvento = {
            title: descricao,
            date: selectedDate,
            formattedDate: selectedDate.toLocaleDateString("pt-BR", { timeZone: "UTC" }), // Formata a data no fuso UTC
        };
    
        try {
            const response = await fetch(
                `https://organizador-academico-be.onrender.com/eventos/semestre/${semestreId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.token,
                    },
                    body: JSON.stringify({
                        titulo: novoEvento.title,
                        data: selectedDate.toISOString(), // Envia a data no formato ISO
                        descricao: "",
                    }),
                }
            );
    
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Erro ao adicionar evento");
            }
    
            // Adiciona o novo evento ao estado
            setEvents((prevEvents) => [...prevEvents, { ...novoEvento, id: data.id }]);
        } catch (error) {
            setError(error.message);
        }
    };

    // Função para editar evento
    const handleEditEvent = async (index) => {
        const novoTitulo = prompt("Edite o título do evento:", events[index].title);
        if (!novoTitulo) return;
    
        try {
            const eventoAtual = events[index]; // Pega o evento atual
            const response = await fetch(
                `https://organizador-academico-be.onrender.com/eventos/${eventoAtual.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.token,
                    },
                    body: JSON.stringify({
                        titulo: novoTitulo, // Novo título
                        descricao: eventoAtual.descricao || "", // Descrição atual ou string vazia
                        data: eventoAtual.date.toISOString(), // Data atual no formato ISO
                    }),
                }
            );
    
            if (!response.ok) throw new Error("Erro ao editar evento");
    
            // Atualiza o estado local com o novo título
            setEvents((prev) => {
                const updated = [...prev];
                updated[index].title = novoTitulo;
                return updated;
            });
        } catch (error) {
            setError(error.message);
        }
    };
    

    // Função para excluir evento
    const handleDeleteEvent = async (index) => {
        if (!confirm("Deseja realmente excluir este evento?")) return;
    
        try {
            const response = await fetch(
                `https://organizador-academico-be.onrender.com/eventos/${events[index].id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.token,
                    },
                }
            );
    
            if (!response.ok) throw new Error("Erro ao excluir evento");
    
            setEvents((prevEvents) => prevEvents.filter((_, i) => i !== index));
        } catch (error) {
            setError(error.message);
        }
    };
    

    // Cria uma cópia ordenada dos eventos pela data
    const sortedEvents = [...events].sort((a, b) => new Date(a.data) - new Date(b.data));

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <div className={styles.headerContainer}>
                    <h1 className={styles.title}>
                        {semestreNome || "Carregando..."}
                    </h1>
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
                </div>

                <div className={styles.inputForms}>
                    <div className={styles.statusForm}>
                        <p className={styles.inputTitle}>Cadastrar disciplinas</p>
                        <input
                            type="text"
                            value={disciplinaNome}
                            onChange={(e) => setDisciplinaNome(e.target.value)}
                            placeholder="Nome da disciplina"
                            className={styles.input}
                        />
                    </div>
                    <button
                        onClick={handleAddDisciplina}
                        className={`${styles.addButton} ${styles.addButtonStyle}`}
                    >
                        +
                    </button>
                </div>
                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.semestreList}>
                    <h2 className={styles.subTitle}>Disciplinas Cadastradas:</h2>
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

            {/* Calendário simples com react-calendar */}
            <div>
            <Calendar
                onChange={handleDateSelect}
                value={date}
                tileContent={({ date }) => {
                    const dateString = date.toISOString().split("T")[0]; // Compara as datas no formato ISO
                    const hasEvent = events.some(event => event.date.toISOString().split("T")[0] === dateString);
                    return hasEvent ? <span>📅</span> : null;
                }}
            />
                {/* Exibindo eventos cadastrados (ordenados por data) com opções de editar e excluir */}
                <div>
                    <h3 className={styles.inputTitle}>Eventos cadastrados:</h3>
                    <ul>
                        {sortedEvents.map((evento, index) => (
                            <li key={index} className={styles.eventListItem}>
                                {evento.formattedDate}: {evento.title}
                                <button
                                    onClick={() => handleEditEvent(index)}
                                    className={styles.editButtonEvent}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDeleteEvent(index)}
                                    className={styles.deleteButtonEvent}
                                >
                                    Excluir
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
