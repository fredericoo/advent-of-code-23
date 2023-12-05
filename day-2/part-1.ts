import { filter, map, pipe, reduce, sumBy } from 'remeda';
import invariant, { logAndPassThrough } from '../lib/utils';
import { input } from './input';

const cubeColours = ['red', 'green', 'blue'] as const;
type CubeColour = (typeof cubeColours)[number];

const replaceAndGetNumber = (replace: string) => (input: string) => pipe(input, s => s.replace(replace, ''), Number);

const handfulStringToObj = (handfulString: string) =>
	pipe(
		handfulString,
		s => s.split(', '),
		map(cubePick => pipe(cubePick, s => s.split(' '))),
		reduce(
			(acc, [count, colour]) => {
				if (!colour) return acc;
				return { ...acc, [colour]: Number(count) };
			},
			{ red: 0, green: 0, blue: 0 } as Record<CubeColour, number>,
		),
	);

const gameInputsToHandfuls = (gameInputs: string) => pipe(gameInputs, s => s.split('; '), map(handfulStringToObj));

const stringToGame = (input: string) =>
	pipe(
		input,
		s => {
			const [gameString, gameInput] = s.split(': ');
			invariant(gameString);
			invariant(gameInput);
			return [gameString, gameInput] as const;
		},
		([gameString, gameInput]) => [replaceAndGetNumber('Game ')(gameString), gameInputsToHandfuls(gameInput)] as const,
	);

const areHandfulsPossible = (maxCubes: Record<CubeColour, number>) => (handfuls: Record<CubeColour, number>[]) => {
	console.log(handfuls);
	return !handfuls.some(
		handful => handful.blue > maxCubes.blue || handful.green > maxCubes.green || handful.red > maxCubes.red,
	);
};

const getValidGames = (input: string[], maxCubes: Record<CubeColour, number>) => {
	return pipe(
		input,
		map(stringToGame),
		filter(([_, handfuls]) => areHandfulsPossible(maxCubes)(handfuls)),
		sumBy(item => item[0]),
	);
};

console.log(getValidGames(input, { red: 12, green: 13, blue: 14 }));
