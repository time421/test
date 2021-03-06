import React, { Component } from 'react';
import firebase, { auth, provider, provider2, ref,} from './config';
import './Task.css';
import logo from './Ling logo.png';
import { database, functions } from 'firebase';



class Task extends Component {
    constructor() {
        super();
        this.state = {
            taskName: '',
            description: '',
            startDate: '',
            endDate: '',
            items: [],
            username: '',
            user: null
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
            
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        var Ref = firebase.database().ref('item');
       
        
        var sd = new Date(this.state.startDate);
        
        console.log(sd);
    
        var ed = new Date(this.state.endDate);
        console.log(ed);
        
        var item = {
            taskName: this.state.taskName,
            description: this.state.description,
            startDate: sd.getTime(),
            endDate: ed.getTime(),
            user: this.state.user.displayName || this.state.user.email
            }

       Ref.push(item);{
         
        this.setState({
            taskName: '',
            description: '',
            startDate: '',
            endDate: '',
        });

    }
    }
    

    removeItem(itemId) {
        const itemRef = firebase.database().ref('item/' + itemId);
        itemRef.remove();
    }

    login = () => {
        var that = this;
        const result = auth.signInWithPopup(provider).then(function (result) {
            var user = result.user;
            console.log(user);
            that.setState({ user: user });
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
        });
    }
    login2 = () => {
        var that = this;
        const result = auth.signInWithPopup(provider2).then(function (result) {
            var user = result.user;
            console.log(user);
            that.setState({ user: user });
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
        });
    }

    logout = () => {
        var that = this;
        auth.signOut().then(function () {
            that.setState({ user: null });
        }).catch(function (error) {
        });
    }
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user });
            }
          
        }); 
        
       
        var itemsRef = firebase.database().ref('item').orderByChild('startDate').on('value', (snapshot) => {
            
            let newState = [];
            snapshot.forEach(function(childSnapshot){
                var childkey = childSnapshot.key;
                var childData = childSnapshot.val(); 
                
                var isd = new Date(childData.startDate);
                var ied = new Date(childData.endDate);

                var sdyear = isd.getFullYear();
                var sdmonth = isd.getMonth()+1;
                var sdday = isd.getDate();

                var sdstring = ''+ sdday +' / '+ sdmonth+ ' / '+sdyear;

                var edyear = ied.getFullYear();
                var edmonth = ied.getMonth()+1;
                var edday = ied.getDate();

                var edstring = ''+ edday +' / '+ edmonth+ ' / '+edyear;

                newState.push({
                    id: childkey,
                    taskName: childData.taskName,
                    description: childData.description,
                    startDate: sdstring,
                    endDate: edstring,
                    user: childData.user
                });
            });
           
            this.setState({
                items: newState 
                
                
            });

        });
    }

    


    renderLoginButon() {
        if (this.state.user) {
            return (
                <div class="App-div.container">
                    <nav class="App-nav">
                        <section className="App-item">
                            <form onSubmit={this.handleSubmit}>
                                <br /><br /><br />
                                <p>&nbsp;Task Name : <input type="text" name="taskName" placeholder="Task Name*" onChange={this.handleChange} value={this.state.taskName} /></p>
                                <br /><br />
                                <p>&nbsp;Description : <input type="text" name="description" placeholder="Description" onChange={this.handleChange} value={this.state.description} /></p>
                                <br /><br />
                                <p>&nbsp;Start : <input type="date" name="startDate" onChange={this.handleChange} value={this.state.startDate} /></p>
                                <br /><br />
                                <p>&nbsp;End : <input type="date" name="endDate" onChange={this.handleChange} value={this.state.endDate} /></p>
                                <br /><br />
                                <button className="buttonSave">Save</button>
                            </form>
                            <button className="buttonLogout" onClick={this.logout}>Log Out</button>
                        </section>
                    </nav>
                    <section className="display-item">
                        <article className="App-article">
                            <br /><br /><br />
                            <h1>LING Project</h1>
                            <br />
                            <table id="t01">
                                <tr>
                                    <th>Task Name</th>
                                    <th>Description</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Edit / Delete</th>
                                </tr>
                                {this.state.items.map((item) => {
                                    return (
                                        <tr key={item.id}>
                                            {item.user === this.state.user.displayName || item.user === this.state.user.email ? <td>{item.taskName}</td> : null}
                                            {item.user === this.state.user.displayName || item.user === this.state.user.email ? <td>{item.description}</td> : null}
                                            {item.user === this.state.user.displayName || item.user === this.state.user.email ? <td>{item.startDate}</td> : null}
                                            {item.user === this.state.user.displayName || item.user === this.state.user.email ? <td>{item.endDate}</td> : null}
                                            {item.user === this.state.user.displayName || item.user === this.state.user.email ? <td><button>Edit</button><button onClick={() => this.removeItem(item.id)}>Delete</button></td> : null}
                                        </tr>
                                    )
                                })}
                            </table>
                        </article>
                    </section>
                </div>
            );
        } else {
            return (
                <div className="loading container wrapper">
                    <img src={logo} className="App-logo" alt="logo" />
                    <br />
                    <p class="sansserif">Log in</p>
                    <button className="loginBtn loginBtn--facebook" onClick={this.login}> Log in with Facebook</button>
                    <br /> <br />
                    <button className="loginBtn loginBtn--google" onClick={this.login2}>Log in with Google</button>
                </div>
            )
        }
    }

    render() {
        return (
            <div className="App">
                {this.renderLoginButon()}
            </div>

        );
    }
}

export default Task;