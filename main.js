let myData;

// Collection of key-value pairs
let companies = new Map();
let investors = new Map();

let topCompanies = [];
let topInvestors = [];
let topCompaniesName = []
let topInvestorsName = [];

let margin = {top: 40, bottom: 50, left: 250, right: 10}
let topN = 100;
let nCol = 10;
let nRow = topN/nCol;

let anyCompany = false;
let anyInvestoment = false;

// console.log(xPosition(nCol, nRow, space = 100));
// console.log(yPosition(nCol, nRow, space = 100));

function preload() {
    myData = loadTable("./data/investments.csv", "csv", "header");
}

function setup() {

    let c = createCanvas(windowWidth, windowHeight);
    let innerWidth = width - margin.left - margin.right;
    let innerHeight = height - margin.top - margin.bottom;
    let xSpace = innerWidth/2/nCol;
    let ySpace = innerHeight/nRow;

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

    topCompanies = position(topCompanies, nCol, nRow, xSpace, ySpace, xStart = margin.left, yStart = margin.top);
    topInvestors = position(topInvestors, nCol, nRow, xSpace, ySpace, xStart = innerWidth/2 + margin.left, yStart = margin.top);
    // console.log(topInvestors);

    for (let c of topCompanies) {
        topCompaniesName.push(c.name);
    }

    for (let i of topInvestors) {
        topInvestorsName.push(i.name);
    }
    
    for(let c of topCompanies) {
        for (let ii of c.investments) {
            for (n of topInvestorsName) {
                if (n === ii.investor.name) {
                    ii.investor.top = true;
                };
            }
        }
    }

    for(let i of topInvestors) {
        for (let ii of i.investments) {
            for (n of topCompaniesName) {
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

    let xSpace = innerWidth/2/nCol;
    let xCenter = (width - margin.left - margin.right)/2;

    background(203, 221, 255);
    noStroke();
    // hover();

    fill(0);
    textSize(26);
    text("Companies", margin.left - xSpace/2, margin.top);
    text("Investors", xCenter + margin.left - xSpace/2, margin.top);

    for(let c of topCompanies) {
        c.draw();
        for (let ii of c.investments) {
            if (ii.investor.top && c.companyHover) {
                ii.hoverType = "company";
                ii.draw(ii.company, ii.investor)
            }
        }
    }

    for (let i of topInvestors) {
        i.draw();
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
        c.companyHover = d < c.radius();
    }

    for (let i of topInvestors) {
        let d = dist(i.x, i.y, mouseX, mouseY);
        i.investorHover = d < i.radius();
    }
}

// Title Click
// Description updates the parameter 'xClick' in each company/investor to be true
// if the user clicks
function mousePressed() {
    for (let c of topCompanies) {
        let d = dist(c.x, c.y, mouseX, mouseY);
        c.companyClick = d < c.radius();
    }

    for (let i of topInvestors) {
        let d = dist(i.x, i.y, mouseX, mouseY);
        i.investorClick = d < i.radius();
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

    constructor(name) {
        this.name = name;
        this.investments = [];
        this.top = false;
        this.fillColor = 'rgba(51, 51, 51, .6)';
    }

    radius() {
        return sqrt(this.total / 1E6)/4;
    }

    clicked() {
        if (this.companyClick) {
            this.fillColor = 0;
        }
    }

    draw() {

        fill(this.fillColor);
        this.clicked();
        // if (this.companyHover) {
        //     fill(255, 255, 255);
        // } else {
        //     fill('rgba(51, 51, 51, .6)');
        // }

        ellipse(this.x, this.y, this.radius()*1.5, this.radius()*1.5);

        // if (this.companyHover) {
        //     fill(0);
        //     textSize(20);
        //     text(this.name, this.x - this.xSpace, this.y -margin.top/2);
        //     textSize(32);
        // }
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

    constructor(name) {
        this.name = name;
        this.investments = [];
        this.top = false;
        this.fillColor = 'rgba(51, 51, 51, .6)';
    }

    radius() {
        return sqrt(this.total / 1E6)/4;
    }

    clicked() {
        if(this.investorClick) {
            this.fillColor = 0;
        }
    }

    draw() {

        fill(this.fillColor);
        this.clicked();
        // if (this.investorHover) {
        //     fill(255, 255, 255);
        // } else {
        //     fill('rgba(51, 51, 51, .6)');
        // }

        rect(this.x, this.y, this.radius()*1.5, this.radius()*1.5, this.radius()/5);

        // if (this.investorHover) {
        //     fill(0);
        //     textSize(20);
        //     text(this.name, this.x - this.xSpace, this.y);
        //     textSize(32);
        // }
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
        fill(0);
        textSize(20);
        if (this.hoverType === "company") {
            text(investor.name, investor.x - investor.xSpace, investor.y + 40);
        } else if (this.hoverType === "investor") {
            text(company.name, company.x - company.xSpace, company.y + 40);
        }
        textSize(32);
    }

    draw(company, investor) {
        // this.textHover(company, investor);
        stroke(0, 100);
        // strokeWeight(this.strokeSize(company, investor));
        line(company.x, company.y, investor.x,  investor.y);
        noStroke();
    }
}

