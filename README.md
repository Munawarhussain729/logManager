# logManager

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
