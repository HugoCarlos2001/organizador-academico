import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/course.module.css";

export default function Curso() {
    const [semestres, setSemestres] = useState([]);
    const [semestreNome, setSemestreNome] = useState("");
    const [semestreCodigo, setSemestreCodigo] = useState("");
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [error, setError] = useState("");
    const router = useRouter();

    // Carregar o curso único do localStorage ao montar a página
    useEffect(() => {
        if (typeof window !== "undefined") {
            const idCurso = localStorage.getItem("idCurso");
            const nomeCurso = localStorage.getItem("nomeCurso");

            if (idCurso && nomeCurso) {
                setSelectedCurso({ id: idCurso, nome: nomeCurso });
            } else {
                setError("Nenhum curso encontrado.");
            }
        }
    }, []);

    // Carregar semestres automaticamente quando o curso for carregado
    useEffect(() => {
        if (selectedCurso?.id) {
            fetch(`https://organizador-academico-be.onrender.com/semestres/curso/${selectedCurso.id}`, {
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
                        setSemestres(data);
                    }
                })
                .catch(() => setError("Erro ao carregar semestres"));
        }
    }, [selectedCurso]);

    const handleAddSemestre = async () => {
        if (!selectedCurso) {
            setError("Nenhum curso carregado.");
            return;
        }

        if (semestreNome.trim() === "" || semestreCodigo.trim() === "") {
            setError("Preencha todos os campos.");
            return;
        }

        try {
            const response = await fetch(
                `https://organizador-academico-be.onrender.com/semestres/curso/${selectedCurso.id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.token,
                    },
                    body: JSON.stringify({
                        nome: semestreNome,
                        ano: semestreCodigo,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erro ao adicionar semestre");
            }

            setSemestres((prev) => [...prev, data]);
            setSemestreNome("");
            setSemestreCodigo("");
            setError("");
        } catch (error) {
            setError(error.message);
        }
    };

    const handleNavigateToSemestre = (semestre) => {
        // Armazena o ID e o nome do semestre no localStorage
        localStorage.setItem("semestreId", semestre.id);
        localStorage.setItem("semestreNome", semestre.nome);
    
        // Navega para a página do semestre
        router.push(`/semestre/${semestre.id}`);
    };

    const handleLogout = () => {
        // Remove o token do localStorage
        localStorage.removeItem("token");

        // Redireciona para a página de login
        router.push("/login");
    };
    
    return (
        <div className={styles.container}>

                

                    <div className={styles.headerContainer}>
                        <h1 className={styles.title}>{selectedCurso?.nome}</h1>
                        <button onClick={handleLogout} className={`${styles.logoutButton} ${styles.logoutButtonStyle}`}>
                            Sair
                        </button>
                    </div>


                    <div className={styles.inputForms}>

                        <div className={styles.statusForm}>

                            <p className={styles.inputTitle}>Cadastrar semestres</p>
                            <input
                            type="text"
                            value={semestreNome}
                            onChange={(e) => setSemestreNome(e.target.value)}
                            placeholder="Nome do semestre"
                            className={styles.input}
                            />

                            <input
                            type="text"
                            value={semestreCodigo}
                            onChange={(e) => setSemestreCodigo(e.target.value)}
                            placeholder="Código do semestre"
                            className={styles.input}
                            />

                        </div>

                        <button
                            onClick={handleAddSemestre}
                            className={`${styles.addButton} ${styles.addButtonStyle}`}
                        >
                            +
                        </button>
                        {error && <p className={styles.error}>{error}</p>}

                    </div>

                    <div className={styles.semestreList}>
                        <p className={styles.subTitle}>Semestres Cadastrados:</p>
                        <ul>
                            {semestres.length === 0 ? (
                                <li className={styles.semestreListItem}>
                                 Não há semestres cadastrados.
                                </li>
                             ) : (
                            semestres.map((semestre) => (
                                <li
                                    key={semestre.id}
                                    className={styles.semestreListItem}
                                    onClick={() =>
                                    handleNavigateToSemestre(semestre)
                                    }>
                                    {semestre.nome} - {semestre.codigo} (ID:{" "}
                                    {semestre.id})
                                </li>

                            ))
                            )}
                        </ul>
                    </div>
                
        </div>  
    );
}