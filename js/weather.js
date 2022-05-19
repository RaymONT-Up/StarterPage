// Weather

const APIKey = "d6137ff54a05f3de3804796ad9f1a5dc";
const weatherIcon = document.querySelector(".weather__icon"),
  weatherDegrees = document.querySelector(".weather__degrees-num"),
  weatherDescription = document.querySelector(".weather__description"),
  weatherDateNum = document.querySelector(".weather__date--num"),
  weatherDateDay = document.querySelector(".weather__date--day"),
  weatherDateTime = document.querySelector(".weather__date--time"),
  weatherWind = document.querySelector(".weather__wind-text"),
  weatherHum = document.querySelector(".weather__hum-text"),
  weatherNextDaysContainer = document.querySelector(".weather__next-days"),
  userGeolocationHtml = document.querySelector(".weather__geolocation-text"),
  weatherBtnOpen = document.querySelector(".weather__btn--burger"),
  weatherBtnClose = document.querySelector(".weather__btn--close"),
  weatherMainWrapper = document.querySelector(".weather");
// Получаем геолокацию пользователя
const getUserCurrentPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
const getUserWeatherInfo = async function () {
  // Прелоадер активировать
  document
    .querySelector(".weather")
    .classList.add("weather__preloader--active");

  // Получаем координаты по геолокации пользователя
  const {
    coords: { latitude: lat, longitude: lon },
  } = await getUserCurrentPosition();

  // Получаем местоположение
  const ReverseGeocodingData = await fetch(
    `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=2&appid=${APIKey}`
  ).then(response => response.json());

  // Получаем данные из API погоды
  const weatherData = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts,hourly&appid=${APIKey}&units=metric`
  ).then(data2 => data2.json());
  setUserWeatherInfo(ReverseGeocodingData, weatherData);

  // Прелоадер убрать
  document
    .querySelector(".weather")
    .classList.remove("weather__preloader--active");
};
const getCurrentDate = function () {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date();
  const dateYear = date.getFullYear();
  const dateMonth = date.getMonth();
  const dateDayMonth = date.getDate();
  const dateDayWeek = date.getDay() - 1;
  const dateHour = date.getHours().toString().padStart(2, "0");
  const dateMinute = date.getMinutes().toString().padStart(2, "0");
  const dateSeconds = date.getSeconds().toString().padStart(2, "0");

  // Вывод даты в число месяц год
  weatherDateNum.textContent = `${dateDayMonth}th ${months[dateMonth]} ${dateYear}`;

  // Вывод дня
  weatherDateDay.textContent = `${days[dateDayWeek]} `;

  // Вывод времени
  weatherDateTime.textContent = `${dateHour}:${dateMinute}:${dateSeconds}`;
};
const setUserWeatherInfo = function (geoData, weatherData) {
  // Установка положения пользователя в HTML
  userGeolocationHtml.textContent = `${geoData[0].state}, ${geoData[0].country}`;

  // Установка иконки
  const weatherIconCode = weatherData.current.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;

  // Установка градусов
  weatherDegrees.textContent = +weatherData.current.temp.toFixed(1);

  // Установка описания погоды
  const weatherDesc = weatherData.current.weather[0].description;
  weatherDescription.textContent =
    weatherDesc[0].toUpperCase() + weatherDesc.slice(1);

  // Установка текущей даты
  getCurrentDate();
  setInterval(getCurrentDate, 1000);

  // Установка параметров Wind Hum
  weatherWind.textContent = `Wind ~ ${weatherData.current.wind_speed} M/s`;
  weatherHum.textContent = `Hum ~ ${weatherData.current.humidity} %`;

  weatherNextDaysContainer.innerHTML = "";
  // Установка погоды на след. дни
  weatherData.daily.slice(1).forEach(item => {
    const date = `${new Date(item.sunrise * 1000).getDate()}
      ${new Date(item.sunrise * 1000).toString().slice(0, 3)}`;

    const nextDayItem = `
  <li class="weather__next-day ">
    <div class="weather__next-day-degrees">
    ${+item.temp.day.toFixed(1)}°C
    </div>
    <img
      class="weather__next-day-icon"
      src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png "
    />
    <div class="weather__next-day-date">${date}</div>
  </li>
  `;

    weatherNextDaysContainer.insertAdjacentHTML("beforeend", nextDayItem);
  });
};
getUserWeatherInfo();

// Открытие и закрытие при адаптиве
weatherBtnOpen.addEventListener("click", e => {
  weatherMainWrapper.classList.toggle("weather--open");
  todoMainWrapper.classList.remove("todo--open");
});
weatherBtnClose.addEventListener("click", e => {
  weatherMainWrapper.classList.remove("weather--open");
});
