// src\lib\levels.ts
export interface PLevel {
  id: string;
  title: string;
  description: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string; // Optional category field for future use
}

export interface QLevel {
  id: string;
  title: string;
  description: string;
  timeLimitS: number; // Time limit in seconds for the quiz
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string; // Optional category field for future use
}

export const PracticeLEVELS: PLevel[] = [
  {
    id: "1",
    title: "基礎字根",
    description: "練習最基本的字根，適合初學者。\n(提示: 「Z」和「X」鍵是倉頡的特殊字符鍵，因此不包含在練習文本中。)",
    text: "日月金木水火土竹戈十大中一弓人心手口尸廿山女田卜",
    difficulty: 'easy',
    category: "字根"
  },
  {
    id: "1-1",
    title: "字根組合 - 日系",
    description: "練習含日字根的常見漢字。",
    text: "日 明 昨 晚 早 時 晴 昼",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-2",
    title: "字根組合 - 月系",
    description: "練習含月字根的常見漢字。",
    text: "月 期 有 朋 服 朗 朔 朝",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-3",
    title: "字根組合 - 金系",
    description: "練習含金字根的常見漢字。",
    text: "金 銀 錢 鈴 鉛 鉗 鉤 鍋 鋼",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-4",
    title: "字根組合 - 木系",
    description: "練習含木字根的常見漢字。",
    text: "木 林 森 桌 椅 枝 條 板 植",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-5",
    title: "字根組合 - 水系",
    description: "練習含水字根的常見漢字。",
    text: "水 河 海 洗 流 泳 湖 波 潮",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-6",
    title: "字根組合 - 火系",
    description: "練習含火字根的常見漢字。",
    text: "火 炎 熱 燒 燈 煙 燃 煉 焰",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-7",
    title: "字根組合 - 土系",
    description: "練習含土字根的常見漢字。",
    text: "土 地 堂 城 場 塔 堆 園 培",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-8",
    title: "字根組合 - 竹系",
    description: "練習含竹字根的常見漢字。",
    text: "竹 筷 筆 箱 簡 筍 節 笑 筒",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-9",
    title: "字根組合 - 戈系",
    description: "練習含戈字根的常見漢字。",
    text: "戈 我 或 戰 戎 強 戲 成",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-10",
    title: "字根組合 - 十系",
    description: "練習含十字根的常見漢字。",
    text: "十 千 升 午 半 協 束",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-11",
    title: "字根組合 - 大系",
    description: "練習含大字根的常見漢字。",
    text: "大 天 夫 奇 奧 奶",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-12",
    title: "字根組合 - 中系",
    description: "練習含中字根的常見漢字。",
    text: "中 央 忠 衷 仲 鍾",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-13",
    title: "字根組合 - 一系",
    description: "練習含一字根的常見漢字。",
    text: "一 七 丁 万 上 下 事",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-14",
    title: "字根組合 - 弓系",
    description: "練習含弓字根的常見漢字。",
    text: "弓 張 強 弦 弧 弩",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-15",
    title: "字根組合 - 人系",
    description: "練習含人字根的常見漢字。",
    text: "人 你 他 什 任 似 信 休 企",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-16",
    title: "字根組合 - 心系",
    description: "練習含心字根的常見漢字。",
    text: "心 忙 想 感 恨 慢 情 意 忠",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-17",
    title: "字根組合 - 手系",
    description: "練習含手字根的常見漢字。",
    text: "手 拿 打 推 握 指 按",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-18",
    title: "字根組合 - 口系",
    description: "練習含口字根的常見漢字。",
    text: "口 吃 喝 唱 問 吧 味",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-19",
    title: "字根組合 - 尸系",
    description: "練習含尸字根的常見漢字。",
    text: "尸 尺 尹 尼 尾",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-20",
    title: "字根組合 - 廿系",
    description: "練習含廿字根的常見漢字。",
    text: "廿 卅 甚",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-21",
    title: "字根組合 - 山系",
    description: "練習含山字根的常見漢字。",
    text: "山 岩 峰 島 岸 崎 峽",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-22",
    title: "字根組合 - 女系",
    description: "練習含女字根的常見漢字。",
    text: "女 好 她 妹 姐 婦 姻",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-23",
    title: "字根組合 - 田系",
    description: "練習含田字根的常見漢字。",
    text: "田 男 畫 留 畝 異 當",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "1-24",
    title: "字根組合 - 卜系",
    description: "練習含卜字根的常見漢字。",
    text: "卜 占 卦 卿 卷",
    difficulty: "easy",
    category: "字根組合"
  },
  {
    id: "2-1",
    title: "基礎單詞1 - 人稱代詞",
    description: "練習基礎人稱代詞。",
    text: "我 你 他 她 它 們 我們 你們 他們 她們 它們",
    difficulty: 'medium',
    category: "單詞"
  },
  {
    id: "2-2",
    title: "基礎單詞1 - 疑問代詞",
    description: "練習基礎疑問代詞。",
    text: "什麼 為什麼 怎麼 怎樣 怎麼樣 哪裡 多少 幾 幾時 誰",
    difficulty: 'medium',
    category: "單詞"
  },
  {
    id: "2-3-1",
    title: "基礎單詞2 - 連接詞/助詞 - 1",
    description: "練習基礎連接詞和助詞。",
    text: "的 是 了 在 和 這 那 也 都 就",
    difficulty: 'medium',
    category: "單詞"
  },
  {
    id: "2-3-2",
    title: "基礎單詞2 - 連接詞/助詞 - 2",
    description: "練習基礎連接詞和助詞。",
    text: "因為 所以 而且 但是 如果 雖然 不過 以及",
    difficulty: 'medium',
    category: "單詞"
  },
  {
    id: "3",
    title: "常用詞彙 - 1",
    description: "練習日常生活中的常用詞彙。",
    text: "你好 謝謝 不客氣 對不起 沒關係",
    difficulty: 'medium'
  },
  {
    id: "4",
    title: "常用詞彙 - 2",
    description: "進一步練習常見的中文短語。",
    text: "今天天氣很好我們一起去吃飯吧",
    difficulty: 'medium'
  },
  {
    id: "5",
    title: "進階練習 - 1",
    description: "挑戰稍微複雜一點的句子。",
    text: "學而時習之 不亦說乎 有朋自遠方來",
    difficulty: 'hard'
  },
  {
    id: "6",
    title: "進階練習 - 2",
    description: "包含更多筆畫複雜的漢字練習。",
    text: "欲窮千里目更上一層樓春風吹又生",
    difficulty: 'hard'
  }
];

