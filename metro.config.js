/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  resolver: {
    extraNodeModules: {
      zlib: require.resolve('browserify-zlib'),
      console: require.resolve('console-browserify'),
      constants: require.resolve('constants-browserify'),
      crypto: require.resolve('react-native-crypto'),
      dns: require.resolve('dns.js'),
      net: require.resolve('react-native-tcp'),
      domain: require.resolve('domain-browser'),
      http: require.resolve('@tradle/react-native-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('react-native-os'),
      path: require.resolve('path-browserify'),
      querystring: require.resolve('querystring-es3'),
      fs: require.resolve('react-native-level-fs'),
      _stream_transform: require.resolve('readable-stream/transform'),
      _stream_readable: require.resolve('readable-stream/readable'),
      _stream_writable: require.resolve('readable-stream/writable'),
      _stream_duplex: require.resolve('readable-stream/duplex'),
      _stream_passthrough: require.resolve('readable-stream/passthrough'),
      dgram: require.resolve('react-native-udp'),
      stream: require.resolve('stream-browserify'),
      timers: require.resolve('timers-browserify'),
      tty: require.resolve('tty-browserify'),
      vm: require.resolve('vm-browserify'),
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
