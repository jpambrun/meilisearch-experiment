const faker = require('faker');
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
          {"name": "name", "type": "string", "sort": true },
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


    const orgIds = [];
    for (let i = 0; i < 100; i++) {
        orgIds.push(faker.helpers.replaceSymbols('??????#####'))
    }

    const patients = []
    for (let i = 0; i < 100000; i++) {
        const patient = {
            name: `${faker.name.lastName()}, ${faker.name.firstName()}`,
            dob: faker.date.past(100).getTime(),
            sex: faker.helpers.randomize(['M', 'F']),
            mrn: faker.helpers.replaceSymbols('???###'),
            accessionNumber: faker.helpers.replaceSymbols('?#####'),
            id: faker.helpers.replaceSymbols('#######'),
            inOrgs: [
                faker.helpers.randomize(orgIds),
                faker.helpers.randomize(orgIds),
                faker.helpers.randomize(orgIds)
            ]
        }

        patients.push(patient);
    }

    const exams = [];
    for (let b = 0; b < 20000; b++) {
        const BATCH_SIZE = 1000;

        for (let i = 0; i < BATCH_SIZE; i++) {
            const patient = patients[(b * BATCH_SIZE + i) % patients.length];

            const exam = {
                id: faker.helpers.replaceSymbols('??????#####'),
                date: faker.date.past(10).getTime(),
                modality: faker.helpers.randomize(['CT', 'MR', 'US', 'XA', 'MG', 'XR']),
                studyDescription: faker.company.catchPhrase(),
                name: patient.name,
                dob: patient.dob,
                sex: patient.sex,
                mrn: patient.mrn,
                accessionNumber: patient.accessionNumber,
                patientId: patient.id,
                org: patient.inOrgs[i % patient.inOrgs.length]
            }
            exams.push(exam)
        }
        const start = Date.now()
        const ret = await doPostText('collections/studies/documents/import?action=create', exams.map(d => JSON.stringify(d)).join('\n'));
        // console.log(ret)
        const statuses = ret.split('\n').map(r=>JSON.parse(r))
        const failures = statuses.filter(r => !r?.success)
        if(failures.length > 0 ){
            console.log(failures.length, failures[0])
        }
        exams.length = 0
        console.log(b*BATCH_SIZE, Date.now() - start)
        // console.log(response)
    }

})()

//