const { default: axios } = require('axios');

module.exports = function (RED) {
  function LowerCaseNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.on('input', function (msg) {
      if (msg.options && msg.options.url && msg.options.method) {
        axios({
          method: msg.options.method,
          url: msg.options.url,
          headers: msg.options.headers ? msg.options.headers : null,
          params: msg.options.params ? msg.options.params : null,
          data: msg.options.data ? msg.options.data : null,
          auth: msg.options.auth ? msg.options.auth : null,
          proxy: msg.options.proxy ? msg.options.proxy : null
        }).then(res => {
          msg.payload = res.data;
          node.send(msg);
        }).catch(err => {
          node.error(`fetching data failed: ${err.message}`);
        })
      } else {
        node.error('Node Options is not set !!');
      }
    });
  }
  RED.nodes.registerType("node-red-axios", LowerCaseNode);
}