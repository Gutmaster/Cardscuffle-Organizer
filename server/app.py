#!/usr/bin/env python3

# Standard library imports
from datetime import datetime

# Remote library imports
from flask import Flask, render_template, request, redirect, url_for, flash, session, make_response, jsonify
from flask_restful import Resource
from flask_login import login_user, logout_user, login_required, current_user
from sqlalchemy.exc import IntegrityError
from sqlalchemy import desc
import os


# Local imports
from config import app, db, api, login_manager
# Add your model imports
from models import User, Card, Set, Artist


@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

# Views go here!
@app.errorhandler(404)
def not_found(e):
    print(e)
    return render_template("index.html")

class CheckSession(Resource):
    def get(self):
        if current_user.is_authenticated:
            for artist in current_user.unique_artists:
                filtered_cards = [card for card in artist.cards if current_user in card.users]
                artist.cards = filtered_cards 
            for set in current_user.unique_sets:
                filtered_cards = [card for card in set.cards if current_user in card.users]
                set.cards = filtered_cards
            return make_response(current_user.to_dict(), 201)
        if current_user is None or not current_user.is_authenticated:
            response = make_response(redirect(url_for("login")))
            response.status_code = 401
            return response

        
class Users(Resource):
    def post(self):
        data = request.json
        try:
            user = User(username=data.get('username'), password_hash=data.get('password'))
            db.session.add(user)
            db.session.commit()
            return {'id': user.id, 'username': user.username}, 201
        except ValueError as ve:
            response = {
                'error': 'Validation Error',
                'message': str(ve)
            }
            return make_response(response, 400)
        except IntegrityError as ie:
            db.session.rollback() 
            response = {
                'error': 'Database Error',
                'message': 'Username already exists.'
            }
            return make_response(response, 400)
        except Exception as e:
            response = {
                'error': 'Internal Server Error',
                'message': 'An unexpected error occurred.'
            }
            return make_response(response, 500)
    
    def patch(self):
        data = request.json
        card_id = data.get('card_id')
        card = Card.query.filter(Card.id == card_id).first()
        if not card:
            return {'Error': 'Card not found'}, 404
        user = current_user

        if card in user.cards: 
            user.cards.remove(card)
        else: 
            user.cards.append(card)

        if not len(card.users):
            db.session.delete(card)
        
        db.session.commit()
        return make_response(current_user.to_dict(), 200)
    

class Cards(Resource):
    @login_required
    def get(self):
        cards = Card.query.all()
        card_dicts = []
        for card in cards:
            card_dict = card.to_dict()
            card_dicts.append(card_dict)
        return make_response(card_dicts, 200)

    @login_required
    def post(self):
        data = request.json
        card = Card(name = data.get('name'),
                    art = data.get('art'),
                    artist_id = Artist.query.filter(Artist.name == data.get('artist')).first().id,
                    set_id = Set.query.filter(Set.name == data.get('set')).first().id,
                    users = [current_user])
        db.session.add(card)
        db.session.commit()
        return card.to_dict(), 201
        
    @login_required
    def patch(self):
        data = request.json
        card = Card.query.filter(Card.id == data.get('id')).first()
        if card:
            card.name = data.get('name')
            card.art = data.get('art')
            card.artist_id = Artist.query.filter(Artist.name == data.get('artist')).first().id
            card.set_id = Set.query.filter(Set.name == data.get('set')).first().id
            db.session.commit()
            return card.to_dict(), 200
        else:
            return make_response("Card not found", 404)


class Artists(Resource):
    def get(self):
        artists = Artist.query.order_by(Artist.name).all()
        print(artists)
        return make_response([artist.to_dict() for artist in artists], 200)
    
    def post(self):
        data = request.json
        artist = Artist(name = data.get('name'))
        db.session.add(artist)
        db.session.commit()
        return artist.to_dict(), 201


class Sets(Resource):
    def get(self):
        sets = Set.query.order_by(Set.name).all()
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
            response = make_response({'error':'Invalid username or ID'})
            response.status_code = 401
            return response
        
        login_user(user)

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

api.add_resource(Users, '/users')
api.add_resource(Cards, '/cards')
api.add_resource(Artists, '/artists')
api.add_resource(Sets, '/sets')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CheckSession, '/check_session')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

