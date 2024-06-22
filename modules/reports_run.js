const {PythonShell} = require('python-shell');
var express = require("express");
var app = express.Router();
module.exports=app;


/*======================= odbc query example =======================*/
const odbc = require('odbc');

// Connect to the ODBC data source
const connection = odbc.connect('DSN=YOUR_DSN_NAME;UID=DB_USERNAME;PWD=DB_PASSWORD', function(err) {
  if (err) {
    console.error(err.message);
  }
});

// Function to execute a SELECT statement
function getOdbc_Data(callback) {
  connection.query('SELECT * FROM MY_TABLE', function(err, result) {
    if (err) {
      console.error(err.message);
      return;
    }

    callback(result);
  });
}

// Use the getData function
getOdbc_Data(function(result) {
  console.log(result);
});

// odbc query function for
const odbc = require('odbc');

// Connect to the ODBC data source
const odbc_con = odbc.connect('DSN=YOUR_DSN_NAME;UID=DB_USERNAME;PWD=DB_PASSWORD', function(err) {
  if (err) {
    console.error(err.message);
  }
});

// Function to execute a SELECT statement
function getData(query, callback) {
    odbc_con.query(query, function(err, result) {
    if (err) {
      console.error(err.message);
      return;
    }

    callback(result);
  });
}

// Use the getData function
getData('SELECT * FROM MY_TABLE', function(result) {
  console.log(result);
});


