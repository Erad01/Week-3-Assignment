console.log("Hello World");

const cookieImage = document.getElementById("cookie-image");
let cookieCountDisplay = document.getElementById("cookie-count");
let cookerPerSecondDisplay = document.getElementById("cookie-per-sec");
let shopContainer = document.getElementById("shop-container");

let upgradeData = []

const stats = {
  cookieCount: 0,
  cookiePerSecond: 0,
};

function saveData() {
  const stringifiedStat = JSON.stringify(stats);
  localStorage.setItem("stat", stringifiedStat);
}

function loadData() {
  const retrieveData = localStorage.getItem("stat");
  const saveData = JSON.parse(retrieveData);
  if(saveData){
    stats.cookieCount = saveData.cookieCount;
    stats.cookiePerSecond = saveData.cookiePerSecond;
    cookieCountDisplay.textContent = stats.cookieCount;
    }
  
}

loadData();

cookieImage.addEventListener("click", increaseCookie);

function increaseCookie() {
  stats.cookieCount++;
  cookieCountDisplay.textContent = stats.cookieCount;
  saveData();
}

async function fetchUpgrade() {
  //STEPS:
  // - connect with the API to request the data --> fetch()
  const response = await fetch(
    "https://cookie-upgrade-api.vercel.app/api/upgrades"
  );
  console.log(response);
  // - format the response (JSON) --> parsing
  const data = await response.json();
  console.log(data);
  return data;
}

async function createUpgrades() {
  upgradeData = await fetchUpgrade();
  const upgrades = document.getElementById("shop-container");

  for (let i = 0; i < upgradeData.length; i++) {
    const upgrade = document.createElement("button");
    upgrade.textContent = upgradeData[i].name;

    upgrade.addEventListener("click", decreaseCookie);

    upgrades.appendChild(upgrade);

  
  }
}
createUpgrades()

function decreaseCookie(event){
    let clickedName = event.target.textContent;
    for (let i = 0; i < upgradeData.length; i++) {
        if (clickedName === upgradeData[i].name) {
            const costData = upgradeData[i].cost;
            const cpsData = upgradeData[i].increase;
            if (stats.cookieCount >= costData) {
                stats.cookieCount -= costData;
                stats.cookiePerSecond += cpsData;
                cookieCountDisplay.textContent = stats.cookieCount;
                cookerPerSecondDisplay.textContent = stats.cookerPerSecondDisplay;
                saveData();
            }else{
                alert("Not enough cookies")
            } 
        }
    }
}


//the interval
setInterval(function () {
  stats.cookieCount += stats.cookiePerSecond; //cookieCount = cookieCount + cps
//update the text content in the DOM with the new values
  cookieCountDisplay.textContent = stats.cookieCount;
  cookerPerSecondDisplay.textContent = stats.cookiePerSecond;
  saveData();
//save the new values in local storage
}, 1000);