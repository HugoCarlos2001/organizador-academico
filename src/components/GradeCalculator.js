import { useState } from "react";

export default function CalculadoraNotas() {
  const [mediaAprovacao, setMediaAprovacao] = useState("");
  const [qtdAvaliacoes, setQtdAvaliacoes] = useState("");
  const [notas, setNotas] = useState([]);
  const [etapa, setEtapa] = useState(1); // Controla a etapa do preenchimento

  const handleConfirmarQuantidade = () => {
    setNotas(new Array(parseInt(qtdAvaliacoes)).fill("")); // Cria campos vazios para as avaliações
    setEtapa(2);
  };

  const handleNotaChange = (index, value) => {
    const novasNotas = [...notas];
    novasNotas[index] = value ? parseFloat(value) : "";
    setNotas(novasNotas);
  };

  const calcularTotalNecessario = () => {
    const notasPreenchidas = notas.filter((nota) => nota !== "");
    const somaNotas = notasPreenchidas.reduce((sum, nota) => sum + nota, 0);
    const totalNecessario = (mediaAprovacao * notas.length) - somaNotas;

    return totalNecessario <= 0 ? "Aprovado!" : totalNecessario.toFixed(2);
  };

  return (
    <div>
      <h2>Calculadora de Notas</h2>

      {etapa === 1 && (
        <>
          <label>Média necessária para aprovação:</label>
          <input
            type="number"
            value={mediaAprovacao}
            onChange={(e) => setMediaAprovacao(parseFloat(e.target.value) || "")}
          />

          <label>Quantidade de avaliações:</label>
          <input
            type="number"
            value={qtdAvaliacoes}
            onChange={(e) => setQtdAvaliacoes(parseInt(e.target.value) || "")}
          />

          <button onClick={handleConfirmarQuantidade} disabled={!mediaAprovacao || !qtdAvaliacoes}>
            Continuar
          </button>
        </>
      )}

      {etapa === 2 && (
        <>
          <h3>Insira as notas já obtidas (se houver):</h3>
          {notas.map((nota, index) => (
            <div key={index}>
              <label>Avaliação {index + 1}:</label>
              <input
                type="number"
                value={nota}
                onChange={(e) => handleNotaChange(index, e.target.value)}
                placeholder="Nota"
                min="0"
                max="10"
              />
            </div>
          ))}

          <h3>Total de pontos ainda necessários: {calcularTotalNecessario()}</h3>

          <button onClick={() => setEtapa(1)}>Voltar</button>
        </>
      )}
    </div>
  );
}
