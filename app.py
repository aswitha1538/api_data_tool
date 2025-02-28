from flask import Flask, request, jsonify, render_template 
import urllib3 
import json
from urllib3.exceptions import HTTPError, RequestError 

app = Flask(__name__)
http = urllib3.PoolManager()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/fetch_repos', methods=['POST'])
def fetch_repos():
    data = request.get_json()
    username = data.get('username')
    if not username:
        return jsonify({'error': 'Username is required'}), 400

    url = f"https://api.github.com/users/{username}/repos"
    try:
        response = http.request('GET', url)
        if response.status == 200:
            repos = json.loads(response.data.decode('utf-8'))
            repo_list = [{'name': repo['name'], 'stars': repo['stargazers_count']} for repo in repos[:5]]
            return jsonify({'repos': repo_list, 'count': len(repos)})
        else:
            return jsonify({'error': f"Status Code: {response.status}"}), response.status
    except (HTTPError, RequestError) as e:
        return jsonify({'error': str(e)}), 500
    except json.JSONDecodeError:
        return jsonify({'error': 'Could not parse response data'}), 500

@app.route('/post_data', methods=['POST'])
def post_data():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    url = "https://httpbin.org/post"
    try:
        response = http.request('POST', url, fields=data)
        if response.status == 200:
            result = json.loads(response.data.decode('utf-8'))
            return jsonify({
                'status': 'success',
                'sent_data': data,
                'response': result['form']
            })
        else:
            return jsonify({'error': f"Status Code: {response.status}"}), response.status
    except (HTTPError, RequestError) as e:
        return jsonify({'error': str(e)}), 500
    except json.JSONDecodeError:
        return jsonify({'error': 'Could not parse response data'}), 500

if __name__ == '__main__':
    app.run(debug=True)