// Title Create Grid
function grid(params, top) {

    const colW = params.w / params.cols;
    const rows = Math.round(params.n/params.cols)
    const rowH = params.h / rows;

    for (let i = 0; i < params.n; i++) {

        let col = i % params.cols;
        let row = Math.floor(i / params.cols);

        top[i].radius = (sqrt(top[i].total / 1E6)/5)*1.5;
        top[i].x = params.startPos.x + (colW * col)
        top[i].y = params.startPos.y + (rowH * row)
    }

    return top;
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
function autoLi(value, type, color, selector = "list-detail") {
    let text = "";

    value.sort((a, b) => b.amt - a.amt);
    value = value.slice(0, 20);

    for (let i = 0; i < value.length; i++) {

        let name = value[i][type].name;
        let amt = nFormatter(value[i].amt, 1);
        let top = value[i][type].top;

        if (top) {
            text += `<li><span style="text-transform: uppercase; color:${color}">${name}</span> : ${amt}</li>`;
        } else {
            text += `<li><span style="text-transform: uppercase;">${name}</span> : ${amt}</li>`;
        }
    }

    document.getElementById(selector).innerHTML = text;
}
