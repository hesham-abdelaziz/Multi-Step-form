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

const steps = document.querySelectorAll(".step-order");
const stepCircle = document.querySelector(".step-circle");
const stepsArray = Array.from(steps);
const planToggler = document.querySelector(".toggle");
const planCards = document.querySelectorAll(".card");
const addonCards = document.querySelectorAll(".add-on");
const changePlanBtn = document.querySelector(".change-btn");
const inputs = document.querySelectorAll("input");

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
  stepTwoContainer.classList.remove("completed");
  stepThreeContainer.classList.remove("completed");
  stepThreeContainer.style.top = 150 + "%";
  stepFourContainer.style.top = 150 + "%";
  stepHandler(1);
});

// Event listener

/**
 * Method used to handle active step
 * @param {*} index step index in the array
 */

let prevIndex = -1; // to store previous index

function stepHandler(index) {
  stepsArray.forEach((step, i) => {
    step.classList.remove("active-bottom-to-top", "active-top-to-bottom");

    if (index === i) {
      if (i > prevIndex) {
        step.classList.add("active-bottom-to-top");
      } else if (i < prevIndex) {
        step.classList.add("active-top-to-bottom");
      }
    }
  });

  // store current index as previous
  prevIndex = index;
}

function handleStepBack(previousStep) {
  switch (previousStep) {
    case "one":
      stepOneContainer.classList.remove("completed");
      stepTwoContainer.style.top = 150 + "%";
      stepHandler(0);
      break;
    case "two":
      stepTwoContainer.classList.remove("completed");
      stepThreeContainer.style.top = 150 + "%";
      stepHandler(1);
      break;
    case "three":
      stepThreeContainer.classList.remove("completed");
      stepFourContainer.style.top = 150 + "%";
      stepHandler(2);
      break;

    default:
      break;
  }
}

function handleStepForward(nextStep) {
  switch (nextStep) {
    case "two":
      validateForm();
      break;
    case "three":
      stepTwoContainer.classList.add("completed");
      stepThreeContainer.style.top = 0;
      stepHandler(2);
      break;
    case "four":
      stepThreeContainer.classList.add("completed");
      stepFourContainer.style.top = 0;
      stepHandler(3);
      createDataView();
      break;
    case "confirm":
      stepFourContainer.classList.add("completed");
      confirmContainer.style.top = 0;
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
    stepTwoContainer.style.top = 0;
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
    }
    input.addEventListener("focusout", (ev) => {
      checkInputValue(ev);
    });
  });
}

inputListener(false);
