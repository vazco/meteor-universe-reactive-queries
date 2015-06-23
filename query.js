'use strict';
var path, pathname, serializations = {}, queryObj, query = {};

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

query.setSerializationForQueryKey = function(key, serializeToQueryValue, unserializeFromQueryValue){
    if(!_.isFunction(serializeToQueryValue) || !_.isFunction(unserializeFromQueryValue)){
        throw Error('serializeToQueryValue and unserializeFromQueryValue should be functions');
    }

    serializations[key] = {
        serialize: serializeToQueryValue,
        unserialize: unserializeFromQueryValue
    };
};

query.equalsQuery = function(key, value){
    return query.getQuery(key) === value;
};

query.getQuery = function (key, isNonReactive) {
    var value, unserialize;
    if(key){
        unserialize = UniUtils.get(serializations, key+'.unserialize');
    } else {
        unserialize = function(values){
            return _.map(values, function(v, k){
                var fn = UniUtils.get(serializations, k+'.unserialize');
                return _.isFunction(fn)? fn(v): v;
            });
        };
    }
    if(isNonReactive){
        value = key ? queryObj[key]: queryObj;
        return unserialize ? unserialize(value) : value;
    }

    if (key) {
        this.ensureKey(key);
        value = path.queryObject[key];
        return unserialize ? unserialize(value) : value;
    } else {
        if (!this.dep){
            this.dep = new Tracker.Dependency;
        }

        this.dep.depend();
        return path.queryObject;
    }
};

query.setQuery = function (key, val) {
    var serialize = UniUtils.get(serializations, key+'.serialize');
    val = _.isFunction(serialize)? serialize(val) : val;
    var oldVal = queryObj[key];
    if (String(val) === oldVal || !oldVal && !val){
        return;
    }

    if (typeof val !== 'undefined' && val !== null && val !== ''){
        queryObj[key] = String(val);
    } else {
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