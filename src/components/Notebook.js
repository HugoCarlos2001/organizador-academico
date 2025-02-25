import { useState, useEffect } from "react";

export default function NotebookUpload({ cadeiraId }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); // Estado para o preview da imagem
    const [uploads, setUploads] = useState([]);
    const [error, setError] = useState("");
    const [cadernoId, setCadernoId] = useState(null);

    // Garante que um caderno exista e obtém o cadernoId
    useEffect(() => {
        const ensureCadernoExists = async () => {
            try {
                const response = await fetch(
                    `https://organizador-academico-be.onrender.com/cadernos/cadeira/${cadeiraId}/ensure`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: localStorage.token, // Adicione o token de autenticação
                        },
                    }
                );

                const data = await response.json();
                if (response.ok) {
                    setCadernoId(data.id); // Define o cadernoId retornado
                } else {
                    setError("Erro ao garantir caderno.");
                }
            } catch {
                setError("Erro ao garantir caderno.");
            }
        };

        if (cadeiraId) {
            ensureCadernoExists();
        }
    }, [cadeiraId]);

    // Busca os documentos do caderno ao carregar o componente
    useEffect(() => {
        const fetchDocumentos = async () => {
            try {
                const response = await fetch(
                    `https://organizador-academico-be.onrender.com/documentos/caderno/${cadernoId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: localStorage.token, // Adiciona o token de autenticação
                        },
                    }
                );

                const data = await response.json();
                if (response.ok) {
                    setUploads(data);
                } else {
                    setError("Erro ao carregar documentos.");
                }
            } catch {
                setError("Erro ao carregar documentos.");
            }
        };

        if (cadernoId) {
            fetchDocumentos();
        }
    }, [cadernoId]);

    // Gera o preview da imagem quando um arquivo é selecionado
    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(null); // Limpa o preview se nenhum arquivo estiver selecionado
            return;
        }

        // Verifica se o arquivo é uma imagem
        if (selectedFile.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result); // Define o URL do preview
            };
            reader.readAsDataURL(selectedFile); // Converte o arquivo para uma URL de dados
        } else {
            setPreviewUrl(null); // Limpa o preview se o arquivo não for uma imagem
        }
    }, [selectedFile]);

    const handleConfirmUpload = async () => {
        if (!selectedFile) {
            setError("Selecione um arquivo.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile); // Adiciona o arquivo ao FormData
        formData.append("description", ""); // Adiciona a descrição ao FormData

        try {
            const response = await fetch(
                `https://organizador-academico-be.onrender.com/documentos/caderno/${cadernoId}/upload`,
                {
                    method: "POST",
                    headers: {
                        Authorization: localStorage.token,
                    },
                    body: formData, // Envia o FormData
                }
            );

            const data = await response.json();
            if (response.ok) {
                // Adiciona o novo documento à lista de uploads
                setUploads((prevUploads) => [...prevUploads, data]);
                setSelectedFile(null);
                setPreviewUrl(null); // Limpa o preview após o upload
                setError("");
            } else {
                setError(data.error || "Erro ao enviar arquivo.");
            }
        } catch {
            setError("Erro ao enviar arquivo.");
        }
    };

    // Remove um documento da lista
    const handleDeleteUpload = async (documentoId) => {
        try {
            const response = await fetch(
                `https://organizador-academico-be.onrender.com/documentos/${documentoId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: localStorage.token,
                    },
                }
            );

            if (response.ok) {
                // Remove o documento da lista de uploads
                setUploads((prevUploads) =>
                    prevUploads.filter((upload) => upload.id !== documentoId)
                );
            } else {
                setError("Erro ao excluir documento.");
            }
        } catch {
            setError("Erro ao excluir documento.");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Caderno de Uploads</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Formulário de upload */}
            <div>
                <input
                    type="file"
                    id="fileInput"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    accept="image/*, application/pdf" // Aceita apenas imagens e PDFs
                />
            </div>
            {selectedFile && (
                <div style={{ marginTop: "10px", padding: "10px", border: "1px solid #ccc" }}>
                    <p>
                        <strong>Arquivo selecionado:</strong> {selectedFile.name}
                    </p>

                    {/* Preview da imagem */}
                    {previewUrl && (
                        <div>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                style={{ maxWidth: "100%", maxHeight: "200px", marginTop: "10px" }}
                            />
                        </div>
                    )}

                    <button onClick={handleConfirmUpload} style={{ marginTop: "5px" }}>
                        Confirmar Upload
                    </button>
                </div>
            )}

            {/* Lista de documentos enviados */}
            <div style={{ marginTop: "20px" }}>
                <h3>Arquivos Enviados:</h3>
                {uploads.length === 0 ? (
                    <p>Nenhum arquivo enviado.</p>
                ) : (
                    uploads.map((upload) => (
                        <div
                            key={upload.id}
                            style={{
                                border: "1px solid #ccc",
                                margin: "8px 0",
                                padding: "8px",
                            }}
                        >
                            {/* Exibição do arquivo */}
                            {upload.tipo === "png" || upload.tipo === "jpg" || upload.tipo === "jpeg" ? (
                                <div>
                                    <img
                                        src={upload.nome} // Link da imagem
                                        alt="Preview"
                                        style={{ maxWidth: "100%", maxHeight: "200px", marginTop: "10px" }}
                                    />
                                </div>
                            ) : upload.tipo === "pdf" ? (
                                <iframe
                                    src={upload.nome}
                                    width="100%"
                                    height="500px"
                                    style={{ border: "none", marginTop: "10px" }}
                                    title="Visualização do PDF"
                                />
                            ) : null}

                            {/* Data de Upload */}
                            <p>
                                <strong>Data de Upload:</strong>{" "}
                                {new Date(upload.dataupload).toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })}
                            </p>

                            {/* Botão de Exclusão */}
                            <button
                                onClick={() => handleDeleteUpload(upload.id)}
                                style={{ color: "red", marginTop: "10px" }}
                            >
                                Excluir
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}