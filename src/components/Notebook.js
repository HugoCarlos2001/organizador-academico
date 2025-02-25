// components/NotebookUpload.js
import { useState } from "react";
import styles from "../styles/notebook.module.css";

export default function NotebookUpload() {
  // Estado para o arquivo selecionado, URL do preview, descrição e uploads realizados
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [description, setDescription] = useState("");
  const [uploads, setUploads] = useState([]);

  // Ao selecionar um arquivo, atualiza o estado e, se for uma imagem, gera um preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Verifica se o arquivo é uma imagem para gerar o preview
      if (file.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  // Confirma o upload: adiciona o arquivo com a descrição e reseta os estados
  const handleConfirmUpload = () => {
    if (selectedFile && description.trim() !== "") {
      setUploads((prevUploads) => [
        ...prevUploads,
        { file: selectedFile, description, previewUrl }
      ]);
      setSelectedFile(null);
      setDescription("");
      setPreviewUrl(null);
      // Limpa o input de arquivo
      document.getElementById("fileInput").value = "";
    } else {
      alert("Selecione um arquivo e informe uma descrição.");
    }
  };

  // Remove um upload da lista
  const handleDeleteUpload = (index) => {
    setUploads((prevUploads) =>
      prevUploads.filter((_, i) => i !== index)
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Caderno de Uploads</h2>
      <div>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
        />
      </div>

      {selectedFile && (
        <div style={{ marginTop: "10px", padding: "10px", border: "1px solid #ccc" }}>
          <p>
            <strong>Arquivo selecionado:</strong> {selectedFile.name}
          </p>
          {/* Exibe o preview caso exista */}
          {previewUrl && (

            <div>
              <img
                src={previewUrl}
                alt="Preview"
                style={{ maxWidth: "720px", maxHeight: "960px", alignItems: "center", }}
              />
            </div>
          )}
          <div>
            <input
              type="text"
              placeholder="Descrição do arquivo"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", marginTop: "5px" }}
            />
          </div>
          <button onClick={handleConfirmUpload} style={{ marginTop: "5px" }}>
            Confirmar Upload
          </button>
        </div>
      )}
      <div style={{ marginTop: "20px" }}>
        <h3 className={styles.subtitle}>Arquivos Enviados:</h3>
        {uploads.length === 0 && <p>Nenhum arquivo enviado.</p>}
        {uploads.map((upload, index) => (

          <div key={index} className={styles.sectionFile}>
            <p>
              <strong>{upload.file.name}</strong>
            </p>
            {upload.previewUrl && (
              <img
                src={upload.previewUrl}
                alt="Preview"
                style={{ maxWidth: "1080px", maxHeight: "900px" }}
              />
            )}
            <p>{upload.description}</p>
            <button onClick={() => handleDeleteUpload(index)} className={styles.buttonDelete}>
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
