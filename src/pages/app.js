import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../lib/firebaseConfig";

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      if (!user && router.pathname !== "/login") {
        router.push("/login"); // Redireciona para login se não autenticado
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <p>Carregando...</p>;

  return <Component {...pageProps} />;
}
