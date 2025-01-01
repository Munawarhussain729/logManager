INSERT INTO users (name, email, role, password)
VALUES ("ahmed", "ahmed@gmail.com",)


INSERT INTO user_roles (title)
VALUES 
('Project Manager'),
('Frontend Developer'),
('Backend Developer'),
('Software Engineer');


ALTER TABLE users 
ALTER COLUMN role TYPE INTEGER USING role::inetger;

INSERT INTO users (id,name, email, role, password)
VALUES 
(gen_random_uuid(),'ahmed','ahmed@gmail.com',1,'ahmedPassword'),
(gen_random_uuid(),'daniyal','daniyal@gmail.com',2,'daniyalPassword'),
(gen_random_uuid(),'amer','amer@gmail.com',3,'amerPassword'),
(gen_random_uuid(),'rizwan','rizwan@gmail.com',4,'rizwanPassword');


INSERT INTO projects (name, client_name, project_manager_id)
VALUES
('Web rentify','Aleem',2),
('Automate', 'jack',3);

INSERT INTO user_projects(user_id, project_id)
VALUES 
(3,2),
(2,1);

INSERT INTO logs(message, blocker, user_role, duration, tomorrow_plan, project_id, user_id)
VALUES
('integrate add vheicle api', 'backend needs to update api according to requirement', 2,3, 'Will start working on inspect screen', 2,3),
('Update the ticketing', 'No blocker.', 3,5, 'will be working on urgent tickets',1,2);
