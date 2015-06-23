'use strict';

Package.describe({
    name: 'vazco:universe-reactive-queries',
    version: '0.9.0',
    summary: 'Reactive url query parameters (works with iron router)'
});

Package.onUse(function (api) {
    api.versionsFrom(['METEOR@1.0.4']);
    api.use(['vazco:universe-utilities', 'iron:router@1.0.9 || =0.9.4', 'underscore', 'tracker', 'templating'], 'client');
    api.addFiles(['deparam.js'], 'client');
    api.addFiles(['query.js'], 'client');

});