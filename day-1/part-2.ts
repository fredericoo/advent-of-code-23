import invariant from '../lib/utils';
import { input } from './input';
import { flatMap, map, pipe, sort } from 'remeda';

const NUMBER_STRING_TO_VALUE = {
	'1': '1',
	'2': '2',
	'3': '3',
	'4': '4',
	'5': '5',
	'6': '6',
	'7': '7',
	'8': '8',
	'9': '9',
	'0': '0',
	one: '1',
	two: '2',
	three: '3',
	four: '4',
	five: '5',
	six: '6',
	seven: '7',
	eight: '8',
	nine: '9',
	zero: '0',
};

const VALID_NUMBERS = Object.keys(NUMBER_STRING_TO_VALUE);

function assertValidNumber(number: string): asserts number is keyof typeof NUMBER_STRING_TO_VALUE {
	if (!VALID_NUMBERS.includes(number)) {
		throw new Error(`Invalid number: ${number}`);
	}
}

const getEdgeNumbers = (input: string) =>
	pipe(
		VALID_NUMBERS,
		// Find the first and last indexes of each valid combination of numbers in the input string
		flatMap(n => [[input.indexOf(n), n.length, n] as const, [input.lastIndexOf(n), n.length, n] as const]),
		// remove invalid combinations
		a => a.filter(([index]) => index !== -1),
		// sort by index in which they occur
		sort((a, b) => a[0] - b[0]),
		// keep only first and last
		a => [a[0], a[a.length - 1]] as const,
		map(n => {
			invariant(n);
			return n;
		}),
		// convert to actual string segments
		map(n => {
			const number = input.substring(n[0], n[0] + n[1]);
			assertValidNumber(number);
			return number;
		}),
		// convert to number
		map(n => NUMBER_STRING_TO_VALUE[n]),
		a => a.join(''),
		Number,
	);

const sum = (array: number[]) => array.reduce((acc, cur) => acc + cur, 0);

const answer = (input: string[]) => pipe(input, map(getEdgeNumbers), sum);

console.log(answer(input));
