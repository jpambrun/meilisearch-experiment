import http from 'k6/http';
import { check } from 'k6';
import { Faker } from "k6/x/faker"
import { Trend } from 'k6/metrics';

const hitTrend = new Trend('hits');

let f = new Faker();


export default function () {
    const url = 'http://127.0.0.1:7700/indexes/studies/search';
    const payload = JSON.stringify({
        q: f.name(),
        filter: 'modality = xa AND date > 1536316958816',
        sort: ["name:asc", "date:desc"],
        // matches: true,
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);
    check(res, {'is status 200': (r) => r.status === 200});
    hitTrend.add(JSON.parse(res.body).nbHits);
}


// go install go.k6.io/xk6/cmd/xk6@latest
// ~/go/bin/xk6  build v0.35.0 --with github.com/szkiba/xk6-faker
// ./k6 run --vus 14 --duration 30s k6stress.js 