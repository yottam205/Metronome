# Simple Metronome
#### Video Demo:  <https://www.youtube.com/watch?v=NdhoxJhQmlM>
#### Description: A simple and easy to use metronome

##### You can choose the time signature
##### You can choose what beats will be accented between three duferent accent sounds so the subdivision and accents are all up to You

##### You can add a timer to time your practice sessions
##### Another option is to add subjects.
##### The subject list is there to help with orginizing the practice session
##### You can add any subject, then hilight the subject you are parcticing.
##### There is an option to edit or delete subjects as well

#### ** Please nore - to add subjects you have to be logged in.
#### To log in, simply register through the register button. choose a user name and a password and thats all. no need for any special details or such.


---------------------------
Python Package Requirements
---------------------------

- Flask
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-Login
- Werkzeug

---------------------------------------
Setting Up a Python Virtual Environment
----------------------------------------
A virtual environment in Python is a self-contained directory that contains a Python installation for a particular version of Python, plus a number of additional packages. Using a virtual environment allows you to manage dependencies for different projects separately.

Create a Virtual Environment:
1. Navigate to your project directory in the terminal.
2. Run the following command to create a virtual environment named 'venv' (you can choose any name):
   python -m venv venv
   This creates a new directory 'venv' in your project folder.

Activate the Virtual Environment:
- On Windows, run:
  venv\Scripts\activate
- On Unix or MacOS, run:
  source venv/bin/activate
  After running this command, your command prompt will change to show the name of the activated environment.

Deactivate the Virtual Environment:
- Simply run:
  deactivate
  Use this command when you're done working on the project.

----------------------------
Installing Required Packages
----------------------------
With your virtual environment activated, install the required packages using pip. These commands will install the necessary libraries for your Flask application:

- pip install Flask
- pip install Flask-SQLAlchemy
- pip install Flask-Migrate
- pip install Flask-Login
- pip install Werkzeug

Each 'pip install' command fetches the latest version of the package from PyPI (Python Package Index) and installs it in your virtual environment.

Remember to activate your virtual environment each time you work on your project to ensure you're using the right Python interpreter and dependencies.
