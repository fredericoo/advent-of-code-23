import { groupBy, join, map, pipe, reduce, sumBy } from 'remeda';
import { input } from './input';
import invariant, { logAndPassThrough } from '../lib/utils';

type Gear = { x: number; y: number };
type LineNumber = {
	value: string;
	x: number;
	y: number;
};

const populateAdjacentGears = (lines: string[]) => (lineNumber: LineNumber) => {
	return pipe(
		[lines[lineNumber.y - 1], lines[lineNumber.y], lines[lineNumber.y + 1]],
		map(
			line =>
				line?.substring(
					Math.max(lineNumber.x - 1, 0),
					Math.min(lineNumber.x + lineNumber.value.length + 1, line.length),
				),
		),

		lookup =>
			lookup.reduce(
				(acc, line, index, array) => {
					if (!line) return acc;
					const startIndex = line.indexOf('*', acc.cursor);

					if (startIndex === -1) return acc;

					// I hate this bit: if it's the left edge of the board, we cannot add 1 from the index.
					const offset = array[1]?.match(/^\d/) ? 0 : 1;
					const gear = {
						x: acc.cursor + lineNumber.x - offset + startIndex,
						y: lineNumber.y + index - 1,
					};

					acc.lineNumbers.push({ ...lineNumber, gear });

					acc.cursor = startIndex + 1;
					return acc;
				},
				{ lineNumbers: [] as Array<LineNumber & { gear: Gear }>, cursor: 0 },
			),
		o => o.lineNumbers,
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
					x: startIndex,
					y: lineIndex,
				});
				// this makes it so that multiple mentions of the same number still register correctly
				acc.cursor = startIndex + cur.length;
				return acc;
			},
			{ lineNumbers: [] as LineNumber[], cursor: 0 },
		),
		o => o.lineNumbers,
	);

const multiply = (numbers: number[]) => numbers.reduce((acc, cur) => acc * cur);

const answer = (input: string) => {
	const lines = input.split('\n');
	return pipe(
		lines,
		a => a.flatMap(getLineNumbers),
		a => a.flatMap(populateAdjacentGears(lines)),
		groupBy(n => `${n.gear.x}:${n.gear.y}`),
		o => Object.entries(o),
		a => a.filter(([, numbers]) => numbers.length === 2),
		map(([group, numbers]) => [group, numbers.map(n => Number(n.value))] as const),
		logAndPassThrough,
		sumBy(([, numbers]) => multiply(numbers)),
		logAndPassThrough,
	);
};

answer(input);
