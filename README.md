# logManager

# Install Knex
npm install knex

# Install PostgreSQL client (for PostgreSQL)
npm install pg

Start your postgress service
sudo service postgresql start

Check it's status:
sudo service postgresql status


#### Login into postgress 
sudo -i -u postgres
psql

#### Create user and database for the project
CREATE USER log_manager WITH PASSWORD "log_manager";
CREATE DATABASE log_manager_db OWNER log_manager;
GRANT ALL PRIVILEGES ON DATABASE log_manager_db to log_manager;

#### Create Database structure
- Run migrations using command: npm run migrate 
- In order to rollback Use: npm run rollback
#### Seed Database data
- As there are dependecies between tables so seed the database using seeder file 
- First replace user_id with the actuall user ID in your user table 
- npx knex seed:run

