import { filter, map, pipe, sumBy } from 'remeda';
import { input } from './input';
import invariant, { logAndPassThrough } from '../lib/utils';

const testInput = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

const getNumbersFromGame = (game: string) =>
	pipe(
		game,
		s => s.split(' '),
		a => a.filter(Boolean),
		map(Number),
	);

const getCardData = (card: string) =>
	pipe(
		card,
		s => {
			const content = s.split(':')[1];
			invariant(content);
			return content;
		},
		s => {
			const [winning, played] = s.split('|');
			invariant(winning && played);
			return [getNumbersFromGame(winning), getNumbersFromGame(played)] as const;
		},
	);

const countCommonElements = ([a, b]: readonly [number[], number[]]) =>
	a.reduce((acc, n) => (b.includes(n) ? acc + 1 : acc), 0);

pipe(
	input,
	s => s.split('\n'),
	map(getCardData),
	map(countCommonElements),
	logAndPassThrough,
	a => a.filter(n => n > 0),
	map(n => 2 ** (n - 1)),
	logAndPassThrough,
	sumBy(n => n),
	logAndPassThrough,
);
