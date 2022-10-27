import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  datetimePickerInput: document.querySelector('input#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  daysField: document.querySelector('span[data-days]'),
  hoursField: document.querySelector('span[data-hours]'),
  minutesField: document.querySelector('span[data-minutes]'),
  secondsField: document.querySelector('span[data-seconds]'),
};

let selectedDate = null;
refs.startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedDate = selectedDates[0].getTime();

    if (selectedDate <= Date.now()) {
      Notiflix.Notify.failure('Please choose a date in the future');

      refs.startBtn.disabled = true;
    } else {
      refs.startBtn.disabled = false;
    }
  },
};

flatpickr(refs.datetimePickerInput, options);

refs.startBtn.addEventListener('click', onStartBtnClick);

function onStartBtnClick() {
  refs.startBtn.disabled = true;
  
  const intervalId = setInterval(() => {
    const currentDate = Date.now();
    const timeDifference = selectedDate - currentDate;

    if (timeDifference < 0) {
      clearInterval(intervalId);

      return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeDifference);
    refs.daysField.textContent = addLeadingZero(days);
    refs.hoursField.textContent = addLeadingZero(hours);
    refs.minutesField.textContent = addLeadingZero(minutes);
    refs.secondsField.textContent = addLeadingZero(seconds);
  }, 1000);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
