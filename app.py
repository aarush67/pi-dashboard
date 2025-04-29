from flask import Flask, render_template, jsonify
import psutil
import threading
import time
from database import init_db, log_metrics, get_historical_data
import subprocess

app = Flask(__name__)

# Initialize database
init_db()

# Background thread to collect system metrics
def collect_metrics():
    while True:
        try:
            cpu = psutil.cpu_percent()
            mem = psutil.virtual_memory().percent
            with open('/sys/class/thermal/thermal_zone0/temp', 'r') as f:
                temp = int(f.read()) / 1000
            log_metrics(cpu, mem, temp)
            print(f"Collected: CPU={cpu}%, Mem={mem}%, Temp={temp}°C")
        except Exception as e:
            print(f"Error in collect_metrics: {e}")
        time.sleep(5)  # Collect every 5 seconds

# Start background thread
thread = threading.Thread(target=collect_metrics, daemon=True)
thread.start()

@app.route('/')
def index():
    historical_data = get_historical_data()
    return render_template('index.html', historical_data=historical_data)

@app.route('/metrics')
def get_metrics():
    cpu = psutil.cpu_percent()
    mem = psutil.virtual_memory().percent
    with open('/sys/class/thermal/thermal_zone0/temp', 'r') as f:
        temp = int(f.read()) / 1000
    return jsonify({'cpu': cpu, 'mem': mem, 'temp': temp})

@app.route('/terminal')
def terminal():
    return render_template('terminal.html')

@app.route('/run_command', methods=['POST'])
def run_command():
    from flask import request
    command = request.form.get('command')
    try:
        result = subprocess.check_output(command, shell=True, stderr=subprocess.STDOUT, text=True)
    except subprocess.CalledProcessError as e:
        result = e.output
    return jsonify({'output': result})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
