//New code begin here
const select = document.getElementById("order_quantity-2");
const professionalPriceText = document.getElementById("professionalPrice");
const brandedPremiumPriceText = document.getElementById("brandedPremium");
const businessPriceText = document.getElementById("businessPrice");
const professionalDescription = document.getElementById("professional-text");
const brandedPremiumDescription = document.getElementById(
  "branded-premium-text"
);

// Get toogles elements ✎
const toogleProfessional = document.getElementById(
  "toogle-change-professional"
);
const toogleBranded = document.getElementById("toogle-change-branded");

// Global variables 📔
let clickCounterProfessional = 0;
let clickCounterBranded = 0;
let countryCode = "US";
let pricingList = [];
let selectedPrice = {
  professional: 29,
  brandedPremium: 79,
  businessAdvanced: 299,
};
let valueSelect;
let professionalCurrentPrice = selectedPrice?.professional;
let brandedCurrentPrice = selectedPrice?.brandedPremium;

// Fecth geo JS
async function getData() {
  const response = await fetch("https://get.geojs.io/v1/ip/geo.json").then(
    (values) => values.json()
  );
  return response?.country_code;
}

// Fetch pricing list
async function FetchPricingList() {
  try {
    const response = await fetch(
      "https://subscription.shipday.com/payment/countries"
    );
    const priceList = await response.json();

    try {
      countryCode = await getData();
    } catch (getDataError) {
      console.error("Error:", getDataError);
      countryCode = null;
    }

    if (countryCode === "US" || countryCode === "CA" || countryCode == null) {
      Array.from(document.getElementsByClassName("toogle-container"))?.forEach(
        (element) => {
          element.style.display = "none";
        }
      );

      professionalPriceText.textContent = "$" + 29;
      professionalDescription.textContent = `300 orders included plus $0.1 per additional order.`;

      brandedPremiumPriceText.textContent = "$" + 79;
      brandedPremiumDescription.textContent = `300 orders included plus $0.2 per additional order.`;
    } else {
      Array.from(document.getElementsByClassName("toogle-container"))?.forEach(
        (element) => {
          element.style.display = "flex";
        }
      );
    }

    const selectedCountry = priceList.find((item) => item.iso === countryCode);

    if (selectedCountry) {
      pricingList = selectedCountry;
    } else {
      pricingList = null;
    }
    return priceList;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

FetchPricingList();

// calculate par or impar number
function isPar(numero) {
  return numero % 2 === 0;
}

//Change Professional Pricing text
function changeProfessionalTexts() {
  // if (!valueSelect || valueSelect === "Deliveries") return;

  if (!isPar(clickCounterProfessional)) {
    const percentage =
      pricingList?.costPerSms + pricingList?.costPerOrder || 0.2;

    //validate valueSelect
    let result = (valueSelect - 450) * percentage + 29;

    if (isNaN(result)) {
      result = 29;
    }

    const updatedProfessionalPrice = result < 29 ? 29 : result;

    //Formated price element 👑
    let formattedPrice = updatedProfessionalPrice.toFixed(1);
    formattedPrice = formattedPrice.endsWith(".0")
      ? formattedPrice.slice(0, -2)
      : formattedPrice;

    // update the price in html
    professionalPriceText.textContent = formattedPrice === "NaN" ?  "$" + 29 : "$" + formattedPrice;
    professionalDescription.textContent = `450 orders included plus $${percentage} per additional order.`;
  } else if (
    countryCode === "US" ||
    countryCode === "CA" ||
    countryCode == null
  ) {
    const percentage = 0.1;
    const result = (valueSelect - 300) * percentage + 29;
    const updatedProfessionalPrice = result < 29 ? 29 : result;

    //Formated price element 👑
    let formattedPrice = updatedProfessionalPrice.toFixed(1);
    formattedPrice = formattedPrice.endsWith(".0")
      ? formattedPrice.slice(0, -2)
      : formattedPrice;

    professionalPriceText.textContent = "$" + formattedPrice;
    professionalDescription.textContent = `300 orders included plus $${percentage} per additional order.`;
  } else {
    const percentage = pricingList?.costPerOrder || 0.1;

    let result = (valueSelect - 750) * percentage + 29;

    if (isNaN(result)) {
      result = 29;
    }

    const updatedProfessionalPrice = result < 29 ? 29 : result;

    //Formated price element 👑
    let formattedPrice = updatedProfessionalPrice.toFixed(1);
    formattedPrice = formattedPrice.endsWith(".0")
      ? formattedPrice.slice(0, -2)
      : formattedPrice;

    professionalPriceText.textContent =
      formattedPrice === "NaN" ? "$" + 29 : "$" + formattedPrice;
    professionalDescription.textContent = `750 orders included plus $${percentage} per additional order.`;
  }
}

//Change Branded Premium Pricing text
function changeBrandedTexts() {
  // if (!valueSelect || valueSelect === "Deliveries") return;

  if (!isPar(clickCounterBranded)) {
    const percentage = 0.2;
    let result = (valueSelect - 300) * percentage + 79;

    if (isNaN(result)) {
      result = 79;
    }

    const updatedProfessionalPrice = result < 79 ? 79 : result;

    //Formated price element 👑
    let formattedPrice =
      updatedProfessionalPrice % 1 === 0
        ? updatedProfessionalPrice.toFixed(0)
        : updatedProfessionalPrice.toFixed(1).replace(/\.0$/, "");

    // update the price in html
    brandedPremiumPriceText.textContent =
      formattedPrice === "NaN" ? "$" + 79 : "$" + formattedPrice;
    brandedPremiumDescription.textContent = `300 orders included plus $${percentage} per additional order.`;
  } else if (
    countryCode === "US" ||
    countryCode === "CA" ||
    countryCode == null
  ) {
    const percentage = 0.2;
    const result = (valueSelect - 300) * percentage + 79;
    const updatedProfessionalPrice = result < 79 ? 79 : result;

    //formatted price
    let formattedPrice =
      updatedProfessionalPrice % 1 === 0
        ? updatedProfessionalPrice.toFixed(0)
        : updatedProfessionalPrice.toFixed(1).replace(/\.0$/, "");

    brandedPremiumPriceText.textContent = "$" + formattedPrice;
    brandedPremiumDescription.textContent = `300 orders included plus $${percentage} per additional order.`;
  } else {
    const percentage = 0.1;
    let result = (valueSelect - 500) * percentage + 79;

    if (isNaN(result)) {
      result = 79;
    }

    const updatedProfessionalPrice = result < 79 ? 79 : result;

    //formatted price
    let formattedPrice =
      updatedProfessionalPrice % 1 === 0
        ? updatedProfessionalPrice.toFixed(0)
        : updatedProfessionalPrice.toFixed(1).replace(/\.0$/, "");

    brandedPremiumPriceText.textContent =
      formattedPrice === "NaN" ? "$" + 79 : "$" + formattedPrice;
    brandedPremiumDescription.textContent = `500 orders included plus $${percentage} per additional order.`;
  }
}

const prices = {
  300: { professional: 29, brandedPremium: 79, businessAdvanced: 299 },
  500: { professional: 49, brandedPremium: 119, businessAdvanced: 299 },
  750: { professional: 74, brandedPremium: 169, businessAdvanced: 299 },
  1000: { professional: 99, brandedPremium: 219, businessAdvanced: 299 },
  1500: { professional: 149, brandedPremium: 319, businessAdvanced: 424 },
  2000: { professional: 199, brandedPremium: 419, businessAdvanced: 549 },
  3000: { professional: 299, brandedPremium: 619, businessAdvanced: 799 },
  5000: { professional: 499, brandedPremium: 1019, businessAdvanced: 1299 },
  7500: { professional: 749, brandedPremium: 1519, businessAdvanced: 1924 },
  10000: { professional: 999, brandedPremium: 2019, businessAdvanced: 2549 },
};

//onchange event function - Entry point
select.addEventListener("change", function () {
  valueSelect = this.value;
  const defaultValues = {
    professional: 29,
    brandedPremium: 79,
    businessAdvanced: 299,
  };

  if (!valueSelect || valueSelect === "Deliveries") {
    selectedPrice = defaultValues;
  } else {
    selectedPrice = prices[valueSelect] || defaultValues;
  }

  professionalCurrentPrice = selectedPrice.professional;
  brandedCurrentPrice = selectedPrice.brandedPremium;

  changeProfessionalTexts();
  changeBrandedTexts();
  businessPriceText.textContent = "$" + selectedPrice.businessAdvanced;
});

//switch's events listener - entry point 🚀

toogleProfessional.addEventListener("click", () => {
  clickCounterProfessional++;

  changeProfessionalTexts();
});

toogleBranded.addEventListener("click", function () {
  clickCounterBranded++;

  changeBrandedTexts();
});