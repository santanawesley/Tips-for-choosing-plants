import "./index.scss";
import Arrow from "./images/icons/arrow-dropdown.svg";
import Sol from "./images/illustrations/sun.png";
import Dog from "./images/illustrations/dog.png";
import Wateringcan from "./images/illustrations/wateringcan.png";


const dataOptions = [
	{
		options: [
			"No sunlight",
			"Low sunlight",
			"High sunlight"
		],
		icon: Sol,
		text: "<span class='detach'>1.</span> Set the amount of <span class='detach'>sunlight</span> your plant will get.",
		alt: "Intensity of the sun",
	}, {
		options: [
			"Rarely",
			"Regularly",
			"Daily"
		],
		icon: Dog,
		text: "<span class='detach'>2.</span> How often do you want to <span class='detach'>water</span> your plant?",
		alt: "Watering plant",
	}, {
		options: [
			"No/They don't care",
			"Yes"
		],
		icon: Wateringcan,
		text: "<span class='detach'>3.</span> Do you have pets? Do they <span class='detach'>chew</span> plants?",
		alt: "Pets",
	}
];

// Generate content from selection div options
document.querySelector(".body-options").innerHTML = selectionContent(dataOptions);

function selectionContent(dataOptions) {
	return `${dataOptions.map((type, index) => {
		return `<div>
        <img src="${type.icon}" alt="${type.alt}" class="icon-options">
        <p class="questions">
          ${type.text}
        </p>
        <div class='dropdown'>
          ${dropdownContent(type.options, index)}
        </div>
      </div>`;
	})}`;
}

function dropdownContent(options, index) {
	return `<div class="title pointerCursor" id=${"type-" + index}>
    Select...
    <span class="icon-arrow-dropdown"><img alt="Open/close options" src="${Arrow}" /></span>
  </div>
  <div class='menu pointerCursor hide'>
    ${options.map(type => {
		return (`<div class='option' id='option1'> ${type} </div>`);
	})}'
  </div>`;
}

// Control option selection
function toggleClass(elem, className) {
	if (elem && elem.className.indexOf(className) !== -1) {
		elem.className = elem.className.replace(className, "");
	}
	else {
		elem.className = elem.className.replace(/\s+/g, " ") + " " + className;
	}

	return elem;
}

function toggleMenuDisplay(e) {
	const dropdown = e.currentTarget.parentNode;
	const menu = dropdown.querySelector(".menu");
	const icon = dropdown.querySelector(".icon-arrow-dropdown");

	toggleClass(menu, "hide");
	toggleClass(icon, "rotate-90");
}

function handleOptionSelected(e) {
	const newValue = e.target.textContent + " ";
	const dropdown = e.currentTarget.parentNode.parentNode;

	const titleElem = dropdown.children[0];
	const icon = document.querySelector(".dropdown .title .icon-arrow-dropdown");

	titleElem.textContent = newValue;
	titleElem.appendChild(icon);

	//setTimeout is used so transition is properly shown
	setTimeout(() => toggleClass(icon, "rotate-90", 0));
	toggleClass(e.target.parentNode, "hide");

	checkChoices();
}

//get elements
function toogleMenu(dataOptions) {
	dataOptions.map((type, index) => {
		const dropdownTitle = document.getElementById(`${"type-" + index}`);
		const dropdownOptions = document.querySelectorAll(".dropdown .option");
		//bind listeners to these elements
		dropdownTitle.addEventListener("click", toggleMenuDisplay);
		dropdownOptions.forEach(option => option.addEventListener("click", handleOptionSelected));
	});
}

toogleMenu(dataOptions);

const buttonToTop = document.getElementById("back-to-top");
buttonToTop.addEventListener("click", backToTop);

function backToTop() {
	window.scrollTo({ top: 0, behavior: "smooth" });
}

// API call
function checkChoices() {
	let selected = [];
	dataOptions.map((data, index) => {
		let optionSelected = document.getElementById(`${"type-" + index}`).innerText;
		if (optionSelected !== "Select...") {
			selected.push(optionSelected);
		}
	});
	selected.length === dataOptions.length && callApiPlants(selected);
}

function callApiPlants(selected) {
	const sun = selected[0] === "No sunlight" ? "no" : selected[0] === "Low sunlight" ? "low" : "high";
	const water = selected[1] === "Regularly" ? "regularly" : selected[1] === "Daily" ? "daily" : "rarely";
	const pets = selected[2] === "Yes" ? true : false;

	const url = `https://front-br-challenges.web.app/api/v2/green-thumb/?sun=${sun}&water=${water}&pets=${pets}`;

	fetch(url).then((resp) => resp.json()).then(function (data) {
		changeDivResults(data);
	});
}

function changeDivResults(data) {
	const divNoResults = document.getElementById("body-no-results");
	const divResults = document.getElementById("body-results");
	const changeDiv = divResults.classList.contains("hide");

	if (data.error) {
		console.log("data = ", data.error);
		return;
	} else if (changeDiv){
		divResults.classList.remove("hide");
		divNoResults.classList.add("hide");
		presentPlants(data);

	}
}

function presentPlants(data) {
	const divImagesPlants = document.getElementById("imagesPlants");
	divImagesPlants.innerHTML = "Novas Plantas";
}
