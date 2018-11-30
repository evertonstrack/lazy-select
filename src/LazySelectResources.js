'use strict'

class LazySelectResources {

    constructor() {

        this.SELECT = getLocalizedResource(Resources.GenericTerms.Select);
        this.SEARCH = getLocalizedResource(Resources.GenericTerms.Search);
        this.FILTER = getLocalizedResource(Resources.GenericTerms.Filter);        
        this.ALL = getLocalizedResource(Resources.GenericTerms.All);
        this.NONE = getLocalizedResource(Resources.GenericTerms.None);
    }
}