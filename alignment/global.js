const utils = require('../utils/utils');

const scoringMatrix = [
	[1, -1, -1, -1],
	[-1, 1, -1, -1],
	[-1, -1, 1, -1],
	[-1, -1, -1, 1]
];

var alphabet = 'ACGT';
const alignment = 'global';

var getGlobalAlignment = (query, database, gap, userScore) => {
	
	var globalAlignmentResult = {
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

	//initialize matrix and direction matrix
	var m = query.length + 1;
	var n = database.length + 1;
	
	var matrix = utils.initializeMatrix(m, n, alignment, gap);
	var directionMatrix = utils.initializeDirectionMatrix(m, n);
	
	//traverse 2D array to fill values
	for (var i = 1; i < m; i++) {
		for (var j = 1; j < n; j++) {

			let l = matrix[i][j - 1] + gap;
			let u = matrix[i - 1][j] + gap;
			let d = matrix [i - 1][j - 1] + utils.getDiagonalScore(query.charAt(i - 1), database.charAt(j - 1), alphabet, scoringMatrix);

			if (l >= u) {
				if (l >= d) {
					matrix[i][j] = l;
					directionMatrix[i][j] = 'l';
				}
				else {
					matrix[i][j] = d;
					directionMatrix[i][j] = 'd';
				}
			}
			else {
				if (u >= d) {
					matrix[i][j] = u;
					directionMatrix[i][j] = 'u';
				}
				else {
					matrix[i][j] = d;
					directionMatrix[i][j] = 'd';
				}
			}
		}
	}

	//Populate queryString and databaseString
	var queryString = "";
	var databaseString = "";
	
	j = n - 1;
	i = m - 1;

	while (i > 0 && j > 0) {
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

	var alignmentScore = matrix[m-1][n-1];
	absAlignmentScore = Math.abs(alignmentScore);
	absUserScore = Math.abs(userScore);

	if (absAlignmentScore !== absUserScore) {
		userScore = ((absAlignmentScore - (absAlignmentScore - absUserScore)) / absAlignmentScore * 100);
	} else if (absAlignmentScore === absUserScore) {
		userScore = 100;
	}
	console.log(database);
	globalAlignmentResult.type = 'global';
	globalAlignmentResult.gap = gap;
	globalAlignmentResult.score = alignmentScore;
	globalAlignmentResult.query = query;
	globalAlignmentResult.database = database;
	globalAlignmentResult.queryStart = 0;
	globalAlignmentResult.databaseStart = 0;
	globalAlignmentResult.alignedQuery = queryString;
	globalAlignmentResult.alignedDatabase = databaseString;
	globalAlignmentResult.matrix = matrix;
	globalAlignmentResult.userScore = userScore;

	/*console.log(matrix[m-1][n-1]);
	console.log('Aligned Query String: ' + queryString + '\n Aligned Database String: ' + databaseString);
*/
	return globalAlignmentResult;
}

module.exports.getGlobalAlignment = getGlobalAlignment;
