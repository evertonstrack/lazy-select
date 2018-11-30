'use strict'

class LazySelectView {

    constructor() {

        this.RESOURCES = new LazySelectResources();
    }

    templateCheckboxItem(model) {
        return model.map(item => `
            <label class="lazy-select-list__item" data-id="${item.id}" data-name="${item.name}">
                <input type="checkbox" ${item.selected ? 'checked' : ''} />
                ${item.name}
            </label>
            `).join('');
    }

    templateRadioItem(model) {
        return model.map(item => `
            <label class="lazy-select-list__item" data-id="${item.id}" data-name="${item.name}">
                <input type="radio" ${item.selected ? 'checked' : ''}>
                </div>
                ${item.name}
            </label>
            `).join('');
    }

    /**
     * @param options {{ showActions: boolean }}
     * @returns {string}
     */
    template({ showActions }) {

        return `
            <div class="lazy-select">
                <div class="lazy-select-header">
                    <div class="lazy-select-header__filter">
                        <label class="lazy-select-header__filter-label">${this.RESOURCES.FILTER}</label>
                        <input class="lazy-select-header__filter-input" type="text" placeholder="${this.RESOURCES.SEARCH}" />
                    </div>
                    ${
                    showActions ?
                    `<div class="lazy-select-header__actions">
                        <button class="action-unckeck-all" type="button">${this.RESOURCES.NONE}</button>
                        <button class="action-ckeck-all" type="button">${this.RESOURCES.ALL}</button>
                    </div>` : ''
                    }
                </div>
                <div class="lazy-select-list"></div>
            </div>
        `;
    }

    templateField(model) {

        let text;
        switch(model.selected.length) {

            case 0:
                text = this.RESOURCES.SELECT;
                break;
            case 1:
            case 2:
                text = model.seletedText;
                break;
            default:
                text = `${model.totalSeleted}/${model.total}`;
                break;
        }

        return text;
    }
}