'use strict'

class LazySelectActions {

    constructor(controller)  {

        this.controller = controller;
        this.worker = this.loadWorker('removeArrayFromArray');
        this.workerEventListener();
    }

    // Check all itens
    checkAll() {

        if( this.controller.model.isFiltered ) {
            this.setSelected(this.controller.model.filter.result, this.controller.model.isFiltered);
            this.controller.model.filter.result.map(el => el.selected = true);
        } else {
            this.setSelected(this.controller.model.full_list, this.controller.model.isFiltered);
            this.controller.model.full_list.map(el => el.selected = true);
        }
        
        this.toggleVisibleCheck(true);
        this.controller.screenUpdate();
    }

    // Toggle Screen Visible checkbox
    toggleVisibleCheck(checked) {
        this.controller.container.querySelectorAll('.lazy-select-list__item input[type="checkbox"], .lazy-select-list__item input[type="radio"]').forEach(item => {
            if(!checked) {
                item.checked = false;
                item.removeAttribute('checked');
            } else {
                item.checked = true;
                item.setAttribute('checked', '');
            }
        });
    }

    // Uncheck all itens
    uncheckAll() {
        
        if( this.controller.model.isFiltered ) {

            this.controller.showLoader();
            let unSelected = this.controller.model.filter.result;
            this.controller.model.filter.result.map(item => item.selected = false);

            // Proccess itens in Web Worker
            this.worker.postMessage([this.controller.model.selected, unSelected.map(i => i.id)]);
        } else {
            this.controller.model.selected = [];
            this.controller.model.full_list.map(el => el.selected = false);
            this.toggleVisibleCheck(false);
            this.controller.screenUpdate();
        }
    }

    // Set selected itens
    setSelected(items, isFiltered) {
        
        if( this.controller.model.selected.length > 0 &&  isFiltered) {
            this.controller.model.selected = [...new Set([...this.controller.model.selected ,...items])];
        } else {
            this.controller.model.selected = items;
        }

        this.controller.model.selected.map(item => item.selected = true);
    }

    // Check / Uncheck individual item
    toggleSelected(element) {
        let id = element.parentNode.dataset.id;
        console.log(element.checked);
        if( element.checked ) {
            if (!this.controller.isMultiSelect && this.controller.model.selected.length === 1) {
                this.uncheckAll();
                element.checked = true;
            }
            element.setAttribute('checked', '');
            this.controller.model.full_list.map(el => el.id == id ? el.selected = true : el);
            this.controller.model.selected.push(...this.controller.model.full_list.filter(e => e.id == id));
        } else {
            this.controller.model.selected = this.controller.model.selected.filter(e => e.id != id);
            this.controller.model.full_list.map(el => el.id == id ? el.selected = false : el);
        }

        this.controller.screenUpdate();
    }

    loadWorker(worker) {
        
        return new Worker(`/Content/assets/scripts/workers/${worker}.js?v=42`);
    }

    // Listen Web worker response
    workerEventListener() {

        this.worker.addEventListener('message', e => {
            this.controller.model.selected = e.data;
            this.toggleVisibleCheck(false);
            this.controller.screenUpdate();
            this.controller.hideLoader();
        }, false);
    }
}