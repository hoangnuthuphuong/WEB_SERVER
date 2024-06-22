import pandas as pd
import pyodbc
from datetime import datetime,timedelta
import os,sys
import importlib
parentdir = os.path.dirname('../Module_Lib')
# parentdir = os.path.dirname('C:\\Users\\ngmai1\\Documents\\Git\\AIS2\\Python\\Module_Lib')
print(parentdir)
sys.path.insert(0,parentdir)
from Module_Lib import module_con
importlib.reload(module_con)
init_con=module_con.init_con()

mega_run=['MEN_G20','MEN_G25','MEN_G30','MEN_G40','MEN_G60','MEN_G70','MEN_G80','MEN_G90'
            ,'WB_US_M','WB_US_B'
            ,'BOY_G20','BOY_G25','BOY_G30','BOY_G35','BOY_G35LL','BOY_G40','BOY_G60','BOY_G80'
            ,'WM_G10','WM_G20','WM_G40','WM_G60','WM_G80','WM_G100'
            ,'GIRL_G10','GIRL_G100','GIRL_G20','GIRL_G40','GIRL_G60'
            ,'CAN_G20','CAN_G25','CAN_G30','CAN_W_G10','CAN_W_G40','CAN_W_G60','CAN_W_G20','CANW_G70LL','CAN_G_G100','CAN_W_G100'
            ,'CAN_G40','CAN_G60','CAN_WB_EXP','CAN_G10','CAN_G50','CAN_G90','CAN_G80','CAN_G70','CAN_BTM'
            ,'US_TEEASIA'
            ,'CAN_WB','MX_WB','MX_G20','MX_G30','MX_G60','MX_G80','MX_G90','MX_WM_G100','MX_WM_G10','MX_WM_G20','MX_WM_G40','MX_WM_G60','MX _WM_G60'
        ]
if __name__=='__main__':
    print('start process')
    roh=init_con.import_db(init_con.ROH)
    cursor=roh.cursor()
    for mega in mega_run:
        sql_del=f"""delete from dbo.AIS2_setup_wc where WC_CD='{mega}'"""
        cursor.execute(sql_del) 
        roh.commit()
        sql_insert=f"""insert into dbo.AIS2_setup_wc (MEGA_WC,WC_CD,BU,UserUpdate,TimeUpdate) values ('{mega}','{mega}','US Basic','Mngoi',getdate())"""
        print(sql_insert)
        cursor.execute(sql_insert)
        roh.commit()
    print('finished')
