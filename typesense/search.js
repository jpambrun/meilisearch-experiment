const bent = require('bent')
const doPostJson = bent('http://localhost:8108/', 'POST', 'json', [200, 201, 409], {"X-TYPESENSE-API-KEY": "Hu52dwsas2AdxdE" });
const doPostText = bent('http://localhost:8108/', 'POST', 'string', [200, 201, 409], {"X-TYPESENSE-API-KEY": "Hu52dwsas2AdxdE" });
const doDelete = bent('http://localhost:8108/', 'DELETE', [200], {"X-TYPESENSE-API-KEY": "Hu52dwsas2AdxdE" });


const doGet = bent('http://localhost:8108/', 'GET', 'json', [200, 201, 409], {"X-TYPESENSE-API-KEY": "Hu52dwsas2AdxdE" });


(async () => {
    doGet('collections/studies').then(console.log)
    const start = Date.now()
    const ret = await doGet('collections/studies/documents/search?q=synergery&query_by=studyDescription&filter_by=modality:xa&sort_by=date:desc')
    const end = Date.now()
    return console.log(JSON.stringify(ret))
    console.log(ret.found)
    console.log(ret.hits.map(h=>h.document))
    console.log('elapsed', end - start)
})();




