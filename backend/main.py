# pyrefly: ignore [missing-import]

from flask import Flask, request, jsonify
from flask_cors import CORS
from carbon_model import predict_emission
from database import init_db, get_db
from auth import register_user, login_user, verify_token, reset_password
import functools
from google import genai
from google.genai import types

import os
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__, static_folder='static', static_url_path='')

# Configure Gemini AI (New SDK)
gemini_client = genai.Client(api_key="AIzaSyCHtT9TIcRG1ocehahD0keCbAHql7HYuiQ")
gemini_config = types.GenerateContentConfig(
    system_instruction="You are EcoTrack AI, a brilliant and friendly assistant. While your expertise is in sustainability and carbon footprint reduction, you can answer any question politely. Always try to relate general topics back to environmental impact if possible. Keep answers concise and use emojis! 🌿✨",
    temperature=0.7,
)

# Secure CORS (Allow All Origins so anyone can use it)
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize DB
init_db()


# =========================
# TOKEN AUTH DECORATOR
# =========================
def token_required(f):
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        # Remove Bearer
        if token.startswith('Bearer '):
            token = token.split(' ')[1]

        user_data, error = verify_token(token)

        if error:
            return jsonify({'message': error}), 401

        return f(user_data, *args, **kwargs)

    return decorated


# =========================
# SERVE FRONTEND
# =========================
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')


# =========================
# REGISTER
# =========================
@app.route('/register', methods=['POST'])
def register():

    data = request.json

    if not data.get('name'):
        return jsonify({"message": "Name required"}), 400

    if not data.get('email'):
        return jsonify({"message": "Email required"}), 400

    if not data.get('password'):
        return jsonify({"message": "Password required"}), 400

    token, user, error = register_user(
        data['name'],
        data['email'],
        data['password']
    )

    if error:
        return jsonify({'message': error}), 400

    return jsonify({
        'token': token,
        'user': user
    })


# =========================
# LOGIN
# =========================
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    token, user, error = login_user(data['email'], data['password'])
    if error:
        return jsonify({'message': error}), 400
    return jsonify({'token': token, 'user': user})

@app.route('/reset-password', methods=['POST'])
def reset_pwd():
    data = request.json
    email = data.get('email')
    new_password = data.get('new_password')
    if not email or not new_password:
        return jsonify({'message': 'Email and new password are required'}), 400
    success, error = reset_password(email, new_password)
    if not success:
        return jsonify({'message': error}), 400
    return jsonify({'message': 'Password reset successfully'})


