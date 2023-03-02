'use strict';

window.addEventListener('DOMContentLoaded', () => {

    //Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide')
            item.classList.remove('show')
        })

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active')
        })
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade')
        tabsContent[i].classList.remove('hide')
        tabs[i].classList.add('tabheader__item_active')

    }

    hideTabContent()
    showTabContent()


    tabsParent.addEventListener('click', (event) => {
        const target = event.target

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target === item) {
                    hideTabContent()
                    showTabContent(i)
                }
            })
        }
    })

    //Timer

    const deadLine = '2023-05-20';

    function getTimeRemaining(endTime) {
        let days, hours, minutes, seconds
        const time = Date.parse(endTime) - new Date();
        if (time <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(time / (1000 * 60 * 60 * 24)),
                hours = Math.floor(time / (1000 * 60 * 60) % 24),
                minutes = Math.floor((time / 1000 / 60) % 60),
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

    setClock('.timer', deadLine)

    //Modal window

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId)
    }

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', () => {
            openModal()
        })
    })

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.getAttribute('data-close') === '') {
            closeModal();
        }
    })

    document.addEventListener('keydown', (event) => {
        if (event.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    })

    const modalTimerId = setTimeout(openModal, 50000)

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll)
        }
    }

    window.addEventListener('scroll', showModalByScroll)

    //Small menu items

    class MenuCard {
        constructor(src, alt, title, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 75
            this.changeToEuro();
        }

        changeToEuro() {
            this.price = (this.price / this.transfer).toFixed(2)
        }

        render() {
            const element = document.createElement('div');
            if (this.classes.length === 0) {
                this.element = 'menu__item'
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }
            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Cost:</div>
                    <div class="menu__item-total"><span>${this.price}</span> euro/day</div>
                </div>`;

            this.parent.append(element)
        }
    }

    new MenuCard(
        "img/tabs/vegy.png",
        "vegy",
        '"Fitness"',
        200,
        '.menu .container',
        'menu__item'
    ).render();

    new MenuCard(
        "img/tabs/meat.png",
        "elite",
        '"Premium"',
        350,
        '.menu .container'
    ).render();

    new MenuCard(
        "img/tabs/post.png",
        "post",
        '"Lenten"',
        320,
        '.menu .container'
    ).render();

    new MenuCard(
        "img/tabs/balanced.png",
        "balanced",
        '"Balanced"',
        300,
        '.menu .container'
    ).render();

    //Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Thanks! We will call you soon',
        failure: 'Something went wrong...'
    };

    forms.forEach(item => {
        postData(item);
    });

    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display:block;
            margin: 0 auto;`
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const object = {}
            formData.forEach(function (value, key) {
                object[key] = value
            })

            fetch('http://localhost:6544', {
                method: "POST",
                headers: {
                    'Content-type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(object)
            })
                .then(data => data.text())
                .then((data) => {
                    showThanksModal(message.success)
                    statusMessage.textContent = message.success;
                    statusMessage.remove();
                }).catch(() => {
                showThanksModal(message.failure)
            })
                .finally(() => form.reset())
        });
    }

    function showThanksModal(message) {
        const prevModal = document.querySelector('.modal__dialog');
        prevModal.classList.add('hide');
        openModal();
        const thanksModal = document.createElement('div')
        thanksModal.classList.add('modal__dialog')
        thanksModal.innerHTML = `
        <div class="modal__content">
         <div data-close class="modal__close">&times;</div>
         <h2 class="modal__title">${message}</h2>
        </div>`;

        document.querySelector('.modal').append(thanksModal)
        setTimeout(() => {
            thanksModal.remove()
            prevModal.classList.add('show')
            prevModal.classList.remove('hide')
            closeModal()

        }, 4000)
    }

})