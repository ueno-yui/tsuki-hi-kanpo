import Papa from "papaparse";
import questionsData from "./questions.json";

// 質問データの型定義
interface Question {
  sho: string;
  weight: number;
}

interface QuestionMap {
  [id: string]: Question;
}

// 漢方薬データの型定義
interface Prescription {
  name: string;
  description: string;
  scores: { [sho: string]: number };
  contraindications: string[];
}

/**
 * 診断エンジンのメインパイプライン
 * @param answers ユーザーの回答（質問IDと回答のペア）
 * @param flags 禁忌フラグ（例: { "妊娠中": true }）
 * @returns スコアと推奨漢方薬のリスト
 */
export async function runEnhancedPipeline(answers: { [key: number]: string }, flags: { [key: string]: boolean }) {
  // 初期スコアの設定
  const baseScores = {
    気虚: 0, 血虚: 0, 瘀血: 0, 陰虚: 0, 痰湿: 0, 気滞: 0, 寒証: 0, 熱証: 0
  };

  // 質問に基づく動的スコアリング
  const questions: QuestionMap = questionsData;
  Object.keys(answers).forEach(id => {
    if (answers[id] === "はい" && questions[id]) {
      baseScores[questions[id].sho] += questions[id].weight;
    }
  });

  // 複合証のロジック（例: 気虚と血虚が両方高い場合にボーナス点）
  if (baseScores["気虚"] >= 7 && baseScores["血虚"] >= 7) {
    baseScores["気虚"] += 5;
    baseScores["血虚"] += 5;
  }

  // 漢方薬リストをCSVから非同期に読み込む
  const prescriptions: Prescription[] = await new Promise((resolve) => {
    Papa.parse("/prescriptions.csv", {
      download: true,
      header: true,
      complete: (result) => {
        // 禁忌列を配列に変換
        const data = result.data.map((row: any) => ({
          ...row,
          contraindications: row.禁忌 ? row.禁忌.split(",") : []
        }));
        resolve(data as Prescription[]);
      }
    });
  });

  // 漢方薬のマッチングとスコア計算
  const recommendations = prescriptions.map(p => {
    let totalScore = 0;
    // 各証ごとのスコアを加算
    Object.entries(p.scores).forEach(([sho, weight]) => {
      totalScore += (baseScores[sho] || 0) * (typeof weight === 'string' ? parseFloat(weight) : weight);
    });

    // 禁忌フラグに基づく減点
    p.contraindications.forEach(flag => {
      if (flags[flag]) totalScore -= 50;
    });

    return { name: p.name, description: p.description, totalScore };
  }).sort((a, b) => b.totalScore - a.totalScore); // スコアが高い順にソート

  // 結果を返す
  return {
    finalScores: baseScores,
    recommendations,
    rawScores: baseScores // 必要に応じて調整可能
  };
}