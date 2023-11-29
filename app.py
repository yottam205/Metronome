import os

from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database.db')

app.config['SECRET_KEY'] = 'your_secret_key'  

db = SQLAlchemy(app)
migrate = Migrate(app, db)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password):
            login_user(user)
            return jsonify({'message': 'Login successful'}), 200

        return jsonify({'message': 'Invalid username or password'}), 401

    return render_template('login.html')


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/')
def index():
    return render_template('index.html', user=current_user)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('register.html')
    elif request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        if not username or not password:
            return jsonify({'message': 'Missing username or password'}), 400

        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({'message': 'Username already exists'}), 400

        new_user = User(username=username)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User successfully registered'}), 201


class Subject(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    timer = db.Column(db.Integer, nullable=True)  # Timer in seconds
    user = db.relationship('User', backref=db.backref('subjects', lazy=True))

@app.route('/add_subject', methods=['POST'])
@login_required
def add_subject():
    try:
        subject_name = request.form.get('subject_name')
        timer = request.form.get('timer')
        timer_value = int(timer) if timer else None

        new_subject = Subject(user_id=current_user.id, name=subject_name, timer=timer_value)
        db.session.add(new_subject)
        db.session.commit()

        return jsonify({'message': 'Subject added successfully'}), 200
    except Exception as e:
        print(e)  # Log the error for debugging
        return jsonify({'error': str(e)}), 500


@app.route('/get_subjects', methods=['GET'])
@login_required
def get_subjects():
    subjects = Subject.query.filter_by(user_id=current_user.id).all()
    return jsonify([{'id': subject.id, 'name': subject.name, 'timer': subject.timer} for subject in subjects])


@app.route('/edit_subject/<int:subject_id>', methods=['POST'])
@login_required
def edit_subject(subject_id):
    try:
        subject = Subject.query.get_or_404(subject_id)
        if subject.user_id != current_user.id:
            return jsonify({'message': 'Unauthorized'}), 403

        subject_data = request.get_json()
        subject.name = subject_data.get('name', subject.name)
        subject.timer = subject_data.get('timer', subject.timer)
        db.session.commit()

        return jsonify({'message': 'Subject updated successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@app.route('/delete_subject/<int:subject_id>', methods=['DELETE'])
@login_required
def delete_subject(subject_id):
    try:
        subject = Subject.query.get_or_404(subject_id)
        if subject.user_id != current_user.id:
            return jsonify({'message': 'Unauthorized'}), 403

        db.session.delete(subject)
        db.session.commit()

        return jsonify({'message': 'Subject deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

