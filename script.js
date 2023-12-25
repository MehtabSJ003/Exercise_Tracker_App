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

// Make page get location
if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      console.log(
        `https://www.google.com/maps/@${latitude},${longitude},15z?entry=ttu`
      );

      const map = L.map("map").setView([51.505, -0.09], 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([51.5, -0.09])
        .addTo(map)
        .bindPopup("A pretty CSS popup.<br> Easily customizable.")
        .openPopup();
    },
    function () {
      alert("Could not get your position");
    }
  );
