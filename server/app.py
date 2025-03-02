#!/usr/bin/env python3

# Standard library imports
from datetime import datetime
from dotenv import load_dotenv

# Remote library imports
from flask import Flask, render_template, request, redirect, url_for, flash, session, make_response
from flask_restful import Resource
from flask_login import login_user, logout_user, login_required, current_user
import os


# Local imports
from config import app, db, api, login_manager
# Add your model imports
from models import User, Card, Set, Artist

load_dotenv()

@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

# Views go here!
@app.errorhandler(404)
def not_found(e):
    print("NOTFOUND")
    return render_template("index.html")

class CheckSession(Resource):
    def get(self):
        if current_user.is_authenticated:
            return make_response(current_user.to_dict(), 201)
        else:
            return make_response('', 204)
        
class Users(Resource):
    def post(self):
        data = request.json
        user = User(username = data.get('username'), password_hash = data.get('password'))
        db.session.add(user)
        db.session.commit()
        return user.to_dict(), 201
    

class UserArtistsAndSets(Resource):
    @login_required
    def get(self):
        if current_user.is_authenticated:
            artists_and_sets = current_user.artists_and_sets()

            artists = artists_and_sets['artists']
            sets = artists_and_sets['sets']

            artist_dicts = [artist.to_dict() for artist in artists]
            set_dicts = [set.to_dict() for set in sets]

            # Combine them into a result dictionary
            result = {
                "artists": artist_dicts,
                "sets": set_dicts
            }

            return make_response(result, 200)
        else:
            return make_response("You need to be logged in to access this feature", 401)

class Cards(Resource):
    @login_required
    def get(self):
        if current_user.is_authenticated:
            cards = current_user.cards
            card_dicts = []
            for card in cards:
                card_dict = card.to_dict()
                card_dicts.append(card_dict)
            return make_response(card_dicts, 200)
        else:
            return make_response("You need to be logged in to access this feature", 401)
        
    @login_required
    def post(self):
        print(current_user.username)
        if current_user.is_authenticated:
            data = request.json
            card = Card(name = data.get('name'), 
                        art = data.get('art'), 
                        artist_id = Artist.query.filter(Artist.name == data.get('artist')).first().id,
                        set_id = Set.query.filter(Set.name == data.get('set')).first().id,
                        users = [current_user])
            db.session.add(card)
            db.session.commit()
            return card.to_dict(), 201


class Artists(Resource):
    def get(self):
        artists = Artist.query.all()
        return make_response([artist.to_dict() for artist in artists], 200)
    
    def post(self):
        data = request.json
        artist = Artist(name = data.get('name'))
        db.session.add(artist)
        db.session.commit()
        return artist.to_dict(), 201
    

class Sets(Resource):
    def get(self):
        sets = Set.query.all()
        return make_response([set.to_dict() for set in sets], 200)
    
    def post(self):
        data = request.json
        set = Set(name = data.get('name'), release_date = datetime(data.get('year'), data.get('month'), data.get('day')))
        db.session.add(set)
        db.session.commit()
        return set.to_dict(), 201
    

class Login(Resource):
    def post(self):
        data = request.json
        user = User.query.filter_by(username=data.get("username")).first()
        if user is None or not user.authenticate(data.get("password")):
            response = make_response(redirect(url_for("login")))
            response.status_code = 401
            return response
        
        login_user(user)

        print('login successful', user.username)
        card = db.session.query(Card).filter_by(id=1).first() 
        print(card)
        print(card.artist.name)

        return make_response(user.to_dict(), 201)


class Logout(Resource):
    @login_required
    def get(self):
        logout_user()
        return make_response(redirect(url_for("login")), 200)

# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     # Here we use a class of some kind to represent and validate our
#     # client-side form data. For example, WTForms is a library that will
#     # handle this for us, and we use a custom LoginForm to validate.
#     form = LoginForm()
#     if form.validate_on_submit():
#         # Login and validate the user.
#         # user should be an instance of your `User` class
#         login_user(user)

#         flask.flash('Logged in successfully.')

#         next = flask.request.args.get('next')
#         # url_has_allowed_host_and_scheme should check if the url is safe
#         # for redirects, meaning it matches the request host.
#         # See Django's url_has_allowed_host_and_scheme for an example.
#         if not url_has_allowed_host_and_scheme(next, request.host):
#             return flask.abort(400)

#         return flask.redirect(next or flask.url_for('index'))
#     return flask.render_template('login.html', form=form)

api.add_resource(Users, '/_users')
api.add_resource(UserArtistsAndSets, '/_userartistsandsets')
api.add_resource(Cards, '/_cards')
api.add_resource(Artists, '/_artists')
api.add_resource(Sets, '/_sets')
api.add_resource(Login, '/_login')
api.add_resource(Logout, '/_logout')
api.add_resource(CheckSession, '/_check_session')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

