module.exports = {
    angular: {
        files: [
            {expand: true, src: "**", cwd: 'bower_components/bootstrap/fonts',         dest: "angular/fonts"},
            {expand: true, src: "**", cwd: 'bower_components/font-awesome/fonts',      dest: "angular/fonts"},
            {expand: true, src: "**", cwd: 'bower_components/Simple-Line-Icons/fonts', dest: "angular/fonts"},
            {expand: true, src: "**", cwd: 'src/fonts',   dest: "angular/fonts"},
            {expand: true, src: "**", cwd: 'src/data',     dest: "angular/data"},
            {expand: true, src: "**", cwd: 'src/l10n',    dest: "angular/l10n"},
            {expand: true, src: "**", cwd: 'src/img',     dest: "angular/img"},
            {expand: true, src: "**", cwd: 'src/js',      dest: "angular/js"},
            {expand: true, src: "**", cwd: 'src/tpl',     dest: "angular/tpl"},
            {expand: true, src: "**", cwd: 'src/conf',     dest: "angular/"},
            {expand: true, src: 'ui-grid.eot', cwd:'bower_components/angular-ui-grid/', dest : 'angular/css/',flatten: true},
            {expand: true, src: 'ui-grid.svg', cwd:'bower_components/angular-ui-grid/', dest : 'angular/css/'},
            {expand: true, src: 'ui-grid.ttf', cwd:'bower_components/angular-ui-grid/', dest : 'angular/css/'},
            {expand: true, src: 'ui-grid.woff',cwd:'bower_components/angular-ui-grid/', dest : 'angular/css/'},
            {expand: true, src: ['bower_components/**/*.js','bower_components/**/*.css','bower_components/**/*.map'], dest:'angular/'},
            {src: 'src/index.min.html', dest : 'angular/index.html'},
            {src: 'src/favicon.ico', dest : 'angular/favicon.ico'},
            {src: 'src/robot.txt', dest : 'angular/robot.txt'},
            {expand: true, src: "toastr.min.css", cwd: 'bower_components/toastr/',     dest: "angular/css"},
            {src: 'src/config.json', dest : 'angular/config.json'}
        ]
    },
    html: {
        files: [
            {expand: true, src: "**", cwd: 'bower_components/bootstrap/fonts',         dest: "html/fonts"},
            {expand: true, src: "**", cwd: 'bower_components/font-awesome/fonts',      dest: "html/fonts"},
            {expand: true, src: "**", cwd: 'bower_components/Simple-Line-Icons/fonts', dest: "html/fonts"},
            {expand: true, src: '**', cwd:'src/fonts/', dest: 'html/fonts/'},
            {expand: true, src: "**", cwd: 'src/api',     dest: "html/api"},
            {expand: true, src: '**', cwd:'src/img/', dest: 'html/img/'},
            {expand: true, src: '*.css', cwd:'src/css/', dest: 'html/css/'},
            {expand: true, src: '**', cwd:'swig/js/', dest: 'html/js/'}
        ]
    },
    landing: {
        files: [
            {expand: true, src: "**", cwd: 'bower_components/bootstrap/fonts',         dest: "landing/fonts"},
            {expand: true, src: "**", cwd: 'bower_components/font-awesome/fonts',      dest: "landing/fonts"},
            {expand: true, src: "**", cwd: 'bower_components/Simple-Line-Icons/fonts', dest: "landing/fonts"},
            {expand: true, src:'**', cwd:'src/fonts/', dest: 'landing/fonts/'},
            {expand: true, src:'*.css', cwd:'src/css/', dest: 'landing/css/'},
            {src:'html/css/app.min.css', dest: 'landing/css/app.min.css'}
        ]
    }

};
