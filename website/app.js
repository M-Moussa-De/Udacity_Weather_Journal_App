// jshint esversion: 11

const api = {
  key: "3f688bfa5f5d76be3f1297465be07814",
  // I Prefer Using Metric On Imperial
  url: "https://api.openweathermap.org/data/2.5/weather?units=metric&zip=",
};

const submit = document.querySelector("#submit");

submit.addEventListener("click", dataHandler);

async function dataHandler() {
  try {
    //Show An Error In Case Of Empty/False Input
    const error = document.querySelector(".error");
    if (isUserinputValid() !== true) {
      error.innerHTML = "Please, validate your input!";
      error.classList.remove("hidden");
      document.querySelector("#info").classList.remove("hidden");
      return;
    }

    // Get Userinput Values
    const zip = document.querySelector("#zip");
    const zipVal = zip.value;
    const feel = document.querySelector("#feeling");
    const feelVal = feel.value;

    // Getting/Fetching Data From OenWeatherMap API
    const response = await fetch(`${api.url}${zipVal}&appid=${api.key}`).then(
      (res) => res.json()
    );

    // Storing The Needed Values
    const temp = Math.round(await response.main.temp);
    const city = await response.name;
    const country = await response.sys.country;
    const description = await response.weather[0].description;
    const icon = await response.weather[0].icon;

    // Sending/Posting Data To Server
    const options = {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        temp,
        description,
        place: { city, country },
        feelVal,
        date: getDate(),
        icon,
      }),
    };
    await fetch("/postWeatherData", options);

    // Calling/Loading The Data From The Server Side
    await fetch("/getWeatherData")
      .then((res) => res.json())
      .then((data) => {
        updateUI(data);
      });
    // In case All Requirements Are Met, Show The Response-Section-Holder In HTML File
    const queryResultSection = document.querySelector("#queryResult");
    queryResultSection.classList.remove("hidden");

    // Set The Input Empty
    zip.value = "";
    feel.value = "";

    // Hidde Error Notifications
    error.classList.add("hidden");
    document.querySelector("#info").classList.add("hidden");
  } catch (err) {
    if (err.code === "404") {
      const error = err.message;
      console.log(error);
    }
  }
}

//Validate Userinput
function isUserinputValid() {
  let isValid = true;
  const feel = document.querySelector("#feeling");
  const feelVal = feel.value;
  const zip = document.querySelector("#zip").value;

  const query = zip.length !== 5 || zip === isNaN || feelVal.length <= 3;
  if (query === true) {
    isValid = false;
  }

  return isValid;
}

// Update UI With The Updated Data
function updateUI(data) {
  const temp = document.querySelector("#temp");
  const location = document.querySelector("#location");
  const description = document.querySelector("#description");
  const feeling = document.querySelector("#feel");
  const date = document.querySelector("#date");
  const icon = document.querySelector("#icon");

  temp.innerHTML = data.temp + "° C";
  location.innerHTML = data.city + ", " + data.country;
  description.innerHTML = data.description;
  feeling.innerText = data.feeling;
  date.innerHTML = data.date;

  const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
  icon.setAttribute("src", iconUrl);
  icon.classList.remove("hidden");
}

function getDate() {
  const d = new Date();
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date =
    weekday[d.getDay()] +
    ", " +
    d.getMonth() +
    "." +
    d.getDate() +
    "." +
    d.getFullYear();

  return date;
}
