import { useState } from "react";

export default function CalculadoraNotas() {
  // Estado para armazenar todas as avaliações cadastradas
  const [avaliacoes, setAvaliacoes] = useState([]);

  // Estado para armazenar os dados do formulário de cadastro
  const [cadastro, setCadastro] = useState({
    nome: "",
    media: "",
    qtd: "",
  });

  // Estado para controlar a avaliação selecionada para inserir/editar notas
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState(null);

  // Atualiza os campos do formulário de cadastro
  const handleCadastroChange = (field, value) => {
    setCadastro({ ...cadastro, [field]: value });
  };

  // Cadastra uma nova avaliação e cria um array de notas vazio (preenchido com strings vazias)
  const handleCadastrarAvaliacao = () => {
    const qtdAvaliacoes = parseInt(cadastro.qtd);
    const novaAvaliacao = {
      id: Date.now(), // ou utilize alguma outra forma de gerar um ID único
      nome: cadastro.nome,
      media: parseFloat(cadastro.media),
      qtd: qtdAvaliacoes,
      notas: new Array(qtdAvaliacoes).fill(""),
    };

    setAvaliacoes([...avaliacoes, novaAvaliacao]);
    // Limpa o formulário de cadastro
    setCadastro({ nome: "", media: "", qtd: "" });
  };

  // Atualiza a nota de uma avaliação específica
  const handleNotaChange = (avaliacaoId, index, value) => {
    const atualizadas = avaliacoes.map((av) => {
      if (av.id === avaliacaoId) {
        const novasNotas = [...av.notas];
        novasNotas[index] = value ? parseFloat(value) : "";
        return { ...av, notas: novasNotas };
      }
      return av;
    });
    setAvaliacoes(atualizadas);

    // Atualiza também a avaliação selecionada, se for a que está sendo editada
    if (avaliacaoSelecionada && avaliacaoSelecionada.id === avaliacaoId) {
      const novasNotasSelecionada = [...avaliacaoSelecionada.notas];
      novasNotasSelecionada[index] = value ? parseFloat(value) : "";
      setAvaliacaoSelecionada({ ...avaliacaoSelecionada, notas: novasNotasSelecionada });
    }
  };

  // Calcula os pontos necessários para alcançar a média de uma avaliação
  const calcularTotalNecessario = (avaliacao) => {
    const somaNotas = avaliacao.notas
      .filter((nota) => nota !== "")
      .reduce((sum, nota) => sum + nota, 0);
    const totalNecessario = avaliacao.media * avaliacao.qtd - somaNotas;
    return totalNecessario <= 0 ? "Aprovado!" : totalNecessario.toFixed(2);
  };

  // Tela para inserir/editar as notas de uma avaliação selecionada
  if (avaliacaoSelecionada) {
    return (
      <div>
        <button onClick={() => setAvaliacaoSelecionada(null)}>
          Voltar para Avaliações
        </button>
        <h2>{avaliacaoSelecionada.nome}</h2>
        <p>Média necessária: {avaliacaoSelecionada.media}</p>
        <p>Quantidade de avaliações: {avaliacaoSelecionada.qtd}</p>

        <h3>Insira as notas:</h3>
        {avaliacaoSelecionada.notas.map((nota, index) => (
          <div key={index}>
            <label>Avaliação {index + 1}:</label>
            <input
              type="number"
              value={nota}
              onChange={(e) =>
                handleNotaChange(avaliacaoSelecionada.id, index, e.target.value)
              }
              placeholder="Nota"
              min="0"
              max="10"
            />
          </div>
        ))}

        <h3>
          Total de pontos necessários:{" "}
          {calcularTotalNecessario(avaliacaoSelecionada)}
        </h3>
      </div>
    );
  }

  // Tela principal: cadastro de avaliação e listagem das avaliações já cadastradas
  return (
    <div>
      <h1>Gerenciador de Avaliações</h1>

      <section>
        <h2>Cadastrar Nova Avaliação</h2>
        <label>Nome da Avaliação:</label>
        <input
          type="text"
          value={cadastro.nome}
          onChange={(e) => handleCadastroChange("nome", e.target.value)}
          placeholder="Ex: Matemática"
        />

        <label>Média necessária para aprovação:</label>
        <input
          type="number"
          value={cadastro.media}
          onChange={(e) => handleCadastroChange("media", e.target.value)}
          placeholder="Ex: 7.0"
        />

        <label>Quantidade de avaliações:</label>
        <input
          type="number"
          value={cadastro.qtd}
          onChange={(e) => handleCadastroChange("qtd", e.target.value)}
          placeholder="Ex: 4"
        />

        <button
          onClick={handleCadastrarAvaliacao}
          disabled={!cadastro.nome || !cadastro.media || !cadastro.qtd}
        >
          Cadastrar Avaliação
        </button>
      </section>

      <section>
        <h2>Avaliações Cadastradas</h2>
        {avaliacoes.length === 0 ? (
          <p>Nenhuma avaliação cadastrada.</p>
        ) : (
          <ul>
            {avaliacoes.map((av) => (
              <li key={av.id}>
                <strong>{av.nome}</strong> | Média: {av.media} | Avaliações:{" "}
                {av.qtd}{" "}
                <button onClick={() => setAvaliacaoSelecionada(av)}>
                  Inserir/Editar Notas
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
