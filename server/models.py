from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)

    cards = db.relationship('Card', secondary='user_cards', back_populates='users')

class UserCard(db.Model, SerializerMixin):
    __tablename__ = 'user_cards'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    card_id = db.Column(db.Integer, db.ForeignKey('cards.id'), primary_key=True)

class Card(db.Model, SerializerMixin):
    __tablename__ = 'cards'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    art = db.Column(db.String, nullable=False)

    set_id = db.Column(db.Integer, db.ForeignKey('sets.id'))
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'))

    users = db.relationship('User', secondary='user_cards', back_populates='cards')

class Set(db.Model, SerializerMixin):
    __tablename__ ='sets'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    release_date = db.Column(db.Date, nullable=False)

    cards = db.relationship('Card', back_populates='set')
    
class Artist(db.Model, SerializerMixin):
    __tablename__ = 'artists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

    cards = db.relationship('Card', back_populates='artist')


# class Animal(db.Model, SerializerMixin):
#     __tablename__ = 'animals'

#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String, unique=True, nullable=False)
#     description = db.Column(db.String)

#     photographs = db.relationship('Photograph', back_populates='animal')

#     # Adding association proxy to access locations directly from animals
#     locations = association_proxy('photographs', 'location')

#     serialize_rules = ('-photographs.animal',)

#     @validates('name', 'description')
#     def validate_text(self, key, value):
#         if not value:
#             raise ValueError(f'{key} cannot be empty.')
#         if type(value) != str:
#             raise ValueError(f'{key} must be a string.')
#         if key == 'description':
#             if not 10 <= len(value) <= 200:
#                 raise ValueError('Description must be between 10 and 200 characters.')
#         return value


# class Photograph(db.Model, SerializerMixin):
#     __tablename__ = 'photographs'

#     id = db.Column(db.Integer, primary_key=True)
#     datetime = db.Column(db.String)
#     image = db.Column(db.String)

#     animal_id = db.Column(db.Integer, db.ForeignKey('animals.id'))
#     animal = db.relationship('Animal', back_populates='photographs')

#     location_id = db.Column(db.Integer, db.ForeignKey('locations.id'))
#     location = db.relationship('Location', back_populates='photographs')

#     serialize_rules = ('-animal.photographs', '-location.photographs')

#     @validates('image')
#     def validate_image(self, key, value):
#         if not value:
#             raise ValueError('Photograph must include a linked image.')
#         return value


# class Location(db.Model, SerializerMixin):
#     __tablename__ = 'locations'

#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String, unique=True, nullable=False)
#     description = db.Column(db.String)

#     photographs = db.relationship('Photograph', back_populates='location')

#     # Adding association proxy to access animals directly from locations
#     animals = association_proxy('photographs', 'animal')

#     serialize_rules = ('-photographs.location',)

#     @validates('name', 'description')
#     def validate_text(self, key, value):
#         if not value:
#             raise ValueError(f'{key} cannot be empty.')
#         if type(value) != str:
#             raise ValueError(f'{key} must be a string.')
#         if key == 'description':
#             if not 10 <= len(value) <= 200:
#                 raise ValueError('Description must be between 10 and 200 characters.')
#         return value