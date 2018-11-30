'use strict'

/**
 * LazySelect
 * @param selector {string}
 * @param config {{paginationSize: number, enableMultiSelect: boolean}}
 * Ex: SelectPosFilter = new LazySelect('.selector', 100);
 */
class LazySelect {

    constructor(selector, config) {

        this.selector = selector;
        this.el = document.querySelector(selector);

        if( this.el ) {
            this.container = this.el.parentNode;
            this.isMultiSelect = config.enableMultiSelect;
            this.pagination = config.paginationSize;

            this.model = new LazySelectModel();
            this.view = new LazySelectView();
            this.filter = new LazySelectFilter(this);
            this.actions = new LazySelectActions(this);

            this.el.innerHTML += '<div class="lazy-field__loader"><i class="material-icons fa-spin-r">cached</i></div>';
            this.create();
        }
    }

    // Create dropdown without data
    create() {

        this.container.classList.add('lazy-select-container');
        this.container.innerHTML += this.view.template({ showActions: this.isMultiSelect });
        this.setEvents();
    }

    // Init load data in dropdown
    init(result) {
        result.data.map(line => line.map(item => item.selected = false));
        this.model.data = result;
        this.reset();
        this.update();
    }

    // Reset dropdown to initial state
    reset() {

        this.model.selected = [];
        this.filter.clear(this.model);
        this.container.querySelector('.lazy-select-header__filter-input').value = '';
        this.container.querySelector('.lazy-select-list').innerHTML = '';
        this.screenUpdate();
    }

    // Update data in list
    update(model) {

        let itens;
        let list = this.container.querySelector('.lazy-select-list');

        if( model !== undefined) {
            itens = model;
        } else {
            itens = this.model.pages[0];
            this.isFiltered = false;
        }

        list.innerHTML = this.isMultiSelect ? this.view.templateCheckboxItem(itens) : this.view.templateRadioItem(itens);
        list.scrollTop = 0;
    }

    // Show / Hide Dropdown windows
    toggleLazySelect() {

        let el = this.container.querySelector('.lazy-select');
        if( !el.classList.contains('open') ) {
            el.classList.add('open');
        } else {
            el.classList.remove('open');
        }
    }

    // Set all events 
    setEvents() {
        let list = this.container.querySelector('.lazy-select-list');
        let field = this.container.querySelector(this.selector);
        let search = this.container.querySelector('.lazy-select-header__filter-input');

        // Filter
        search.addEventListener('keyup', e => this.filter.apply(e, this.model, this));

        // Toggle open/close dropdown
        field.addEventListener('click', () => this.toggleLazySelect());

        // Check / Uncheck one
        list.addEventListener('change', e => {
            if( e.target.tagName == 'INPUT' && (e.target.type == 'checkbox' || e.target.type == 'radio') ) {
                this.actions.toggleSelected(e.target);
            }
        });

        // Close dropdown on outside click
        document.addEventListener('click', e => {
            if( !e.target.closest('.lazy-select')&& !e.target.closest('.lazy-field') ) {
                this.container.querySelector('.lazy-select').classList.remove('open');
            }
        });

        // lazy load list
        list.addEventListener('scroll', e => {
            let content = e.currentTarget;

            // Load next page when scroll to bottom
            if (content.scrollTop + content.clientHeight >= content.scrollHeight * 0.95 ) {

                let pages = this.model.isFiltered ? this.model.filter.result_paged : this.model.pages;

                if( this.model.current_page + 1 < pages.length) {
                    content.innerHTML += this.isMultiSelect ? this.view.templateCheckboxItem(pages[this.model.current_page + 1]) : this.view.templateRadioItem(pages[this.model.current_page + 1]);
                    this.model.current_page++;
                }
            }
        });


        // Remove Multiselect actions if it not enabled
        if (this.isMultiSelect) {
            let btnCheckAll = this.container.querySelector('.lazy-select-header__actions .action-ckeck-all');
            let btnUncheckAll = this.container.querySelector('.lazy-select-header__actions .action-unckeck-all');

            // select all
            btnCheckAll.addEventListener('click', () => this.actions.checkAll());

            // select all
            btnUncheckAll.addEventListener('click', () => this.actions.uncheckAll());
        }
    }

    screenUpdate() {

        let vm = this.view.templateField(this.model);
        this.container.querySelector('.lazy-field__text').innerHTML = vm;
    }
    
    addError() {
        document.querySelector(this.selector).classList.add('error');
    }
    
    removeError() {
        document.querySelector(this.selector).classList.remove('error');
    }

    // Show Loader
    showLoader(element = null) {

        let el = element ? document.querySelector(element) : document.querySelector(this.selector);
        el.querySelector('.lazy-field__icon').style.display = 'none';
        el.classList.add('animated', 'infinite', 'colorTransition', 'isloading');
        el.querySelector('.lazy-field__loader').style.display = 'block';
    }

    // Hide Loader
    hideLoader(element = null) {

        let el = element ? document.querySelector(element) : document.querySelector(this.selector);
        el.querySelector('.lazy-field__icon').style.display = 'block';
        el.classList.remove('animated', 'infinite', 'colorTransition', 'isloading');
        el.querySelector('.lazy-field__loader').style.display = 'none';
    }

    /**
     * Returns the serialized value of this component
     * @returns {string}
     */
    get value() {
        return this.model.selected.map(item => item.id);
    }

    set value(selectedIds) {
        this.actions.uncheckAll();

        this.model.full_list.map(item => {
            if (selectedIds.indexOf(item.id) > -1) {
                item.selected = true;
                this.model.selected.push(item);
            }

        });

        this.update();
        this.screenUpdate();
    }
}