/*======================= SYNCHRONIZE WITH SYSTEM =======================*/
var weekly_dpr_material_requirement = require('node-cron');
var weekly_firm_material_requirement = require('node-cron');
var weekly_bom_refresh = require('node-cron');
var AIS_data_DPr_demand = require('node-cron');
var selling_dpr_category = require('node-cron');
weekly_dpr_material_requirement.schedule('0 59 0 * * TUE', function(){
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/Material_Requirement/Reports',
        pythonOptions: ['-u'], // get print results in real-time
        args:['start']
    };
    console.log('Processing DPR Material Requirement');
    let shell=new PythonShell('Material_Requirement.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
weekly_firm_material_requirement.schedule('20 5 1 * * MON', function(){
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/Material_Requirement/Reports',
        pythonOptions: ['-u'], // get print results in real-time
        args:['PB']
    };
    console.log('Processing FIRM Material Requirement');
    let shell=new PythonShell('Material_Requirement_Full_Official.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
weekly_firm_material_requirement.schedule('20 6 1 * * MON', function(){
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/Material_Requirement/Reports',
        pythonOptions: ['-u'], // get print results in real-time
        args:['HYN']
    };
    console.log('Processing FIRM Material Requirement');
    let shell=new PythonShell('Material_Requirement_Full_Official.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
weekly_bom_refresh.schedule('0 0 15 * * SAT', function(){
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/FlatBOM_sync',
        pythonOptions: ['-u'], // get print results in real-time
        args:['PB']
    };
    console.log('Processing Flat BOM supplies');
    let shell=new PythonShell('FlatBOM_sync.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
weekly_bom_refresh.schedule('0 1 15 * * SAT', function(){
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/FlatBOM_sync',
        pythonOptions: ['-u'], // get print results in real-time
        args:['HYN']
    };
    console.log('Processing Flat BOM supplies');
    let shell=new PythonShell('FlatBOM_sync.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
/*====================== REPORT ===============================*/
var weekly_inventory_report = require('node-cron');
var weekly_production_shipment = require('node-cron');
var dpr_material = require('node-cron');
var mpw_fabric_grouping = require('node-cron');
var export_wo_plant = require('node-cron');
var excess_inventory = require('node-cron');
var po_shipment = require('node-cron');
var pb_cutoff = require('node-cron');
var no_demand = require('node-cron');
/*========= WEEKLY REPORT =========*/
weekly_inventory_report.schedule('0 0 4 * * MON', function(){
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/Inventory_Report/Reports',
        pythonOptions: ['-u'], // get print results in real-time
        args:['start']
    };
    console.log('Processing Weekly Inventory Report');
    let shell=new PythonShell('Inventory_Report.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
weekly_production_shipment.schedule('0 50 12 * * SUN', function(){
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/Production_Shipment/Reports',
        pythonOptions: ['-u'], // get print results in real-time
        args:['start']
    };
    console.log('Processing Weekly MTD Production Shipment');
    let shell=new PythonShell('Production_Shipment_MTD.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
mpw_fabric_grouping.schedule('0 30 16 * * MON', function(){
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/MRP_Fabric_Grouping/Reports',
        pythonOptions: ['-u'], // get print results in real-time
        args:['start']
    };
    console.log('Processing MRP Fabric Grouping');
    let shell=new PythonShell('MRP_Fabric_Grouping.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
export_wo_plant.schedule('0 0 8 * * MON', function(){
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/Material_Requirement/Reports',
        pythonOptions: ['-u'], // get print results in real-time
        args:['start']
    };
    console.log('Processing Export Material by Plant');
    let shell=new PythonShell('Export_Material_by_Plant.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
excess_inventory.schedule('0 0 8 * * TUE', function(){
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/Excess_WO/Report',
        pythonOptions: ['-u'], // get print results in real-time
        args:['start']
    };
    console.log('Processing Excess inventory');
    let shell=new PythonShell('Excess_Inventory.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});


po_shipment.schedule('0 0 9 * * MON', function(){
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/PO_Shipment/Report', 
        pythonOptions: ['-u'], // get print results in real-time
        args:['start']
    };
    console.log('Processing PO Shipment');
    let shell=new PythonShell('PO_Shipment.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});

pb_cutoff.schedule('0 28 10 * * SUN', function(){
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/PB_Cutoff',
        pythonOptions: ['-u'], // get print results in real-time
        args:['start']
    };
    console.log('Processing PB Cutoff time');
    let shell=new PythonShell('Refresh_Cutoff.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
no_demand.schedule('0 0 16 * * MON', function(){
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/No_Demand/Reports',
        pythonOptions: ['-u'], // get print results in real-time
        args:['MON']
    };
    console.log('Processing No Demand Report');
    let shell=new PythonShell('No_Demand_Official.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
/*========= DAILY REPORT ==========*/
var daily_production_shipment = require('node-cron');
daily_production_shipment.schedule('0 5 1 * * *', function(){
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/Production_Shipment/Reports',
        pythonOptions: ['-u'], // get print results in real-time
        args:['start']
    };
    console.log('Processing Production Report');
    let shell=new PythonShell('Production_Shipment_WTD.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
daily_production_shipment.schedule('0 35 12 * * SUN', function(){
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/Production_Shipment/Reports',
        pythonOptions: ['-u'], // get print results in real-time
        args:['start']
    };
    console.log('Processing Production Report');
    let shell=new PythonShell('Production_Shipment_WTD.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
// daily_production_shipment.schedule('0 20 1 * * *', function(){
//     var options = {
//         mode: 'text',
//         pythonPath: 'python',
//         scriptPath: './public/Python/Production_Shipment/Reports',
//         pythonOptions: ['-u'], // get print results in real-time
//         args:['start']
//     };
//     console.log('Processing Production Report');
//     let shell=new PythonShell('Production_Shipment_MTD_90.py', options);
//     shell.on('message', function(message){
//         console.log(message);
//     });
// });
var daily_shipping_material = require('node-cron');
// daily_shipping_material.schedule('0 5 23 * * *', function(){
//     var options = {
//         mode: 'text',
//         pythonPath: 'python',
//         scriptPath: './public/Python/Shipping_Report/Reports',
//         pythonOptions: ['-u'], // get print results in real-time
//         args:['start']
//     };
//     console.log('Processing Shipping Material');
//     let shell=new PythonShell('Shipping_Vendor.py', options);
//     shell.on('message', function(message){
//         console.log(message);
//     });
// });
daily_shipping_material.schedule('0 30 0 * * *', function(){
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/Shipping_Report/Reports',
        pythonOptions: ['-u'], // get print results in real-time
        args:['start']
    };
    console.log('Processing Shipping Material');
    let shell=new PythonShell('Shipping_Report.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
/*====== BI-WEEKLY REPORT =======*/
// var material_coverage = require('node-cron');
// material_coverage.schedule('0 40 15 * * MON', function(){
//     var options = {
//         mode: 'text',
//         pythonPath: 'python',
//         scriptPath: './public/Python/Material_Coverage/Reports',
//         pythonOptions: ['-u'], // get print results in real-time
//         args:['PB']
//     };
//     console.log('Processing Material Coverage Report');
//     let shell=new PythonShell('Material_Coverage_2.py', options);
//     shell.on('message', function(message){
//         console.log(message);
//     });
// });
// material_coverage.schedule('10 40 15 * * MON', function(){
//     var options = {
//         mode: 'text',
//         pythonPath: 'python',
//         scriptPath: './public/Python/Material_Coverage/Reports',
//         pythonOptions: ['-u'], // get print results in real-time
//         args:['HYN']
//     };
//     console.log('Processing Material Coverage Report');
//     let shell=new PythonShell('Material_Coverage_2.py', options);
//     shell.on('message', function(message){
//         console.log(message);
//     });
// });
// material_coverage.schedule('20 40 15 * * MON', function(){
//     var options = {
//         mode: 'text',
//         pythonPath: 'python',
//         scriptPath: './public/Python/Material_Coverage/Reports',
//         pythonOptions: ['-u'], // get print results in real-time
//         args:['HYS']
//     };
//     console.log('Processing Material Coverage Report');
//     let shell=new PythonShell('Material_Coverage_2.py', options);
//     shell.on('message', function(message){
//         console.log(message);
//     });
// });


/*-----WO CREATION-------*/
var wo_creation = require('node-cron');
var po_creation = require('node-cron');
wo_creation.schedule('0 5 0 * * SUN', function(){//refresh table
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/WO_Creation',
        pythonOptions: ['-u'], // get print results in real-time
        args:['INIT','system']
    };
    console.log('Processing INIT');
    let shell=new PythonShell('0.AIS_data_cutofftime.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
wo_creation.schedule('0 0 6 * * MON', function(){//CPS
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/WO_Creation',
        pythonOptions: ['-u'], // get print results in real-time
        args:['CPS','system']
    };
    console.log('Processing INIT');
    let shell=new PythonShell('0.AIS_data_cutofftime.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
wo_creation.schedule('0 35 10 * * SUN', function(){//WIP
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/WO_Creation',
        pythonOptions: ['-u'], // get print results in real-time
        args:['WIP','system']
    };
    console.log('Processing WIP');
    let shell=new PythonShell('0.AIS_data_cutofftime.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
wo_creation.schedule('0 30 10 * * SUN', function(){//ON HAND FAB
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/WO_Creation',
        pythonOptions: ['-u'], // get print results in real-time
        args:['ON HAND FAB','system']
    };
    console.log('Processing ON HAND FAB');
    let shell=new PythonShell('0.AIS_data_cutofftime.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
wo_creation.schedule('0 30 10 * * SUN', function(){//ON HAND RM
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/WO_Creation',
        pythonOptions: ['-u'], // get print results in real-time
        args:['ON HAND RM','system']
    };
    console.log('Processing ON HAND RM');
    let shell=new PythonShell('0.AIS_data_cutofftime.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
wo_creation.schedule('0 30 10 * * SUN', function(){//ON ORDER
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/WO_Creation',
        pythonOptions: ['-u'], // get print results in real-time
        args:['ON ORDER','system']
    };
    console.log('Processing ON ORDER');
    let shell=new PythonShell('0.AIS_data_cutofftime.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
wo_creation.schedule('0 30 7 * * MON', function(){//TIL
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/WO_Creation',
        pythonOptions: ['-u'], // get print results in real-time
        args:['TIL Report','system']
    };
    console.log('Processing TIL Report');
    let shell=new PythonShell('0.AIS_data_cutofftime.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
wo_creation.schedule('0 45 7 * * MON', function(){//DPR + WO creation
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/WO_Creation',
        pythonOptions: ['-u'], // get print results in real-time
        args:['DPR','system']
    };
    console.log('Processing DPR');
    let shell=new PythonShell('0.AIS_data_cutofftime.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
po_creation.schedule('0 0 2 * * WED', function(){//Item information from LW
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/WO_Creation',
        pythonOptions: ['-u'], // get print results in real-time
        args:['New WIP','system']
    };
    console.log('Processing Item infor from LW');
    let shell=new PythonShell('1.AIS_data_item_infor.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
po_creation.schedule('0 30 2 * * WED', function(){//Item information from MPW
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/WO_Creation',
        pythonOptions: ['-u'], // get print results in real-time
        args:['New WIP','system']
    };
    console.log('Processing Item infor from MPW');
    let shell=new PythonShell('2.AIS_data_item_infor_mpw.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
po_creation.schedule('0 0 8 * * WED', function(){//Selling style LT
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/WO_Creation',
        pythonOptions: ['-u'], // get print results in real-time
        args:['New WIP','system']
    };
    console.log('Processing Selling style LT');
    let shell=new PythonShell('3.AIS_setup_sellstyle_leadtime.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
po_creation.schedule('0 45 0 * * THU', function(){//New WIP + New WIP Material Requirement
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/WO_Creation',
        pythonOptions: ['-u'], // get print results in real-time
        args:['New WIP','system']
    };
    console.log('Processing DPR');
    let shell=new PythonShell('0.AIS_data_cutofftime.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
po_creation.schedule('0 35 8 * * THU', function(){//WIP Material Coverage + Material Shortage
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/WO_Creation',
        pythonOptions: ['-u'], // get print results in real-time
        args:['WIP Material Coverage','system','PB']
    };
    console.log('Material Coverage PB');
    let shell=new PythonShell('0.AIS_data_cutofftime.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
po_creation.schedule('0 36 8 * * THU', function(){//WIP Material Coverage + Material Shortage
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/WO_Creation',
        pythonOptions: ['-u'], // get print results in real-time
        args:['WIP Material Coverage','system','HYS']
    };
    console.log('Material Coverage HYS');
    let shell=new PythonShell('0.AIS_data_cutofftime.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
po_creation.schedule('0 37 8 * * THU', function(){//WIP Material Coverage + Material Shortage
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/WO_Creation',
        pythonOptions: ['-u'], // get print results in real-time
        args:['WIP Material Coverage','system','HYN']
    };
    console.log('Material Coverage HYS');
    let shell=new PythonShell('0.AIS_data_cutofftime.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
po_creation.schedule('0 30 7 * * TUE', function(){//Export Material to Order
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/WO_Creation',
        pythonOptions: ['-u'], // get print results in real-time
        args:['Material to Order','system']
    };
    console.log('Processing DPR');
    let shell=new PythonShell('0.AIS_data_cutofftime.py', options);
    shell.on('message', function(message){
        console.log(message);
    });
});
