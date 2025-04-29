import sqlite3
from datetime import datetime

def init_db():
    conn = sqlite3.connect('data/metrics.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS metrics (
            timestamp TEXT,
            cpu REAL,
            mem REAL,
            temp REAL
        )
    ''')
    conn.commit()
    conn.close()

def log_metrics(cpu, mem, temp):
    conn = sqlite3.connect('data/metrics.db')
    c = conn.cursor()
    timestamp = datetime.now().isoformat()
    c.execute('INSERT INTO metrics (timestamp, cpu, mem, temp) VALUES (?, ?, ?, ?)',
              (timestamp, cpu, mem, temp))
    conn.commit()
    conn.close()

def get_historical_data():
    conn = sqlite3.connect('data/metrics.db')
    c = conn.cursor()
    c.execute('SELECT timestamp, cpu, mem, temp FROM metrics ORDER BY timestamp')
    data = c.fetchall()
    conn.close()
    return [
        {'timestamp': row[0], 'cpu': row[1], 'mem': row[2], 'temp': row[3]}
        for row in data
    ]
