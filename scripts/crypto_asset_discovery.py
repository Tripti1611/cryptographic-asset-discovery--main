import base64
import paramiko
import getpass
import pymysql
import os

class crypto_asset_discovery():

    def __init__(self,machine_os): 
        self.client = paramiko.SSHClient()
        self.client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        # self.machine_ip=machine_ip
        # self.username=username
        # self.password=password
        # self.machine_os=machine_os
        self.db_ip="localhost"
        self.db_port=3306
        self.db = pymysql.connect(host="localhost",user="root",password="SKLM@admin123",database="cad" )
        self.cursor = self.db.cursor()

    def remote_machine_login(self,machine_ip,username,password):
        """This method is to login remote machine"""
        self.client.connect(machine_ip, username=username, password=password)
    
    def set_certificate_details(self,certificate_details=None,required_details=None,machine_ip="9.202.178.116"):
        """This method is to insert entries in database"""
        for detail in required_details.keys():
                    detail=str(detail).replace(":","")
                    if "CA" not in certificate_details.keys():
                         certificate_details["CA"]="N/A"
                    if detail not in certificate_details.keys():
                         certificate_details[detail]="null"
        print(certificate_details)
        status_green = "green"
        if certificate_details is not  None and certificate_details["Issuer"]!="null":
            certificate_query=f'insert into cad.certificate_details (version,serial_number,public_key_algorithm,public_key,issuer,start_date,enddate,subject_name,subject_key_identifier,ca_approved,signature_algorithm,certificate_name,server_name,status) values' \
            f'("{certificate_details["Version"]}","{certificate_details["Serial Number"]}","{certificate_details["Public Key Algorithm"]}","{certificate_details["Public-Key"]}","{certificate_details["Issuer"]}","{certificate_details["Not Before"]}","{certificate_details["Not After "]}","{certificate_details["Subject"]}","{certificate_details["X509v3 Subject Key Identifier"]}","{certificate_details["CA"]}","{certificate_details["Signature Algorithm"]}","{certificate_details["file_path"]}","{machine_ip}","{status_green}")'
            #Check if file has been scanned
            sql=f"select count(*) from cad.certificate_details where certificate_name='{certificate_details['file_path']}'"
            self.cursor.execute(sql)
            file_count=self.cursor.fetchall()
            file_count=file_count[0][0]
            if file_count==0:
                print(certificate_query)
                self.cursor.execute(certificate_query)
                self.db.commit()

    def get_certificate_details(self,file_path,os_type=1,machine_ip=None):
            """This method is to get available certificate details from remote machine"""
            if int(os_type)==1:
                table_dict={}
                required_details={"Version:":0,"Serial Number:":0,"Public Key Algorithm:":0,"Issuer:":0,"Not Before:":0,"Not After :":0,"Subject:":0,"X509v3 Subject Key Identifier:":1,"CA:":0,"Signature Algorithm:":0,"Public-Key:":0}        
                if 'der' in file_path:
                    print(f"::::::::::::::::::::::::::::::::::::{file_path}::::::::::::::::::::::::::::::::::::::::::::::::")
                    for detail in required_details:
                        command='openssl x509 -text -noout -inform DER -in {}|grep -m 1 "{}" -A {}'.format(file_path,detail,required_details[detail]).replace('\n', '')
                        #print(command)
                        stdin, stdout, stderr = self.client.exec_command(command)
                        value=self.print_details(stdout,detail)
                        if value!='' and  len(value)>0:
                            table_dict[str(detail).replace(":","")]=value
                    table_dict['file_path']=str(file_path).replace('\n', '')
                if 'p12' in file_path:
                    print(f"::::::::::::::::::::::::::::::::::::{file_path}::::::::::::::::::::::::::::::::::::::::::::::::")
                    p12_pass="passw0rd" # need to be parameterized
                    stdin, stdout, stderr =self.client.exec_command("rm -rf /db2cert.cert")
                    command="/usr/bin/keytool -export -alias db2cert -keystore {}  -storetype PKCS12  -storepass {} -rfc -file /db2cert.cert".format(file_path,p12_pass).replace('\n', '').strip()
                    stdin, stdout, stderr =self.client.exec_command(command)
                    for detail in required_details:
                        print('openssl x509 -in /db2cert.cert -text -noout |grep -m 1 "{}" -A {}'.format(detail,required_details[detail]).replace('\n', '').strip())
                        stdin, stdout, stderr = self.client.exec_command('openssl x509 -in /db2cert.cert -text -noout |grep -m 1 "{}" -A {}'.format(detail,required_details[detail]).replace('\n', '').strip())
                        #print(stdout)
                        value=self.print_details(stdout,detail)
                        if value!='' and  len(value)>0:
                            table_dict[str(detail).replace(":","")]=value
                    table_dict['file_path']=str(file_path).replace('\n', '')
                    #self.client.exec_command("rm -rf /db2cert.cert")
                if 'cer' in file_path:
                    print(f"::::::::::::::::::::::::::::::::::::{file_path}::::::::::::::::::::::::::::::::::::::::::::::::")
                    for detail in required_details:
                        stdin, stdout, stderr = self.client.exec_command(f'openssl x509 -inform pem -noout -text -in {file_path}| grep -m 1 "{detail}" -A {required_details[detail]}'.replace('\n', '').strip())
                        value=self.print_details(stdout,detail)
                        if value!='' and  len(value)>0:
                            table_dict[str(detail).replace(":","")]=value
                    table_dict['file_path']=str(file_path).replace('\n', '')
                if 'p7s' in file_path:
                    print(f"::::::::::::::::::::::::::::::::::::{file_path}::::::::::::::::::::::::::::::::::::::::::::::::")
                    for detail in required_details:
                        stdin, stdout, stderr = self.client.exec_command(f'openssl cms -in {file_path} -noout -cmsout -print | grep "{detail}" -A {required_details[detail]}'.replace('\n', '').strip())
                        value=self.print_details(stdout,detail)
                        if value!='' and  len(value)>0:
                            table_dict[str(detail).replace(":","")]=value
                    table_dict['file_path']=str(file_path).replace('\n', '')
                if 'pfx' in file_path: 
                    print(f"::::::::::::::::::::::::::::::::::::{file_path}::::::::::::::::::::::::::::::::::::::::::::::::")
                    for detail in required_details:
                        stdin, stdout, stderr = self.client.exec_command(f'openssl pkcs12 -info -in {file_path} | grep "{detail}" -A {required_details[detail]}'.replace('\n', '').strip())
                        value=self.print_details(stdout,detail)
                        if value!='' and  len(value)>0:
                            table_dict[str(detail).replace(":","")]=value
                        table_dict['file_path']=str(file_path).replace('\n', '')
                self.set_certificate_details(table_dict,required_details,machine_ip)
            if int(os_type)==2:
                    stdin, stdout, stderr = self.client.exec_command(f'certutil -dump "{file_path}"')
                    self.print_details(stdout)
                
                
            
    def print_details(self,output,detail):
        """This method is to fetch required lines"""
        readline=""
        for readline in output:
                continue
        return str(readline.strip('\n')).replace(detail,"").strip()

    def check_dir(self,os_type,machine_ip):
        """This method is to search for crypto assets in remote machine"""
        if int(os_type)==1:
            stdin, stdout, stderr = self.client.exec_command('find / -name "*.cer" -o -name "*.p7s" -o -name "*.der"	-o -name "*.p12"')
            #stdin, stdout, stderr = client.exec_command(' ls')
            for line in stdout:
                print('... ' + line.strip('\n'))
                self.get_certificate_details(line,machine_ip=machine_ip)
        elif int(os_type)==2:
            stdin, stdout, stderr = self.client.exec_command('wmic logicaldisk get name')
            dir=[]
            for line in stdout:
                if "Name" in line:
                    continue
                else:
                    dir.append(line)
                    dir=[x.replace("\r","").replace("\n","").strip() for x in dir if "\r" or "\n" in x]
                #print(dir)
            for d in dir:
                    #print(d)
                    if ":" in d:
                        if "c" in d.lower():
                            stdin, stdout, stderr = self.client.exec_command(f'cd \\')
                        else:
                            stdin, stdout, stderr = self.client.exec_command(f'cd {d}')
                        stdin, stdout, stderr = self.client.exec_command(f"dir \*.der  \*.p12  \*.cer \*.p7s \*.pfx /s /b")
                        #print_details(stdout)
                        for line in stdout:
                            self.get_certificate_details(line,os_type=2)
            
        self.client.close()





if __name__ == "__main__":
    machine_os=input("Enter Machine IP: \n Enter 1 for Linux \n Enter 2 Windows \n")
    #machine_ip=input("Enter Machine IP:")
    #username=input("Please enter Username:")
    #password=getpass.getpass(prompt='Enter Password:')
    password="Belacasa@0123456789"
    cad=crypto_asset_discovery(machine_os=machine_os)
    #cad.remote_machine_login(machine_ip,username,password)
    cad.check_dir(machine_os)
    #cad.set_certificate_details()
