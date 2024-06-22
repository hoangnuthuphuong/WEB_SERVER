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
# current_directory = os.getcwd()
# Construct the path to the file
filename = os.path.join(current_directory, 'public', 'uploaded', 'IT', 'Leadtime', sys.argv[1])
userup=sys.argv[2]
def synch_substitute(filename):
    # roh = pyodbc.connect(Trusted_Connection='Yes',DRIVER='{SQL Server}',SERVER='PBVSQLPOC1V',UID='ngmai1', PWD='Vietnam8',database='ROH_Planning')
    try:
        roh=init_con.import_db(init_con.ROH)
        cursor=roh.cursor()
        sub_list=pd.read_excel(filename)
        # print(len(sub_list))
    except:
        return False,0,'connection error'
    sql_del="""DELETE FROM [dbo].[AIS2_STYLE_LEADTIME_INTIMATES]"""
    cursor.execute(sql_del)
    roh.commit()
    error_string='sku_error:\n'
    e=True
    i=0
    while i<len(sub_list):
        style=str(sub_list.iloc[i,0]).strip()
        color=str(sub_list.iloc[i,1]).strip()
        mlt=str(sub_list.iloc[i,2]).strip().split('.')[0]
        plt=str(sub_list.iloc[i,3]).strip().split('.')[0]
        wlt=str(sub_list.iloc[i,4]).strip().split('.')[0]
        slt=str(sub_list.iloc[i,5]).strip().split('.')[0]
        keyx=style+color
        try:
            sql_ins=f"""
                insert into [dbo].[AIS2_STYLE_LEADTIME_INTIMATES] 
                ([STYLE],[COLOR],[Material_LT],[Planing_LT],[WO_LT],[SEW_LEADTIME],[USERUPDATE],[TIMEUPDATE],[NOTE]
                )
                values
                ('{style}','{color}','{mlt}','{plt}','{wlt}','{slt}','{userup}',getdate(),'web-service')
                """
            cursor.execute(sql_ins)
            roh.commit()
        except:
            e=False
            error_string+=keyx+'\n'
        i=i+1
    return e,i,error_string
if __name__ == "__main__":
    result,rowinput,message=synch_substitute(filename)
    if result:
        restext='finished uploaded '+str(rowinput)+' cases'
    else:
        restext=message
    print(restext)