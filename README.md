# SourceOutlet

Web app which counts how many users came into website from various sources

## Getting started

### Prerequisites 

You will need node and npm installed in your machine. When you have one, install all dependencies with command `npm install`

Create _config.NODE_ENV.js_ based on [config.js](/config.js)

Set NODE_ENV environment variable

MySql database is used to store data. Set-up one and use [sql script](/db_dump/source-outlet.sql) to to migrate database

## Hosting with `systemctl`

There is good 
[StackOverflow answer](https://stackoverflow.com/questions/4681067/how-do-i-run-a-node-js-application-as-its-own-process/28542093#28542093) with all steps to host your node app

## Customization

Edit sources table to show custom style sources