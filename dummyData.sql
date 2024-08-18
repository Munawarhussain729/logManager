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


