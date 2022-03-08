let myData;

// Collection of key-value pairs
let companies = new Map();
let investors = new Map();

let topCompanies = [];
let topInvestors = [];
let topCompaniesName = []
let topInvestorsName = [];

function preload() {
    myData = loadTable("./investments.csv", "csv", "header");
}

function setup() {

    let c = createCanvas(windowWidth, windowHeight);
    c.parent("sketch");

    print(myData.rows); //Can only by printed in setup not preload

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

    print(companies.size);
    print(investors.size);
    print(companies);
    print(investors);

    // Compute top companies and investors
    // Array.from takes a list of data, an object we can iterate on
    let tC = Array.from(companies.values());
    let tI = Array.from(investors.values());

    tC.sort((a, b) => b.total - a.total);
    tI.sort((a, b) => b.total - a.total);

    topCompanies = tC.slice(0, 100);
    topInvestors = tI.slice(0, 100);

    for (let c of topCompanies) {
        topCompaniesName.push(c.name);
    }

    for (let i of topInvestors) {
        topInvestorsName.push(i.name);
    }

    console.log(topCompaniesName);
    console.log(topInvestorsName);
    /*  Verbose sort
    function fSort(a, b) {
        let a_amt = a.getNum("amount_usd");
        let b_amt = b.getNum("amount_usd");

        return b_amt - a_amt;

        // if(a_amt > b_amt) {
        //     return 1
        // } else if (a_amt < b_amt) {
        //     return -1
        // } else {
        //     return 0
        // }
    }
    myData.rows.sort(fSort);
    */

    // myData.rows.sort((a, b) => b.getNum("amount_usd") - a.getNum("amount_usd"));

    // myData.rows = myData.rows.filter((a) => a.getNum("amount_usd") >= 1E8);

    // print(myData.rows.length);
    // console.log("tC:", topCompanies[0].name);
    // console.log("# investments:", topCompanies[0].investments.length);
    // console.log("investments:", topCompanies[0].investments);
    // console.log("top investor:", topCompanies[0].investments[0].investor.name)
    // console.log("investor", topCompanies[0].investments[0].investor);
    
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
                if (n === ii.investor.name) {
                    ii.investor.top = true;
                };
            }
        }
    }
    
    console.log( Array.from(topCompanies.keys()));
    console.log(topInvestors[0].investments[0].company);

    rectMode(CENTER);
    // noLoop();
}

function draw() {

    background(200);
    textSize(10);
    noStroke();
    hover();

    for(let c of topCompanies) {
        for (let ii of c.investments) {
            if (ii.investor.top) {
                c.draw(ii.investor);
            }
        }
    }

    for (let i of topInvestors) {
        for (let ii of i.investments) {
            if (ii.investor.top) {
                i.draw(ii.company);
            }
        }
    }
}

function hover() {
    for (let c of topCompanies) {
        let d = dist(c.x, c.y, mouseX, mouseY);
        c.hover = d < c.radius();
        // for (let ii of c.investments) {
        //     ii.hoverCompany = c.hover;
        // }
    }

    for (let i of topInvestors) {
        let d = dist(i.x, i.y, mouseX, mouseY);
        i.hover = d < i.radius();
        // for (let ii of i.investments) {
        //     ii.hoverInvestor = i.hover;
        // }
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
    hover = false;
    top;

    constructor(name) {
        this.name = name;
        this.investments = [];
        this.x = random(0, width/2);
        this.y = random(0, height);
        this.top = false;
    }

    radius() {
        return sqrt(this.total / 1E6)/4;
    }

    draw(investor) {
        if (this.hover) {
            fill(255, 0, 0);
            stroke(0, 50);
            // strokeWeight(investor.total);
            line(this.x, this.y, investor.x,  investor.y);
        } else {
            fill(255, 255, 255);
        }
        ellipse(this.x, this.y, this.radius()*2, this.radius()*2);
        if (this.hover) {
            fill(0);
            noStroke();
            text(this.name, this.x, this.y);
        }
    }
}

class Investor {
    name;
    investments;
    total = 0;
    x;
    y;
    hover = false;
    top;

    constructor(name) {
        this.name = name;
        this.investments = [];
        this.x = random(width/2, width);
        this.y = random(0, height);
        this.top = false;
    }

    radius() {
        return sqrt(this.total / 1E6)/4;
    }

    draw(company) {
        if (this.hover) {
            fill(255, 0, 0);
            stroke(0, 10);
            line(this.x, this.y,  company.x,  company.y);
        } else {
            fill(255, 255, 255);
        }
        rect(this.x, this.y, this.radius()*2, this.radius()*2, this.radius()/5);
        if (this.hover) {
            fill(0);
            noStroke();
            text(this.name, this.x, this.y);
        }
    }
}

class Investment {
    company;
    investor;
    amt;
    date;
    hoverCompany = false;
    hoverInvestor = false;

    constructor(company, investor, amt, date) {
        this.company = company;
        this.investor = investor;
        this.amt = amt;
        this.date = date;
    }
}

