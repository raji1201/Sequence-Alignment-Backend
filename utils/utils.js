var initializeMatrix = (m, n, alignment, gap) => {
	var matrix = new Array(m);

	for (let i = 0; i < m; i++) {
		matrix[i] = new Array(n);
	}
	matrix[0][0] = 0;

	if(alignment === 'global') {
		for (let i = 1; i < m; i++) {
			matrix[i][0] = i * gap;
		}
		
		for (let j = 1; j < n; j++) {
			matrix[0][j] = j * gap;
		}
	}

	else if (alignment === 'local') {
		for (let i = 1; i < m; i++) {
			matrix[i][0] = 0;
		}
			
		for (let j = 1; j < n; j++) {
			matrix[0][j] = 0;
		}
	}

	return matrix;
}
module.exports.initializeMatrix = initializeMatrix;

var initializeDirectionMatrix = (m, n) => {
	var directionMatrix = new Array(m);
	
	for (let i = 0; i < m; i++) {
		directionMatrix[i] = new Array(n);
	}

	return directionMatrix;
}
module.exports.initializeDirectionMatrix = initializeDirectionMatrix;

var getDiagonalScore = (q, d, alphabet, scoringMatrix) => {
	let a = 0, b = 0;
	
	alphabet = alphabet.toLowerCase();	
	for (let i = 0; i < alphabet.length; i++) {
		if (q === alphabet.charAt(i)) a = i;
	}
		
	for (let i = 0; i < alphabet.length; i++) {
		if (d === alphabet.charAt(i)) b = i;
	}

	return scoringMatrix[a][b];
}

module.exports.getDiagonalScore = getDiagonalScore;