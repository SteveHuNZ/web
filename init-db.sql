
drop table if exists lab_15_users;
select * from lab_15_users;

create table if not exists lab_15_users (
                                            id int not null auto_increment,
                                            username varchar(64) not null,
                                            password varchar(64) not null,

                                            name varchar(64),
                                            primary key (id)

);


ALTER TABLE lab_15_users
    ADD COLUMN description TEXT,
    ADD COLUMN birthday DATE;



INSERT INTO lab_15_users (id, username, password, name, description, birthday)
VALUES
    (11, 'user11', 'password123', 'John Doe', 'A web developer with a passion for tech.', '1985-04-12'),
    (12,'user12', 'password456', 'Jane Doe', 'Enthusiastic software engineer and tech lover.', '1990-07-08'),
    (13,'user13', 'password789', 'Mike Smith', 'Experienced database administrator.', '1978-11-22');
