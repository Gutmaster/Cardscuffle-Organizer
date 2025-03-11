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

### Home.js
#### Home
Returns JSX for a splash page with a quick description of the site and links to it's pages.

### NavBar.js
#### Navbar
Returns JSX for a navbar with links to all pages on site.

### Animal.js
#### Animal
Returns a JSX representation of an Animal object. Contains the following helper functions:
- handleArrowRight: raises photo index and changes displayed picture for animal
- handleArrowLeft: lowers photo index and changes displayed picture for animal
- handleEdit: edits animal description from content received from client then pushes changes to database
- handleDescriptionChange: used to edit the value of the description in state
- alertReset: used to reset the value of the popup text when timer runs out

### Animals.js
#### Animals
Returns a list of all Animal objects in JSX.

### Location.js
#### Location
Returns a JSX representation of a Location object. Contains the following helper functions:
- handleArrowRight: raises photo index and changes displayed picture for location
- handleArrowLeft: lowers photo index and changes displayed picture for location
- handleEdit: edits location description from content received from client then pushes changes to database
- handleDescriptionChange: used to edit the value of the description in state
- alertReset: used to reset the value of the popup text when timer runs out

### Locations.js
#### Locations
Returns a list of all Location objects in JSX.

### Photograph.js
#### Photograph
Returns a JSX representation of a Photograph object. Contains the following helper functions:
- handleEdit: swaps editing on and off, if swapping off, passes values to confirmEdit function received from App component to push changes to database and state
- handleEditAnimal: sets new animal for the photograph in state
- handleEditLocation: sets new location for the photograph in state

### Photographs.js
#### Photographs
Returns a filter and filtered list of photographs from the database. Contains the following helper functions:
- handleFilterTypeChange: handles changing the state of the type of filter applied
- handleFilterChange: handles changing the state of the filter



## Server Side
### seed.py
This file resets and seeds the animal_photo database with initial values for
the program. It can be run by entering `python server/seed.py` from the project directory.


### config.py
This file contains imports and configuration for the app and database.


### app.py
This file contains the following routes that serve to and accepts data from the client application. 
It is written to Flask RESTful standards and contains the following classes and methods.

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