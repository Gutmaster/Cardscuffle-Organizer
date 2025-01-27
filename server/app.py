#!/usr/bin/env python3

# Standard library imports
from datetime import datetime
from dotenv import load_dotenv

# Remote library imports
from flask import Flask, render_template, request
from flask_restful import Resource
from flask import make_response

# Local imports
from config import app, db, api
# Add your model imports
from models import Animal, Photograph, Location, User, Score

load_dotenv()

# Views go here!
@app.errorhandler(404)
def not_found(e):
    return render_template("index.html")

class Users(Resource):
    def get(self):
        users = User.query.all()
        user_dicts = []
        for user in users:
            user_dict = user.to_dict()
            user_dict['scores'] = [score.score for score in user.scores]
            user_dicts.append(user_dict)
        return make_response(user_dicts, 200)
    
    def post(self):
        data = request.json
        print('POSTING ATTEMPT', data.get('username'), data.get('password'))
        user = User(username = data.get('username'), password = data.get('password'))
        db.session.add(user)
        db.session.commit()
        return user.to_dict(), 201
    
class Scores(Resource):
    def get(self):
        scores = Score.query.all()
        score_dicts = []
        for score in scores:
            score_dict = score.to_dict()
            score_dicts.append(score_dict)
        return make_response(score_dicts, 200)
    
    def post(self):
        data = request.json  
        user = User.query.filter_by(username=data.get('username')).first()
        score = Score(user = user, score = data.get('score'))
        db.session.add(score)
        db.session.commit()
        return score.to_dict(), 201

class Animals(Resource):
    def get(self):
        animals = Animal.query.all()
        animal_dicts = []
        for animal in animals:
            animal_dict = animal.to_dict()
            animal_dict['locations'] = list(set([location.name for location in animal.locations]))
            animal_dicts.append(animal_dict)
        return make_response(animal_dicts, 200)

class AnimalById(Resource):    
    def patch(self, id):
        print("PATCHING", id, request.json.get('description'))
        animal = Animal.query.filter_by(id=id).first()
        if animal:
            try:
                animal.name = request.json.get('name')
                animal.description = request.json.get('description')
            except ValueError as error:
                print(error)
                return {'error editing animal': [error.args[0]]}, 400
            else:
                db.session.commit()
                return animal.to_dict(), 200
        else:
            return {'Error': 'Animal not found'}, 404
        
class Locations(Resource):
    def get(self):
        locations = Location.query.all()
        location_dicts = []
        for location in locations:
            location_dict = location.to_dict()
            location_dict['animals'] = list(set([animal.name for animal in location.animals]))
            location_dicts.append(location_dict)
        return make_response(location_dicts, 200)

class LocationById(Resource):
    def patch(self, id):
        location = Location.query.filter_by(id=id).first()
        if location:
            location.name = request.json.get('name')
            location.description = request.json.get('description')
            db.session.commit()
            return location.to_dict(), 200
        else:
            return {'Error': 'Location not found'}, 404

class Photographs(Resource):
    def get(self):
        photographs = Photograph.query.all()
        return [photograph.to_dict() for photograph in photographs], 200
    
    def post(self):
        data = request.json

        dt = datetime.now()
        dt_formatted = f"{dt.day}/{dt.month}/{dt.year} {dt.hour}:{dt.minute:02d}"

        animal = Animal.query.filter_by(name=data.get('animal_name')).first()
        if not animal:
            try:
                animal = Animal(name = data.get('animal_name'))
            except ValueError as error:
                print(error)
                return {'error creating new animal': [error.args[0]]}, 400
            db.session.add(animal)
        
        location = Location.query.filter_by(name=data.get('location_name')).first()
        if not location:
            try:
                location = Location(name = data.get('location_name'))
            except ValueError as error:
                return {'error creating new location': [error.args[0]]}, 400
            db.session.add(location)

        photograph = Photograph(datetime = dt_formatted, animal = animal, location = location, image = data.get('image'))
        db.session.add(photograph)
        db.session.commit()
        return photograph.to_dict(), 201

class PhotographById(Resource):
    def patch(self, id):
        photograph = Photograph.query.filter_by(id=id).first()
        if photograph:
            photograph.animal_id = request.json.get('animal_id')
            photograph.location_id = request.json.get('location_id')
            db.session.commit()
            return photograph.to_dict(), 200
        else:
            return {'Error': 'Photograph not found'}, 404
            
    def delete(self, id):
        photograph = Photograph.query.filter_by(id=id).first()
        if photograph:
            db.session.delete(photograph)
            db.session.commit()
            return {'Message': 'Photograph deleted'}, 200
        else:
            return {'Error': 'Photograph not found'}, 404

api.add_resource(Users, '/_users')
api.add_resource(Scores, '/_scores')
api.add_resource(Animals, '/_animals')
api.add_resource(AnimalById, '/_animals/<int:id>')
api.add_resource(Locations, '/_locations')
api.add_resource(LocationById, '/_locations/<int:id>')
api.add_resource(Photographs, '/_photographs')
api.add_resource(PhotographById, '/_photographs/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

