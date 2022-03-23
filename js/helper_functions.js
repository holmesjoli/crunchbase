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

// Number formatter
// From https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900
function nFormatter(num, digits) {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: " thousand" },
        { value: 1e6, symbol: " million" },
        { value: 1e9, symbol: " billion" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
        return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

// Autopopulate a group of list elements
function autoLi(value, type, selector = "list-detail") {
    let text = "";

    value.sort((a, b) => b.amt - a.amt);
    value = value.slice(0, 20);

    for (let i = 0; i < value.length; i++) {

        let name = value[i][type].name;
        let amt = nFormatter(value[i].amt, 1);
        let top = value[i][type].top;

        if (top) {
            top = "top";
        } else {
            top = "not-top";
        }
        text += `<li class=${top}-${type}><b>${name}</b> : ${amt}</li>`;
    }

    document.getElementById(selector).innerHTML = text;
}
