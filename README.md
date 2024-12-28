# logManager

Start your postgress service
sudo service postgresql start

Check it's status:
sudo service postgresql status

#### Login into postgress 
sudo -i -u postgres
psql

#### Create user and database for the project
CREATE USER log_manager WITH PASSWORD "log_manager"