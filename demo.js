const PlexAPI = require('plex-api');
const inquirer = require('inquirer');
const { PlexSearch } = require('./lib');

inquirer.prompt([
    {
        type: 'input',
        name: 'hostname',
        message: 'What is your Plex hostname/IP address?',
    },
    {
        type: 'input',
        name: 'username',
        message: 'What is your Plex username?',
    },
    {
        type: 'password',
        message: 'What is your Plex password',
        name: 'password',
        mask: '*',
    },
])
    .then(({ hostname, username, password }) => {

        const client = new PlexAPI({
            hostname, username, password
        });
        const searchClient = new PlexSearch(client);

        function prompt() {

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'query',
                    message: 'What is your query? (q to cancel)',
                },
            ])
                .then(({ query }) => {
                    if (query === "q") return process.exit(0);
                    searchClient.search(query)
                        .then(result => console.log("Results: ", JSON.stringify(result, null, 2)))
                        .catch(error => console.error(error))
                        .then(() => prompt())
                        ;
                });
        }
        prompt();

    });