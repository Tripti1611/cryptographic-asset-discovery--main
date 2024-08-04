import pymysql
from flask import jsonify,Flask,request
from flask_cors import CORS
import json
from crypto_asset_discovery import crypto_asset_discovery
import paramiko



app = Flask(__name__)
CORS(app)
db_ip="localhost"
db_port=3306

def get_db_data(query,is_update_table=False):
       db = pymysql.connect(host="localhost",user="root",password="SKLM@admin123",database="cad")
       cursor = db.cursor()
       cursor.execute(query)
       if is_update_table:
              db.commit()
              result=None
       else:
              result=cursor.fetchall()
       cursor.close()
       return result

@app.route('/api/v1/certificates/all', methods=['GET'])
def get_certificate_details():
        sql="select version,serial_number,public_key_algorithm,public_key,issuer,start_date,enddate,subject_name,subject_key_identifier,ca_approved,signature_algorithm,certificate_name,server_name from cad.certificate_details"
        tuples=get_db_data(sql)
        keys=("version","serial_number","public_key_algorithm","public_key","issuer","startdate","enddate","subject_name","subject_key_identifier","ca_approved","signature_algorithm","certificate_name","server_name")
        result = [{k: v for k, v in zip(keys, tup)} for tup in tuples]
        print (jsonify(result),"###############")
        return json.dumps(result)

@app.route('/api/v1/certificates', methods=['GET'])
def get_certificate_details_ip():
        server_name=request.args.get('server_name')
        sql="select version,serial_number,public_key_algorithm,public_key,issuer,start_date,enddate,subject_name,subject_key_identifier,ca_approved,signature_algorithm,certificate_name,server_name,status from cad.certificate_details where server_name={}".format(server_name)
        tuples=get_db_data(sql)
        keys=("version","serial_number","public_key_algorithm","public_key","issuer","startdate","enddate","subject_name","subject_key_identifier","ca_approved","signature_algorithm","certificate_name","server_name","status")
        result = [{k: v for k, v in zip(keys, tup)} for tup in tuples]
        return jsonify(result)


@app.route('/api/v1/certificates/find', methods=['POST'])
def discover_certificates():
        cad=crypto_asset_discovery(machine_os=1)
        server_name=request.json['server_name']
        sql="select username,password from cad.server_details where server_name='{}'".format(server_name)
        data=get_db_data(sql)
        print(data)
        cad.remote_machine_login(machine_ip=server_name,username=data[0][0],password=data[0][1])
        cad.check_dir(os_type=1,machine_ip=server_name)
        server_update = "update cad.server_details set status=2 where server_name='{}'".format(server_name)
        get_db_data(server_update, is_update_table=True)
        return jsonify({"message": "Discovery completed!!"})

@app.route('/api/v1/server/all', methods=['GET'])
def get_server_details():
        sql="select server_name,username, ds.status from cad.server_details sd Join cad.discovery_status ds on sd.status=ds.id"
        tuples=get_db_data(sql)
        keys=("server","username","status")
        result = [{k: v for k, v in zip(keys, tup)} for tup in tuples]
        return jsonify(result)

@app.route('/api/v1/server/create', methods=['POST'])
def add_server_details():
        machine_ip=request.json['machine_ip']
        username=request.json['username']
        password=request.json['password']
        sql="select count(*) from cad.server_details where server_name='{}' ".format(machine_ip)
        tuples=get_db_data(sql)
        result=tuples[0][0]
        if result==0:
            print("############################################")
            server_query=f'insert into cad.server_details (server_name,username,password,status,discovery_date) values ("{machine_ip}","{username}","{password}","1",now())'
            print(server_query)
            get_db_data(server_query,is_update_table=True)
            
        keys=("server","username","status")
        #result = [{k: v for k, v in zip(keys, tup)} for tup in tuples]
        return jsonify({"message":"System added successfully!"})

if __name__ == '__main__':
    app.run(port=8088)
        
