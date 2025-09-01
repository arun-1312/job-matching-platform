import os
import json
from functools import wraps
from datetime import datetime, timezone, timedelta
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client, Client

# -------------------------
# Env & App Setup
# -------------------------
load_dotenv()

app = Flask(__name__)
CORS(app)

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# -------------------------
# Authentication
# -------------------------



# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# This decorator now takes an optional role to check against the JWT
def token_required(required_role=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = None
            if 'Authorization' in request.headers:
                token = request.headers['Authorization'].split(" ")[1]
            if not token:
                return jsonify({'message': 'Token is missing! Please log in again.', 'error': 'Unauthorized'}), 401
            try:
                # Use Supabase's built-in function to verify the token
                user_response = supabase.auth.get_user(token)
                current_user = user_response.user

                # --- NEW: Fallback to profiles table if user_metadata role is missing ---
                role = current_user.user_metadata.get('role')
                if not role:
                    profile_response = supabase.table('profiles').select('role').eq('id', current_user.id).single().execute()
                    role = profile_response.data.get('role') if profile_response.data else None

                # Role checking logic
                if required_role and role != required_role:
                    return jsonify({'message': 'Access denied: You do not have permission for this action.', 'error': 'Forbidden'}), 403
            
            except Exception as e:
                return jsonify({'message': 'Token is invalid! Please log in again.', 'error': str(e)}), 401
            
            return f(current_user, *args, **kwargs)
        return decorated_function
    return decorator

# --- API Routes ---

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')
        name = data.get('name') if role == 'seeker' else data.get('companyName')

        if not all([email, password, role]):
            return jsonify({'message': 'Email, password, and role are required!', 'error': 'Bad Request'}), 400

        # --- Ensure role is set in user_metadata ---
        auth_response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": {
                    "role": role,
                    "name": name
                }
            }
        })
        
        session = auth_response.session
        new_user = session.user

        if not new_user:
            return jsonify({'message': 'Signup failed! Please try again.', 'error': 'Server Error'}), 500

        profile_data = {
            'id': new_user.id,
            'name': name,
            'role': role,
            'email': email,
            'company_name': None if role == 'seeker' else (data.get('companyName') or None)
        }
        
        profile_response = supabase.table('profiles').insert(profile_data).execute()

        if not profile_response.data:
            return jsonify({'message': 'Failed to create user profile! Please contact support.', 'error': 'Server Error'}), 500

        return jsonify({
            'token': session.access_token,
            'user': profile_response.data[0], 
            'message': 'User created successfully! Please check your email to verify.'
        }), 201

    except Exception as e:
        error_message = getattr(e, 'message', str(e))
        return jsonify({'message': 'Signup error! Please try again.', 'error': error_message}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            return jsonify({'message': 'Email and password are required!', 'error': 'Bad Request'}), 400

        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        session = auth_response.session
        user = session.user

        if not user or not session or not session.access_token:
            return jsonify({'message': 'Invalid email or password! Please try again.', 'error': 'Unauthorized'}), 401

        profile_response = supabase.table('profiles').select('*').eq('id', user.id).single().execute()

        if not profile_response.data or profile_response.data.get('role') != 'seeker':
            return jsonify({'message': 'This login is for job seekers only! Use the employer login.', 'error': 'Forbidden'}), 403

        user_data = profile_response.data

        return jsonify({
            'token': session.access_token,
            'user': user_data,
            'message': 'Login successful! Welcome back.'
        }), 200

    except Exception as e:
        error_message = getattr(e, 'message', str(e))
        return jsonify({'message': 'Login error! Please try again.', 'error': error_message}), 500

@app.route('/api/employer/login', methods=['POST'])
def employer_login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            return jsonify({'message': 'Email and password are required!', 'error': 'Bad Request'}), 400

        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        session = auth_response.session
        user = session.user

        if not user or not session or not session.access_token:
            return jsonify({'message': 'Invalid email or password! Please try again.', 'error': 'Unauthorized'}), 401

        # Fetch profile data
        profile_response = supabase.table('profiles').select('*').eq('id', user.id).single().execute()
        logger.info(f"Profile response: {profile_response}")  # Log the response for debugging
        if not profile_response.data:
            return jsonify({'message': 'User profile not found!', 'error': 'Not Found'}), 404
        if profile_response.data.get('role') != 'employer':
            return jsonify({'message': 'This login is for employers only! Use the job seeker login.', 'error': 'Forbidden'}), 403

        user_data = profile_response.data

        # Fetch employers data if exists, handle None response
        employer_response = supabase.table('employers').select('*').eq('id', user.id).maybe_single().execute()
        logger.info(f"Employer response: {employer_response}")  # Log the response for debugging
        if employer_response is not None and hasattr(employer_response, 'error') and employer_response.error:
            logger.warning(f"Employer query error: {employer_response.error}")
        elif employer_response is not None and employer_response.data and employer_response.data.get('id'):
            user_data.update(employer_response.data)

        return jsonify({
            'token': session.access_token,
            'user': user_data,
            'message': 'Employer login successful! Welcome to your dashboard.'
        }), 200

    except Exception as e:
        error_message = getattr(e, 'message', str(e))
        logger.error(f"Employer login error: {str(e)}")  # Log the full error
        return jsonify({'message': 'Employer login error! Please try again.', 'error': error_message}), 500

@app.route('/api/employer/update-profile', methods=['PUT'])
@token_required(required_role='employer')
def update_employer_profile(current_user):
    try:
        data = request.get_json()
        logger.info(f"Received employer profile data: {data}")  # Log the incoming data for debugging

        if not current_user or not current_user.id:
            return jsonify({'message': 'User not authenticated!', 'error': 'Unauthorized'}), 401

        # Prepare update data for employers table, filtering only relevant fields
        update_data = {
            'id': current_user.id,
            'company_website': data.get('company_website'),
            'company_size': data.get('company_size'),
            'industry': data.get('industry'),
            'about_company': data.get('about_company')
        }
        # Filter out None values and the id if no other data is provided
        update_data = {k: v for k, v in update_data.items() if v is not None and k != 'id'}
        if not update_data:
            return jsonify({'message': 'No valid update data provided!', 'error': 'Bad Request'}), 400

        # Check if an employers row exists
        employer_response = supabase.table('employers').select('*').eq('id', current_user.id).maybe_single().execute()
        logger.info(f"Existing employer response: {employer_response}")

        if employer_response is not None and getattr(employer_response, 'error', None):
            logger.warning(f"Employer query error: {employer_response.error}")
        elif employer_response is not None and employer_response.data:  # Update existing row
            update_response = supabase.table('employers').update(update_data).eq('id', current_user.id).execute()
            logger.info(f"Employers update response: {update_response}")
            if getattr(update_response, 'error', None) is not None:
                return jsonify({'message': 'Failed to update employer profile!', 'error': update_response.error.message if hasattr(update_response.error, 'message') else 'Unknown error'}), 400
        else:  # Insert new row
            insert_response = supabase.table('employers').insert({'id': current_user.id, **update_data}).execute()
            logger.info(f"Employers insert response: {insert_response}")
            if getattr(insert_response, 'error', None) is not None:
                return jsonify({'message': 'Failed to create employer profile!', 'error': insert_response.error.message if hasattr(insert_response.error, 'message') else 'Unknown error'}), 400

        return jsonify({
            'message': 'Employer profile updated successfully!',
            'user': {**{'id': current_user.id}, **update_data}
        }), 200

    except Exception as e:
        error_message = getattr(e, 'message', str(e))
        logger.error(f"Employer profile update error: {str(e)}")
        return jsonify({'message': 'Employer profile update error! Please try again.', 'error': error_message}), 500
@app.route('/api/profile', methods=['PUT'])
@token_required() # No specific role needed, just needs to be logged in
def update_profile(current_user):
    try:
        data = request.get_json()
        
        update_data = {k: v for k, v in data.items() if v is not None}

        if 'experience' in update_data and isinstance(update_data['experience'], list):
            update_data['experience'] = json.dumps(update_data['experience'])

        if not update_data:
            return jsonify({'message': 'No update data provided!', 'error': 'Bad Request'}), 400

        response = supabase.table('profiles').update(update_data).eq('id', current_user.id).execute()

        if response.data:
            return jsonify({'message': 'Profile updated successfully!', 'user': response.data[0]}), 200
        else:
            raise Exception("Failed to update profile")

    except Exception as e:
        error_message = getattr(e, 'message', str(e))
        return jsonify({'message': 'Profile update error! Please try again.', 'error': error_message}), 500

@app.route('/api/employer/jobs', methods=['GET'])
@token_required(required_role='employer')
def get_employer_jobs(current_user):
    try:
        response = supabase.table('jobs').select('*').eq('employer_id', current_user.id).order('created_at', desc=True).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/employer/jobs', methods=['POST'])
@token_required(required_role='employer')
def create_employer_job(current_user):
    try:
        data = request.get_json(force=True)
        required_fields = ['title', 'description']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'message': f'{field} is required'}), 400

        payload = {
            'employer_id': current_user.id,
            'title': data.get('title'),
            'description': data.get('description'),
            'location': data.get('location'),
            'salary_range': data.get('salaryRange'),  # Map camelCase to snake_case
            'job_type': data.get('jobType'),         # Map camelCase to snake_case
            'experience': data.get('experience'),
            'skills': data.get('skills'),
            'status': data.get('status', 'open'),
            'application_deadline': data.get('applicationDeadline')
        }
        
        response = supabase.table('jobs').insert(payload).execute()
        if response.data:
            return jsonify({'message': 'Job created successfully', 'job': response.data[0]}), 201
        else:
            raise Exception("Failed to create job")
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/employer/jobs/<job_id>', methods=['DELETE'])
@token_required(required_role='employer')
def delete_employer_job(current_user, job_id):  # Adjusted parameter order
    try:
        response = supabase.table('jobs').delete().eq('id', job_id).eq('employer_id', current_user.id).execute()
        if response.data:
            return jsonify({'message': 'Job deleted successfully'}), 200
        else:
            raise Exception("Job not found or unauthorized")
    except Exception as e:
        return jsonify({'message': str(e)}), 500
