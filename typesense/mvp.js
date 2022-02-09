const bent = require('bent')
const doPostJson = bent('http://localhost:8108/', 'POST', 'json', [200, 201, 409], {"X-TYPESENSE-API-KEY": "Hu52dwsas2AdxdE" });
const doPostText = bent('http://localhost:8108/', 'POST', 'string', [200, 201, 409], {"X-TYPESENSE-API-KEY": "Hu52dwsas2AdxdE" });
const doDelete = bent('http://localhost:8108/', 'DELETE', [200], {"X-TYPESENSE-API-KEY": "Hu52dwsas2AdxdE" });

(async () => {
    await doDelete('collections/studies').catch(()=>{})
    await doPostJson('collections',{
        "name": "studies",
        "fields": [
          {"name": "studyDescription", "type": "string" },
          {"name": "name", "type": "string" },
          {"name": "mrn", "type": "string" },
          {"name": "accessionNumber", "type": "string" },
          {"name": "patientId", "type": "string" },
          {"name": "org", "type": "string", "facet": true  },
          {"name": "sex", "type": "string", "facet": true  },
          {"name": "modality", "type": "string", "facet": true  },
          {"name": "dob", "type": "int32" },
          {"name": "date", "type": "int64"}
        ],
        "default_sorting_field": "date"
      }).then(console.log)


    const docs = [{
        id: "1",
        date: Date.now(),
        modality: 'XR',
        studyDescription:"fake desc 1",
        name: "a name",
        dob: 20200802,
        sex: 'M',
        mrn: "somemrn12",
        accessionNumber: 'some accession nu',
        patientId: "asdfsafd123123",
        org: "ordas"
    },{
        id: "2",
        date: Date.now(),
        modality: 'XR',
        studyDescription:"fake desc dsafsa",
        name: "a nameas ",
        dob: 20200802,
        sex: 'M',
        mrn: "somemrn12",
        accessionNumber: 'some accession nu',
        patientId: "asdfsafd123123",
        org: "ordas"
    }]

    const ret = await doPostText('collections/studies/documents/import?action=create', docs.map(d => JSON.stringify(d)).join('\n') )
    console.log(ret.split('\n').map(r=>JSON.parse(r)).every(r=>r.success))
})();


