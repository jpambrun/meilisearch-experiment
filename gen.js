const faker = require('faker');
const { MeiliSearch } = require('meilisearch');




(async () => {
    const client = new MeiliSearch({
        host: 'http://127.0.0.1:7700',
        apiKey: 'masterKey',
    })


    // const movies = client.index('movies')
    // const documents = [
    //     { id: 1, title: 'Carol', genres: ['Romance', 'Drama'] },
    //     { id: 2, title: 'Wonder Woman', genres: ['Action', 'Adventure'] },
    //     { id: 3, title: 'Life of Pi', genres: ['Adventure', 'Drama'] },
    //     { id: 4, title: 'Mad Max: Fury Road', genres: ['Adventure', 'Science Fiction'] },
    //     { id: 5, title: 'Moana', genres: ['Fantasy', 'Action']},
    //     { id: 6, title: 'Philadelphia', genres: ['Drama'] },
    // ]
    // let moviesresponse = await movies.addDocuments(documents)
    // return

    const index = client.index('studies')
    index.updateSettings({
        searchableAttributes: [
            'id',
            'studyDescription',
            'name',
            'mrn',
            'accessionNumber',
            'patientId',
            'org',
        ],
        filterableAttributes: [
            'sex',
            'modality',
            'dob',
            'date',
        ],
        sortableAttributes: [
            'date',
            'name',
        ]
    })


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

        for (let i = 0; i < 1000; i++) {
            const patient = patients[(b * 1000 + i) % patients.length];

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
        let response = await index.addDocuments(exams)
        await client.waitForTask(response.uid, { timeOutMs: 60000, intervalMs: 100 })
        console.log(Date.now() - start)
        // console.log(response)
    }

})()

//