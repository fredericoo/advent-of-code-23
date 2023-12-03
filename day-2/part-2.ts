import { map, pipe, reduce, sumBy } from 'remeda';
import { logAndPassThrough } from '../lib/utils';
import { input } from './input';

const cubeColours = ['red', 'green', 'blue'] as const;
type CubeColour = (typeof cubeColours)[number];

const replaceAndGetNumber = (replace: string) => (input: string) => pipe(input, s => s.replace(replace, ''), Number);

const handfulStringToObj = (handfulString: string) =>
	pipe(
		handfulString,
		s => s.split(', '),
		map(cubePick => pipe(cubePick, s => s.split(' '))),
		reduce((acc, [count, colour]) => ({ ...acc, [colour]: Number(count) }), { red: 0, green: 0, blue: 0 } as Record<
			CubeColour,
			number
		>),
	);

const gameInputsToHandfuls = (gameInputs: string) => pipe(gameInputs, s => s.split('; '), map(handfulStringToObj));

const stringToGame = (input: string) =>
	pipe(
		input,
		s => s.split(': '),
		([gameString, gameInput]) => [replaceAndGetNumber('Game ')(gameString), gameInputsToHandfuls(gameInput)] as const,
	);

const getMinimumCubesForHandfuls = (handfuls: Record<CubeColour, number>[]) =>
	pipe(
		handfuls,
		reduce(
			(acc, handful) => ({
				red: Math.max(acc.red, handful.red),
				green: Math.max(acc.green, handful.green),
				blue: Math.max(acc.blue, handful.blue),
			}),
			{ red: 0, green: 0, blue: 0 } as Record<CubeColour, number>,
		),
	);

const multiplyHandfuls = (handful: Record<CubeColour, number>) => {
	return (handful.red || 1) * (handful.green || 1) * (handful.blue || 1);
};

const answer = pipe(
	input,
	map(stringToGame),
	map(([_, handfuls]) => getMinimumCubesForHandfuls(handfuls)),
	map(multiplyHandfuls),
	sumBy(item => item),
);

console.log(answer);
