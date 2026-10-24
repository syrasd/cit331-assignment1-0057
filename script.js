/* ==========================================================
   script.js - Registration page (register.html)
   1. On submit: stop page reload, save registration to
      localStorage as JSON, show a confirmation message.
   2. Read localStorage and display all saved registrations
      in a list, with a "Clear all" button to remove them.
   ========================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "registrations";

  var form = document.getElementById("register-form");
  if (!form) {
    return; // This script only does something on register.html
  }

  /* ---------- Build the elements that are not in the HTML ---------- */

  // Confirmation message, placed under the form note
  var message = document.createElement("p");
  message.className = "form-note";
  message.setAttribute("role", "status");
  form.appendChild(message);

  // "Saved registrations" section, placed after the form section
  var savedSection = document.createElement("section");
  savedSection.className = "saved-section";

  var savedHeading = document.createElement("h2");
  savedHeading.textContent = "Saved registrations";

  var savedList = document.createElement("ul");
  savedList.id = "saved-list";

  var clearButton = document.createElement("button");
  clearButton.type = "button";
  clearButton.className = "btn";
  clearButton.id = "clear-all";
  clearButton.textContent = "Clear all";

  savedSection.appendChild(savedHeading);
  savedSection.appendChild(savedList);
  savedSection.appendChild(clearButton);
  document.querySelector("main").appendChild(savedSection);

  /* ---------- localStorage helpers ---------- */

  // Returns the saved registrations as an array (empty if none or broken)
  function loadRegistrations() {
    try {
      var data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  // Returns true if the data was saved, false if the browser blocked it
  function saveRegistrations(registrations) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
      return true;
    } catch (error) {
      return false;
    }
  }

  /* ---------- Display ---------- */

  function showSavedRegistrations() {
    var registrations = loadRegistrations();
    savedList.innerHTML = "";

    if (registrations.length === 0) {
      var empty = document.createElement("li");
      empty.textContent = "No registrations saved yet.";
      savedList.appendChild(empty);
      clearButton.disabled = true;
      return;
    }

    registrations.forEach(function (person) {
      var item = document.createElement("li");

      var name = document.createElement("strong");
      name.textContent = person.fullName;

      // textContent is used (not innerHTML) so typed text can never run as code
      item.appendChild(name);
      item.appendChild(
        document.createTextNode(
          " | " + person.email +
          " | DOB: " + person.dob +
          " | League: " + person.league +
          " | Level: " + person.level
        )
      );
      savedList.appendChild(item);
    });

    clearButton.disabled = false;
  }

  function showMessage(text) {
    message.textContent = text;
  }

  /* ---------- Events ---------- */

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from reloading

    var data = new FormData(form);
    var registration = {
      fullName: data.get("fullName").trim(),
      dob: data.get("dob"),
      email: data.get("email").trim(),
      league: data.get("league"),
      level: data.get("level")
    };

    var registrations = loadRegistrations();
    registrations.push(registration);

    if (saveRegistrations(registrations)) {
      showMessage("Thank you, " + registration.fullName + "! Your registration has been saved.");
      form.reset();
      showSavedRegistrations();
    } else {
      showMessage("Sorry, your registration could not be saved in this browser.");
    }
  });

  clearButton.addEventListener("click", function () {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // nothing to remove if storage is blocked
    }
    showMessage("All saved registrations have been cleared.");
    showSavedRegistrations();
  });

  // Show anything already saved when the page opens
  showSavedRegistrations();
})();