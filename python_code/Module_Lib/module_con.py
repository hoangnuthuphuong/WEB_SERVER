import pyodbc
# from sqlalchemy import create_engine
'''============================================= INIT DATA ==================================================='''
class init_con:
    OAK='OAKDWH1'
    HQ400B='hq400b'
    PROD1 ='prod1'
    PROD4 ='prod4'
    CPS_MASTER='cps'
    ANET  ='anet'
    ANET_PRO='anet_pro'
    ANET_QA='anet_qa'
    LAWSON='lawson'
    CISDB ='cisdb'
    CTS   ='cts'
    ROH   ='roh'
    ROH94   ='roh94'
    US     = 'us_planning'
    HBIVTPRD = 'sah_seq'
    ASIA_EMAIL="AsiaPlanning@hanes.com"
    ASIA_PASS ="v8vN9bjM99"
    USER_EMAIL='ngoi.mai1@hanes.com'
    def import_db(self, system_name):
        if system_name=='anet':
            return pyodbc.connect(Trusted_Connection='Yes', DRIVER='{SQL Server}', SERVER='WSANETDWv', UID='ngmai1', PWD='Vietnam8', database='Manufacturing')
        if system_name=='anet_pro':
            return pyodbc.connect(Trusted_Connection='Yes', DRIVER='{SQL Server}', SERVER='ANETDATANRT', UID='ngmai1', PWD='Vietnam8', database='ApparelNETII')
        if system_name=='anet_qa':
            return pyodbc.connect(Trusted_Connection='Yes', DRIVER='{SQL Server}', SERVER='ANETDATA', UID='ngmai1', PWD='Vietnam8', database='QualityNet')        
        elif system_name=='hq400b':
            return pyodbc.connect('Driver={iSeries Access ODBC Driver};System=HQ400B;Uid=ngmai1;Pwd=Vietnam8;')
        elif system_name=='sah_seq':
            return pyodbc.connect('Driver={iSeries Access ODBC Driver};System=HBIVTPRD;Uid=ngmai1;Pwd=Vietnam8;')
        elif system_name=='prod1':
            return pyodbc.connect('Driver={Oracle in OraClient12Home1};DBQ=PROD1;Uid=ngmai1;Pwd=Vietnam8')
        elif system_name=='prod4':
            return pyodbc.connect('Driver={Oracle in OraClient12Home1};DBQ=PROD4;Uid=ngmai1;Pwd=Vietnam8')
        elif system_name=='cisdb':
            return pyodbc.connect('Driver={Oracle in OraClient12Home1};DBQ=CISDB;Uid=QE;Pwd=QE')
        elif system_name=='cps':
            return pyodbc.connect(Trusted_Connection='Yes',DRIVER='{SQL Server}',SERVER='SQLP1BUS12\P1BUS12',UID='ngmai1', PWD='Vietnam8',database='CPSMaster')
        elif system_name=='us_planning':
            return pyodbc.connect(Trusted_Connection='Yes',DRIVER='{SQL Server}',SERVER='SQLP1BUS16\P1BUS16',UID='ngmai1', PWD='Vietnam8',database='AMSO_COMMON')
        elif system_name=='cts':
            return pyodbc.connect(DRIVER='{SQL Server}', SERVER='PBVPAYQSQL1V', UID='cts', PWD='Ct$yS123', database='PBCTS')
        elif system_name=='lawson':
            return pyodbc.connect('Driver={Oracle in OraClient12Home1};DBQ=LAWPROD;Uid=ngmai1;Pwd=Vietnam8')
        elif system_name=='OAKDWH1':
            return pyodbc.connect('Driver={Oracle in OraClient12Home1};DBQ=OAKDWHP1;Uid=ngmai1;Pwd=Vietnam8')
        elif system_name=='roh':
            return pyodbc.connect(Trusted_Connection='Yes',DRIVER='{SQL Server}',SERVER='PBVSQLPOC1V',UID='ngmai1', PWD='Vietnam8',database='ROH_Planning')
        elif system_name=='roh94':
            return pyodbc.connect(Trusted_Connection='No',DRIVER='{SQL Server}',SERVER='PBV-G1PY8X2\SQLEXPRESS',UID='ngoikk', PWD='ngoi1kk',database='ROH_Planning')
        else:
            return 'database not found'