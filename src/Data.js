import React, { Component } from "react";

export default class Data extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            devicesId:"",
            data: null,
            userName: "",
            pwd: "",
        };
        this.fetchData = this.fetchData.bind(this)
        this.renderData = this.renderData.bind(this)
        this.login = this.login.bind(this)
  }
  login() {
    const {userName,pwd} = this.state
    fetch(`http://138.25.211.251:8080/api/auth/login`,{
        method: 'POST',
        "Content-Type": "application/json;charset=ISO-8859-1",
        body:JSON.stringify({"username":userName, "password":pwd})

    })
    .then(res => res.json())
    .catch(e => console.error(`error ${e}`))
    .then(res => {
        console.log(res)
        this.setState({token:res.token})
    })
  }
  fetchData() {
        const {token,devicesId} = this.state
        const dateTime = new Date().getTime();
        const timestamp = Math.floor(dateTime / 1000);
        fetch(`http://138.25.211.251:8080/api/plugins/telemetry/DEVICE/${devicesId}/values/timeseries?&keys=R,G,B,eui,lum,AC,DC,Group,light,Motion,Section,SoftwareId&startTs=1563952050710&endTs=1564000000000`,{
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'X-Authorization': `Bearer ${token}`
            })
        })
        .then(res => res.json())
        .catch(e => console.error(`error ${e}`))
        .then(res => {
            console.log(res)
            this.setState({data:res})
        })
  }
  renderData() {
      return (
          <React.Fragment>
              <h1>Data</h1>
              {JSON.stringify(this.state.data)}
          </React.Fragment>
      )
  }
  render() { 
        const {token,devicesId,data,userName,pwd} = this.state
        return (
        <div>
            <h1>Login Auth</h1>
            <label>Username:</label>
            <input type="text" value={userName} onChange={(e) => {
                this.setState({userName:e.target.value})}} />
            <label>Pwd:</label>
            <input type="text" value={pwd} onChange={(e) => {
                this.setState({pwd:e.target.value})}}/>
             <input type="button" value="Login" onClick={this.login}/>

            <h1>Fetch Data</h1>
            <label>Auth Token</label>
            <input type="text" value={token} onChange={(e) => {
                this.setState({token:e.target.value})
            }}/>
            <label>DevicesID</label>
            <input type="text" value={devicesId} onChange={(e) => {
                this.setState({devicesId:e.target.value})
            }}/>
            <input type="button" value="get" onClick={this.fetchData}/>
            {data? this.renderData() : <h3>No Data</h3>}
        </div>
        );
  }
}
