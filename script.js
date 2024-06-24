const today = new Date();
let selectedDate = today;
const deadlines = {};
const initialMonth = today.getMonth();
const initialYear = today.getFullYear();

function isToday(date) {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function formatDateAsWords(date) {
  return date.toLocaleString("default", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function renderCalendar(monthOffset = 0) {
  const calendarDaysElement = document.getElementById("calendar-days");
  calendarDaysElement.innerHTML =
    '<div class="weekday">Mo</div><div class="weekday">Tu</div><div class="weekday">We</div><div class="weekday">Th</div><div class="weekday">Fr</div><div class="weekday">Sa</div><div class="weekday">Su</div>';

  const currentMonth = today.getMonth() + monthOffset;
  const currentYear = today.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfPrevMonth = new Date(currentYear, currentMonth, 0);
  const lastDayOfCurrentMonth = new Date(
    currentYear,
    currentMonth + 1,
    0
  );
  const totalDays = lastDayOfCurrentMonth.getDate();
  const startDay = firstDayOfMonth.getDay() || 7;

  const monthYearElement = document.getElementById("current-month-year");
  monthYearElement.textContent = firstDayOfMonth.toLocaleString(
    "default",
    { month: "long", year: "numeric" }
  );

  for (let i = 1; i < startDay; i++) {
    const prevMonthDay = lastDayOfPrevMonth.getDate() - startDay + i + 1;
    calendarDaysElement.insertAdjacentHTML(
      "beforeend",
      `<div class="calendar-day past" onclick="selectPrevMonthDate(${prevMonthDay})">${prevMonthDay}</div>`
    );
  }

  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const dateString = `${currentYear}-${(currentMonth + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    const isDeadline =
      deadlines[dateString] && deadlines[dateString].length > 0;
    const isActive =
      selectedDate &&
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear;

    let className = "calendar-day";
    if (isToday(date)) {
      className += " today";
    } else if (isActive) {
      className += " active";
    } else if (isDeadline) {
      className += " deadline";
    }

    calendarDaysElement.insertAdjacentHTML(
      "beforeend",
      `<div class="${className}" onclick="selectDate(${day})" onmouseover="hoverDate(this)" onmouseout="unhoverDate(this)">${day}</div>`
    );
  }

  const remainingDays =
    7 - ((totalDays + startDay - 1) % 7) === 7
      ? 0
      : 7 - ((totalDays + startDay - 1) % 7);
  for (let i = 1; i <= remainingDays; i++) {
    calendarDaysElement.insertAdjacentHTML(
      "beforeend",
      `<div class="calendar-day future" onclick="selectNextMonthDate(${i})">${i}</div>`
    );
  }
}

function hoverDate(element) {
  if (!element.classList.contains("today")) {
    element.style.backgroundColor = "#004080";
    element.style.color = "white";
  }
}

function unhoverDate(element) {
  if (element.classList.contains("today")) {
    element.style.backgroundColor = "#4CAF50";
    element.style.color = "white";
  } else if (element.classList.contains("active")) {
    element.style.backgroundColor = "#5ed3ec";
    element.style.color = "white";
  } else if (element.classList.contains("deadline")) {
    element.style.backgroundColor = "#f77600";
    element.style.color = "white";
  } else if (
    element.classList.contains("future") ||
    element.classList.contains("past")
  ) {
    element.style.backgroundColor = "#f2f3f7";
    element.style.color = "#b9b9ba";
  } else {
    element.style.backgroundColor = "white";
    element.style.color = "#364346";
  }
}

function selectDate(day) {
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  selectedDate = new Date(currentYear, currentMonth, day);
  updateCalendarUI();
  renderDeadlines();
  document.getElementById("deadline-input-container").style.display =
    "flex";

  updateDateDisplay();
}

function selectPrevMonthDate(day) {
  today.setMonth(today.getMonth() - 1);
  selectDate(day);
  renderCalendar();
}

function selectNextMonthDate(day) {
  today.setMonth(today.getMonth() + 1);
  selectDate(day);
  renderCalendar();
}

function updateCalendarUI() {
  const dayElements = document.querySelectorAll(".calendar-day");
  dayElements.forEach((el) => {
    el.classList.remove("active");
    el.style.backgroundColor = "";
    el.style.color = "";

    const day = parseInt(el.textContent);
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const date = new Date(currentYear, currentMonth, day);
    const dateString = `${currentYear}-${(currentMonth + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

    if (isToday(date)) {
      el.classList.add("today");
    } else if (
      day === selectedDate.getDate() &&
      !el.classList.contains("past") &&
      !el.classList.contains("future")
    ) {
      el.classList.add("active");
      el.style.backgroundColor = "#5ed3ec";
      el.style.color = "white";
    } else if (
      deadlines[dateString] &&
      deadlines[dateString].length > 0 &&
      !el.classList.contains("past") &&
      !el.classList.contains("future")
    ) {
      el.classList.add("deadline");
      el.style.backgroundColor = "#f77600";
      el.style.color = "white";
    }
  });
}

function updateDateDisplay() {
  const now = new Date();
  document.getElementById("current-day").textContent = now
    .getDate()
    .toString()
    .padStart(2, "0");
  document.getElementById("current-month").textContent =
    now.toLocaleString("default", { month: "long" });
  document.getElementById("current-year").textContent = now.getFullYear();
}

function addDeadline() {
  const deadlineInput = document.getElementById("deadline-input");
  const deadline = deadlineInput.value.trim();
  if (deadline && selectedDate) {
    const dateString = `${selectedDate.getFullYear()}-${(
      selectedDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${selectedDate
      .getDate()
      .toString()
      .padStart(2, "0")}`;
    if (!deadlines[dateString]) {
      deadlines[dateString] = [];
    }
    deadlines[dateString].push(deadline);
    deadlineInput.value = "";
    renderDeadlines();
    updateCalendarUI();
  }
}

function renderDeadlines() {
  const todayDeadlinesElement =
    document.getElementById("today-deadlines");
  const upcomingDeadlinesElement =
    document.getElementById("upcoming-deadlines");
  todayDeadlinesElement.innerHTML = "";
  upcomingDeadlinesElement.innerHTML = "";

  const currentDateString = `${selectedDate.getFullYear()}-${(
    selectedDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${selectedDate
    .getDate()
    .toString()
    .padStart(2, "0")}`;

  if (deadlines[currentDateString]) {
    deadlines[currentDateString].forEach((deadline) => {
      const deadlineItem = document.createElement("div");
      deadlineItem.classList.add("today-item");
      deadlineItem.textContent = deadline;
      const tickIcon = document.createElement("span");
      tickIcon.innerHTML = "✓";
      tickIcon.classList.add("tick-icon");
      tickIcon.onclick = () =>
        removeDeadline(currentDateString, deadline);
      deadlineItem.appendChild(tickIcon);
      todayDeadlinesElement.appendChild(deadlineItem);
    });
  } else {
    const noDeadlinesItem = document.createElement("div");
    noDeadlinesItem.classList.add("today-item");
    noDeadlinesItem.textContent = "No deadlines today";
    todayDeadlinesElement.appendChild(noDeadlinesItem);
  }

  let hasUpcomingDeadlines = false;
  const now = new Date();
  for (const dateString in deadlines) {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (date > now) {
      const formattedDate = formatDateAsWords(date);
      deadlines[dateString].forEach((deadline) => {
        hasUpcomingDeadlines = true;
        const deadlineItem = document.createElement("div");
        deadlineItem.classList.add("deadline-item");
        deadlineItem.textContent = `${formattedDate}: ${deadline}`;
        const tickIcon = document.createElement("span");
        tickIcon.innerHTML = "✓";
        tickIcon.classList.add("tick-icon");
        tickIcon.onclick = () => removeDeadline(dateString, deadline);
        deadlineItem.appendChild(tickIcon);
        upcomingDeadlinesElement.appendChild(deadlineItem);
      });
    }
  }

  if (!hasUpcomingDeadlines) {
    const noUpcomingDeadlinesItem = document.createElement("div");
    noUpcomingDeadlinesItem.classList.add("deadline-item");
    noUpcomingDeadlinesItem.textContent = "No upcoming deadlines";
    upcomingDeadlinesElement.appendChild(noUpcomingDeadlinesItem);
  }
}

function removeDeadline(dateString, deadline) {
  if (
    confirm("Are you done with this deadline? Click OK to remove it.")
  ) {
    const index = deadlines[dateString].indexOf(deadline);
    if (index > -1) {
      deadlines[dateString].splice(index, 1);
      if (deadlines[dateString].length === 0) {
        delete deadlines[dateString];
      }
      renderDeadlines();
      updateCalendarUI();
    }
  }
}

function navigateMonth(offset) {
  today.setMonth(today.getMonth() + offset);
  renderCalendar();
}

document.addEventListener("DOMContentLoaded", () => {
  renderCalendar();
  renderDeadlines();
  document
    .getElementById("add-deadline-button")
    .addEventListener("click", addDeadline);

  updateDateDisplay();

  const todayDayElement = document.querySelector(".calendar-day.today");
  if (todayDayElement) {
    todayDayElement.classList.add("active");
  }
});