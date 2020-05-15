const path = require("path")

test("react native on root folder, libraries on packages folder", () => {
  expect(require("./test-1/react-native-app/metro.config")).toMatchObject({
    resolver: {
      extraNodeModules: {
        '@doodles/common': path.resolve(__dirname, 'test-1/packages/common'),
        axios: path.resolve(__dirname, 'test-1/node_modules/axios'),
        inversify: path.resolve(__dirname, 'test-1/node_modules/inversify')
      }
    },
    watchFolders: [
      path.resolve(__dirname, 'test-1/packages/common')
    ]
  })
});
test("react native and libraries on packages folder", () => {
  expect(require("./test-2/packages/react-native-app/metro.config")).toMatchObject({
    resolver: {
      extraNodeModules: {
        '@doodles/common': path.resolve(__dirname, 'test-2/packages/common'),
        axios: path.resolve(__dirname, 'test-2/node_modules/axios'),
        inversify: path.resolve(__dirname, 'test-2/node_modules/inversify')
      }
    },
    watchFolders: [
      path.resolve(__dirname, 'test-2/packages/common')
    ]
  })
})
test("react native and libraries on root folder", () => {
  expect(require("./test-3/react-native-app/metro.config")).toMatchObject({
    resolver: {
      extraNodeModules: {
        '@doodles/common': path.resolve(__dirname, 'test-3/common'),
        axios: path.resolve(__dirname, 'test-3/node_modules/axios'),
        inversify: path.resolve(__dirname, 'test-3/node_modules/inversify')
      }
    },
    watchFolders: [
      path.resolve(__dirname, 'test-3/common')
    ]
  })
})
