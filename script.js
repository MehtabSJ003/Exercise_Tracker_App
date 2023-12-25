"use strict";

// Selecting elements
const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form--input-type");
const inputDistance = document.querySelector(".form--input-distance");
const inputDuration = document.querySelector(".form--input-duration");
const inputCadence = document.querySelector(".form--input-cadence");
const inputElevation = document.querySelector(".form--input-elevation");

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords; // [lat,lng]
    this.distance = distance;
    this.duration = duration;
  }

  _setDescription() {
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

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

class Running extends Workout {
  type = "running";

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calculatePace();
    this._setDescription();
  }

  // Method for calculating pace
  calculatePace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = "cycling";

  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.calculateSpeed();
    this._setDescription();
  }

  // Calculating Speed
  calculateSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// Application Architecture
class App {
  #map;
  #mapEvent;
  #workouts = [];

  //Constructor
  constructor() {
    this._getPosition();
    form.addEventListener("submit", this._newWorkout.bind(this));
    inputType.addEventListener("change", this._toggleElevationField);
  }

  // Getting the position of the user
  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Could not get your position");
        }
      );
  }

  // Rendering the map on screen
  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(
      `https://www.google.com/maps/@${latitude},${longitude},15z?entry=ttu`
    );
    const coords = [latitude, longitude];

    this.#map = L.map("map").setView(coords, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.fr/hot/">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling clicks on map
    this.#map.on("click", this._showForm.bind(this));
  }

  // Displaying the form when being clicked on the form
  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("form--hidden");
    inputDistance.focus();
  }

  _hideForm() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        "";

    // Hiding the form
    form.style.display = "none";
    form.classList.add("form--hidden");
    setTimeout(() => (form.style.display = "grid"), 1000);
  }

  // Changing to Elevation or candence according to the type of workout
  _toggleElevationField() {
    inputElevation.closest(".form--row").classList.toggle("form--row-hidden");
    inputCadence.closest(".form--row").classList.toggle("form--row-hidden");
  }

  // Submitting the form
  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every((input) => Number.isFinite(input));
    const checkPositive = (...inputs) => inputs.every((input) => input > 0);

    e.preventDefault();

    // GEt data from the form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // If workout is running, create running object
    if (type === "running") {
      const cadence = +inputCadence.value;
      if (
        !validInputs(distance, duration, cadence) ||
        !checkPositive(distance, duration, cadence)
      )
        return alert("Inputs have to be positive numbers!");

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If workout is cycling, create cycling object
    if (type === "cycling") {
      const elevation = +inputElevation.value;
      // Elevation could be negative
      if (
        !validInputs(distance, duration, elevation) ||
        !checkPositive(distance, duration)
      )
        return alert("Inputs have to be positive numbers!");

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add new object to workout array
    this.#workouts.push(workout);
    console.log(workout);

    // Render workout on map as marker
    this._renderWorkoutMarker(workout);

    // Render workout on list
    this._renderWorkout(workout);

    // Hide form + Clear input fields
    this._hideForm();
  }
  // Render Workout Marker
  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    let html = `<li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
    <h2 class="workout--title">${workout.description}</h2>
    <div class="workout--details">
      <span class="workout--icon">${
        workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"
      }</span>
      <span class="workout--value">${workout.distance}</span>
      <span class="workout--unit">km</span>
    </div>
    <div class="workout--details">
      <span class="workout--icon">⏱</span>
      <span class="workout--value">${workout.duration}</span>
      <span class="workout--unit">min</span>
    </div>`;

    if (workout.type === "running") {
      html += `<div class="workout--details">
      <span class="workout--icon">⚡️</span>
      <span class="workout--value">${workout.pace.toFixed(1)}</span>
      <span class="workout--unit">min/km</span>
    </div>
    <div class="workout--details">
      <span class="workout--icon">🦶🏼</span>
      <span class="workout--value">${workout.cadence}</span>
      <span class="workout--unit">spm</span>
    </div>
    </li>`;
    }

    if (workout.type === "cycling") {
      html += `<div class="workout--details">
      <span class="workout--icon">⚡️</span>
      <span class="workout--value">${workout.speed.toFixed(1)}</span>
      <span class="workout--unit">km/h</span>
    </div>
    <div class="workout--details">
      <span class="workout--icon">⛰</span>
      <span class="workout--value">${workout.elevation}</span>
      <span class="workout--unit">m</span>
    </div>
    </li>`;
    }

    form.insertAdjacentHTML("afterend", html);
  }
}

// Creating an App object
const app = new App();
