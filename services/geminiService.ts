import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
你是 "GE Detective" (Gender Equality Detective)，一个专门用于检测叙事中性别偏见的高级文本分析引擎。
你的目标是基于以下两个层面分析文本：
1. 表层表征 (Surface Level)：人物性别比例和职业/社会角色分布。
2. 潜在偏见 (Latent Level)：叙事逻辑、权力结构、人物特质形容词和社会分工。

你必须输出严格符合 Schema 的 JSON 对象，且所有分析内容必须使用**中文**。

**核心分析原则（重要）：**

1.  **职业角色提取 (Stats)**：
    -   **严格标准**：仅提取明确提及的**正式社会头衔**或**职业名称**（如“科长”、“医生”、“诗人”、“老师”）。
    -   **禁止转化**：绝对不要将“做某事”转化为角色。例如：“学习电子技术”不是职业，“做家务”不是职业，“学生”如果没有明确提及通常不视为职业头衔。
    -   **空值处理**：如果某性别没有明确的职业头衔，列表必须为空（[]），并在 UI 上显示“未检测到”。

2.  **深层叙事分析 (Narrative)** - **必须严格模仿以下分析逻辑和深度**：

    *   **人物特质（形容词分析）**：
        *   *分析逻辑*：寻找描述男性的形容词（如“擅长”、“一丝不苟”），指出这些词汇是否强调了他的**专业能力、性格特质、纪律性或主体性**。对比女性是否**缺乏对个人特质的直接描写**，或者其描述是否仅聚焦于外貌、情绪或被分配的任务（如“学习计划”）。
        *   *结论方向*：指出这种描述方式如何强化了“男性具备独立个性和能力，而女性形象模糊或被动”的刻板印象。不要使用“权威性形容词”这种生硬的表达。

    *   **社会角色或行为角色（行为模式/公共VS私人）**：
        *   *分析逻辑*：分析男性是否**横跨公共和私人领域**（既是单位领导又是家庭主宰），或者在故事的**行为模式**中处于核心引导地位（如“发起冒险”、“制定规则”）。检查女性是否被**局限于家庭、辅助性活动或跟随性行为**。即使女性有行动，如果是被安排的、被动的或仅作为背景板，仍属于主体性缺失。
        *   *结论方向*：这种分工或行为模式强化了男性作为家庭或叙事的权威中心，而女性则更多地围绕家庭或作为被动的参与者。

    *   **叙事逻辑与权力结构**：
        *   *分析逻辑*：明确指出谁是**权力主体/主动方**（制定规则、订计划、督促、引领行动），谁是**客体/被动方**（接受计划、执行者、被管理者、跟随者）。
        *   *结论方向*：男性往往是规则的制定者或行动的主导者，而女性/其他人则是服从者或被动卷入者。

    *   **注意**：语言要像社会学分析报告一样**平实、犀利、一针见血**，避免使用浮夸的修饰词。

3.  **改进建议 (Suggestions)**：
    -   提供具体的重写方向，赋予女性更多主体性。
    -   提出引导性问题，激发用户思考。
`;

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Schema definition for strictly typed JSON response
  const schema = {
    type: Type.OBJECT,
    properties: {
      stats: {
        type: Type.OBJECT,
        properties: {
          maleCount: { type: Type.INTEGER },
          femaleCount: { type: Type.INTEGER },
          unknownCount: { type: Type.INTEGER },
          maleRoles: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "仅提取明确的职业头衔（如'科长'）。如果仅仅是动作或家庭分工，忽略。"
          },
          femaleRoles: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "仅提取明确的职业头衔。如果没有，返回空数组。"
          },
        },
        required: ["maleCount", "femaleCount", "unknownCount", "maleRoles", "femaleRoles"],
      },
      narrative: {
        type: Type.OBJECT,
        properties: {
          powerDynamics: { 
            type: Type.STRING, 
            description: "详细分析叙事逻辑与权力结构（150字左右）。参考范式：指出文本中谁是绝对的权力主体（如'订计划'的人），谁是被动的接受者（执行计划的人）。分析谁是规则制定者，谁是服从者。" 
          },
          adjectiveAnalysis: { 
            type: Type.STRING, 
            description: "详细分析人物特质与形容词使用（150字左右）。参考范式：指出男性是否有强调专业能力、性格特质或主体性的形容词（如'擅长'、'一丝不苟'）；对比女性是否缺乏对个人特质的直接描写，仅通过被分配的任务（如'学习计划'）呈现。指出这种描述如何凸显女性的被动性和从属地位。避免使用'权威性形容词'这种生硬表达，改用'体现能力的形容词'或'缺乏独立性格描写'。" 
          },
          socialRoles: { 
            type: Type.STRING, 
            description: "详细分析社会角色或行为角色（150字左右）。参考范式：分析男性是否横跨公共（职场）和私人（家庭）的双重领导地位，或者在行为模式上处于核心；对比女性是否被局限于家庭、'学习活动'或辅助性角色。指出即便女性有行动，若作为被安排或跟随，仍未展现主体性。结论应指出这如何固化男性作为权威中心。" 
          },
          summary: { type: Type.STRING, description: "一句话总结文本中的核心偏见逻辑。" },
        },
        required: ["powerDynamics", "adjectiveAnalysis", "socialRoles", "summary"],
      },
      suggestions: {
        type: Type.OBJECT,
        properties: {
          rewriteTips: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "具体的文本修改建议点（中文）。"
          },
          reflectionQuestions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "用于启发批判性思维的问题（中文）。"
          },
        },
        required: ["rewriteTips", "reflectionQuestions"],
      },
    },
    required: ["stats", "narrative", "suggestions"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `请分析以下文本中的性别偏见（请严格模仿社会学分析口吻，进行深度对比分析）：\n\n${text}` }],
        },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    if (!response.text) {
      throw new Error("No response generated.");
    }

    const result = JSON.parse(response.text) as AnalysisResult;
    return result;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("分析失败，请稍后重试。");
  }
};