@app.route('/api/employer/jobs/<job_id>', methods=['PUT'])
@token_required(required_role='employer')
def update_employer_job(current_user, job_id):
    try:
        data = request.get_json(force=True)
        if 'status' not in data:
            return jsonify({'message': 'Status is required'}), 400

        updated_status = data.get('status')
        if updated_status not in ['open', 'paused', 'closed']:
            return jsonify({'message': 'Invalid status value'}), 400

        response = supabase.table('jobs').update({'status': updated_status}).eq('id', job_id).eq('employer_id', current_user.id).execute()
        if response.data:
            return jsonify({'message': 'Job updated successfully', 'job': response.data[0]}), 200
        else:
            raise Exception("Job not found or unauthorized")
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/jobs', methods=['GET'])  # New endpoint for job seekers
def get_jobs():
    try:
        response = supabase.table('jobs').select('*').eq('status', 'open').execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
# -------------------------
# Resumes CRUD (Kept as is for job seekers)
# -------------------------
@app.route("/api/resumes", methods=["GET"])
@token_required()
def get_resumes(current_user):
    try:
        res = supabase.table("resumes").select("*").eq("user_id", current_user.id).order("created_at", desc=True).execute()
        return jsonify(res.data), 200
    except Exception as e:
        return jsonify({'message': f'Failed to fetch resumes: {str(e)}', 'status': 500}), 500

