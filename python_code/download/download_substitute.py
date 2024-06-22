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
plant=sys.argv[1]
excelfile='plant_'+plant+'_Substitution_'+datetime.now().strftime('%Y-%m-%d')+'.xlsx'
filename = os.path.join(current_directory, 'public', 'download', 'substitute', 'template', excelfile)
def synch_substitute(filename):
    # roh = pyodbc.connect(Trusted_Connection='Yes',DRIVER='{SQL Server}',SERVER='PBVSQLPOC1V',UID='ngmai1', PWD='Vietnam8',database='ROH_Planning')
    try:
        roh=init_con.import_db(init_con.ROH)
        # print(len(sub_list))
    except:
        return 'connection error'
    data=pd.read_sql('SELECT * FROM [ROH_planning].[dbo].[AIS2_data_substitution] ORDER BY ORG_STYLE,ORG_COLOR,ORG_ATTRIBUTE,ORG_SIZE',roh)
    writer = pd.ExcelWriter(filename, engine='openpyxl')
    data.to_excel(writer, sheet_name="substitution detail", index=False) 
    writer.save()
    return excelfile
if __name__ == "__main__":
    message=synch_substitute(filename)
    print(message)