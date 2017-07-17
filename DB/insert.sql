insert into person(uname, pword, owner) values ('owner', 'o', 1);
insert into person(uname, pword, owner) values ('con', 'c', 0);

insert into personAssociate(owner, associate) values ('owner', 'con');

insert into media(name, place, creator, owner) values ('owner/pic1.jpg','./files/owner/pic1.jpg', 'con', 'owner');
insert into media(name, place, creator, owner) values ('owner/pic2.jpg', './files/owner/pic2.jpg', 'con', 'owner');
insert into media(name, place, creator, owner) values ('owner/song1.mp3', './files/owner/song1.mp3', 'con', 'owner');
insert into media(name, place, creator, owner) values ('owner/song2.mp3', './files/owner/song2.mp3', 'con', 'owner');

insert into mediaAssociate(visual, audio) values ('owner/pic1.jpg', 'owner/song1.mp3');
insert into mediaAssociate(visual, audio) values ('owner/pic1.jpg', 'owner/song2.mp3');
insert into mediaAssociate(visual, audio) values ('owner/pic2.jpg', 'owner/song1.mp3');
