'use strict';

var pkg = require('./package.json');

module.exports = function (processor) {
    processor.registerBlockType('appscript', function (content, block, blockLine) {
        var production =  '<script type="text/javascript" src="static/js/app-v' + pkg.version + '.min.js" async></script>';
        return content.replace(blockLine, production);
    });

    processor.registerBlockType('appstyle', function (content, block, blockLine) {
        var production = '<link rel="stylesheet" href="static/css/app-v' + pkg.version + '.min.css">';
        return content.replace(blockLine, production);
    });
};
