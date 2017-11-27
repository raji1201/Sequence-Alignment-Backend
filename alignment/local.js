const utils = require('../utils/utils');

const scoringMatrix = [
	[1, -1, -1, -1],
	[-1, 1, -1, -1],
	[-1, -1, 1, -1],
	[-1, -1, -1, 1]
];

var alphabet = 'ACGT';

const alignment = 'local';

var getLocalAlignment = (query, database, gap, userScore) => {

	var localAlignmentResult = {
		score: NaN,
		queryStart: NaN,
		databaseStart: NaN,
		alignedQuery: "",
		alignedDatabase: ""
	}

	//Preprocessing input
	query = query.replace(/\s+/gi, "");
	database = database.replace(/\s+/gi, "");
	gap = parseInt(gap);

	console.log(`${query} ${database}`);
	var m = query.length + 1;
	var n = database.length + 1;
	
	var matrix = utils.initializeMatrix(m, n, alignment, gap);
	var directionMatrix = utils.initializeDirectionMatrix(m, n);
	
	//initialize initial values
	var max = 0;
	var maxI = 0;
	var maxJ = 0;

	//traverse 2D array to fill values
	for (var i = 1; i < m; i++) {
		for (var j = 1; j < n; j++) {

			let l = matrix[i][j - 1] + gap;
			let u = matrix[i - 1][j] + gap;
			let d = matrix [i - 1][j - 1] + utils.getDiagonalScore(query.charAt(i - 1), database.charAt(j - 1), alphabet, scoringMatrix);
			var val = Math.max(l, u, d, 0);
			debugger;
			if (val == l) {
				matrix[i][j] = l;
				directionMatrix[i][j] = 'l';
				if (val > max) {
					max = val;
					maxI = i;
					maxJ = j;
					console.log(`maxI: ${maxI}, maxJ: ${maxJ}`);
				}
				continue;
			}
			
			if (val == u) {
				matrix[i][j] = u;
				directionMatrix[i][j] = 'u';
				if (val > max) {
					max = val;
					maxI = i;
					maxJ = j;
					console.log(`maxI: ${maxI}, maxJ: ${maxJ}`);
				}
				continue;
			}
			
			if (val == d) {
				matrix[i][j] = d;
				directionMatrix[i][j] = 'd';
				if (val > max) {
					max = val;
					maxI = i;
					maxJ = j;
					console.log(`maxI: ${maxI}, maxJ: ${maxJ}`);
				}
				continue;
			}
			
			if (val == 0) {
				matrix[i][j] = 0;
				directionMatrix[i][j] = 'i';
			}
		}
	}

	//Populate queryString and databaseString
	var queryString = "";
	var databaseString = "";
	var queryStart = 0;
	var databaseStart = 0;

	var i = maxI;
	var j = maxJ;

	console.log(i, j);
	console.log(directionMatrix);
	while (i > 0 && j > 0 && directionMatrix[i][j] !== 'i') {
		queryStart = i;
		databaseStart = j;

		switch (directionMatrix[i][j]) {
		case 'l': 
			queryString = '.' + queryString;
			databaseString = database.charAt(j - 1) + databaseString;
			j--;
			break;
		case 'u':
			queryString = query.charAt(i - 1) + queryString;
			databaseString = '.' + databaseString;
			i--;
			break;
		case 'd': 
			queryString = query.charAt(i - 1) + queryString;
			databaseString = database.charAt(j - 1) + databaseString;
			i--;
			j--;
			break;
		default:
		} 
	}
		
	while (i > 0) {
		queryString = query.charAt(i - 1) + queryString;
		databaseString = '.' + databaseString;
		i--;
	}
		
	while (j > 0) {
		queryString = '.' + queryString;
		databaseString = database.charAt(j - 1) + databaseString;
		j--;
	}

	var alignmentScore = matrix[maxI][maxJ];
	absAlignmentScore = Math.abs(alignmentScore);
	absUserScore = Math.abs(userScore);

	if (absAlignmentScore !== absUserScore) {
		userScore = ((absAlignmentScore - (absAlignmentScore - absUserScore)) / absAlignmentScore * 100);
	} else if (absAlignmentScore === absUserScore) {
		userScore = 100;
	}

	localAlignmentResult.type = 'local';
	localAlignmentResult.score = matrix[maxI][maxJ];
	localAlignmentResult.query = query;
	localAlignmentResult.gap = gap;
	localAlignmentResult.database = database;
	localAlignmentResult.queryStart = queryStart;
	localAlignmentResult.databaseStart = databaseStart;
	localAlignmentResult.alignedQuery = queryString;
	localAlignmentResult.alignedDatabase = databaseString;
	localAlignmentResult.matrix = matrix;
	localAlignmentResult.userScore = userScore;

	/*console.log(matrix[maxI][maxJ]);
	console.log('Query start: ' + queryStart + ' Database start: ' + databaseStart);
	console.log('Aligned Query String: ' + queryString + '\n Aligned Database String: ' + databaseString);
*/
	return localAlignmentResult;

}



module.exports.getLocalAlignment = getLocalAlignment;
