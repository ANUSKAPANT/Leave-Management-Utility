const { environment } = require('@rails/webpacker')
environment.loaders.append('typescript', {
  test: /.(ts|tsx)$/,
  loader: 'ts-loader'
});
module.exports = environment
const nodeModulesLoader = environment.loaders.get('nodeModules');
if (!Array.isArray(nodeModulesLoader.exclude)) {
  nodeModulesLoader.exclude = nodeModulesLoader.exclude == null ? [] : [nodeModulesLoader.exclude];
}
nodeModulesLoader.exclude.push(/react-table/);
