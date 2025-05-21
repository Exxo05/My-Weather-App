# Weather App 🌦️

A simple yet dynamic web application that displays the current weather conditions and a 5-day forecast for any searched city. This app utilizes the OpenWeatherMap API to fetch real-time weather data and enhances user experience with dynamic background images, user-configurable settings, and clear visual feedback.

<!-- Optional: Add a live demo link if available -->
<!-- You can try a live demo here: [tiempo.exxo.ovh](https://tiempo.exxo.ovh/) -->

## ✨ Features

*   **Current Weather Display:** Shows temperature, weather condition, and humidity for the searched city.
*   **5-Day Weather Forecast:** Provides a summarized forecast for the next five days.
*   **Dynamic Background Images:** The background image changes to reflect the current weather conditions (e.g., sunny, rainy, cloudy).
*   **User-Configurable API Key:** Users must enter their own OpenWeatherMap API key, which is then stored securely in their browser's `localStorage` for future use.
*   **Celsius/Fahrenheit Toggle:** Users can switch between Celsius and Fahrenheit temperature units. Their preference is saved in `localStorage`.
*   **Loading Indicators:** Visual feedback is provided while data is being fetched.
*   **Error Messages:** Clear messages are displayed for issues like invalid API keys, city not found, or network errors.
*   **Persistent Last Searched City:** Remembers the last city you searched for.

## 🛠️ Setup and Usage

### 1. API Key Requirement

This application requires an API key from OpenWeatherMap to fetch weather data.

*   **Get your API Key:**
    1.  Sign up for a free account (or a paid plan) on [OpenWeatherMap](https://openweathermap.org).
    2.  Navigate to the "API keys" section of your account dashboard (usually found at `https://home.openweathermap.org/api_keys`).
    3.  Generate a new API key if you don't already have one.

*   **Enter the API Key into the App:**
    1.  Upon loading the app for the first time, you will see an input field at the top prompting you to "Enter your OpenWeatherMap API Key".
    2.  Paste your generated API key into this field.
    3.  Click the "Save Key" button. The key will be saved in your browser's `localStorage`, so you won't need to enter it every time you visit on the same browser.

### 2. Running the App

Simply open the `index.html` file in your web browser.

## 💻 Technologies Used

*   **HTML:** For the basic structure and content of the application.
*   **CSS:** For styling the application and making it responsive.
*   **JavaScript:** For all dynamic functionality, API interactions, data processing, and DOM manipulation.
*   **OpenWeatherMap API:** Used to source the weather data.

## 📂 File Structure

The project consists of the following main files:

*   `index.html`: The main HTML file that structures the web page.
*   `style.css`: Contains all the CSS rules for styling the application.
*   `script.js`: Handles all the JavaScript logic, including API calls, data processing, DOM updates, and event handling.
*   `IMAGENES/`: A directory containing static images used for backgrounds and icons.

## 🚧 Future Enhancements (Ideas)

While the current version is fully functional, here are some potential ideas for future updates:

*   **Geolocation:** Option to get weather for the user's current location.
*   **Detailed Hourly Forecast:** Displaying a more granular hourly forecast for the current day.
*   **Favorite Cities:** Allow users to save a list of favorite cities for quick access.
*   **Improved UI/UX:** Further enhancements to the user interface and overall experience.

---

*This README has been updated to reflect the current state and features of the application.*
