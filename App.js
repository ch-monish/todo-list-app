import React, { Component, useLayoutEffect } from "react";
// import RoundCheckbox from 'rn-round-checkbox';
// import { AsyncStorage } from '@react-native-community/async-storage'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  FlatList,
  AsyncStorage,
  Button,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Platform,
  CheckBox,
  ToastAndroid,

} from "react-native";

const isAndroid = Platform.OS == "android";
const viewPadding = 10;

export default class TodoList extends Component {
  state = {
    tasks: [],
    text: ""
  };

  changeTextHandler = text => {
    this.setState({ text: text });
  };

  addTask = () => {
    let notEmpty = this.state.text.trim().length > 0;

    if (notEmpty) {
      this.setState(
        prevState => {
          let { tasks, text } = prevState;
          return {
            tasks: tasks.concat({ key: tasks.length, text: text }),
            text: ""
          };
        },
        () => Tasks.save(this.state.tasks)
      );
    }
  };

  deleteTask = i => {
    this.setState(
      prevState => {
        let tasks = prevState.tasks.slice();

        tasks.splice(i, 1);
        // console.log(this.state.tasks[i].text)
        ToastAndroid.show(`Task ${this.state.tasks[i].text} deleted`, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        return { tasks: tasks };
      },
      () => Tasks.save(this.state.tasks)
    );
  };
  striketext = j => {
    // console.log(j)
    // alert(`Task ${j + 1} completed`)
    ToastAndroid.show(`Task ${this.state.tasks[j].text} has completed`, ToastAndroid.LONG);
    // textDecorationLine: "line-through",

  }
  addButton = (i) => {
    // alert(this.state.text)
    if (this.state.text != "") {
      // this.addTask
      // tasks: tasks.concat({ key: tasks.length, text: text })
      // this.changeTextHandler
      // this.addTask


      let notEmpty = this.state.text.trim().length > 0;

      if (notEmpty) {
        this.setState(
          prevState => {
            let { tasks, text } = prevState;
            return {
              tasks: tasks.concat({ key: tasks.length, text: text }),
              text: ""
            };
          },
          () => Tasks.save(this.state.tasks)
        );
      }
      // alert(`${this.state.text} added`)
      ToastAndroid.show(`${this.state.text} added`, ToastAndroid.LONG)



    }
    // this.setState({})

  }

  componentDidMount() {
    Keyboard.addListener(
      isAndroid ? "keyboardDidShow" : "keyboardWillShow",
      e => this.setState({ viewPadding: e.endCoordinates.height + viewPadding })
    );

    Keyboard.addListener(
      isAndroid ? "keyboardDidHide" : "keyboardWillHide",
      () => this.setState({ viewPadding: viewPadding })
    );

    Tasks.all(tasks => this.setState({ tasks: tasks || [] }));
  }

  render() {
    return (
      <View
        style={[styles.container, { paddingBottom: this.state.viewPadding }]}>
        <Text style={{ fontSize: 28, top: 0, justifyContent: "space-around" }}>All Tasks</Text>
        <FlatList style={{ top: 14, padding: 1 }}
          // style={styles.list} 
          data={this.state.tasks}

          renderItem={({ item, index }) =>
            <View>
              <View style={styles.listItemCount} >
                <View style={styles.hr}>
                  <CheckBox style={styles.checkbox} onChange={() => this.striketext(index)}></CheckBox>

                  <Text style={styles.textInput} onLongPress={() => this.deleteTask(index)}>
                    {item.text}
                  </Text>
                </View>
                {/* <Button title="X" onPress={() => this.deleteTask(index)} /> */}


              </View>
            </View>}
        />
        <TouchableOpacity style={styles.addButton} onPress={this.addButton}>
          <View style={{ justifyContent: 'space-around' }}></View>
          <Text style={{ fontSize: 42, color: "white" }} >+</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          onChangeText={this.changeTextHandler}
          onSubmitEditing={this.addTask}
          value={this.state.text}
          placeholder="Add Tasks"
          returnKeyType="done"
          returnKeyLabel="done"
        />
      </View >
    );
  }
}

let Tasks = {
  convertToArrayOfObject(tasks, callback) {
    return callback(
      tasks ? tasks.split("||").map((task, i) => ({ key: i, text: task })) : []
    );
  },
  convertToStringWithSeparators(tasks) {
    return tasks.map(task => task.text).join("||");
  },
  all(callback) {
    return AsyncStorage.getItem("TASKS", (err, tasks) =>
      this.convertToArrayOfObject(tasks, callback)
    );
  },
  save(tasks) {
    AsyncStorage.setItem("TASKS", this.convertToStringWithSeparators(tasks));
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 11,
    paddingTop: 30,
    justifyContent: "space-around",
    width: "100%",
  },

  listItem: {


    fontSize: 10,
    justifyContent: "space-between",
    width: 300,
  },
  checkbox: {
    left: "50%",
    height: 40,



  },
  hr: {

    backgroundColor: "white",
    width: "100%",
    height: 40,
    borderRadius: 950,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,

    justifyContent: "space-around",
    borderRightWidth: 1,
    borderRightColor: '#ffffff',
    borderLeftWidth: 1,
    borderLeftColor: '#eeeeee',
    borderTopWidth: 1,
    borderTopColor: '#fffffe',
    borderBottomWidth: 8,

    borderBottomColor: '#ffffff',
    elevation: 10,
    // shadowColor: "#ffffff",



  },
  listItemCount: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-around",
    borderBottomWidth: 12,
    borderBottomColor: "#ffffff",
    backgroundColor: "#ffffff",


  },
  addButton: {
    position: 'absolute',


    zIndex: 11,
    right: "40%",
    bottom: 30,
    backgroundColor: "#6666ff",
    width: 70,
    height: 70,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 20,
  },
  textInput: {
    height: 40,
    width: 310,
    borderColor: "blue",

    borderWidth: isAndroid ? 0 : 1,
    width: "100%",

  }
});

AppRegistry.registerComponent("TodoList", () => TodoList);
