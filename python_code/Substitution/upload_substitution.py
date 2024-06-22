import pyodbc, math, sys
import numpy as np
import pandas as pd
from datetime import date, timedelta
from datetime import datetime
import os,sys
current_directory = os.getcwd()
modulelib=os.path.join(current_directory, 'python_code', 'Module_Lib')
import importlib
parentdir = os.path.dirname(modulelib)
sys.path.insert(0,parentdir)
from Module_Lib import module_con
importlib.reload(module_con)
init_con=module_con.init_con()
# Get the current directory
current_directory = os.getcwd()
# Construct the path to the file
filename = os.path.join(current_directory, 'public', 'uploaded', 'substitution', sys.argv[1])
userup=sys.argv[2]
def synch_substitute(filename):
    # roh = pyodbc.connect(Trusted_Connection='Yes',DRIVER='{SQL Server}',SERVER='PBVSQLPOC1V',UID='ngmai1', PWD='Vietnam8',database='ROH_Planning')
    roh=init_con.import_db(init_con.ROH)
    cursor=roh.cursor()
    sub_list=pd.read_excel(filename)
    # print(len(sub_list))
    i=0
    while i<len(sub_list):
        pl=str(sub_list.iloc[i,0]).strip()
        org=str(sub_list.iloc[i,1]).strip()
        sub=str(sub_list.iloc[i,2]).strip()
        mtype=str(sub_list.iloc[i,3]).strip()
        notes=str(sub_list.iloc[i,4]).strip()
        keyx=org+sub
        sql_del="""delete from [dbo].[AIS2_SUBSTITUTION] where KEY_SKU='{keyx}'""".format(keyx=keyx)
        cursor.execute(sql_del)
        roh.commit()
        sql_ins="""
            insert into [dbo].[AIS2_SUBSTITUTION] 
            ([PLANT_CD],[KEY_SKU],[ORG_SKU],[SUB_SKU],[NOTE],[MT_TYPE],[USER_ID],[UPDATE_DATE]
            )
            values
            ('{pl}','{keyx}','{org}','{sub}','{notes}','{mtype}','ngmai1',getdate())
        """.format(pl=pl,keyx=keyx,org=org,sub=sub,notes=notes,mtype=mtype)
        cursor.execute(sql_ins)
        roh.commit()
        i=i+1
    return i
if __name__ == "__main__":
    rowup=synch_substitute(filename)
    restext='finished uploaded '+str(rowup)+' cases'
    print(restext)