LoginPage.jsx
export default function LoginPage({ onLogin }) {
  const [nome, setNome] = useState("");

  const entrar = () => {
    if (nome.trim() === "") return alert("Digite seu nome");
    onLogin(nome.trim());
  };

  return (
    <div className="login-container">
      <h2>Bem-vindo ao Consultório</h2>
      <input
        type="text"
        placeholder="Nome do dentista"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <button onClick={entrar}>Entrar</button>
    </div>
  );
}