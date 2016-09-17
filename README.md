# fullstack-boilerplate
Boilerplate for developing with and express backend and webpack bundler with gulp for the frontend.

# Installation
<ul>
    <li>Clone/Download/Fork this repository</li>
    <li>npm install</li>
    <li>npm start</li>
</ul>

# Basic Usage
Run `npm start` to start the express server then `gulp` to start file watching and browserSync.

# Gulp Tasks
<ul>
    <li>gulp bundle: Bundles the javascript in web/src directory and outputs it into build/src.</li>
    <li>gulp style: Compiles the scss from web/scss to build/css.</li>
    <li>gulp images: Runs imagemin on the images in web/images and outputs them to build.</li>
    <li>gulp html: Outputs the html from web/pages to build.</li>
    <li>gulp watch: Start up browserSync and synchronizes the scss, html, js and images.</li>
    <li>gulp build: Performs all build tasks: bundle, style, images and html.</li>
    <li>gulp as-prod: Sets the gulp environment to production. Using this before gulp build will cause a production build. This will minify js and css.</li>
    <li>gulp production: Performs all build tasks in production mode. Equivalent to gulp as-prod build.</li>
    <li>gulp build-if-dev: Will run a build, used specifically to avoid building in a production environment (NODE_ENV=production).</li>
</ul>