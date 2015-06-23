# universe reactive queries
simple package to add and take query parameters from urls with Meteor. 
It works with iron router 1.0.X but also should works with 0.9.4

## Installation
```sh
$ meteor add vazco:universe-reactive-queries
```

## API
`UniUtils.url` works exactly as a session but their values are stored in the url queries and depend.

#### UniUtils.url.setQuery (key, value)
add or change the value of a key in the path ( without redirection )

#### UniUtils.url.getQuery (key, isNonReactive)
gets the value of a key in the current path, if not sends `key` return an object with all the query keys
it's reactive method as a default but you can turn off reactivity using isNonReactive parameter.

#### UniUtils.url.equalsQuery (key, value)
checks if value under key is equal passed value

#### UniUtils.url.setSerializationForQueryKey(key, serializeFn, unserializeFn);
sets the way to serialize value for given key to url query parameter and how read it back.

## UI Helpers
helpers available in the template

#### {{ getQuery key }}
gets the value of a key

#### {{ equalsQuery key }}
checks if value under key is equal passed value

### License MIT