@app.route("/api/resumes/upload", methods=["POST"])
@token_required()
def upload_resume(current_user):
    try:
        if "file" not in request.files:
            return jsonify({'message': 'Resume upload failed: No file part!', 'status': 400}), 400
        file = request.files["file"]
        resume_name = (request.form.get("resumeName") or "").strip()

        if not file or file.filename == "" or not resume_name:
            return jsonify({'message': 'Resume upload failed: No selected file or resume name!', 'status': 400}), 400

        timestamp = int(datetime.now(timezone.utc).timestamp())
        safe_name = file.filename
        storage_path = f"{current_user.id}/{timestamp}_{safe_name}"
        file_bytes = file.read()
        mime = file.mimetype or "application/octet-stream"

        supabase.table("resumes").insert({
            "user_id": current_user.id,
            "resume_name": resume_name,
            "file_path": storage_path,
        }).execute()

        return jsonify({'message': 'Resume uploaded successfully!', 'file_path': storage_path}), 201
    except Exception as e:
        return jsonify({'message': f'Resume upload failed: {str(e)}', 'status': 500}), 500

@app.route("/api/resumes/<int:resume_id>", methods=["DELETE"])
@token_required()
def delete_resume(current_user, resume_id):
    try:
        res = supabase.table("resumes").select("file_path").eq("id", resume_id).eq("user_id", current_user.id).single().execute()
        if not res.data:
            return jsonify({'message': 'Resume deletion failed: Resume not found!', 'status': 404}), 404

        supabase.table("resumes").delete().eq("id", resume_id).eq("user_id", current_user.id).execute()
        return jsonify({'message': 'Resume deleted successfully!'}), 200
    except Exception as e:
        return jsonify({'message': f'Resume deletion failed: {str(e)}', 'status': 500}), 500

# -------------------------
# Entry
# -------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)