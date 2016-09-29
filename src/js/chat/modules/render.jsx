(function () {
  // render module
  const render = (function () {

    const init = () => {
      renderChat()
    }

    const renderChat = () => {
      // required modules
      const notifications = require("./notifications")
      const sockets = require("./sockets")

      // Chat Messages
      let ChatMessages = React.createClass({
        render: function() {
          // create messages
          let createMessage = (item) => {
            return (
              <li key={item.id}>
                <span className="name" style={{color: item.color}}> {item.name} </span>
                <span className="message"> {item.message} </span>
              </li>
            )
          }

          // return ul of messages
          return <ul>{this.props.items.map(createMessage)}</ul>
        }
      })

      // Chat App
      let ChatApp = React.createClass({
        // setup the initial data for the application
        getInitialState: function() {
          return {items: [], error:"", data : { color: "#ffffff", name: "", message: ""}}
        },
        onChange: function(e) {
          // setup data
          let data = {data: {}}

          // assign data variable
          data.data[e.target.getAttribute("data-name")] = { $set: e.target.value }

          var newState = React.addons.update(this.state, data)

          // set state
          this.setState(newState)
        },
        handleSubmit: function(e) {
          if (e.key === "Enter") {
            // setup new items
            let newItem = {
              color: this.state.data.color,
              name: this.state.data.name,
              message: this.state.data.message,
              id: Date.now(),
            }

            let newItems = this.state.items.concat([newItem])

            // set state
            this.setState({
              items: newItems,
              data: {
                color: this.state.data.color,
                name: this.state.data.name,
                message: ""
              }})

            // send
            sockets.send(newItem)
          }
        },
        render: function() {
          return (
            <div className="window">
              <ChatMessages items={this.state.items} />
              <div className="inputs">
                <form>
                  <input onChange={this.onChange} value={this.state.data.color} data-name="color" type="text"/>
                  <input onChange={this.onChange} value={this.state.data.name} data-name="name" type="text" placeholder="John Doe"/>
                  <input onKeyPress={this.handleSubmit} onChange={this.onChange} value={this.state.data.message} data-name="message" type="text" placeholder="Your Message!"/>
                </form>
              </div>
            </div>
          )
        },
        componentDidMount: function(){
          // listen for new items
          sockets.listen((item) => {
            // add a new item
            let newItems = this.state.items.concat([item])

            // set the new state
            this.setState({ items: newItems })
          })
        }
      })

      // render the elements
      ReactDOM.render(
        <ChatApp />,
        document.getElementById("chat")
      )
    }

    return {init}
  }())

  module.exports = render
}())