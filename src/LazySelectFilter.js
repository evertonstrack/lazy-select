'use strict'

class LazySelectFilter {

    constructor(controller) {

        this.controller = controller;
        this.timer;
    }

    apply(event) {
        
        if( this.timer ){ clearTimeout(this.timer); }
        if( this.controller.model.filter.query ==  event.currentTarget.value ) { return false; };

        let query =  event.currentTarget.value;

        if( !query ) {

            this.clear();
            this.controller.update();
        } else {

            this.controller.model.isFiltered = true;
            this.timer = setTimeout(() => this.filter(query), 250);
        }
    }

    clear() {

        this.controller.model.isFiltered = false;
        this.controller.model.filter.query = '';
        this.controller.model.filter.result = [];
        this.controller.model.filter.result_paged = [];
        this.controller.model.current_page = 0;
    }

    filter(query) {

        this.controller.model.filter.query = query;
        this.controller.model.current_page = 0;
        this.controller.model.filter.result = this.controller.model.full_list.filter(e => 
            e.name.toLowerCase().includes(this.controller.model.filter.query.toLowerCase())
        );
        this.controller.model.filter.result_paged = this.paginate(this.controller.model.filter.result, this.controller.pagination);
        this.controller.update(this.controller.model.filter.result_paged[0] || []);
    }

    paginate(array, size) {

        return array.map((e,i) => {
                        return (i % size === 0) ? array.slice(i, i + size) : null
                    })
                    .filter(e => e);
    }
}