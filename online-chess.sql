CREATE DATABASE online_chess_udemy;

USE online_chess_udemy;

-- Tables 
create table users(
	id int auto_increment primary key,
    username varchar(225) unique,
	email varchar(225) unique,
	password varchar(225)
);

create table user_info(
	user_id int,
    user_rank enum('beginner', 'intermediate', 'advanced', 'expert') default 'beginner' ,
    user_points int default 1000,
    key userID(user_id),
    constraint userID foreign key(user_id) references users(id) on delete cascade
);

-- drop table user_info
-- Procedures
Delimiter $$
create procedure createUser(
	in _username varchar(255),
    in _email varchar(255),
    in _password varchar(255)
)
begin
	declare userId int;
    
    insert into users(username, email, password) values(_username, _email, _password);
    select id into userId from users where username= _username;
    insert into user_info(user_id) value(userId);
end $$
Delimiter ;
