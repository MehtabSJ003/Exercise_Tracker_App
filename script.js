"use strict";

//create an array of all the months of year
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July ",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Selecting elements
const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form--input-type");
const inputDistance = document.querySelector(".form--input-distance");
const inputDuration = document.querySelector(".form--input-duration");
const inputCadence = document.querySelector(".form--input-cadence");
const inputElevation = document.querySelector(".form--input-elevation");

let map, mapEvent;
// Make page get location
if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      console.log(
        `https://www.google.com/maps/@${latitude},${longitude},15z?entry=ttu`
      );
      const coords = [latitude, longitude];

      map = L.map("map").setView(coords, 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.fr/hot/">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Handling clicks on map
      map.on("click", function (mapE) {
        mapEvent = mapE;
        form.classList.remove("form--hidden");
        inputDistance.focus();
      });
    },
    function () {
      alert("Could not get your position");
    }
  );

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Clear input fields
  inputDistance.value =
    inputDuration.value =
    inputCadence.value =
    inputElevation.value =
      "";

  // Display marker
  const { lat, lng } = mapEvent.latlng;
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: "running-popup",
      })
    )
    .setPopupContent("Workout")
    .openPopup();
});

// Changing form input on basis of type of exercise
inputType.addEventListener("change", function () {
  inputElevation.closest(".form--row").classList.toggle("form--row-hidden");
  inputCadence.closest(".form--row").classList.toggle("form--row-hidden");
});
