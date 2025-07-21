const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            'components': path.resolve(__dirname, 'src/components'),
            'common': path.resolve(__dirname, 'src/common'),
            'store': path.resolve(__dirname, 'src/redux'),
            'api': path.resolve(__dirname, 'src/api'),
            'config': path.resolve(__dirname, 'src/config'),
            'constants': path.resolve(__dirname, 'src/constants'),
            'hooks': path.resolve(__dirname, 'src/hooks'),
            'pages': path.resolve(__dirname, 'src/pages'),
        }
    }
};