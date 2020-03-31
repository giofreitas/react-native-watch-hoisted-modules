const path = require("path");
const fs = require("fs");
const glob = require("glob");

module.exports = function(dirname, config = {}){

    const reactNativePackageJson = require(path.resolve(dirname, "package.json"));
    const workspacePackageJson = require(path.resolve(dirname, "../../package.json"));
    const extraNodeModules = {};

    workspacePackageJson.workspaces.forEach(workspace => {
        const packages = path.resolve(dirname, "../../", workspace);
        const directories = glob.sync(packages, {});

        directories.forEach(directory => {
            directory = path.resolve(directory);
            // check if the directory is not the react native package
            if (directory === dirname) {
                return;
            }
            // check if the directory exists
            if (!fs.existsSync(directory) || !fs.lstatSync(directory).isDirectory()) {
                return;
            }

            // check if the json file exists
            const packageJsonFile = path.resolve(directory, "package.json");
            if (
                !fs.existsSync(packageJsonFile) ||
                !fs.lstatSync(packageJsonFile).isFile()
            ) {
                return;
            }
            const packageJson = require(packageJsonFile);
            // bail if react native package does not depend on this dependency
            if (!reactNativePackageJson.dependencies.hasOwnProperty(packageJson.name))
                return;
            extraNodeModules[packageJson.name] = directory;
            // bail if this package does not have dependencies
            if (!packageJson.dependencies) {
                return;
            }

            for (let dependency in packageJson.dependencies) {
                const dependencyPath = path.resolve(
                    directory,
                    `node_modules/${dependency}`
                );
                // bail if the dependency already exists in the current package node_module folder
                if (fs.existsSync(dependencyPath)) {
                    continue;
                }
                const hoistedDependencyPath = path.resolve(
                    __dirname,
                    `../../node_modules/${dependency}`
                );
                //
                if (fs.existsSync(hoistedDependencyPath))
                    extraNodeModules[dependency] = hoistedDependencyPath;
            }
        });
    });
    // clone config
    config = {...config}
    // add extra node modules
    config.resolve = config.resolve || {};
    config.resolve.extraNodeModules = { ...(config.resolve.extraNodeModules || {}), ...extraNodeModules};
    // append watch folders
    config.watchFolders = [...(config.watchFolders || []), ...Object.values(extraNodeModules)];
    return config;
}