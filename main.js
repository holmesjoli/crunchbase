let myData;

// Collection of key-value pairs
let companies = new Map();
let investors = new Map();

let topCompanies = [];
let topInvestors = [];
let topCompaniesName = []
let topInvestorsName = [];

let margin = {top: 75, bottom: 10, left: 75, right: 0}
let topN = 100;
let nCol = 10;
let nRow = topN/nCol;
let vizWidth;

const paramsTC = {
    startPos: {x: margin.left, y: margin.top},
    w: vizWidth,
    h: innerHeight,
    n: topN,
    cols: nCol
}

const paramsTI = {
    startPos: {x: margin.left + 75, y: margin.top},
    w: vizWidth,
    h: innerHeight,
    n: topN,
    cols: nCol
}

let defaultFillColor = "#BBDEF0";
let defaultStrokeWeight = 0;
let defaultStroke = "#C7DBE6";
let defaultTextColor = "#000000";
let defaultBackgroundColor = "#D7D7D7";

let id = null;

function preload() {
    myData = loadTable("./data/investments.csv", "csv", "header");
}

function setup() {

    let c = createCanvas(windowWidth*.83, windowHeight*.85);
    let innerWidth = width - margin.left - margin.right;
    let innerHeight = height - margin.top - margin.bottom;

    paramsTC.w = innerWidth/2 - margin.left - margin.right;
    paramsTC.h = innerHeight;
    paramsTI.w = innerWidth/2 - margin.left - margin.right;
    paramsTI.startPos.x = paramsTI.startPos.x + paramsTI.w;
    paramsTI.h = innerHeight;

    c.parent("sketch");

    // print(myData.rows); //Can only by printed in setup not preload

    // fix NA values for amts in dataset
    for(let row of myData.rows) {

        let amt = row.get("amount_usd");
        if (amt === "") {
            row.setNum("amount_usd", 0);
        }
    }

    for(let row of myData.rows) {

        let iname = row.getString("investor_name");
        let cname = row.getString("company_name");

        let company;
        let investor;
        let amt = row.getNum("amount_usd");
        let date = row.getString("funded_when")

        if (companies.has(cname)) {
            company = companies.get(cname);
        } else {
            company = new Company(cname);
            companies.set(cname, company);
        } 

        if (investors.has(iname)) {
            investor = investors.get(iname);
        } else {
            investor = new Investor(iname);
            investors.set(iname, investor);
        }

        let investment = new Investment(company, investor, amt, date);

        company.investments.push(investment);
        company.total +=amt;
        investor.investments.push(investment);
        investor.total +=amt;
    }

    // Compute top companies and investors
    // Array.from takes a list of data, an object we can iterate on
    let tC = Array.from(companies.values());
    let tI = Array.from(investors.values());

    tC.sort((a, b) => b.total - a.total);
    tI.sort((a, b) => b.total - a.total);

    topCompanies = tC.slice(0, topN);
    topInvestors = tI.slice(0, topN);

    topCompanies = grid(paramsTC, topCompanies);
    topInvestors = grid(paramsTI, topInvestors);
    console.log(topCompanies);

    console.log(topCompanies[0]);

    for (let c of topCompanies) {
        topCompaniesName.push(c.name);
    }

    for (let i of topInvestors) {
        topInvestorsName.push(i.name);
    }
    
    for(let c of topCompanies) {
        for (let ii of c.investments) {
            for (let n of topInvestorsName) {
                if (n === ii.investor.name) {
                    ii.investor.top = true;
                };
            }
        }
    }

    for(let i of topInvestors) {
        for (let ii of i.investments) {
            for (let n of topCompaniesName) {
                if (n === ii.company.name) {
                    ii.company.top = true;
                };
            }
        }
    }

    rectMode(CENTER);
    // noLoop();
}

function draw() {

    textFont('Geomanist');
    clear();
    stroke(defaultStroke);
    strokeWeight(defaultStrokeWeight);
    hover();

    fill(defaultTextColor);
    
    textSize(26);
    text("Companies", paramsTC.startPos.x - topCompanies[0].radius, margin.top/2);
    text("Investors", paramsTI.startPos.x - topInvestors[0].radius, margin.top/2);
    for(let c of topCompanies) {
        c.draw();
    }

    for (let i of topInvestors) {
        i.draw();
    }

    for(let c of topCompanies) {
        for (let ii of c.investments) {
            if (ii.investor.top && c.companyHover) {
                ii.hoverType = "company";
                ii.draw(ii.company, ii.investor)
            }
        }
    }

    for (let i of topInvestors) {
        for (let ii of i.investments) {
            if (ii.company.top && i.investorHover) {
                ii.hoverType = "investor";
                ii.draw(ii.company, ii.investor)
            }
        }
    }
}

