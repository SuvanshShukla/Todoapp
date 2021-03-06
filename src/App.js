import React from 'react';
import './App.css';
import "papercss/dist/paper.css"
import axios from 'axios';


function App() {
  return (
    <div className="App">
      <h1 className="animated tada">Todo List!</h1>
      <Todo list={[]}></Todo>
    </div>
  );
}

class Todo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.state.list = props.list;
    this.state.addItem = "";
    this.state.lol = [];
    this.state.count=0
   
    
    
  }  

  componentDidMount() {
    axios.get(`http://localhost:8080/tasks`).then(res=>{
      const list = res.data;
      this.setState({
        list
      })        
      console.log(res)
      console.log(res.data)     
    })  
  }

  words(e) {
    this.setState({
      addItem: e.target.value
    })
  }

  clicker() {
    let l = this.state.list;
    let obj = { title: this.state.addItem, status: false, pinned: false, anim: true}
    
     axios.post("http://localhost:8080/tasks",obj).then((res)=>{      
      if (obj.title !== "") { 
        l.push(res.data); 


        this.setState({
        list:l, 
        addItem:""
        }) 
      }      
    })    
  }

  colorify(i) {
    let m = this.state.list;    
    m[i].status = !m[i].status;
    console.log(m[i]);
    
    axios.put("http://localhost:8080/tasks/status",m[i]).then((res)=>{
      console.log(res.data)

      // m[i]= res.data;
      this.setState({
        list: m
      }) 
    })   
  }

  count(){
    let count1=0;
    let m = this.state.list;

    for(var j=0; j<m.length; j++){
      if(m[j].status===true){
        count1 ++;
      }
    }
    return count1
  }

  removeItem(i) {
    let m = this.state.list

    axios.delete("http://localhost:8080/tasks/"+m[i]._id).then(res=>{
      console.log("delete",res.data);     

      m[i].anim = false;

      this.setState({
        list: m
      })
  
      console.log(this.state.list);
  
      if (m[i].status) {
        let count = this.state.lol;
        count.pop()
        this.setState({
          lol: count
        })
      }
  
      setTimeout(() => {
        console.log("waiting");
        m.splice(i, 1);
        this.setState({
          list: m
        })
      }, 1000);

      console.log(this.state.list);
      
  
    })
  }

  downy(i) {
    if (i === this.state.list.length - 1) { }
    else {
      let v = this.state.list
      let m = [];
      m[i] = v[i];
      v[i] = v[i + 1];
      v[i + 1] = m[i];
      this.setState({
        list: v
      })
    }
  }

  uppy(i) {
    if (i === 0) { }
    else {
      let v = this.state.list
      let m = [];
      m[i] = v[i];
      v[i] = v[i - 1];
      v[i - 1] = m[i];
      this.setState({
        list: v
      })
    }
  }

  pressed(e) {
    if (e.key === "Enter") {
      let l = this.state.list;
      let obj = { title: this.state.addItem, status: false, pinned: false,  anim: true};

      axios.post("http://localhost:8080/tasks",obj).then((res)=>{
        if (obj.title !== "") { l.push(res.data); }

        this.setState({
          list: l,
          addItem: ""
        });
        // console.log(res.data);
        
      })      
    }
  }

  pinner(i) {
    let j = this.state.list;
    j[i].pinned = !j[i].pinned;

    if (j[i].pinned===true) {
      if (j[i] === j[0]) { this.setState({ list: j }) }
      else {        
          let v = j[0];
        j[0] = j[i]
        j.splice(i, 1)
        j.splice(1, 0, v)      
        this.setState({
          list: j
        })
        console.log(j[i].pinned);
      }
    }
    else if (j[i].pinned===false) {      
      let k = j[i]
      j.splice(i, 1);
      j.splice(j.length, 0, k)
      this.setState({
        list: j
      })
      console.log(j[i].pinned);
    }    
  } 

  sorting() {
    let m = this.state.list
    m.sort();

    this.setState({
      list : m
    })
   
    this.state.list.map((x)=>(
    <button>{x.title}</button>
    ))
    
  }

 

  render() {
    return (
      <section>
        <div className="row flex-center">
          <input type="text" onChange={(e) => { this.words(e) }} onKeyPress={(e) => { this.pressed(e) }} className="col col-5" value={this.state.addItem}></input>
          <button onClick={() => { this.clicker() }} className="col col-5 background-secondary">Add Item</button>
        </div >
        <div className="row flex-center">
          <h4 className="text-lead flex-center col-12">Completed Tasks:{this.count()}/{this.state.list.length}</h4>
          <div className="progress margin-bottom col-4">
            <div className="bar striped secondary" style={{ width: `${(this.count())/(this.state.list.length) * 100}%` }}> </div>
          </div>
        </div>  

        <div>
          {this.state.list.map((x, i) => (
            <div className={(x.anim ? "row flex-center animated bounceIn" : "row flex-center animated bounceOut")} key={i}>
              <button className={(x.status ? "btn btn-success col-7" : "btn col-7") + (x.pinned ? "btn btn-warning col-7" : "btn col-7")} onClick={() => { this.colorify(i) }} onDoubleClick={(e) => { this.pinner(i) }}>{x.title}</button>
              <button onClick={(e) => { this.removeItem(i) }} className="btn btn-danger" >X</button>
              <button onClick={(e) => { this.downy(i) }} className="background-secondary">↓</button>
              <button onClick={(e) => { this.uppy(i) }} className="background-warning">↑</button>
              <button className="btn2">Added on {new Date().getHours().toString()} : {new Date().getSeconds().toString()}</button>
            </div>
          ))}
        </div>
        
      </section>
    );
  }

}

export default App;

// {/* <div className="form-group row flex-center ">
// <label for="paperSelects1"><text className="col text-lead">Select</text></label>
// <select id="paperSelects1" className="col ">
//   <option value="1">Option 1</option>
//   <option value="2">Option 2</option>
//   <option value="3">Option 3</option>
// </select>
// </div> */}

/* m.map((x,i)=>{
  m[i].bday = i;
  return(m.sort((a,b) => {
    let x =  a.bday - b.bday;
    if(x<0){
      return(m)
    }
    else {
      return{
        tmp = m[i]
        m[i] : m[i+1]
        m[i+1] : tmp;
      }
    }
  }))
}) */