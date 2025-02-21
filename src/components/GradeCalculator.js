// components/GradeCalculator.js
import { useState } from "react";

export default function GradeCalculator() {
    const [notaAtual, setNotaAtual] = useState("");
    const [notaNecessaria, setNotaNecessaria] = useState("");
    const [resultado, setResultado] = useState(null);

    const calcular = () => {
        // Exemplo de lógica: calcula a diferença entre a nota necessária e a nota atual
        const required = parseFloat(notaNecessaria) - parseFloat(notaAtual);
        setResultado(required);
    };

    return (
        <div>
            <h2>Calculadora de Notas</h2>
            <div>
                <label>Nota Atual: </label>
                <input
                    type="number"
                    value={notaAtual}
                    onChange={(e) => setNotaAtual(e.target.value)}
                />
            </div>
            <div>
                <label>Nota Necessária para Aprovação: </label>
                <input
                    type="number"
                    value={notaNecessaria}
                    onChange={(e) => setNotaNecessaria(e.target.value)}
                />
            </div>
            <button onClick={calcular}>Calcular</button>
            {resultado !== null && (
                <p>Você precisa de: {resultado} pontos adicionais.</p>
            )}
        </div>
    );
}
