import sqlite3
import os

DB_PATH = os.path.join(
    os.path.dirname(__file__),
    'ecotrack.db'
)

def get_db():

    conn = sqlite3.connect(
        DB_PATH,
        check_same_thread=False
    )

    conn.row_factory = sqlite3.Row

    # ENABLE FOREIGN KEYS

    conn.execute(
        'PRAGMA foreign_keys = ON'
    )

    return conn

def init_db():

    conn = get_db()

    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            eco_points INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Migration for existing databases
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN eco_points INTEGER DEFAULT 0')
    except Exception as e:
        if "duplicate column name" not in str(e):
            print(f"Migration notice: {e}")

    cursor.execute('''

        CREATE TABLE IF NOT EXISTS carbon_logs (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            transport_distance REAL DEFAULT 0,

            electricity_usage REAL DEFAULT 0,

            fuel_usage REAL DEFAULT 0,

            food_type TEXT DEFAULT 'veg',

            transport_emission REAL DEFAULT 0,

            electricity_emission REAL DEFAULT 0,

            fuel_emission REAL DEFAULT 0,

            food_emission REAL DEFAULT 0,

            total_emission REAL DEFAULT 0,

            predicted_future_emission REAL DEFAULT 0,

            eco_score INTEGER DEFAULT 0,

            eco_badge TEXT DEFAULT 'Beginner',

            suggestion TEXT,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
            REFERENCES users (id)

        )

    ''')


    cursor.execute('''

        CREATE INDEX IF NOT EXISTS idx_user_id

        ON carbon_logs(user_id)

    ''')


    cursor.execute('''

        CREATE INDEX IF NOT EXISTS idx_email

        ON users(email)

    ''')

    conn.commit()

    conn.close()


    print(
        "Database initialized successfully."
    )

if __name__ == '__main__':

    init_db()