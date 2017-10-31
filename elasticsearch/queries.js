const { client } = require('./');

// can use promises instead of callbacks

const addDocumentsinBulk = (index, type, body) => client.bulk({ index, type, body });

 // client.index({
 //     index: 'blog',
 //     id: '1',
 //     type: 'posts',
 //     body: {
 //         "PostName": "Integrating Elasticsearch Into Your Node.js Application",
 //         "PostType": "Tutorial",
 //         "PostBody": "This is the text of our tutorial about using Elasticsearch in your Node.js application.",
 //     }
 // }, function(err, resp, status) {
 //     console.log(resp);
 // });


module.exports = {
  addDocumentsinBulk
};
