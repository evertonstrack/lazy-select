'use strict'

class LazySelectModel {

    constructor(itens = [], total = 0) {
        
        this.pages = itens;
        this.full_list = itens.length > 0 ? itens.reduce((acc, val) => [...acc, ...val]) : [];
        this.current_page = 0;
        this.selected = [];
        this.isFiltered = false;
        this.filter = {
            query: '',
            current_page: 0,
            result: [],
            result_paged: []
        };
        this.total = total;
    }

    set data(itens) {
        
        this.pages = itens.data;
        this.full_list = itens.data.length > 0 ? itens.data.reduce((acc, val) => [...acc, ...val]) : [];
        this.selected = [];
        this.isFiltered = false;
        this.total = itens.size;
    }

    get totalSeleted() {

        return this.selected.length;
    }

    get seletedText() {
        
        return this.totalSeleted == 1 ? 
            this.selected[0].name : `${this.selected[0].name}, ${this.selected[1].name}`;
    }
}