export const QuizLEVELS: QLevel[] = [
  {
    id: "1",
    title: "測驗 - 基礎字根",
    description: "測驗對基礎字根的掌握程度。",
    text: "日月金木水火土竹戈十大中一弓人心手口尸廿山女田卜",
    difficulty: 'easy',
    category: "字根",
    timeLimitS: 60
  },
  {
    id: "2-1",
    title: "測驗 - 基礎單詞 - 1",
    description: "測驗對基礎單詞的掌握程度。",
    text: "我 你 他 她 它 們 我們 你們 他們 她們 它們",
    difficulty: 'medium',
    category: "單詞",
    timeLimitS: 60

  },
  {
    id: "2-2",
    title: "測驗 - 基礎單詞 - 2",
    description: "測驗對基礎單詞的掌握程度。",
    text: "什麼 為什麼 怎麼 怎樣 怎麼樣 哪裡 多少 幾 幾時 誰",
    difficulty: 'medium',
    category: "單詞",
    timeLimitS: 60
  },
  {
    id: "2-3",
    title: "測驗 - 基礎單詞 - 3",
    description: "測驗對基礎單詞的掌握程度。",
    text: "的 是 了 在 和 這 那 也 都 就",
    difficulty: 'medium',
    category: "單詞",
    timeLimitS: 60
  },
  {
    id: "2-4",
    title: "測驗 - 基礎單詞 - 4",
    description: "測驗對基礎單詞的掌握程度。",
    text: "因為 所以 而且 但是 如果 雖然 不過 以及",
    difficulty: 'medium',
    category: "單詞",
    timeLimitS: 60
  },
  {
    id: "3-1",
    title: "測驗 - 短篇組合 - 1",
    description: "測驗對綜合能力的掌握程度。",
    text: "清晨的空氣裡帶著露水的氣味。 窗外的鳥叫聲斷斷續續，像在試探這個世界是否已經醒來。",
    difficulty: 'hard',
    category: "短篇",
    timeLimitS: 150
  },
  {
    id: "3-2",
    title: "測驗 - 短篇組合 - 2",
    description: "測驗對綜合能力的掌握程度。",
    text: "走進那家舊書店，時間彷彿慢了半拍。 灰塵在陽光中飄浮，每一本書都像一個沉睡的故事。",
    difficulty: 'hard',
    category: "短篇",
    timeLimitS: 150
  },
  {
    id: "3-3",
    title: "測驗 - 短篇組合 - 3",
    description: "測驗對綜合能力的掌握程度。",
    text: "人工智慧正在改變我們的生活。 從語音助理到自動駕駛，這項技術讓許多事情變得更容易。 不過，我們也需要思考它帶來的隱私與道德問題。",
    difficulty: 'hard',
    category: "短篇",
    timeLimitS: 180
  },
  {
    id: "3-4",
    title: "測驗 - 短篇組合 - 4",
    description: "測驗對綜合能力的掌握程度。",
    text: "那是一個秋天的傍晚，落葉鋪滿了整條小巷。 他站在路燈下，手中握著一封已經泛黃的信。 風吹過時，紙張微微顫抖，彷彿還藏著未說出口的話語。",
    difficulty: 'hard',
    category: "短篇",
    timeLimitS: 180
  },
  {
    id: "3-5",
    title: "測驗 - 短篇組合 - 5",
    description: "測驗對綜合能力的掌握程度。",
    text: "雨落在鐵皮屋頂上，聲音忽大忽小。 他坐在窗邊，手裡握著一杯早已涼掉的茶，什麼也不想，只是聽雨。",
    difficulty: 'hard',
    category: "短篇",
    timeLimitS: 150
  },
];
