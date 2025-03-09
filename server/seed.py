#!/usr/bin/env python3

# Local imports
from app import app
from models import db, User, Card, UserCard, Artist, Set
from datetime import date

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")
        print("Deleting data...")
        UserCard.query.delete()
        User.query.delete()
        Card.query.delete()
        Artist.query.delete()
        Set.query.delete()
       
        print("Creating Sets")
        Core = Set(name="Core", release_date= date(1996, 12, 11))
        Expansionous = Set(name="Expansionous", release_date= date(1997, 11, 3))
        sets = [Core, Expansionous]

        print("Creating Artists")
        Randal = Artist(name="Randal Vandalfile")
        Dirk = Artist(name="Dirk Dangler")
        Harry = Artist(name="Harry Hamhandler")
        artists = [Randal, Dirk, Harry]

        print("Creating Users...")
        Billy = User(username="Billy", password_hash="Yllib")
        Davey = User(username="Davey", password_hash="Yevad")
        Scrambles = User(username="Scambles", password_hash="ILOVEEGGS")
        users = [Billy, Davey, Scrambles]

        print("Creating Cards...")
        FireHuck = Card(name="Firehuck", 
                        art = "https://imgs.search.brave.com/izk5prphnJGNL88vbLHEm1GVa-XUUCeCkylHu4j_kuk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzgyLzUyLzUx/LzM2MF9GXzM4MjUy/NTEwNF91VVJ6QU8w/Uzl0dnpNelM5OGt0/QlNyTzFyRVFtS09m/NC5qcGc", 
                        artist = Randal, 
                        set = Core)
        
        FireCluck = Card(name="Firecluck", 
                        art = "https://imgs.search.brave.com/p83TmfrIrb8BrulaBKEauxW8nXRJmONavJuYSm0iZQs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2YxLzVl/Lzk3L2YxNWU5N2Rh/YTViMjZjYmUxZTNk/NjVlYzcwZGMxZTZh/LmpwZw", 
                        artist = Randal, 
                        set = Core)
        
        Tree = Card(name="Tree", 
                art = "https://imgs.search.brave.com/UbPZAKMfEvtG03DOAWq1SzdR81bc5yGddozumtcvQ6U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTg2/ODI2NzQ0L3Bob3Rv/L3RyZWUuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPU10YjJU/ak5DMDBaTUVmcnBX/LVl0MkZVQVRkdHJT/ajNsYWRabXotdW5B/U1E9", 
                artist = Harry, 
                set = Core)
        
        Pangolini = Card(name="Pangolini", 
                art = "https://imgs.search.brave.com/oOAX227rMVgd3Lw4wbZaIDLQjx7NEGAWpIsp4V-xI_g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wYW5n/b2xpbmNyaXNpc2Z1/bmQub3JnL3dwLWNv/bnRlbnQvdXBsb2Fk/cy9zaXRlcy82LzIw/MjQvMTIvTmFtaWJp/YV9wYW5nb2xpbl9p/U3RvY2tfY3JlZGl0/LUQtMTAyNHg1MzEu/anBn", 
                artist = Dirk, 
                set = Expansionous)
        
        cards = [FireHuck, FireCluck, Tree, Pangolini]

        Billy.cards.append(FireHuck)
        Billy.cards.append(FireCluck)
        Billy.cards.append(Tree)
        Davey.cards.append(FireHuck)
        Davey.cards.append(Pangolini)

        Core.cards.append(FireHuck)
        Core.cards.append(Tree)
        Expansionous.cards.append(Pangolini)

        db.session.add_all(sets)
        db.session.add_all(artists)
        db.session.add_all(users)
        db.session.add_all(cards)
        db.session.commit()
        print("Seeding done!")