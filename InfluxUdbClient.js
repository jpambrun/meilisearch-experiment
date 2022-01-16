const dgram = require('dgram');
const stream = require('stream');

class InfluxUdbClient {
    constructor(params = {address: '127.0.0.1',port: 9009,}) {
        const socket = dgram.createSocket('udp4');
        return new stream.Writable({
            final:()=>{ socket.close()},
            destroy:()=>{ socket.close()},
            write(data, encoding, done) {
                socket.send(data, 0, data.length, params.port, params.address, done);
            }
        });
    }
};

exports.InfluxUdbClient = InfluxUdbClient;

// const influxStream = new InfluxUdbClient();
// influxStream.write(`trades,name=test_ilp1 value=15.4 ${Date.now() * 1e6}\n`, undefined, ()=>{console.log('done')})
// influxStream.write(`trades,name=test_ilp1 value=16.4 ${Date.now() * 1e6}\n`, undefined, ()=>{console.log('done')})
// influxStream.end('\n')
