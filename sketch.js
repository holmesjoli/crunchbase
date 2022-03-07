//crunchbase 2007-2016

let myData;

let companies = new Map();
let investors = new Map();

let topCompanies = [];
let topInvestors = [];

function preload(){
    myData = loadTable("investments.csv", "csv", "header");
}

function setup() {
    let c = createCanvas(windowWidth, windowHeight);
    c.parent("sketch");

    /* fix the null values for amts in dataset */
    for(let row of myData.rows){
        let amt = row.get("amount_usd");
        if( amt == ""){
        row.setNum("amount_usd", 0);
        }
    }

    for(let row of myData.rows){
        let cname = row.getString("company_name");
        let iname = row.getString("investor_name");

        let company;
        let investor;
        let amt = row.getNum("amount_usd");
        let date = row.getString("funded_when");

        if(companies.has(cname)){
            company = companies.get(cname);
        } else{
            company = new Company(cname);
            companies.set(cname, company);
        }

        if(investors.has(iname)){
            investor = investors.get(iname);
        } else{
            investor = new Investor(iname);
            investors.set(iname, investor);
        }

        let investment = new Investment(company, investor, amt, date);
        company.investments.push(investment);
        company.total += amt;
        investor.investments.push(investment);
        investor.total += amt;
    }

    //compute my top companies and investors
    let tC = Array.from(companies.values());
    let tI = Array.from(investors.values());

    tC.sort( (a, b) => b.total - a.total);
    tI.sort( (a, b) => b.total - a.total);

    /*for(let i = 0; i < 100; i++){
        topCompanies.push(tC[i]);
        topInvestors.push(tI[i]);
    }*/

    topCompanies = tC.slice(0, 200);
    topInvestors = tI.slice(0, 200);

    /*
    myData.rows.sort(function (a, b){
        let a_amt = a.getNum("amount_usd");
        let b_amt = b.getNum("amount_usd");
        return b_amt - a_amt;
    });*/

    //short arrow notation
    //myData.rows.sort( (a,b) => b.getNum("amount_usd") - a.getNum("amount_usd"));

    //myData.rows = myData.rows.filter( (a) => a.getNum("amount_usd") >= 100E6);
    
    rectMode(CENTER);
    // noLoop();
}

function draw() {

    background(200);
    textSize(10);
    hover();

    for(let c of topCompanies){
        c.draw();
    }

    for(let i of topInvestors){
        rect(i.x, i.y, i.radius()*2, i.radius()*2, i.radius()/5);
    }

    //draw lines connecting companies to investors
    for(let c of topCompanies){
        for(let inv of c.investments){
        let ii = investors.get(inv.investor.name);
        stroke(0, 10);
        //line(c.x, c.y, ii.x, ii.y);
        }
    }
}


function hover() {
    for (let c of topCompanies) {
        let d = dist(c.x, c.y, mouseX, mouseY);
        c.hover = d < c.radius();
    }

    for (let i of topInvestors) {
        let d = dist(i.x, i.y, mouseX, mouseY);
        i.hover = d < i.radius();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

class Company {
    name
    investments
    total = 0
    x
    y
    hover = false
    constructor(name) {
        this.name = name;
        this.investments = [];
        this.x = random(0, width/2);
        this.y = random(0, height);
    }
    radius() {
        return sqrt(this.total / 1E6) / 4;
    }

    draw(){
        if (this.hover) {
            fill(255, 0, 0);
        } else {
            fill(255, 255, 255);
        }
        ellipse(this.x, this.y, this.radius()*2, this.radius()*2);
    }
}

class Investor {
    name
    investments
    total = 0
    x
    y
    constructor(name){
        this.name = name;
        this.investments = [];
        this.x = random(width/2, width);
        this.y = random(0, height);
    }
    radius(){
        return sqrt(this.total / 1E6) / 4;
    }
}

class Investment {
    company
    investor
    amt
    date

    constructor(company, investor, amt, date){
        this.company = company;
        this.investor = investor;
        this.amt = amt;
        this.date = date;

    }
}
