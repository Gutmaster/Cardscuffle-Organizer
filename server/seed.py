#!/usr/bin/env python3

# Standard library imports
from datetime import datetime
# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Animal, Photograph, Location

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():

        print("Starting seed...")
        print("Deleting data...")
        Photograph.query.delete()
        Animal.query.delete()
        Location.query.delete()
       

        print("Creating Species...")
        frog = Animal(name="Frog", description=fake.paragraph())
        bear = Animal(name="Bear", description=fake.paragraph())
        cat = Animal(name="Cat", description=fake.paragraph())
        animals = [frog, bear, cat]

        print("Creating Locations...")
        location1 = Location(name="Forest", description=fake.paragraph())
        location2 = Location(name="Crag", description=fake.paragraph())
        location3 = Location(name="Mountain", description=fake.paragraph())
        locations = [location1, location2, location3]

        dt = datetime.now()
        dt_formatted = f"{dt.day}/{dt.month}/{dt.year} {dt.hour}:{dt.minute:02d}"
        
        print("Creating Sightings...")
        sighting1 = Photograph(datetime = dt_formatted, animal = frog, location = location1, image = 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2F2.bp.blogspot.com%2F-JfVO_Hwqlb4%2FTlOjgETXGnI%2FAAAAAAAAAc4%2FKYiJ_rRA5vA%2Fs1600%2Ftree_frog_3.jpg&f=1&nofb=1&ipt=0c45bdee3a92168ace54b7573250e4d7321008620f864be8300bca996debcc6a&ipo=images')
        sighting2 = Photograph(datetime = dt_formatted, animal = bear, location = location2, image = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages6.alphacoders.com%2F529%2Fthumb-1920-529903.jpg&f=1&nofb=1&ipt=cae0c6abdc08cea8c14a123c2949b0c8069a392371af2f99371f2b04f1cbc1c5&ipo=images')
        sighting3 = Photograph(datetime = dt_formatted, animal = cat, location = location3, image = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.the-sun.com%2Fwp-content%2Fuploads%2Fsites%2F6%2F2023%2F10%2FKS-crunchy-cat-comp.jpg%3Fw%3D620&f=1&nofb=1&ipt=260c156d905b4d1a42dba3496bcc1c0a119e0fcb2c63a289040eafd20500ca4c&ipo=images')
        photo4 = Photograph(datetime = dt_formatted, animal = bear, location = location3, image = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fv.w-x.co%2F1654795237283_060922_CLIMATE_CHANGE_COULD_LEAD_TO_PIZZLY_BEARSprproj.jpg&f=1&nofb=1&ipt=21de8508a57162226ee02f13200b2f4c631c094de575a6096b5f0894d2dc92a4&ipo=images')
        photo5 = Photograph(datetime = dt_formatted, animal = frog, location = location3, image = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.wallpaperflare.com%2Fstatic%2F148%2F861%2F281%2Fnature-animals-frog-poison-dart-frogs-wallpaper.jpg&f=1&nofb=1&ipt=dacd16c4e6b14db11b555e77905b8884d09dc82347536479021ce1e7a91189d4&ipo=imagess')
        sightings = [sighting1, sighting2, sighting3, photo4, photo5]

        db.session.add_all(animals)
        db.session.add_all(locations)
        db.session.add_all(sightings)
        db.session.commit()
        print("Seeding done!")