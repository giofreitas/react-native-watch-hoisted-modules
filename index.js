const path = require("path");
const fs = require("fs");
const glob = require("glob");

module.exports = function(dirname, config = {}){

  const reactNativePackageJson = require(path.resolve(dirname, "package.json"));
  const maxNumberOfAncestors = dirname.split(path.sep).length-1;
  let workspacePackageJson;
  // we need to keep the number of ancestors. it will be used later on.
  let ancestors = "../";
  for(let i = 0; i < maxNumberOfAncestors; ancestors += "../", i++){
    const filePath = path.resolve(dirname, ancestors, "package.json");
    // continue to parent folder if package.json don't exists in current folder
    if (!fs.existsSync(filePath))
      continue;
    const content = require(filePath);
    // continue to parent folder if package.json does not have workspaces entry
    if(!content.workspaces)
      continue;
    workspacePackageJson = content;
    break;
  }
  // bail if we didnt find any package with workspace configuration
  if(!workspacePackageJson)
    return config;
  // lets start looking on each workspace folder
  const extraNodeModules = {};
  workspacePackageJson.workspaces.forEach(workspace => {
    const packages = path.resolve(dirname, ancestors, workspace);
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
          dirname,
          `${ancestors}node_modules/${dependency}`
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
  config.resolver = config.resolver || {};
  config.resolver.extraNodeModules = { ...(config.resolver.extraNodeModules || {}), ...extraNodeModules};
  // append watch folders
  config.watchFolders = [...(config.watchFolders || []), ...Object.values(extraNodeModules)];
  return config;
}