// Title Hover
// Description updates the parameter 'xHover' in each company/investor to be true
// if the user hovers
function hover() {
    for (let c of topCompanies) {
        let d = dist(c.x, c.y, mouseX, mouseY);
        c.companyHover = d < c.radius;
    }

    for (let i of topInvestors) {
        let d = dist(i.x, i.y, mouseX, mouseY);
        i.investorHover = d < i.radius;
    }
}

// Title Click
// Description updates the parameter 'xClick' in each company/investor to be true
// if the user clicks
function mousePressed() {

    for (let c of topCompanies) {
        let d = dist(c.x, c.y, mouseX, mouseY);
        if (d < c.radius) {
            c.companyClick = !c.companyClick;
            id = c.name;
        }
    }

    for (let i of topInvestors) {
        let d = dist(i.x, i.y, mouseX, mouseY);
        if (d < i.radius) {
            i.investorClick = !i.investorClick;
            id = i.name;
        }
    }
}

function windowResized() {
    resizeCanvas(windowHeight, windowWidth);
}

class Company {
    name;
    investments;
    total = 0;
    x;
    y;
    companyHover = false;
    companyClick = false;
    top;
    fillColor;
    strokeWeight;
    stroke;

    constructor(name) {
        this.name = name;
        this.investments = [];
        this.top = false;
        this.fillColor = defaultFillColor;
        this.strokeWeight = defaultStrokeWeight;
        this.stroke = defaultStroke;
    }

    clicked() {
        if (this.companyClick && this.name === id) {
            this.fillColor = "#F49F0A";
            autoLi(this.investments, "investor", this.fillColor);
        } else {
            this.fillColor = defaultFillColor;
        }
    }

    hovered() {
        if(this.companyHover) {
            this.stroke = "#FFD399";
            this.strokeWeight = 3;
        } else {
            this.stroke = defaultStroke;
            this.strokeWeight = defaultStrokeWeight;
        }
    }

    addText() {
        if (this.companyHover) {
            fill(defaultTextColor);
            textSize(18);
            noStroke();
            text(this.name, this.x, this.y-margin.top/2);
        }
    }

    draw() {

        this.clicked();
        this.hovered();

        fill(this.fillColor);
        stroke(this.stroke);
        strokeWeight(this.strokeWeight);

        rect(this.x, this.y, this.radius, this.radius);

        this.addText();
    }
}

class Investor {
    name;
    investments;
    total = 0;
    x;
    y;
    investorHover = false;
    investorClick = false;
    top;
    fillColor;
    strokeWeight;
    stroke;

    constructor(name) {
        this.name = name;
        this.investments = [];
        this.top = false;
        this.fillColor = defaultFillColor;
        this.strokeWeight = defaultStrokeWeight;
        this.stroke = defaultStroke;
    }

    clicked() {
        if (this.investorClick && this.name === id) {
            this.fillColor = "#EFCA08";
            autoLi(this.investments, "company", this.fillColor);
        } else {
            this.fillColor = defaultFillColor;
        }
    }

    hovered() {
        if(this.investorHover) {
            this.stroke = "#FFD399";
            this.strokeWeight = 3;
        } else {
            this.stroke = defaultStroke;
            this.strokeWeight = defaultStrokeWeight;
        }
    }

    addText() {
        if (this.investorHover) {
            fill(defaultTextColor);
            textSize(18);
            noStroke();
            text(this.name, this.x, this.y-margin.top/1.5);
        }
    }

    draw() {

        this.clicked();
        this.hovered();

        fill(this.fillColor);
        stroke(this.stroke);
        strokeWeight(this.strokeWeight);

        rect(this.x, this.y, this.radius, this.radius);

        this.addText();
    }
}

class Investment {
    company;
    investor;
    amt;
    date;
    hoverType = "none";

    constructor(company, investor, amt, date) {
        this.company = company;
        this.investor = investor;
        this.amt = amt;
        this.date = date;
    }

    strokeSize(company, investor) {
        if (this.hoverType === "company") {
            return this.amt/company.total*100;
        } else if (this.hoverType === "investor") {
            return this.amt/investor.total*100;
        }
    }

    textHover(company, investor) {
        fill("black");
        textSize(10);
        if (this.hoverType === "company") {
            text(investor.name.toUpperCase(), investor.x, investor.y + 30);
        } else if (this.hoverType === "investor") {
            text(company.name.toUpperCase(), company.x, company.y + 30);
        }
        textSize(32);
    }

    draw(company, investor) {
        this.textHover(company, investor);
        stroke("grey");
        strokeWeight(2);
        // strokeWeight(this.strokeSize(company, investor));
        line(company.x, company.y, investor.x,  investor.y);
        noStroke();
    }
}

