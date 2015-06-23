'use strict';
var path, pathname, queryObj, query = {};

var toUrlQuery =  UniUtils.get(window, 'Iron.Url.toQueryString') || function(queryObject){
        return '?'+jQuery.param(queryObject);
    };

query.keyDeps = {};

query.ensureKey = function (key) {
    var deps = this.keyDeps;
    if (!(key in deps)){
        deps[key] = new Tracker.Dependency;
    }
    deps[key].depend();
};
query.equalsQuery = function(key, value){
    return query.getQuery(key) === value;
};

query.getQuery = function (key, isNonReactive) {
    if(isNonReactive){
        return key ? queryObj[key]: queryObj;
    }
    if (key) {
        this.ensureKey(key);
        return path.queryObject[key];
    } else {
        if (!this.dep){
            this.dep = new Tracker.Dependency;
        }

        this.dep.depend();
        return path.queryObject;
    }
};

query.setQuery = function (key, val) {
    var oldVal = queryObj[key];
    if (String(val) === oldVal || !oldVal && !val){
        return;
    }


    if (typeof val !== 'undefined' && val !== null && val !== ''){
        queryObj[key] = String(val);
    }
    else {
        delete queryObj[key];
    }
    query.isfromLink = false;
    var dep = this.keyDeps[key];
    dep && dep.changed();

    this.dep && this.dep.changed();

    if (history && history.pushState) {
        history.pushState(null, null, toUrlQuery(queryObj));
    } else {
        location.search = toUrlQuery(queryObj);
    }
};

query.getRouteName = function(){
    this.dep.depend();
    return pathname;
};

UniUtils.url = query;
if(typeof Iron !== 'undefined' && Iron.Location){
    Tracker.autorun(function () {
        path = Iron.Location.get();
        query.isfromLink = true;
        if (pathname && path.pathname !== pathname) {
            var deps = query.keyDeps;
            for (var key in deps) {
                deps[key].changed();
            }
            query.dep && query.dep.changed();
        }

        pathname = path.pathname;
        queryObj = path.queryObject;
    });
} else{
    Tracker.autorun(function () {
        var locationParams = location.search.substr(1);
            locationParams = jQuery.deparam(locationParams);
        path = {
            pathname: UniUtils.get(Router.current(), 'route.name'),
            queryObject : locationParams
        };
        query.isfromLink = true;
        if (pathname && path.pathname !== pathname) {
            var deps = query.keyDeps;
            for (var key in deps) {
                if(_.has(deps, key)){
                    deps[key].changed();
                }
            }
            query.dep && query.dep.changed();
        }

        pathname = path.pathname;
        queryObj = path.queryObject;
    });
}


Template.registerHelper('getQuery', function (key) {
    return UniUtils.url.getQuery(key);
});

Template.registerHelper('equalsQuery', function (key, value) {
    return UniUtils.url.equalsQuery(key, value);
});