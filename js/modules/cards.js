import {getResource} from "../services/services";

function cards() {

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


    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, alt, title, description, price}) => {
                new MenuCard(img, alt, title, description, price, '.menu .container').render();
            })
        })
}

export default cards;