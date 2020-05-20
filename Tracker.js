import React, {Component} from 'react';
import {View, Text, Button, StyleSheet, FlatList} from 'react-native';

class Tracker extends Component {
  url = 'https://api.thevirustracker.com/free-api?countryTimeline=RU';

  state = {
    //json: null,
    label: 'Initialized',
  };

  constructor() {
    super();
    console.log('Hello from constructor!');
  }

  componentDidMount() {
    console.log('Hello from componentDidMount!');
  }

  async getData() {
    try {
      var response = await fetch(this.url);
      var json = await response.json();
      console.log(json.timelineitems[0]);
      this.setState({json: json.timelineitems[0]});
    } catch (error) {
      alert('Failed with ' + error.message);
    }
  }

  render() {
    console.log('Hello from render');
    var flatData = [];
    var month = 1;
    var day = 1;
    var total_days = [31, 29, 31, 30, 31, 30];
    var dayAsString = '01';
    if (this.state.json != null) {
      var keys = Object.keys(this.state.json);
      // add days from 01/01/20 if they not exist
      while (keys[0] !== month.toString() + '/' + dayAsString + '/20') {
        flatData.push({
          date_value: month.toString() + '/' + dayAsString + '/20',
          total_cases: 0,
        });
        console.log(day, month, keys[0]);
        day += 1;
        if (day > total_days[month - 1]) {
          day = 1;
          month += 1;
        }
        if (day < 10) {
          dayAsString = '0' + day;
        } else {
          dayAsString = day.toString();
        }
      }
      keys.forEach(i => {
        var record = this.state.json[i];
        if (record !== 'ok') {
          record.date_value = i;
          flatData.push(record);
        }
      });
      console.log(flatData);
    }

    return (
      <View style={styles.container}>
        <Text style={styles.text}>Covid Tracker</Text>
        <Button title="Get Data" onPress={() => this.getData()} />
        <FlatList
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          data={flatData}
          renderItem={({item, index}) => (
            <Text>
              {index} : Date: {item.date_value}; Total cases: {item.total_cases}
            </Text>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: 'white',
  },
  separator: {
    height: 0.4,
    backgroundColor: 'gray',
  },
  text: {
    fontSize: 32,
  },
});

export default Tracker;
