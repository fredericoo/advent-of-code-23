export const logAndPassThrough = <T>(input: T) => {
	console.log(input);
	return input;
};

export default function invariant(condition: any): asserts condition {
	if (condition) {
		return;
	}

	throw new Error();
}

export const mapIter =
	<T, U>(selector: (t: T) => U) =>
	(source: Iterable<T>) => {
		function* items() {
			for (const i of source) {
				yield selector(i);
			}
		}
		return { [Symbol.iterator]: items };
	};
