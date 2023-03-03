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
            constructor(src, alt, title, description, price, parentSelector, ...classes) {
                this.src = src;
                this.alt = alt;
                this.title = title;
                this.description = description;
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
                <h5 class="menu__item-descr">${this.description}</h5>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Cost:</div>
                    <div class="menu__item-total"><span>${this.price}</span> euro/day</div>
                </div>`;

                this.parent.append(element)
            }
        }

        const getResource = async (url) => {
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`Could not fetch ${url}, status: ${res.status}`);
            }

            return await res.json();

        };

        getResource('http://localhost:3000/menu')
            .then(data => {
                data.forEach(({img, alt, title, description, price}) => {
                    new MenuCard(img, alt, title, description, price, '.menu .container').render();
                })
            })

        //Forms

        const forms = document.querySelectorAll('form');
        const message = {
            loading: 'img/form/spinner.svg',
            success: 'Thanks! We will call you soon',
            failure: 'Something went wrong...'
        };

        forms.forEach(item => {
            bindPostData(item);
        });

        const postData = async (url, data) => {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json; charset=utf-8'
                },
                body: data
            });

            return await res.json();
        };

        function bindPostData(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                let statusMessage = document.createElement('img');
                statusMessage.src = message.loading;
                statusMessage.style.cssText = `
            display:block;
            margin: 0 auto;`
                form.insertAdjacentElement('afterend', statusMessage);

                const formData = new FormData(form);

                const json = JSON.stringify(Object.fromEntries(formData.entries()));

                postData('http://localhost:3000/requests', json)
                    .then(() => {
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

        //Slider

        let slideIndex = 1;
        let offset = 0;


        const slides = document.querySelectorAll('.offer__slide'),
            slider = document.querySelector('.offer__slider'),
            prev = document.querySelector('.offer__slider-prev'),
            next = document.querySelector('.offer__slider-next'),
            total = document.querySelector('#total'),
            current = document.querySelector('#current'),
            slidesWrapper = document.querySelector('.offer__slider-wrapper'),
            width = window.getComputedStyle(slidesWrapper).width,
            slidesField = document.querySelector('.offer__slider-inner');

        if (slides.length < 10) {
            total.textContent = `0${slides.length}`;
            current.textContent = `0${slideIndex}`;
        } else {
            total.textContent = `${slides.length}`;
            current.textContent = slideIndex;
        }

        slidesField.style.width = 100 * slides.length + '%';
        slidesField.style.display = 'flex';
        slidesField.style.transition = '0.5s all';

        slidesWrapper.style.overflow = 'hidden';

        slides.forEach(slide => {
            slide.style.width = width;
        });

        slider.style.position = 'relative';

        const indicators = document.createElement('ol'),
            dots = [];
        indicators.classList.add('carousel-indicators');
        slider.append(indicators)

        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('li');
            dot.setAttribute('data-slide-to', i + 1)
            dot.classList.add('dot')

            if (i === 0) {
                dot.style.opacity = '1'
            }
            indicators.append(dot)
            dots.push(dot)
        }

        function updateCurrentNum() {
            if (slides.length < 10) {
                current.textContent = `0${slideIndex}`;
            } else {
                current.textContent = slideIndex;
            }

        }

        function setDotOpacity() {
            dots.forEach(dot => {
                dot.style.opacity = '.5'
                dots[slideIndex - 1].style.opacity = '1'
            })
        }

        function deleteNotDigits(str) {
            return +str.replace(/\D/g, '');
        }


        next.addEventListener('click', () => {
            if (offset === (deleteNotDigits(width) * (slides.length - 1))) {
                offset = 0;
            } else {
                offset += deleteNotDigits(width);
            }

            slidesField.style.transform = `translateX(-${offset}px)`;

            if (slideIndex === slides.length) {
                slideIndex = 1;
            } else {
                slideIndex++;
            }

            updateCurrentNum()

            setDotOpacity()


        });

        prev.addEventListener('click', () => {
            if (offset === 0) {
                offset = deleteNotDigits(width) * (slides.length - 1);
            } else {
                offset -= deleteNotDigits(width);
            }

            slidesField.style.transform = `translateX(-${offset}px)`;

            if (slideIndex === 1) {
                slideIndex = slides.length;
            } else {
                slideIndex--;
            }

            updateCurrentNum()

            setDotOpacity()
        });

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideTo = e.target.getAttribute('data-slide-to');

                slideIndex = slideTo;
                offset = deleteNotDigits(width) * (slideTo - 1);

                slidesField.style.transform = `translateX(-${offset}px)`;

                updateCurrentNum()

                setDotOpacity()
            });
        });

        // Calculator

        const result = document.querySelector('.calculating__result span')


        let sex, height, weight, age, ratio;

        if (localStorage.getItem('sex')) {
            sex = localStorage.getItem('sex');
        } else {
            sex = 'female';
            localStorage.setItem('sex', sex)
        }

        if (localStorage.getItem('ratio')) {
            ratio = localStorage.getItem('ratio');
        } else {
            ratio = 1.375;
            localStorage.setItem('ratio', ratio)
        }

        function initLocalSettings(selector, activeClass) {

            const elements = document.querySelectorAll(selector);
            elements.forEach(elem => {
                elem.classList.remove(activeClass);
                if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                    elem.classList.add(activeClass)
                }
                if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                    elem.classList.add(activeClass)
                }
            })

        }

        initLocalSettings('#gender div', 'calculating__choose-item_active');
        initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');


        function calcTotal() {
            if (!sex || !height || !weight || !age || !ratio) {
                result.textContent = '0';
                return;
            }
            if (sex === 'female') {
                result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
            } else {
                result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
            }
        }

        calcTotal()

        function getStaticInfo(selector, activeClass) {
            const elements = document.querySelectorAll(selector);

            elements.forEach(element => {
                element.addEventListener('click', (event) => {
                    if (event.target.getAttribute('data-ratio')) {
                        ratio = +event.target.getAttribute('data-ratio')
                        localStorage.setItem('ratio', +event.target.getAttribute('data-ratio'))
                    } else {
                        sex = event.target.getAttribute('id')
                        localStorage.setItem('sex', event.target.getAttribute('id'))
                    }

                    elements.forEach(elem => {
                        elem.classList.remove(activeClass)
                    })
                    event.target.classList.add(activeClass)
                    calcTotal()
                })

            })
        }

        getStaticInfo('#gender div', 'calculating__choose-item_active');
        getStaticInfo('.calculating__choose_big div', 'calculating__choose-item_active');

        function getDynamicInfo(selector) {
            const input = document.querySelector(selector);


            input.addEventListener('input', () => {
                if (input.value.match(/\D/g)) {
                    input.style.border = '1px solid red';
                } else {
                    input.style.border = 'none';
                }

                switch (input.getAttribute('id')) {
                    case 'height':
                        height = +input.value;
                        break
                    case 'weight':
                        weight = +input.value;
                        break
                    case 'age':
                        age = +input.value;
                        break
                }
                calcTotal()
            });
        }

        getDynamicInfo('#height')
        getDynamicInfo('#weight')
        getDynamicInfo('#age')


    }
)
;
