import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { runEnhancedPipeline } from "../diagnosisEngine";
import questionsData from "../questions.json";

// 質問テキストを定義（元のquestions.jsonから抽出）
const questionTexts: { [id: string]: string } = {
  "1": "最近疲れやすいと感じますか？",
  "2": "食後すぐに眠くなりますか？",
  "3": "運動するとすぐ息切れしますか？",
  "4": "声が小さくかすれることが多いですか？",
  "5": "手足がだるく重い感じがしますか？",
  "6": "風邪をひきやすいと感じますか？",
  "7": "活動後にすぐ疲労を感じますか？",
  "8": "声に力がないと感じますか？",
  "9": "食欲が落ちやすいですか？",
  "10": "倦怠感が続いていますか？",
  "11": "顔色が青白いと感じますか？",
  "12": "爪が割れやすいですか？",
  "13": "髪が細く抜けやすいですか？",
  "14": "肌が乾燥しやすいですか？",
  "15": "月経量が少ないですか？",
  "16": "手足がしびれることがありますか？",
  "17": "唇の色が薄いと感じますか？",
  "18": "ふらつきを感じることが多いですか？",
  "19": "乾燥肌で悩んでいますか？",
  "20": "髪のボリュームが減ったと感じますか？",
  "21": "イライラしやすいですか？",
  "22": "ため息が多くなりましたか？",
  "23": "ストレスを感じやすいですか？",
  "24": "感情の浮き沈みが激しいですか？",
  "25": "胸がつかえる感じがしますか？",
  "26": "お腹が張る感じがありますか？",
  "27": "怒りっぽくなったと感じますか？",
  "28": "夜眠れないことが多いですか？",
  "29": "動悸を感じやすいですか？",
  "30": "目の疲れを感じやすいですか？",
  "31": "冷え性で悩んでいますか？",
  "32": "夜中にトイレに起きることが多いですか？",
  "33": "寒さに弱いと感じますか？",
  "34": "のぼせやすいですか？",
  "35": "顔が赤くなりやすいですか？",
  "36": "寝汗をかきやすいですか？",
  "37": "喉の渇きが強いと感じますか？",
  "38": "体が重だるいと感じますか？",
  "39": "浮腫みやすい体質ですか？",
  "40": "湿度の高い日が苦手ですか？",
  "41": "生理痛が強い方ですか？",
  "42": "月経血に塊が混じることがありますか？",
  "43": "生理不順で悩んでいますか？",
  "44": "PMS症状（イライラ・腹痛など）が強い方ですか？",
  "45": "生理後に疲れを強く感じますか？",
  "46": "肌荒れが生理前後にひどくなりますか？",
  "47": "月経時にめまいやふらつきを感じますか？",
  "48": "月経が長引く傾向にありますか？",
  "49": "月経周期が短くなってきたと感じますか？",
  "50": "更年期の症状（ほてり・汗）を感じますか？"
};

export default function QuestionForm() {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [flags, setFlags] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  const handleAnswer = (id: number, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleFlag = (name: string) => {
    setFlags(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = async () => {
    const result = await runEnhancedPipeline(answers, flags);
    navigate("/result", { state: { result } });
  };

  // 質問をセクションに再構築
  const sections = [
    {
      title: "体調・エネルギー",
      questions: Object.entries(questionsData)
        .filter(([id]) => parseInt(id) <= 10)
        .map(([id, q]) => ({ id: parseInt(id), text: questionTexts[id], ...q })),
    },
    {
      title: "血流・美容",
      questions: Object.entries(questionsData)
        .filter(([id]) => parseInt(id) >= 11 && parseInt(id) <= 20)
        .map(([id, q]) => ({ id: parseInt(id), text: questionTexts[id], ...q })),
    },
    {
      title: "メンタル・ストレス",
      questions: Object.entries(questionsData)
        .filter(([id]) => parseInt(id) >= 21 && parseInt(id) <= 30)
        .map(([id, q]) => ({ id: parseInt(id), text: questionTexts[id], ...q })),
    },
    {
      title: "冷え・乾燥・湿熱",
      questions: Object.entries(questionsData)
        .filter(([id]) => parseInt(id) >= 31 && parseInt(id) <= 40)
        .map(([id, q]) => ({ id: parseInt(id), text: questionTexts[id], ...q })),
    },
    {
      title: "婦人科・その他",
      questions: Object.entries(questionsData)
        .filter(([id]) => parseInt(id) >= 41 && parseInt(id) <= 50)
        .map(([id, q]) => ({ id: parseInt(id), text: questionTexts[id], ...q })),
    },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">体質診断 質問フォーム</h1>
      <div className="space-y-6">
        {sections.map(section => (
          <div key={section.title}>
            <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
            {section.questions.map(q => (
              <div key={q.id} className="bg-white p-4 rounded shadow mb-4">
                <p className="font-medium mb-2">{q.text}</p>
                <div className="flex gap-4">
                  <label>
                    <input type="radio" name={`q-${q.id}`} value="はい" onChange={() => handleAnswer(q.id, "はい")} /> はい
                  </label>
                  <label>
                    <input type="radio" name={`q-${q.id}`} value="いいえ" onChange={() => handleAnswer(q.id, "いいえ")} /> いいえ
                  </label>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div className="bg-white p-4 rounded shadow">
          <p className="font-medium mb-2">禁忌チェック</p>
          <div className="flex flex-wrap gap-4">
            <label><input type="checkbox" onChange={() => handleFlag("妊娠中")} /> 妊娠中</label>
            <label><input type="checkbox" onChange={() => handleFlag("高血圧")} /> 高血圧</label>
            <label><input type="checkbox" onChange={() => handleFlag("肝機能障害")} /> 肝機能障害</label>
          </div>
        </div>
        <button onClick={handleSubmit} className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded font-semibold">
          診断スタート
        </button>
      </div>
    </div>
  );
}