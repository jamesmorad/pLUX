#!/home/lux_admin/APPS/pylux/bin/ipython	
from flask import Flask, jsonify, render_template, request,Response, g
from flaskext.mysql import MySQL
import return_random_sumpod
import return_random_sumpod_test
import json
import MySQLdb
import operator
app = Flask(__name__)

DB_HOST = 'DATABASEHOST'
DB_USER = 'DATABASEUSER'
DB_PASSWD = 'DATABASEPASSWORD'
DB_NAME = 'DATABASENAME'

@app.before_request
def db_connect():
    g.db_conn = MySQLdb.connect(host=DB_HOST,
                                user=DB_USER,
                                passwd=DB_PASSWD,
                                db=DB_NAME)

@app.teardown_request
def db_disconnect(exception=None):
    g.db_conn.close()




@app.route('/')
def index():
  return render_template('index.html')

@app.route('/about')
def about():
  return render_template('about.html')

@app.route('/get_evt')
def get_evt():
  evt_dir = '/path/to/my/evtdir/'
  rq_dir = '/path/to/my/rqdir'
  pulse_dict = return_random_sumpod.get_rand_sumpod(evt_dir,rq_dir)
  
  json_data = pulse_dict
  return Response(json.dumps(json_data), mimetype='application/json')

@app.route('/user_stats', methods=['GET', 'POST'])
def get_user_stats():
  cursor = g.db_conn.cursor()
  req_json = request.get_json()
  email = req_json['email']
  username = req_json['username']
  cursor.execute("""
                SELECT COUNT(*) from classifications where username = %s
                """, [username])
  count = cursor.fetchall()
  return Response(json.dumps(count[0][0]), mimetype='application/json')

@app.route('/leaderboard')
def leaderboard():
  cursor = g.db_conn.cursor()
  cursor.execute("""
                 select email,username from classifications where username !="" group by username;
                 """)
  user_info = cursor.fetchall()
  user_dict = []
  print user_info
  for user in user_info:
    email = user[0]
    username = user[1]
    cursor.execute("""
                  SELECT COUNT(*) from classifications where username = %s
                  """, [username])
    user_stat = cursor.fetchall()
    user_dict.append({"username":username,"stats":user_stat[0][0]})
  user_dict.sort(key=operator.itemgetter("stats"),reverse=True)
  return render_template("leaderboard.html",user_stats=user_dict)

@app.route('/user_classification', methods=['GET', 'POST'])
def user_classification():
  cursor = g.db_conn.cursor()

  req_json = request.get_json()
  filename_prefix = str(req_json['filename_prefix'])
  filenumber = str(req_json['filenumber'])
  event_number = int(req_json['event_number'])
  pulse_start_samples = int(req_json['pulse_start_samples'])
  pulse_end_samples = int(req_json['pulse_end_samples'])
  luxstamp_samples = int(req_json['luxstamp_samples'])
  classification = int(req_json['classification'])
  email = g.db_conn.escape(req_json['email'])
  username = g.db_conn.escape(req_json['username'])
  notes = g.db_conn.escape(req_json['notes'])
  cursor.execute("""
                 insert into classifications (filename_prefix,filenumber,event_number,pulse_start_samples,pulse_end_samples,luxstamp_samples,classification,email,username,notes)
                 values
                 (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                 """, (filename_prefix,filenumber,event_number,pulse_start_samples,pulse_end_samples,luxstamp_samples,classification,email,username,notes))
  g.db_conn.commit()
  return ('', 204)


if __name__ == '__main__':
  app.run(debug=True,host='0.0.0.0',port=80)
