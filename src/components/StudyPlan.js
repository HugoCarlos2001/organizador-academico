import { useState, useEffect } from "react";
import styles from "../styles/studyPlan.module.css";

export default function StudyPlan() {
  const diasSemana = [
    "Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo",
  ];
  const horariosDisponiveis = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00","21:00","22:00",
  ];

  const [diaSelecionado, setDiaSelecionado] = useState(diasSemana[0]);
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [atividade, setAtividade] = useState("");

  // Estado para controlar a edição de uma atividade
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const [planoEstudo, setPlanoEstudo] = useState(() => {
    const savedPlan = localStorage.getItem("planoEstudo");
    return savedPlan
      ? JSON.parse(savedPlan)
      : diasSemana.reduce((acc, dia) => ({ ...acc, [dia]: [] }), {});
  });

  useEffect(() => {
    localStorage.setItem("planoEstudo", JSON.stringify(planoEstudo));
  }, [planoEstudo]);

  const handleAddAtividade = () => {
    if (horarioSelecionado && atividade.trim() !== "") {
      // Adiciona um id único à atividade (utilizando Date.now)
      const novaAtividade = {
        id: Date.now(),
        horario: horarioSelecionado,
        atividade,
      };
      setPlanoEstudo((prev) => ({
        ...prev,
        [diaSelecionado]: [...prev[diaSelecionado], novaAtividade],
      }));
      setHorarioSelecionado(""); // Reseta a seleção do horário
      setAtividade(""); // Reseta o campo de atividade
    }
  };

  const handleRemoveAtividade = (id) => {
    setPlanoEstudo((prev) => ({
      ...prev,
      [diaSelecionado]: prev[diaSelecionado].filter(
        (item) => item.id !== id
      ),
    }));
  };

  const handleEdit = (id, currentAtividade) => {
    setEditingId(id);
    setEditingValue(currentAtividade);
  };

  const handleSaveEdit = (id) => {
    if (editingValue.trim() !== "") {
      setPlanoEstudo((prev) => ({
        ...prev,
        [diaSelecionado]: prev[diaSelecionado].map((item) =>
          item.id === id ? { ...item, atividade: editingValue } : item
        ),
      }));
      setEditingId(null);
      setEditingValue("");
    }
  };

  // Ordena as atividades do dia selecionado com base no horário
  const atividadesDoDia = planoEstudo[diaSelecionado] || [];
  const sortedAtividades = [...atividadesDoDia].sort((a, b) =>
    a.horario.localeCompare(b.horario)
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Plano de Estudo</h2>

      <div className={styles.input}>
        {/* Seleção de Dia */}
        <label>Dia: </label>
        <select
          onChange={(e) => {
            setDiaSelecionado(e.target.value);
            // Opcional: cancelar a edição se trocar de dia
            setEditingId(null);
          }}
          value={diaSelecionado}
        >
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
        <select
          onChange={(e) => setHorarioSelecionado(e.target.value)}
          value={horarioSelecionado}
        >
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
      <h3 className={styles.subtitle}>Atividades para {diaSelecionado}:</h3>
      <div>
        <ul className={styles.view}>
          {sortedAtividades.map((item) => (
            <li key={item.id}>
              <strong>{item.horario}</strong>:{" "}
              {editingId === item.id ? (
                <>
                  <input
                    type="text"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                  />
                  <button
                    onClick={() => handleSaveEdit(item.id)}
                    className={styles.buttonSave}
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className={styles.buttonEdit}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  {item.atividade}
                  <button
                    onClick={() => handleEdit(item.id, item.atividade)}
                    className={styles.buttonEdit}
                  >
                    Editar
                  </button>
                </>
              )}
              <button
                onClick={() => handleRemoveAtividade(item.id)}
                className={styles.buttonDelete}
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
