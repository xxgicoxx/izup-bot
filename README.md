# Izup
Discord bot for check your servers every five minutes.

![Bot](http://i.imgur.com/zJZe8ka.png)

### Prerequisites
* [Node.js](https://nodejs.org/en/) - Node.js

### Running
The server can be run locally and also deployed to your own server.

### Discord
````
# Create an Discord application
Create an application on https://discordapp.com/developers/applications/

# Add a bot
Access bot option on settings menu and click on 'Add Bot' button

# Configure
Get your token clicking on 'Click to Reveal Token' and set TOKEN in 'configs/discord.js'
````

### PostgreSQL
````
# Install
Install PostgreSQL and create an database

# Configure
Set PostgreSQL username, password, database, host and dialect in 'configs/postgresql.js'
````

### Sequelize
````
# Install sequelize-cli
npm install -D sequelize-cli

# Install dependencies
npm install

# Create tables
npx sequelize db:migrate
````

### Run
````
# Install dependencies
npm install

# Start
npm start
````

### Built With
* [Node.js](https://nodejs.org/en/)

### Authors
* **Giovani de Oliveira** - [xxgicoxx](https://github.com/xxgicoxx)

### Acknowledgments
* [FlatIcon](https://www.flaticon.com/) - Icon