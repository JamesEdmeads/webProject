select * from media inner join (select audio from mediaAssociate inner join (select name from media where owner = "owner") as m on visual = m.name) as n on name = n.audio;

select * from media;

select * from mediaAssociate;


select name as sName, place as sPlace, visual as sVisual from (select * from media inner join mediaAssociate on name = audio);

select name, place, sName, sPlace from media join (
select name as sName, place as sPlace, visual as sVisual from (select * from media inner join mediaAssociate on name = audio)) where name = sVisual;
