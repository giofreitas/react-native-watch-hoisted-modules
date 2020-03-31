As everybody knows, react native and links are not friends. But this library is friends with both.

This library is a simple function that will generate the right configurations for `metro.config.js`.
in order to give to react native a reason to like links in a yarn workspaces world.

I came across with a problem where my

__Install__

```
npm install --save-dev react-native-watch-hoisted-modules
```
or
```
yarn add -D react-native-watch-hoisted-modules
```
__Motivation__

So, my RN project cannot find my linked package `@doodles/common` when I try to import them. Ok, no problem, we just need 
to go `metro.config.js` and add the following configurations to the exporting object:
```
module.exports = {
    ...
    resolver: {
        extraNodeModules: {
            "@doodles/common": path.resolve(__dirname + '/../../common/')
        }
    },
    watchFolders: [
        path.resolve(__dirname + '/../../common/')
    ]
}
```
Cool... wait, still not cool. `@doodles/common` uses `lodash` and due to workspaces this dependency was hoisted to the 
root `node_modules` and because of that my RN project says `@doodles/common` can not find `lodash`. Ok, no problem again,
just add it to `metro.config.js` like we did with `@doodles/common`:
```
module.exports = {
    ...
    resolver: {
        extraNodeModules: {
            "@doodles/common": path.resolve(__dirname + '/../../common/'),
            "lodash": path.resolve(__dirname + '/../../node_modules/lodash/')
        }
    },
    watchFolders: [
        path.resolve(__dirname + '/../../common/'),
        path.resolve(__dirname + '/../../node_modules/lodash/')
    ]
}
```
So its easy, every time our RN project links to a new package or a new dependency is added to a linked package we just need
to edit `metro.config.js`.

No! its not easy. its a pain in the ass!!!

What this function does it simply looks for all linked packages and their dependencies and build the configurations for us.
We just need to wrap the current configurations with this function:
```
const watchHoistedModules = require("react-native-watch-hoisted-modules");
module.exports = watchHoistedModules({
    ...
})
```
Now. that's easy!
___
I don't know if this is a good approach but let's face it, React Native and links are not a good approach at the first place.

This works for my project so I will stick with this hack.

Also, this function assumes we're using the conventional directory structure for yarn workspaces, that is, it will look 
for a `package.json` two levels above the RN project folder to get workspaces configuration.
