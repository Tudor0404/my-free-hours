export function shuffleWithKey(array: any[], key: string) {
	// Create hash from key
	let hash = Array.from(key).reduce((hash, char) => {
		hash = (hash << 5) - hash + char.charCodeAt(0);
		return hash & hash;
	}, 0);

	// Create seeded random number generator
	const seededRandom = () => {
		let x = Math.sin(hash++) * 10000;
		return x - Math.floor(x);
	};

	// Create a copy to avoid mutating original array
	const shuffled = [...array];

	// Fisher-Yates shuffle with seeded random
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(seededRandom() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}

	return shuffled;
}
