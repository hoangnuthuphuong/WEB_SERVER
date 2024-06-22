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
frdate=sys.argv[1]
todate=sys.argv[2]
excelfile='Anet_typo_'+str(frdate)+'_to_'+str(todate)+'.xlsx'
filename = os.path.join(current_directory, 'public', 'download', 'QA', 'Anet_typo', excelfile)
def synch_substitute(filename):
    # roh = pyodbc.connect(Trusted_Connection='Yes',DRIVER='{SQL Server}',SERVER='PBVSQLPOC1V',UID='ngmai1', PWD='Vietnam8',database='ROH_Planning')
    try:
        anet=init_con.import_db(init_con.ANET_QA)
        # print(len(sub_list))
    except:
        return 'connection error'
    query=f"""
        SELECT M.QualityAuditID,M.AuditReferenceCD,M.PlantCD,M.FacilityTypeCD,M.DestinationCD,M.AuditTypeCD,M.AuditFunctionCD,M.FiscalYear,M.FiscalWeek,M.StyleCD,M.ColorCD,M.SizeDESC,
        M.AuditorCD,M.Manifest,M.TotalSampleSize,M.TotalDefects,M.CutLot,R.OperationCD,R.DefectCD,M.CreatedOnDate,T.Username
        FROM dbo.QualityAudits M 
        LEFT JOIN dbo.QualityAuditDetails R
        ON M.QualityAuditID=R.QualityAuditID
        LEFT JOIN dbo.Users T
        ON M.CreatedByID=UserID
        WHERE M.AuditfunctionCd in ('M','Q') AND M.CreatedOnDate>='{frdate} 00:00:00' AND M.CreatedOnDate<='{todate} 23:59:59';
    """
    data=pd.read_sql(query,anet)
    writer = pd.ExcelWriter(filename, engine='openpyxl')
    data.to_excel(writer, sheet_name="Data Typo Detail", index=False) 
    writer.save()
    return excelfile
if __name__ == "__main__":
    message=synch_substitute(filename)
    print(message)