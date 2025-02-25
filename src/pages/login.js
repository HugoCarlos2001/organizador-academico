import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/login.module.css"; // Usando o mesmo estilo

export default function Login() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Função de login (mesma lógica que você já tinha)
    const handleLogin = async () => {
        setLoading(true);
        setError("");
    
        try {
            // Faz o login
            const loginResponse = await fetch("https://organizador-academico-be.onrender.com/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email, senha: password }),
            });
    
            const loginData = await loginResponse.json();
    
            if (!loginResponse.ok) {
                throw new Error(loginData.message || "Erro ao fazer login");
            }
    
            // Armazenar o token
            localStorage.setItem("token", loginData.token);
    
            // Verifica se o usuário já tem um curso cadastrado
            const cursosResponse = await fetch("https://organizador-academico-be.onrender.com/cursos", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.token,
                },
            });
    
            const cursosData = await cursosResponse.json();
    
            if (!cursosResponse.ok) {
                throw new Error(cursosData.message || "Erro ao verificar cursos");
            }
    
            // Se o usuário não tiver cursos, redireciona para a página de criação de curso
            if (cursosData.length === 0) {
                router.push("/createCurso");
            } else {
                // Caso contrário, redireciona para o dashboard
                router.push("/dashboard");
            }
    
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
                <p className={styles.titleCard}>Login</p>

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

                {error && <p className={styles.error}>{error}</p>}

                <button
                    onClick={handleLogin}
                    className={styles.button}
                    disabled={loading}
                >
                    {loading ? "Acessando..." : "Acessar Conta"}
                </button>

                {/* Link para a tela de Cadastro */}
                <div className={styles.registerLink}>
                    <button
                        onClick={() => router.push("/register")}
                        className={styles.linkButton}
                    >
                        Não possui uma conta? Faça o seu cadastro!
                    </button>
                </div>
            </div>
        </div>
    );
}
