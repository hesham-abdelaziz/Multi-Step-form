// Global variables
let validField;
let selectedData = {
  plan: {
    name: "Arcade",
    planDuration: "Monthly",
    price: "9",
  },
  services: [],
};
const container = document.querySelector(".container");
const steps = document.querySelectorAll(".step-order");
const stepCircle = document.querySelector(".step-circle");
const stepsArray = Array.from(steps);
const planToggler = document.querySelector(".toggle");
const planCards = document.querySelectorAll(".card");
const addonCards = document.querySelectorAll(".add-on");
const changePlanBtn = document.querySelector(".change-btn");
const inputs = document.querySelectorAll("input");
const mobileBtns = document.querySelector(".mobile-btns");
const mobileGoBackBtn = document.querySelector(".mobile-btns .prev-button");
const mobileGoNextBtn = document.querySelector(".mobile-btns .next-button");
const isMatched = window.matchMedia("(max-width: 768px)").matches;
// Steps containers
const stepOneContainer = document.querySelector(".step-one-container");
const stepTwoContainer = document.querySelector(".step-two-container");
const stepThreeContainer = document.querySelector(".step-three-container");
const stepFourContainer = document.querySelector(".step-four-container");
const confirmContainer = document.querySelector(".finish-step");

// Event Listeners

planToggler.addEventListener("click", (ev) => {
  planToggler.classList.toggle("toggled");
  document.querySelector(".monthly").classList.toggle("selected");
  document.querySelector(".yearly").classList.toggle("selected");

  const planDuration = document.querySelector(".plan.selected").innerHTML;
  selectedData.plan.planDuration = planDuration;
  handlePlansPrices();
  handleAddonsPrices();
});

addonCards.forEach((card) => {
  card.addEventListener("click", (ev) => {
    const serviceIndex = selectedData.services.findIndex(
      (service) => service.name === ev.currentTarget.dataset.addonName
    );
    if (serviceIndex > -1) {
      card.classList.remove("selected");
      selectedData.services.splice(serviceIndex, 1);
    } else {
      selectedData.services.push({
        name: ev.currentTarget.dataset.addonName,
        price: ev.currentTarget.dataset.addonPrice,
      });
      card.classList.add("selected");
    }
  });
});

planCards.forEach((card) => {
  card.addEventListener("click", (ev) => {
    handleActiveCard(ev);
  });
});

changePlanBtn.addEventListener("click", () => {
  activeIndex = 2;
  stepTwoContainer.classList.add("active");
  stepTwoContainer.classList.remove("completed");
  stepThreeContainer.classList.remove("completed");
  stepFourContainer.classList.remove("active");
  stepHandler(1);
});

// Event listener

/**
 * Method used to handle active step
 * @param {*} index step index in the array
 */

let prevIndex = -1; // to store previous index

function stepHandler(index) {
  console.log(index);
  stepsArray.forEach((step, i) => {
    step.classList.remove("active-bottom-to-top", "active-top-to-bottom");
    step.classList.remove("active-right-to-left", "active-left-to-right");
    if (index === i) {
      if (i > prevIndex) {
        step.classList.add("active-bottom-to-top");
      } else if (i < prevIndex) {
        step.classList.add("active-top-to-bottom");
      }
    }
    if (isMatched) {
      step.classList.replace("active-bottom-to-top", "active-left-to-right");
      step.classList.replace("active-top-to-bottom", "active-right-to-left");
    }
  });

  // store current index as previous
  prevIndex = index;
}

function handleStepBack(previousStep) {
  switch (previousStep) {
    case 1:
      stepOneContainer.classList.remove("completed");
      stepOneContainer.classList.add("active");
      stepTwoContainer.classList.remove("active");
      stepHandler(0);
      break;
    case 2:
      stepTwoContainer.classList.remove("completed");
      stepTwoContainer.classList.add("active");
      stepThreeContainer.classList.remove("active");
      stepHandler(1);
      break;
    case 3:
      stepThreeContainer.classList.remove("completed");
      stepThreeContainer.classList.add("active");
      stepFourContainer.classList.remove("active");
      stepHandler(2);
      break;

    default:
      break;
  }
}

