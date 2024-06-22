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
filename = os.path.join(current_directory, 'public', 'uploaded', 'Bom', sys.argv[1])


def synch_substitute(filename):
    # roh = pyodbc.connect(Trusted_Connection='Yes',DRIVER='{SQL Server}',SERVER='PBVSQLPOC1V',UID='ngmai1', PWD='Vietnam8',database='ROH_Planning')
    roh=init_con.import_db(init_con.ROH)
    cursor=roh.cursor()
    sub_list=pd.read_excel(filename)
    # print(len(sub_list))
    sql_del=f"""delete from [dbo].[AIS2_data_actual_usage] where PLANT_CD IN ('{plant}')"""
    cursor.execute(sql_del)
    roh.commit()
    i=0
    while i<len(sub_list):
        style=str(sub_list.iloc[i,1]).strip()
        color=str(sub_list.iloc[i,2]).strip()
        size=str(sub_list.iloc[i,3]).strip()
        stype=str(sub_list.iloc[i,4]).strip()
        item=str(sub_list.iloc[i,5]).strip()
        icolor=('000'+str(sub_list.iloc[i,6]).strip())[-3:]
        iattr=str(sub_list.iloc[i,7]).strip()
        iprint=str(sub_list.iloc[i,8]).strip()
        if 'nan' in iprint:
            iprint=''
        isize=str(sub_list.iloc[i,9]).strip()
        spcd=str(sub_list.iloc[i,10]).strip()
        if 'nan' in spcd:
            spcd=''
        usage=str(sub_list.iloc[i,11]).strip()
        note=str(sub_list.iloc[i,12]).strip()
        sql_ins=f"""
            insert into [dbo].[AIS2_data_actual_usage] 
            ([PLANT_CD],[STYLE_CD],[COLOR_CD],[SIZE_CD],[STYLE_TYPE],[ITEM_STYLE],[ITEM_COLOR],[ITEM_ATTRIBUTE],PRINT_CD,[ITEM_SIZE],[SPREAD_CD]
            ,[NEW_USAGE],[IS_ADD],[TimeUpdate],[UserUpdate]
            )
            values
            ('{plant}','{style}','{color}','{size}','{stype}','{item}','{icolor}','{iattr}','{iprint}','{isize}','{spcd}','{usage}','{note}',getdate(),'{userup}')
        """
        cursor.execute(sql_ins)
        roh.commit()
        i=i+1
    return i
if __name__ == "__main__":
    rowup=synch_substitute(filename)
    restext='finished uploaded '+str(rowup)+' cases'
    print(restext)