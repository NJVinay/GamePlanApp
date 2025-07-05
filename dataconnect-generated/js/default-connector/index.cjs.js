const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'GamePlanApp-main',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