function handleStepForward(nextStep) {
  switch (nextStep) {
    case 2:
      validateForm();
      break;
    case 3:
      stepTwoContainer.classList.add("completed");
      stepTwoContainer.classList.remove("active");
      stepThreeContainer.classList.add("active");

      stepHandler(2);
      break;
    case 4:
      stepThreeContainer.classList.add("completed");
      stepThreeContainer.classList.remove("active");
      stepFourContainer.classList.add("active");

      stepHandler(3);
      createDataView();
      break;
    case "confirm":
      stepFourContainer.classList.add("completed");
      stepFourContainer.classList.remove("active");
      confirmContainer.classList.add("active");
      mobileBtns?.remove();
      break;
    default:
      break;
  }
}
/**
 * Method used to handle step one form validity and go to next step
 */
function validateForm() {
  if (!validField) {
    inputListener(true);
    return;
  } else {
    stepOneContainer.classList.add("completed");
    stepOneContainer.classList.remove("active");
    stepTwoContainer.classList.add("active");
    stepHandler(1);
  }
}

/**
 * Method used to handle removing active class on previous element and add it to the clicked card element
 * @param {*} ev Click event on card element
 */
function handleActiveCard(ev) {
  selectedData.plan.name = ev.currentTarget.dataset.planName;
  selectedData.plan.price = ev.currentTarget.dataset.planPrice;
  ev.currentTarget.parentElement
    .querySelectorAll(".active")
    .forEach((element) => {
      element.classList.remove("active");
    });
  ev.currentTarget.classList.add("active");
}

/**
 * Method used to handle change in prices according to selected plan
 * @param {*} element the DOM element which will be edited
 */
function handlePriceChanges(element) {
  let newPrice = element.innerHTML.replace(/[$/+]|mo|yr|/g, "");
  if (selectedData.plan.planDuration === "Yearly") {
    element.innerHTML = `+$${newPrice * 10} ${
      selectedData.plan.planDuration === "Monthly" ? "/mo" : "/yr"
    }`;
  } else {
    element.innerHTML = `+$${newPrice / 10} ${
      selectedData.plan.planDuration === "Monthly" ? "/mo" : "/yr"
    }`;
  }
}

/**
 * Method used to handle add-ons prices change
 */
function handleAddonsPrices() {
  const addonPriceElements = document.querySelectorAll(".add-on-price");
  addonPriceElements.forEach((addonPrice) => {
    handlePriceChanges(addonPrice);
  });
}

/**
 * Method used to handle plans prices change
 */
function handlePlansPrices() {
  const planPrice = document.querySelectorAll(".price");
  planPrice.forEach((price) => {
    handlePriceChanges(price);
  });
}

/**
 * Method used to create a container that contains all selected data
 */
function createDataView() {
  let totalPrice = 0;
  const planNameSpan = document.querySelector(".plan-name");
  const planPriceSpan = document.querySelector(".plan-price");
  const servicesSpan = document.querySelector(".services");
  const totalDiv = document.querySelector(".total");
  servicesSpan.innerHTML = "";
  planNameSpan.innerHTML = `${selectedData.plan.name} (${selectedData.plan.planDuration})`;

  planPriceSpan.innerHTML = `$${
    selectedData.plan.planDuration === "Monthly"
      ? selectedData.plan.price
      : selectedData.plan.price * 10
  } ${selectedData.plan.planDuration === "Monthly" ? "/mo" : "/yr"}`;

  selectedData.services.forEach((service) => {
    const serviceData = document.createElement("p");
    const servicePrice =
      selectedData.plan.planDuration === "Monthly"
        ? service.price
        : service.price * 10;
    serviceData.classList.add("service-data");
    serviceData.innerHTML = `
      <span class="service-name">${service.name}</span>
      <span class="service-price">+$${servicePrice}/${
      selectedData.plan.planDuration === "Monthly" ? "mo" : "yr"
    }</span>
    `;
    servicesSpan.appendChild(serviceData);
  });

  totalDiv.innerHTML = `
  <span class="font-gray">Total (${
    selectedData.plan.planDuration === "Monthly" ? "per month" : "per year"
  })</span>

  <span class="total-price">+${calculateTotalPrice()}/${
    selectedData.plan.planDuration === "Monthly" ? "mo" : "yr"
  }</span>
  `;
}

