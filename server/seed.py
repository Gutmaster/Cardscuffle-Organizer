#!/usr/bin/env python3

# Standard library imports
from datetime import datetime
# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Card, UserCard, Artist, Set
from datetime import date

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():

        print("Starting seed...")
        print("Deleting data...")
        User.query.delete()
        Card.query.delete()
        UserCard.query.delete()
        Artist.query.delete()
        Set.query.delete()
       
        print("Creating Sets")
        CroreSet = Set(name="Crore Set", release_date= date(1996, 12, 11))
        sets = [CroreSet]

        print("Creating Artists")
        Randal = Artist(name="Randal")
        artists = [Randal]

        print("Creating Users...")
        Billy = User(username="Billy", password="Yllib")
        users = [Billy]

        print("Creating Cards...")
        FireHuck = Card(name="Firehuck", art = "NOART", artist = Randal, set = CroreSet)
        cards = [FireHuck]

        Billy.cards.append(FireHuck)
        Randal.cards.append(FireHuck)
        CroreSet.cards.append(FireHuck)

        db.session.add_all(sets)
        db.session.add_all(artists)
        db.session.add_all(users)
        db.session.add_all(cards)
        db.session.commit()
        print("Seeding done!")