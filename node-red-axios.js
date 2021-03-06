const { default: axios } = require('axios');

module.exports = function (RED) {
  function LowerCaseNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.on('input', function (msg) {
      if (msg.options && msg.options.url && msg.options.method) {
        let url = msg.options.url;
        if (msg.options.params) {
          let p = new URLSearchParams({ ...msg.options.params }).toString();
          url = `${url}?${p}`;
        }
        msg.startTime = new Date();
        axios({
          method: msg.options.method,
          url: (msg.options.decode) ? decodeURI(url) : url,
          headers: msg.options.headers ? msg.options.headers : null,
          data: msg.options.data ? msg.options.data : null,
          auth: msg.options.auth ? msg.options.auth : null,
          proxy: msg.options.proxy ? msg.options.proxy : null
        }).then(res => {
          msg.payload = res.data;
          msg.response = res;
          msg.finishTime = new Date();
          node.send(msg);
        }).catch(err => {
          node.error(`fetching data failed: ${err.message}`);
          msg.error = err;
          msg.finishTime = new Date();
          node.send(msg);
        })
      } else {
        node.error('Node Options is not set !!');
      }
    });
  }
  RED.nodes.registerType("node-red-axios", LowerCaseNode);
}