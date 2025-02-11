import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/register.module.css";

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            setError("Preencha todos os campos!");
            return;
        }

        if (password !== confirmPassword) {
            setError("As senhas não coincidem!");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                "https://organizador-academico-be.onrender.com/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nome: name,
                        email: email,
                        senha: password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erro ao cadastrar");
            }

            router.push("/login");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <p className={styles.title}>Organizador Acadêmico</p>
            <div className={styles.card}>
                <p className={styles.titleCard}>Cadastro</p>

                <p className={styles.inputText}>Nome</p>
                <input
                    type="text"
                    placeholder=""
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                />

                <p className={styles.inputText}>Email</p>
                <input
                    type="email"
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                />

                <p className={styles.inputText}>Senha</p>
                <input
                    type="password"
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                />

                <p className={styles.inputText}>Confirmar Senha</p>
                <input
                    type="password"
                    placeholder=""
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.input}
                />

                {error && <p className={styles.error}>{error}</p>}

                <button
                    onClick={handleRegister}
                    className={styles.button}
                    disabled={loading}
                >
                    {loading ? "Cadastrando..." : "Criar Conta"}
                </button>

                <div className={styles.registerLink}>
                    <button
                        onClick={() => router.push("/login")}
                        className={styles.linkButton}
                    >
                        Já possui uma conta? Faça o seu login!
                    </button>
                </div>
            </div>
        </div>
    );
}
