import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datePicker = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let chosenDate;
let timerId;

startBtn.disabled = true;

flatpickr(datePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    chosenDate = selectedDates[0].getTime();

    if (chosenDate < Date.now()) {
      showError('Please choose a date in the future');
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  },
});

startBtn.addEventListener('click', () => {
  startTimer();
});

function startTimer() {
  startBtn.disabled = true;
  datePicker.disabled = true;

  timerId = setInterval(() => {
    const dateNow = Date.now();
    const timeSub = chosenDate - dateNow;

    if (timeSub <= 0) {
      clearInterval(timerId);
      showInfo('Time finished');
      datePicker.disabled = false;
      return;
    }

    updateCountdown(timeSub);
  }, 1000);
}

function updateCountdown(timeSub) {
  const { days, hours, minutes, seconds } = convertMilSec(timeSub);
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function convertMilSec(ms) {
  const second = 1000;
  const minute = 60 * second;
  const hour = 60 * minute;
  const day = 24 * hour;
  return {
    days: Math.floor(ms / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor((ms % hour) / minute),
    seconds: Math.floor((ms % minute) / second),
  };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function showError(message) {
  iziToast.error({
    message,
    position: 'topRight',
    timeout: 0,
    backgroundColor: '#EF4040',
    messageColor: '#FFFFFF',
    close: true,
  });
}

function showInfo(message) {
  iziToast.info({
    message,
    position: 'topRight',
    timeout: 0,
    backgroundColor: '#09f',
    messageColor: '#FFFFFF',
    close: true,
  });
}
