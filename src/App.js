import { useState, useEffect } from "react";
import "./styles.css";

const dentistas = ["Dra. Ana", "Dr. Carlos", "Dra. Júlia"];

export default function App() {
  const [dentistaAtual, setDentistaAtual] = useState(dentistas[0]);
  const [dados, setDados] = useState({});
  const [nome, setNome] = useState("");
  const [filtroData, setFiltroData] = useState("");

  // Inicializar dados por dentista
  useEffect(() => {
    const salvos = localStorage.getItem("dadosDentistas");
    if (salvos) {
      setDados(JSON.parse(salvos));
    } else {
      const inicial = {};
      dentistas.forEach((d) => {
        inicial[d] = { fila: [], atendido: "", historico: [] };
      });
      setDados(inicial);
    }
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem("dadosDentistas", JSON.stringify(dados));
  }, [dados]);

  const adicionarPaciente = (urgente = false) => {
    const nomeLimpo = nome.trim();
    if (!nomeLimpo) return alert("Digite um nome válido.");
    if (dados[dentistaAtual].fila.includes(nomeLimpo))
      return alert("Paciente já está na fila.");

    const novaFila = urgente
      ? [nomeLimpo, ...dados[dentistaAtual].fila]
      : [...dados[dentistaAtual].fila, nomeLimpo];

    atualizarDentista({ fila: novaFila });
    setNome("");
  };

  const atenderPaciente = () => {
    const fila = dados[dentistaAtual].fila;
    if (fila.length === 0) return alert("Fila vazia.");

    const paciente = fila[0];
    const horario = new Date();
    const registro = {
      nome: paciente,
      horario: horario.toLocaleTimeString("pt-BR"),
      data: horario.toLocaleDateString("pt-BR"),
    };

    atualizarDentista({
      atendido: paciente,
      fila: fila.slice(1),
      historico: [...dados[dentistaAtual].historico, registro],
    });
  };

  const limparFila = () => {
    if (window.confirm("Limpar fila de pacientes?")) {
      atualizarDentista({ fila: [] });
    }
  };

  const atualizarDentista = (novosDados) => {
    setDados((prev) => ({
      ...prev,
      [dentistaAtual]: { ...prev[dentistaAtual], ...novosDados },
    }));
  };

  const historicoFiltrado = dados[dentistaAtual]?.historico.filter((h) =>
    filtroData ? h.data === filtroData : true
  );

  const exportarHistorico = () => {
    const texto = historicoFiltrado
      .map((h) => `${h.data} - ${h.horario} - ${h.nome}`)
      .join("\n");
    alert("Histórico formatado para exportação:\n\n" + texto);
  };

  return (
    <div className="container">
      <h1>Consultório Odontológico</h1>

      <div className="abas">
        {dentistas.map((d) => (
          <button
            key={d}
            className={dentistaAtual === d ? "ativo" : ""}
            onClick={() => setDentistaAtual(d)}
          >
            {d}
          </button>
        ))}
      </div>

      <h2>{dentistaAtual}</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          adicionarPaciente(false);
        }}
      >
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do paciente"
        />
        <button type="submit">Adicionar</button>
        <button type="button" onClick={() => adicionarPaciente(true)}>
          Urgência
        </button>
        <button type="button" onClick={atenderPaciente}>
          Atender
        </button>
        <button type="button" onClick={limparFila}>
          Limpar Fila
        </button>
      </form>

      <h3>
        Em Atendimento:{" "}
        <span className="atendimento">{dados[dentistaAtual]?.atendido}</span>
      </h3>

      <div className="painel">
        <div>
          <h4>Fila de Espera</h4>
          <ul className="fila">
            {dados[dentistaAtual]?.fila.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Histórico de Atendimentos</h4>
          <input
            type="date"
            onChange={(e) =>
              setFiltroData(
                new Date(e.target.value).toLocaleDateString("pt-BR")
              )
            }
          />
          <button onClick={exportarHistorico}>Exportar Histórico</button>
          <ul className="historico">
            {historicoFiltrado?.map((h, i) => (
              <li key={i}>
                {h.data} - {h.horario} - {h.nome}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}