// Method used to calculate total price for services and selected plan price

function calculateTotalPrice() {
  const planDuration = selectedData.plan.planDuration;
  const planPrice = Number(
    planDuration === "Monthly"
      ? selectedData.plan.price
      : selectedData.plan.price * 10
  );
  let servicePrice = selectedData.services.reduce((acc, curr) => {
    return (
      acc + Number(planDuration === "Monthly" ? curr.price : curr.price * 10)
    );
  }, 0);
  return servicePrice + planPrice;
}

/**
 * Helper method to show custom error
 * @param {*} input the input that is not valid
 * @param {*} msg the error msg to display
 */
function handleInputErrorMsg(input, msg) {
  const errorSpan = document.createElement("span");
  errorSpan.classList.add("invalid-input-feedback");
  errorSpan.innerText = `${msg}`;
  input?.classList.add("invalid-input");
  if (!input.nextElementSibling)
    input?.insertAdjacentElement("afterend", errorSpan);
}

/**
 * Method to check input value
 * @param {*} ev input event
 */

function checkInputValue(ev) {
  const inputPattern = RegExp(ev.currentTarget.getAttribute("pattern"));
  if (inputPattern.test(ev.currentTarget.value)) {
    validField = true;
    ev.currentTarget.classList?.remove("invalid-input");
    ev.currentTarget.nextElementSibling?.remove();
  } else {
    validField = false;
    ev.currentTarget.classList.add("invalid-input");
    handleInputErrorMsg(
      ev.currentTarget,
      `Invalid format for ${ev.currentTarget.name} field`
    );
  }
}

/**
 * Method to validate form fields
 * @param {*} submitted boolean parameter to simulate form submitting
 */
function inputListener(submitted) {
  inputs.forEach((input) => {
    if (submitted) {
      if (input.value === "")
        handleInputErrorMsg(input, `${input.name} is required`);
      checkInputValue(input);
    }
    input.addEventListener("focusout", (ev) => {
      checkInputValue(ev);
    });
  });
}

window.addEventListener("load", () => {
  document.querySelectorAll(".active-top-to-bottom").forEach((element) => {
    element.classList.replace("active-top-to-bottom", "active-right-to-left");
  });
  isMediaMatched(window.innerWidth >= 768, mobileBtns, container);
  showPrevBtn();
});

window.addEventListener("resize", () => {
  isMediaMatched(window.innerWidth >= 768, mobileBtns, container);
});

/**
 * Method to append or remove element based on media screen
 * @param value parameter to detect is media matched or not
 * @param child the element to remove or append
 * @param container the parent element that contains the element
 */
function isMediaMatched(isMatched, child, container) {
  if (isMatched) {
    child.remove();
  } else {
    container.append(child);
  }
}
function showPrevBtn() {
  if (
    stepsArray[0].classList.contains("active-right-to-left") ||
    stepsArray[0].classList.contains("active-left-to-right")
  ) {
    mobileGoBackBtn.remove();
    mobileBtns.querySelector(".btn-container").style.justifyContent =
      "flex-end";
  } else {
    mobileBtns
      .querySelector(".btn-container")
      .insertAdjacentElement("afterbegin", mobileGoBackBtn);
    mobileBtns.querySelector(".btn-container").style.justifyContent =
      "space-between";
  }
}

let activeIndex = 1;
function handleMobileNavigation(stepBehavior) {
  switch (stepBehavior) {
    case "next":
      if (activeIndex == 4) activeIndex = "confirm";
      else activeIndex++;
      handleStepForward(activeIndex);
      break;
    case "prev":
      if (activeIndex === 0) return;
      else activeIndex--;
      handleStepBack(activeIndex);

      break;
  }
  showPrevBtn();
}

inputListener(false);
