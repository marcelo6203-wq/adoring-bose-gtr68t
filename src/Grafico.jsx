Grafico.jsx
import { Bar } from "react-chartjs-2";

export default function Grafico({ historico }) {
  const dadosPorData = historico.reduce((acc, h) => {
    acc[h.data] = (acc[h.data] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(dadosPorData),
    datasets: [
      {
        label: "Atendimentos por dia",
        data: Object.values(dadosPorData),
        backgroundColor: "#007bff",
      },
    ],
  };

  return <Bar data={data} />;
}