import { useState, useEffect } from "react";
import styles from "../styles/studyPlan.module.css";

export default function StudyPlan() {
  const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  const horariosDisponiveis = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00","20:00","21:00","22:00" ];

  const [diaSelecionado, setDiaSelecionado] = useState(diasSemana[0]);
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [atividade, setAtividade] = useState("");

  const [planoEstudo, setPlanoEstudo] = useState(() => {
    const savedPlan = localStorage.getItem("planoEstudo");
    return savedPlan ? JSON.parse(savedPlan) : diasSemana.reduce((acc, dia) => ({ ...acc, [dia]: [] }), {});
  });

  useEffect(() => {
    localStorage.setItem("planoEstudo", JSON.stringify(planoEstudo));
  }, [planoEstudo]);

  const handleAddAtividade = () => {
    if (horarioSelecionado && atividade.trim() !== "") {
      setPlanoEstudo((prev) => ({
        ...prev,
        [diaSelecionado]: [...prev[diaSelecionado], { horario: horarioSelecionado, atividade }],
      }));
      setHorarioSelecionado(""); // Reseta a seleção do horário
      setAtividade(""); // Reseta o campo de atividade
    }
  };

  const handleRemoveAtividade = (index) => {
    setPlanoEstudo((prev) => ({
      ...prev,
      [diaSelecionado]: prev[diaSelecionado].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Plano de Estudo</h2>

      <div className={styles.input}>
        {/* Seleção de Dia */}
      <label>Dia: </label>
      <select onChange={(e) => setDiaSelecionado(e.target.value)} value={diaSelecionado}>
        {diasSemana.map((dia) => (
          <option key={dia} value={dia}>
            {dia}
          </option>
        ))}
      </select>
      </div>

      <div className={styles.input}>
      {/* Seleção de Horário */}
      <label>Horário: </label>
      <select onChange={(e) => setHorarioSelecionado(e.target.value)} value={horarioSelecionado}>
        <option value="" disabled>
          Escolha um horário
        </option>
        {horariosDisponiveis.map((horario) => (
          <option key={horario} value={horario}>
            {horario}
          </option>
        ))}
      </select>
      </div>

      <div className={styles.input}>
        {/* Input de Atividade */}
      <input
        type="text"
        placeholder="Digite a atividade"
        value={atividade}
        onChange={(e) => setAtividade(e.target.value)}
      />

      {/* Botão de Adicionar */}
      <button onClick={handleAddAtividade}>Adicionar Atividade</button>
      </div>

      {/* Exibição das Atividades do Dia Selecionado */}
      <h3>Atividades para {diaSelecionado}</h3>

      <div>
      <ul className={styles.view}>
        {planoEstudo[diaSelecionado].map((item, index) => (
          <li key={index}>
            <strong>{item.horario}</strong>: {item.atividade}
            <button 
            onClick={() => handleRemoveAtividade(index)}
            className={styles.buttonDelete}>
              X
            </button>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}
