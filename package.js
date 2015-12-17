'use strict';

Package.describe({
    name: 'vazco:universe-reactive-queries',
    version: '1.0.1',
    summary: 'Reactive url query parameters (works with iron router)',
    git: 'https://github.com/vazco/meteor-universe-reactive-queries'
});

Package.onUse(function (api) {
    api.versionsFrom(['METEOR@1.0.4']);
    api.use(['universe-utilities@2.1.0', 'iron:router@1.0.9 || =0.9.4', 'underscore', 'tracker', 'templating'], 'client');
    api.addFiles(['deparam.js'], 'client');
    api.addFiles(['query.js'], 'client');
    api.export('UniUtils', 'client');
});
