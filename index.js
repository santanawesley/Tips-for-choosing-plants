import "./index.scss";
import Arrow from "./images/icons/arrow-dropdown.svg";
import OneDrop from "./images/icons/1-drop.svg";
import TwoDrop from "./images/icons/2-drops.svg";
import ThreeDrop from "./images/icons/3-drops.svg";
import NoSun from "./images/icons/no-sun.svg";
import LowSun from "./images/icons/low-sun.svg";
import HighSun from "./images/icons/high-sun.svg";
import Toxic from "./images/icons/toxic.svg";
import Pet from "./images/icons/pet.svg";
import Staff from "./images/icons/staff-favorite.svg";

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
		icon: Wateringcan,
		text: "<span class='detach'>2.</span> How often do you want to <span class='detach'>water</span> your plant?",
		alt: "Watering plant",
	}, {
		options: [
			"No/They don't care",
			"Yes"
		],
		icon: Dog,
		text: "<span class='detach'>3.</span> Do you have pets? Do they <span class='detach'>chew</span> plants?",
		alt: "Pets",
	}
];

// Generate content from selection div options
document.querySelector(".body-options-cards").innerHTML = selectionContent(dataOptions);

function selectionContent(dataOptions) {
	return `${dataOptions.map((type, index) => {
		return (`<div class="option-card">
        <img src="${type.icon}" alt="${type.alt}" class="icon-options ${type.icon.indexOf("wateringcan") !== -1 ? "wateringcan" : ""}">
        <p class="questions">
          ${type.text}
        </p>
        <div class='dropdown'>
          ${dropdownContent(type.options, index)}
        </div>
      </div>`);
	}).join("")}`;
}

function dropdownContent(options, index) {
	return `<div class="title pointerCursor" id=${"type" + index}>
		Select...
		<span class="icon-arrow-dropdown"><img alt="Open/close options" src="${Arrow}" /></span>
		</div>
		<div class='menu pointerCursor hide'>
			${options.map(type => {
		return (`<div class='option' id='option1'> ${type} </div>`);
	}).join("")}
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

	menu && toggleClass(menu, "hide");
	icon && toggleClass(icon, "rotate-90");
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
		const dropdownTitle = document.getElementById(`${"type" + index}`);
		const dropdownOptions = document.querySelectorAll(".dropdown .option");
		//bind listeners to these elements
		dropdownTitle.addEventListener("click", toggleMenuDisplay);
		dropdownOptions.forEach(option => option.addEventListener("click", handleOptionSelected));
	});
}

toogleMenu(dataOptions);

const buttonToTop = document.getElementById("backToTop");
buttonToTop.addEventListener("click", backToTop);

function backToTop() {
	window.scrollTo({ top: 0, behavior: "smooth" });
}

// API call
function checkChoices() {
	let selected = [];
	dataOptions.map((data, index) => {
		let optionSelected = document.getElementById(`${"type" + index}`).innerText;
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
	const divNoResults = document.getElementById("bodyNoResults");
	const divResults = document.getElementById("bodyResults");

	if (data.error){
		console.log("data = ", data.error);
		return;
	} else{
		divResults.classList.remove("hide");
		divNoResults.classList.add("hide");
		presentPlants(data);

	}
}

function presentPlants(data) {
	const divImagesPlants = document.getElementById("imagesPlants");

	data = data.sort(sortByFavorite);
	function sortByFavorite(a, b){
		return b.staff_favorite - a.staff_favorite;
	}

	const suggestedPlants = `<div class="plants">
		${generatePlantsCards(data)}
  </div>`;

	divImagesPlants.innerHTML = suggestedPlants;
}

function generatePlantsCards(data){
	const pet = (toxicity) => {
		return toxicity === true ? Toxic : Pet;
	};

	const sun = (amount) => {
		if(amount === "no") return NoSun;
		if(amount === "low") return LowSun;
		if(amount === "high") return HighSun;
	};

	const water = (amount) => {
		if(amount === "rarely") return OneDrop;
		if(amount === "regularly") return TwoDrop;
		if(amount === "daily") return ThreeDrop;
	};

	return data.map((pick) => {
		return (`<div class="pick ${pick.staff_favorite ? "favorite-card" : ""}">
			<div class="${pick.staff_favorite ? "favorite" : "hide"}">
				<img src="${Staff}" alt="" class="icon staff">
			</div>
			<img src="${pick.url}" alt="Plant ${pick.name}" class="img-plant">
			<div class="data-plant">
				<p class="name-plant">${pick.name}</p>
				<div class="value">
					$${pick.price}
					<span class="icons">
						<img src="${pet(pick.toxicity)}" alt="Icon pet" class="icon">
						<img src="${sun(pick.sun)}" alt="Icon sun" class="icon">
						<img src="${water(pick.water)}" alt="Icon drop" class="icon">
					</span>
				</div>
			</div>
		</div>`);
	}).join("");
}
