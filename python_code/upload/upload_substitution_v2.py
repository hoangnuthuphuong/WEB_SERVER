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
userup=sys.argv[2]
plant='90'
user90=['ngoikk','Tri']
user93=['Jintana']
if userup in user90:
    plant='90'
if userup in user93:
    plant='93'
filename = os.path.join(current_directory, 'public', 'uploaded', 'substitution', sys.argv[1])

def synch_substitute(filename):
    # roh = pyodbc.connect(Trusted_Connection='Yes',DRIVER='{SQL Server}',SERVER='PBVSQLPOC1V',UID='ngmai1', PWD='Vietnam8',database='ROH_Planning')
    roh=init_con.import_db(init_con.ROH)
    cursor=roh.cursor()
    sub_list=pd.read_excel(filename)
    # print(len(sub_list))
    sql_del=f"""delete from [dbo].[AIS2_data_substitution] where PLANT IN ('{plant}')"""
    cursor.execute(sql_del)
    roh.commit()
    i=0
    while i<len(sub_list):
        ostyle=str(sub_list.iloc[i,1]).strip()
        ocolor=('000'+str(sub_list.iloc[i,2]).strip())[-3:]
        oattr=str(sub_list.iloc[i,3]).strip()
        osize=str(sub_list.iloc[i,4]).strip()
        sstyle=str(sub_list.iloc[i,5]).strip()
        scolor=('000'+str(sub_list.iloc[i,6]).strip())[-3:]
        sattr=str(sub_list.iloc[i,7]).strip()
        ssize=str(sub_list.iloc[i,8]).strip()
        mt_type=str(sub_list.iloc[i,9]).strip()
        note=str(sub_list.iloc[i,10]).strip()
        sql_ins=f"""
            insert into [dbo].[AIS2_data_substitution] 
            ([PLANT],[ORG_STYLE],[ORG_COLOR],[ORG_ATTRIBUTE],[ORG_SIZE]
            ,[SUB_STYLE],[SUB_COLOR],[SUB_ATTRIBUTE],[SUB_SIZE],[TYPE_CD],[NOTE],[UserUpdate],[TimeUpdate]
            )
            values
            ('{plant}','{ostyle}','{ocolor}','{oattr}','{osize}','{sstyle}','{scolor}','{sattr}','{ssize}','{mt_type}','{note}','{userup}',getdate())
        """
        cursor.execute(sql_ins)
        roh.commit()
        i=i+1
    return i
if __name__ == "__main__":
    rowup=synch_substitute(filename)
    restext='finished uploaded '+str(rowup)+' cases'
    print(restext)