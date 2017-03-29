create table cats
{
id bigint unsigned not null,
name tinytext not null,
parent bigint unsigned not null,
primary key (id)
}

create table notes
{
id bigint unsigned not null,
type enum("inq","sts","req","adv") not null,
note tinytext not null,
follows text,
primary key (id),
foreign key (cat) references cats(id)
}