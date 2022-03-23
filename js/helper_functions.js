// Title xPosition
// Description creates an array which can be used to set x
function xPosition(nCol, nRow, xSpace, xStart) {
    const nArray = [];
    for (var i = 1; i <= nCol; i++) {
        nArray.push(i*xSpace + xStart - xSpace);
    }

    return [].concat.apply([], Array(nRow).fill(nArray));
}

// Title yPosition
// Description creates an array which can be used to set y
function yPosition(nCol, nRow, ySpace, yStart) {
    var foo = [];
        for (var i = 1; i <= nRow; i++) {
            for (var j = 1; j <= nCol; j++) {
            foo.push(i*ySpace + yStart);
        }
    }

    return foo;
}

// Position on a grid
function position(data, nCol, nRow, xSpace = 100, ySpace = 100, xStart = 0, yStart = 0) {

    const xPos = xPosition(nCol, nRow, xSpace, xStart);
    const yPos = yPosition(nCol, nRow, ySpace, yStart);

    data.forEach(function (d, i) {
        d.x = xPos[i];
        d.y = yPos[i];
        d.xSpace = xSpace;
        d.ySpace = ySpace;
    });

    return data;
}

// Title Generate Matrix
// Description Geneates the number of columns and number of rows
// Which depend on the number of countries
function generateMatrix(nObj) {
    let nRow;

    if (nObj >= 14) {
        nRow = 2;
    } else {
        nRow = 1;
    }

    return {
        nCol: Math.ceil(nCntry / nRow),
        nRow: nRow,
    };
}