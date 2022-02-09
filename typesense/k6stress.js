import http from 'k6/http';
import { check } from 'k6';
import { Faker } from "k6/x/faker"
import { Trend } from 'k6/metrics';

const hitTrend = new Trend('hits');

let f = new Faker();


export default function () {
    const url = `http://localhost:8108/collections/studies/documents/search?q=${f.name().replace(' ', '%20')}&query_by=studyDescription,name&sort_by=date:desc`;

    const params = {
        headers: {
            'Content-Type': 'application/json',
            "X-TYPESENSE-API-KEY": "Hu52dwsas2AdxdE"
        },
    };

    const res = http.get(url, params);
    check(res, {'is status 200': (r) => r.status === 200});
    hitTrend.add(JSON.parse(res.body).found);
}


// go install go.k6.io/xk6/cmd/xk6@latest
// ~/go/bin/xk6  build v0.35.0 --with github.com/szkiba/xk6-faker
// ./k6 run --vus 15 --duration 30s k6stress.js 


// running (0m30.0s), 00/15 VUs, 57290 complete and 0 interrupted iterations
// default ✓ [======================================] 15 VUs  30s

//      ✓ is status 200

//      checks.........................: 100.00% ✓ 57290       ✗ 0    
//      data_received..................: 244 MB  8.1 MB/s
//      data_sent......................: 15 MB   484 kB/s
//      hits...........................: avg=6857.815483 min=200    med=6400   max=53000   p(90)=8200    p(95)=8800   
//      http_req_blocked...............: avg=2.53µs      min=1.2µs  med=2.2µs  max=678.1µs p(90)=3µs     p(95)=3.4µs  
//      http_req_connecting............: avg=16ns        min=0s     med=0s     max=114.6µs p(90)=0s      p(95)=0s     
//      http_req_duration..............: avg=7.34ms      min=2.26ms med=6.68ms max=50.88ms p(90)=10.96ms p(95)=12.88ms
//        { expected_response:true }...: avg=7.34ms      min=2.26ms med=6.68ms max=50.88ms p(90)=10.96ms p(95)=12.88ms
//      http_req_failed................: 0.00%   ✓ 0           ✗ 57290
//      http_req_receiving.............: avg=48.25µs     min=12.2µs med=31.7µs max=9.25ms  p(90)=61.6µs  p(95)=73µs   
//      http_req_sending...............: avg=17.28µs     min=5.7µs  med=9.7µs  max=10.4ms  p(90)=14.4µs  p(95)=23.9µs 
//      http_req_tls_handshaking.......: avg=0s          min=0s     med=0s     max=0s      p(90)=0s      p(95)=0s     
//      http_req_waiting...............: avg=7.28ms      min=2.22ms med=6.62ms max=50.83ms p(90)=10.87ms p(95)=12.77ms
//      http_reqs......................: 57290   1908.976941/s
//      iteration_duration.............: avg=7.84ms      min=2.74ms med=7.16ms max=51.54ms p(90)=11.57ms p(95)=13.55ms
//      iterations.....................: 57290   1908.976941/s
//      vus............................: 15      min=15        max=15 
//      vus_max........................: 15      min=15        max=15 