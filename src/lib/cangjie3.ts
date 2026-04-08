// src/lib/cangjie3.ts
import rawData from './cangjie3.json';

export type Cangjie3Dict = {
    [char: string]: string[];   // Chinese character -> Cangjie code array (eng)
};
export type eng2cjDict = {
    [char: string]: string;   // eng -> Cangjie code
};

const cangjie3: Cangjie3Dict = rawData as Cangjie3Dict;
const eng2cjDict: eng2cjDict = {
    'a': '日',
    'b': '月',
    'c': '金',
    'd': '木',
    'e': '水',
    'f': '火',
    'g': '土',
    'h': '竹',
    'i': '戈',
    'j': '十',
    'k': '大',
    'l': '中',
    'm': '一',
    'n': '弓',
    'o': '人',
    'p': '心',
    'q': '手',
    'r': '口',
    's': '尸',
    't': '廿',
    'u': '山',
    'v': '女',
    'w': '田',
    'x': '難',
    'y': '卜',
    'z': 'Z',
}
export default { cangjie3, eng2cjDict };

export function getCangjie(char: string): string[][][] {
    const temp = cangjie3[char]
    if (!temp) return [[[]]];
    const cjs = temp.map((cj) => {
        return (
            cj.split('')
        )
    });
    const cjsEngZh = cjs.map((cj) => {
        return cj.map((c) => {
            return [c, eng2cjDict[c]]
        })
    })
    return cjsEngZh;
}