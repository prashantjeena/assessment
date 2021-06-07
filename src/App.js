import {  useState} from 'react';
import { AgGridReact} from 'ag-grid-react';
import validator from 'validator';


import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import 'ag-grid-enterprise';

function App() {

  const emailStyle=(param)=> {
    if(!validator.isEmail(param.value) & param.value.length!==0){
      param.colDef.validator=false;
      param.data.validator=false;
      return {
        backgroundColor: 'yellow'
    }
    }
    
  }
  const nameStyle=(param)=> {
    if(param.value.length<3 & param.value.length!==0){
      param.data.validator=false;
      return {
        backgroundColor: 'yellow'
      }
    }
    ;
  }

  const [rowData,setRowData]=useState([ 
    {Id: "1", Name: "Jack", Email: 'jack@potc.com', gender:'male', DOB:'16-05-1988',Country:'Canada',City:'ontario',validator:true},
    {Id: "2", Name: "Ace", Email: 'ace@op.com', gender:'male', DOB:'17-11-1996',Country:'Japan',City:'kyoto',validator:true},
    {Id: "3", Name: "Kakashi", Email: 'konoha@rin.com', gender:'male', DOB:'02-07-1990',Country:'Russia',City:'minsk',validator:true}]);
  
  
  const defaultColDef = {
    width: 114,
    editable: true,
    filter: 'agTextColumnFilter',
    
  };

  
  function deleteCellRenderer(params) {
    let eGui = document.createElement("div");
      eGui.innerHTML = `
          <button 
            class="action-button delete"
            data-action="delete"
          >
            delete
          </button>
          `;
  
    return eGui;
  }
  
  const gridOptions = {
    onCellClicked(params) {

      if (params.column.colId === "delete" ) {
        

        params.api.applyTransaction({
          remove: [params.node.data]
        });
        
      }
    },
    rowSelection: 'multiple',
    columnDefs: [
      {
        field: 'Id',
        cellEditor: 'agTextCellEditor',
        width:100,
        checkboxSelection:true,
    },

    {
      field: 'Name',
      cellEditor: 'agTextCellEditor',
      width:100,
      cellStyle:nameStyle,
    },
    {
      field: 'Email',
      cellEditor: 'agTextCellEditor',
      width:150,
      cellStyle:emailStyle,
      validator:true,
    },
    
    {
      field: 'gender',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
          values: ['male','female'],
      },
      width:100,
    },
    {
      field: 'DOB',
      headerName:'DOB',
      agDateInput:'agDateinput',
      filter:'agDateColumnFilter',
      width:120,
   
    },
    {
      field: 'Country',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
          values: ['India','China','Pakistan'],
     },
     width:100,
    },
    {
      field: 'City',
      cellEditor: 'agTextCellEditor',
      width:100,
    },
    {
      headerName: " ",
      cellRenderer: deleteCellRenderer,
      editable: false,
      colId: "delete"
    },
    { field:"validator",
      headerName:"validator",
      hide:true,
    }
  ],
  columnDefsSubmit: [
    {
      field: 'Id',
      editable:false,
      width:100,
  },

  {
    field: 'Name',
    editable:false,
    width:100,
  },
  {
    field: 'Email',
    editable:false,
    width:150,

  },
  
  {
    field: 'gender',
    editable:false,
    width:100,
  },
  {
    field: 'DOB',
    editable:false,
    width:120,
    
  },
  {
    field: 'Country',
    editable:false,
    width:100,
  },
  {
    field: 'City',
    editable:false,
    width:100,
  },
  ],
  
  }
  var gridApi;
  const onGridReady = (params) => {
    gridApi = params.api;
    };

  const onAdd = () => {
    
    let newNode={Id:'',Name:'', Email: '', gender:'', DOB:'',Country:'',City:'',validator:true};
    setRowData(rowData=>[...rowData,newNode]); 
  }

  const onDeleteSelectedRows=()=>{
    let selectedRows=gridApi.getSelectedRows();
    let arrayOfId=selectedRows.map(e=>e.Id); 
    let newRowData=rowData.filter(function(e){
      if(!arrayOfId.includes(e.Id)){
        return e
      }
      });

    let newData=[];
    newRowData.forEach(node=>newData.push(node));
    setRowData(newData);
  }

  const onDeleteNonSelectedRows=()=>{
    let selectedRows=gridApi.getSelectedRows();
    let arrayOfId=selectedRows.map(e=>e.Id); 
    let newRowData=rowData.filter(function(e){
      
      if(arrayOfId.includes(e.Id)){
        return e
      }
        });
    setRowData(newRowData);
  }  

  const [newData,setNewData]=useState([]);
  const onSubmit=()=>{
    let tempData=[];
    rowData.forEach(node=>tempData.push(node));
   
    tempData.forEach(function(node){

      if(node.validator===false){
        alert('please fix the errors before submitting');
        return false;
      }
      for (const item in node){
        if(node[item].length===0){
          alert('please fix the errors before submitting');
          return false;
        }
        
      }
    });
    let newData1= [];
    tempData.forEach(node=>newData1.push(node));
    setNewData(newData1);
    
  }

  return (
    <>
    <div >
      <button style={{marginLeft:100,padding:10}} onClick={onAdd}>add row</button> 
      <button style={{margin:20,padding:10}} onClick={onDeleteSelectedRows} >delete selected rows</button>
      <button style={{margin:20,padding:10}} onClick={onDeleteNonSelectedRows}>Delete non selected rows</button>
      <button style={{margin:20,padding:10}} onClick={onSubmit}>submit</button>
    </div>
    <div className="ag-theme-alpine" style={{height: 300, width: 900,marginLeft:100}}>
           <AgGridReact
              defaultColDef={defaultColDef}
              columnDefs={gridOptions.columnDefs}
               rowData={rowData}
               gridOptions={gridOptions}
              onGridReady={onGridReady}
              >     
           </AgGridReact>
    </div>
    <div style={{fontSize:20, margin:20, padding:10,marginLeft:100}}>
      Submitted Data
    </div>
    <div className="ag-theme-alpine" style={{height: 300, width: 900,marginLeft:100}}>
           <AgGridReact
              rowData={newData}
              columnDefs={gridOptions.columnDefsSubmit}
            >
           </AgGridReact>
    </div>
    </>
  );
}

export default App;
