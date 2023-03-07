function timer(id, deadLine) {

    function getTimeRemaining(endTime) {
        let days, hours, minutes, seconds
        const time = Date.parse(endTime) - new Date();
        if (time <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(time / (1000 * 60 * 60 * 24));
                hours = Math.floor(time / (1000 * 60 * 60) % 24);
                minutes = Math.floor((time / 1000 / 60) % 60);
                seconds = Math.floor((time / 1000) % 60);
        }

        return {
            'total': time,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        }
    }

    function setClock(selector, endTime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock()

        function getZero(num) {
            if (num >= 0 && num < 10) {
                return `0${num}`;
            } else {
                return num;
            }
        }

        function updateClock() {
            const timeRemaining = getTimeRemaining(endTime);

            days.innerHTML = getZero(timeRemaining.days);
            hours.innerHTML = getZero(timeRemaining.hours);
            minutes.innerHTML = getZero(timeRemaining.minutes);
            seconds.innerHTML = getZero(timeRemaining.seconds);

            if (timeRemaining.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock(id, deadLine)
}

export default timer;