import { input } from './input';
import { map, pipe } from 'remeda';

const getEdgeNumbers = (input: string) =>
	pipe(
		input,
		i => i.split(''),
		a => [a.find(Number), a.reverse().find(Number)],
		a => a.join(''),
		Number,
	);

const sum = (array: number[]) => array.reduce((acc, cur) => acc + cur, 0);

const answer = (input: string[]) => pipe(input, map(getEdgeNumbers), sum);

console.log(answer(input));
