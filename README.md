# Phase 5 Full Stack Web Application Project
## CardScuffle Organizer

## Introduction
This web application lets users upload and view cards from the hit fiction collectible card game Card Scuffle, categorized by artist and set. The user can also add and edit cards to keep the database current with new releases.


# File Descriptions
## Client Side
### index.css 
Contains HTML styles for the front-end application.

### index.js
Creates root and renders App.

### /Components
The following files are react components.
### App.js
#### App
Pulls artists and sets from the database and makes stateful arrays out of them. Checks the session and pulls up to date
artists and sets when needed, and manages user login with session. Redirects users to login page if trying to access
restricted views. Returns JSX describing route mapping and passes relevant information to rendered components.

### Card.js
#### Card
Returns JSX for viewing, editing, and removing a card from the user's collection. Contains the following helper functions:
 - onSubmit: Sends patch request to the server with card edits made by the user
 - handleAlert: Takes a message and a css class for displaying alerts to the user for editing and removing cards
 - alertReset: Resets alert messages, called on a timer

### Cards.js
#### Cards
Returns a list of all of the user's cards in JSX, categorized by artist and/or set. Contains the following helper functions:
 - filterCards: Checks the artist and set filters and filters cards appropriately before display
 - handleDelete: Sends a patch request to the server to remove card from user's collection, the back end will delete 
                 the card from the database if no user owns a copy.

### ErrorPage.js
#### ErrorPage
Simple error view.

### Home.js
#### Home
Returns JSX for a splash page with a quick description of the site and links to it's pages.

### LibCard.js
#### LibCard
Returns JSX for viewing a card currently in the database, sorted by artist and/or set. Users can add cards to their
collection from this page. Contains the following helper function:
 - handleAddCard: Sends a patch request to the server to add card to current user's collection.

### Library.js
Returns a list of all cards in the database in JSX. Contains the following helper function: 
 - filterCards: Checks the artist and set filters and filters cards appropriately before display

### LogIn.Js
Returns JSX for a log in form. Sends a request to the server to log in user with the inputted credentials, alerts
success or failure. Contains the following helper functions: 
 - onSubmit: Sends post request to log in user from form info
 - handleAlert: Takes a message and a css class for displaying alerts to the user for log in status
 - alertReset: Resets alert messages, called on a timer

### NavBar.js
#### Navbar
Returns JSX for a navbar with links to all pages on site, as well as a logout button.

### NewCard.js
#### NewCard
Returns JSX for a form to add cards to the database, as well as forms for adding new artists and sets.
Contains the following helper functions:
 - handleAlert: Takes a message and a css class for displaying alerts to the user for log in status
 - alertReset: Resets alert messages, called on a timer
 - onSubmit: Attempts to post new card to database from form info, server will add card to user collection if successful
 - handleArtistSubmit: Attempts to post artist to database from add artist form
 - handleSetSubmit: Attempts to post set to database from add set form

### SignUp.js
#### SignUp
Returns JSX for a sign up form. Sends a request to the server to sign up user with the inputted credentials, alerts
success or failure. Contains the following helper functions: 
 - onSubmit: Sends post request to log in user from form info
 - handleAlert: Takes a message and a css class for displaying alerts to the user for log in status
 - alertReset: Resets alert messages, called on a timer



## Server Side
### seed.py
This file resets and seeds the database with initial values for
the program. It can be run by entering `python server/seed.py` from the project directory.


### config.py
This file contains imports and configuration for the app and database.


### app.py
This file contains the following routes that serve to and accepts data from the client application. 
It is written to Flask RESTful standards and contains the following classes and methods.

#### Class CheckSession
##### get
Handles get requests to /_check_session, returns logged in user if successful otherwise returns 401
and a redirect to the login page.

#### Class Users
##### post
Handles post requests to /_users, adds new user to database from request data, returns user on success, errors on failure.
##### patch
Handles patch requests to /_users, takes a given card id and removes the matching card from the current user's card. 
If no user owns the card after it has been removed from the current user, it will be deleted from the database.
    




#### Class Animals
##### get
Handles get requests to /animals and returns a list of all animals from the database.

#### Class AnimalsById
##### patch
Handles patch requests to /animals/{id} and pulls the animal from the database matching the given ID and patches it's
name and description with the name and description from the request body. Returns the patched animal if successful.

#### Class Locations
##### get
Handles get requests to /locations and returns a list of all locations from the database.

#### Class LocationById
##### patch
Handles patch requests to /locations/{id} and pulls the location from the database matching the given ID and patches it's
name and description with the name and description from the request body. Returns the patched location if successful.

#### Class Photographs
##### get
Handles get requests to /photographs and returns a list of all photographs from the database.

#### post
Handles post requests to /photographs and attempts to create a new photograph from information in the request body.
It will create a new animal and/or location if those requested are not yet in the database. On success, updates the
database and returns the new photograph.

#### Class PhotographsById
##### patch
Handles patch requests to /photographs/{id}, patches animal in database matching ID with new animal and location values.

##### delete
Handles delete requests to /photographs/{id}, finds the photograph associated with the given id and deletes it from the database.
Returns nothing if successful.

### models.py
This file contains the definitions for all models used in the animal_photo database.



Copyright (c) 2024 Chevy Vall

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.