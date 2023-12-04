import { join, map, pipe, reduce, sumBy } from 'remeda';
import { input } from './input';
import { logAndPassThrough } from '../lib/utils';

type LineNumber = {
	value: string;
	startIndex: number;
	lineIndex: number;
};

const SYMBOL = /[^\d.]/;

const countSymbols = (line?: string) => {
	if (!line) {
		return 0;
	}
	return pipe(
		line,
		s => s.split('').filter(s => SYMBOL.test(s)),
		a => a.length,
	);
};

const getAdjacentSymbolsCount = (lines: string[]) => (lineNumber: LineNumber) => {
	return pipe(
		[lines[lineNumber.lineIndex - 1], lines[lineNumber.lineIndex], lines[lineNumber.lineIndex + 1]],
		map(
			line =>
				line?.substring(
					Math.max(lineNumber.startIndex - 1, 0),
					Math.min(lineNumber.startIndex + lineNumber.value.length + 1, line.length),
				),
		),
		logAndPassThrough,
		join(''),
		countSymbols,
	);
};

const getLineNumbers = (line: string, lineIndex: number) =>
	pipe(
		line,
		s => s.split(/[^\d]+/),
		a => a.filter(Boolean),
		reduce(
			(acc, cur) => {
				const startIndex = line.indexOf(cur, acc.cursor);
				acc.lineNumbers.push({
					value: cur,
					startIndex,
					lineIndex,
				});
				// this makes it so that multiple mentions of the same number still register correctly
				acc.cursor = startIndex + cur.length;
				return acc;
			},
			{ lineNumbers: [] as LineNumber[], cursor: 0 },
		),
		o => o.lineNumbers,
	);

const answer = (input: string) => {
	const lines = input.split('\n');
	return pipe(
		lines,
		a => a.flatMap(getLineNumbers),
		map(line => Number(line.value) * getAdjacentSymbolsCount(lines)(line)),
		sumBy(n => n),
		logAndPassThrough,
	);
};

answer(input);
