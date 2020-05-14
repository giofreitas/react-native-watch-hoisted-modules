
test("metro.config", () => {
  expect(require("./tests/react-native-app/metro.config")).toMatchObject({
    resolver: {
      extraNodeModules: {
        '@doodles/common': 'E:\\Projects\\react-native-watch-hoisted-modules\\tests\\packages\\common',
        axios: 'E:\\Projects\\react-native-watch-hoisted-modules\\tests\\node_modules\\axios',
        inversify: 'E:\\Projects\\react-native-watch-hoisted-modules\\tests\\node_modules\\inversify'
      }
    },
    watchFolders: [
      'E:\\Projects\\react-native-watch-hoisted-modules\\tests\\packages\\common',
      'E:\\Projects\\react-native-watch-hoisted-modules\\tests\\node_modules\\axios',
      'E:\\Projects\\react-native-watch-hoisted-modules\\tests\\node_modules\\inversify'
    ]
  })
})
