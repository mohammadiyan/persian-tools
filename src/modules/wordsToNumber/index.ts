import { addCommas } from "../commas";
import { replaceArray } from "../../helpers";
import { digitsEnToFa, digitsFaToEn } from "../digits";
import removeOrdinalSuffix from "../removeOrdinalSuffix";
import { UNITS, TEN, MAGNITUDE, TYPO_LIST } from "./constants";

// <Reference path='https://fa.wikipedia.org/wiki/الگو:عدد_به_حروف/توضیحات' />
// https://fa.wikipedia.org/wiki/۱۰۰۰۰۰۰۰۰۰_(عدد)

interface IOption {
	digits?: string;
	addCommas?: boolean;
}

class WordsToNumber {
	/**
	 * Convert to numbers
	 * @method convert
	 * @param  words
	 * @param  options
	 * @return Converted words to number. e.g: 350000
	 */
	public convert(words: string, options: IOption = {}): number | string | undefined {
		if (!words) return;

		const digits = options.digits ?? "en";
		const shouldAddCommas = options.addCommas ?? false;
		// @ts-ignore
		let numbersConverted = this.compute(this.tokenize(words));

		// @ts-ignore
		numbersConverted = shouldAddCommas ? (addCommas(numbersConverted) as string) : (numbersConverted as number);
		// @ts-ignore
		numbersConverted = digits === "fa" ? (digitsEnToFa(numbersConverted as number) as string) : numbersConverted;

		return numbersConverted;
	}
	private tokenize(words: string): number[] {
		let replacedWords = replaceArray(words, TYPO_LIST);
		replacedWords = replacedWords.replace(new RegExp("مین$", "ig"), "");
		replacedWords = removeOrdinalSuffix(replacedWords)!;

		const result: number[] = [];
		const slittedWords: string[] = replacedWords.split(" ");
		slittedWords.forEach((word: string) =>
			// @ts-ignore
			word === "و" ? "" : !isNaN(+word) ? result.push(+word) : result.push(word),
		);

		return result;
	}

	private compute(tokens: string[]): number {
		let sum = 0;
		let isNegative = false;

		tokens.forEach((token: string) => {
			// @ts-ignore
			token = digitsFaToEn(token);

			if (token === "منفی") {
				isNegative = true;
			} else if (UNITS[token] != null) {
				sum += UNITS[token];
			} else if (TEN[token] != null) {
				sum += TEN[token];
				// @ts-ignore
			} else if (!isNaN(token)) {
				sum += parseInt(token, 10);
			} else {
				sum *= MAGNITUDE[token];
			}
		});
		return isNegative ? sum * -1 : sum;
	}
}

const WordsToNumberInstance = new WordsToNumber();

export default WordsToNumberInstance;