# =========================
# CALCULATE EMISSION
# =========================
@app.route('/calculate', methods=['POST'])
@token_required
def calculate(user_data):

    data = request.json
    user_id = user_data['user_id']

    try:
        transport_distance = float(data.get('transport_distance', 0))
        electricity_usage = float(data.get('electricity_usage', 0))
        fuel_usage = float(data.get('fuel_usage', 0))
    except:
        return jsonify({
            "message": "Invalid numeric input"
        }), 400

    food_type = data.get('food_type', 'veg')
    vehicle_type = data.get('vehicle_type', 'car')

    # =========================
    # VALIDATION
    # =========================
    if transport_distance < 0:
        return jsonify({
            "message": "Invalid transport distance"
        }), 400

    if electricity_usage < 0:
        return jsonify({
            "message": "Invalid electricity usage"
        }), 400

    if fuel_usage < 0:
        return jsonify({
            "message": "Invalid fuel usage"
        }), 400

    # =========================
    # VEHICLE EMISSION
    # =========================
    vehicle_emission_factor = {
        "car": 0.21,
        "bike": 0.12,
        "bus": 0.08,
        "ev": 0.03
    }

    transport_emission = (
        transport_distance *
        vehicle_emission_factor.get(vehicle_type, 0.21)
    )

    # =========================
    # ELECTRICITY & FUEL
    # =========================
    electricity_emission = electricity_usage * 0.82
    fuel_emission = fuel_usage * 2.3

    # =========================
    # FOOD EMISSION
    # =========================
    food_emissions = {
        "veg": 2,
        "non-veg": 5,
        "vegan": 1,
        "junk": 6
    }

    food_emission = food_emissions.get(food_type, 2)

    # =========================
    # TOTAL
    # =========================
    total_emission = (
        transport_emission +
        electricity_emission +
        fuel_emission +
        food_emission
    )

    # =========================
    # ML PREDICTION
    # =========================
    prediction = predict_emission(
        transport_distance,
        electricity_usage
    )

    # =========================
    # ECO SCORE
    # =========================
    eco_score = max(0, 100 - int(total_emission * 2))

    # =========================
    # ECO BADGE
    # =========================
    if eco_score >= 80:
        eco_badge = "🌱 Eco Hero"

    elif eco_score >= 60:
        eco_badge = "♻️ Green Warrior"

    elif eco_score >= 40:
        eco_badge = "🌍 Eco Learner"

    else:
        eco_badge = "⚠️ Needs Improvement"

    # =========================
    # GRADE
    # =========================
    if total_emission <= 5:
        grade = 'A'
        grade_label = 'Excellent'

    elif total_emission <= 10:
        grade = 'B'
        grade_label = 'Good'

    elif total_emission <= 20:
        grade = 'C'
        grade_label = 'Average'

    elif total_emission <= 35:
        grade = 'D'
        grade_label = 'High'

    else:
        grade = 'F'
        grade_label = 'Critical'

    # =========================
    # HIGHEST SOURCE
    # =========================
    emissions_map = {
        'Transport': transport_emission,
        'Electricity': electricity_emission,
        'Fuel': fuel_emission,
        'Food': food_emission
    }

    highest_source = max(
        emissions_map,
        key=emissions_map.get
    )

    # =========================
    # SMART TIPS
    # =========================
    tips_map = {
        'Transport': '🚗 Use public transport or EV vehicles.',
        'Electricity': '⚡ Switch off unused devices.',
        'Fuel': '⛽ Reduce fuel consumption.',
        'Food': '🥗 Try more plant-based meals.'
    }

    tip = tips_map[highest_source]

    # =========================
    # AI SUGGESTION
    # =========================
    if highest_source == "Transport" and transport_distance > 50:
        suggestion = (
            "🚇 Long travel detected. "
            "Use metro or EV for lower emissions."
        )

    elif highest_source == "Electricity":
        suggestion = (
            "💡 Use LED bulbs and energy-efficient appliances."
        )

    elif highest_source == "Fuel":
        suggestion = (
            "⛽ Fuel usage is high. "
            "Try reducing unnecessary trips."
        )

    else:
        suggestion = (
            "🥗 Sustainable food habits can reduce emissions."
        )

    # =========================
    # SAVE TO DATABASE
    # =========================
    conn = get_db()

    conn.execute('''
        INSERT INTO carbon_logs
        (
            user_id,
            transport_distance,
            electricity_usage,
            fuel_usage,
            food_type,

            transport_emission,
            electricity_emission,
            fuel_emission,
            food_emission,

            total_emission,
            predicted_future_emission,

            eco_score,
            eco_badge,

            suggestion
        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (

        user_id,
        transport_distance,
        electricity_usage,
        fuel_usage,
        food_type,

        transport_emission,
        electricity_emission,
        fuel_emission,
        food_emission,

        total_emission,
        prediction,

        eco_score,
        eco_badge,

        suggestion
    ))

    conn.commit()
    conn.close()

    # =========================
    # RESPONSE
    # =========================
    return jsonify({

        "name": user_data['name'],

        "grade": grade,
        "grade_label": grade_label,

        "eco_score": eco_score,
        "eco_badge": eco_badge,

        "highest_source": highest_source,

        "tip": tip,
        "suggestion": suggestion,

        "transport_emission": round(
            transport_emission, 2
        ),

        "electricity_emission": round(
            electricity_emission, 2
        ),

        "fuel_emission": round(
            fuel_emission, 2
        ),

        "food_emission": round(
            food_emission, 2
        ),

        "total_emission": round(
            total_emission, 2
        ),

        "predicted_future_emission": prediction
    })


# =========================
# HISTORY
# =========================
@app.route('/history', methods=['GET'])
@token_required
def get_history(user_data):

    user_id = user_data['user_id']

    conn = get_db()

    logs = conn.execute(
        '''
        SELECT *
        FROM carbon_logs
        WHERE user_id = ?
        ORDER BY created_at DESC
        ''',
        (user_id,)
    ).fetchall()

    conn.close()

    return jsonify([
        dict(log)
        for log in logs
    ])


# =========================
# LEADERBOARD
# =========================
@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    conn = get_db()
    # Sort by eco_points descending
    query = 'SELECT name, eco_points FROM users ORDER BY eco_points DESC LIMIT 10'
    rows = conn.execute(query).fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])


# =========================
# NEWS FEED
# =========================
@app.route('/news', methods=['GET'])
def get_news():
    news = [
        {"id": 1, "title": "Global Solar Power Capacity Hits New Record", "source": "EcoNews", "desc": "Solar energy adoption is accelerating faster than predicted in 2024."},
        {"id": 2, "title": "New Biodegradable Material Replaces Plastic", "source": "Nature Tech", "desc": "Researchers have developed a seaweed-based alternative to single-use plastics."},
        {"id": 3, "title": "Electric Vehicle Sales Up by 35% Globally", "source": "CleanTransport", "desc": "More people are switching to EVs as charging infrastructure improves."},
        {"id": 4, "title": "Ocean Cleanup Project Removes 100 Tons of Waste", "source": "OceanGuard", "desc": "The largest ocean cleanup initiative has reached a major milestone."}
    ]
    return jsonify(news)


# =========================
# USER STATS & POINTS
# =========================
@app.route('/user-stats', methods=['GET'])
@token_required
def get_user_stats(user_data):
    user_id = user_data['user_id']
    conn = get_db()
    user = conn.execute('SELECT eco_points, name FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    return jsonify(dict(user))

@app.route('/claim-points', methods=['POST'])
@token_required
def claim_points(user_data):
    data = request.json
    points = data.get('points', 0)
    user_id = user_data['user_id']
    conn = get_db()
    conn.execute('UPDATE users SET eco_points = eco_points + ? WHERE id = ?', (points, user_id))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "points_added": points})


# =========================
# AI CHAT
# =========================
@app.route('/chat', methods=['POST'])
@token_required
def ai_chat(user_data):
    data = request.json
    message = data.get('message', '')
    user_id = user_data['user_id']

    if not message:
        return jsonify({"reply": "I didn't get any message."}), 400

    # Fetch User's Recent History for Context
    conn = get_db()
    recent_logs = conn.execute(
        'SELECT total_emission, eco_badge, created_at FROM carbon_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 3',
        (user_id,)
    ).fetchall()
    conn.close()

    context = ""
    if recent_logs:
        log_list = [f"{l['created_at']}: {l['total_emission']}kg ({l['eco_badge']})" for l in recent_logs]
        context = f"\n\n[USER CONTEXT: Here is the user's recent footprint history: {', '.join(log_list)}. Use this to give personalized advice if relevant.]"

    try:
        response = gemini_client.models.generate_content(
            model='gemini-1.5-flash',
            contents=message + context,
            config=gemini_config
        )
        return jsonify({"reply": response.text})
    except Exception as e:
        print(f"Gemini Error: {e}")
        return jsonify({"reply": "Sorry, my AI brain is currently resting. Please try again later.", "error": str(e)}), 500


# =========================
# ANALYTICS
# =========================
@app.route('/analytics', methods=['GET'])
@token_required
def analytics(user_data):

    user_id = user_data['user_id']

    conn = get_db()

    logs = conn.execute(
        '''
        SELECT *
        FROM carbon_logs
        WHERE user_id = ?
        ''',
        (user_id,)
    ).fetchall()

    conn.close()

    if not logs:
        return jsonify({
            "message": "No data found"
        })

    total_logs = len(logs)

    avg_emission = round(
        sum(log['total_emission'] for log in logs)
        / total_logs,
        2
    )

    highest_emission = round(
        max(log['total_emission'] for log in logs),
        2
    )

    lowest_emission = round(
        min(log['total_emission'] for log in logs),
        2
    )

    return jsonify({

        "total_records": total_logs,

        "average_emission": avg_emission,

        "highest_emission": highest_emission,

        "lowest_emission": lowest_emission
    })


# =========================
# MAIN
# =========================
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)