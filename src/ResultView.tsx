import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import html2pdf from "html2pdf.js";

export default function ResultView() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result || null;

  useEffect(() => {
    if (!result) {
      navigate("/");
    }
    window.scrollTo(0, 0);
  }, [result, navigate]);

  if (!result) return <div className="text-center p-8">診断結果がありません。トップページに戻ります…</div>;

  const data = Object.keys(result.finalScores).map(key => ({
    subject: key,
    A: result.finalScores[key],
    fullMark: 20
  }));

  const handleDownloadPdf = () => {
    const element = document.getElementById("report");
    html2pdf().from(element).set({
      margin: 10,
      filename: "diagnosis_result.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    }).toPdf().get("pdf").then((pdf: any) => {
      pdf.setFontSize(8); // 仕様書の8ptに設定
    }).save();
  };

  return (
    <div id="report" className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">診断結果</h1>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">証スコア一覧</h2>
        <ul className="list-disc list-inside">
          {Object.entries(result.finalScores).map(([sho, score]) => (
            <li key={sho}>{sho}: {score}点</li>
          ))}
        </ul>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">レーダーチャート</h2>
        <RadarChart outerRadius={100} width={500} height={300} data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 20]} />
          <Radar name="体質" dataKey="A" stroke="#ef476f" fill="#ef476f" fillOpacity={0.6} />
        </RadarChart>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">推奨漢方薬</h2>
        <ul className="list-disc list-inside">
          {result.recommendations.slice(0, 3).map((rec: any) => (
            <li key={rec.name}>{rec.name}: {rec.description} (スコア: {rec.totalScore})</li>
          ))}
        </ul>
      </div>
      <div className="text-center">
        <button onClick={handleDownloadPdf} className="mt-6 bg-pink-500 hover:bg-pink-600 text-white py-3 px-8 rounded-full">
          PDFで保存する
        </button>
      </div>
    </div>
  );
}