import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  TextInput,
} from 'react-native';
import {Input} from 'react-native-elements';
import {BarChart} from 'react-native-chart-kit';

const scrollView = ScrollView;

class Chart extends Component {
  prevUrl = 'https://api.thevirustracker.com/free-api?countryTimeline=RU';
  state = {
    url: 'https://api.thevirustracker.com/free-api?countryTimeline=RU',
    text: 'RU',
    //json: null,
    label: 'Initialized',
  };

  constructor(props) {
    super(props);
    console.log('Hello from constructor!');
  }

  componentDidMount() {
    console.log('Hello from componentDidMount!');
    setTimeout(() => this.refs._scrollView.scrollToEnd(), 0);
    this.getData();
  }

  componentDidUpdate() {
    if (this.prevUrl !== this.state.url) {
      this.prevUrl = this.state.url;
      this.getData();
    }
  }
  async getData() {
    try {
      var response = await fetch(this.state.url);
      var json = await response.json();
      //console.log(json.timelineitems[0]);
      this.setState({json: json.timelineitems[0]});
    } catch (error) {
      alert('Failed with ' + error.message);
    }
  }

  render() {
    var labels = [];
    var data = [];
    var flatData = [];
    var month = 1;
    var day = 1;
    var total_days = [31, 29, 31, 30, 31, 30];
    var dayAsString = '01';
    var total_infected = 0;
    var total_dead = 0;
    var today_infected = 0;
    if (this.state.json != null) {
      var keys = Object.keys(this.state.json);
      // add days from 01/01/20 if they not exist
      while (keys[0] !== month.toString() + '/' + dayAsString + '/20') {
        flatData.push({
          date_value: month.toString() + '/' + dayAsString + '/20',
          total_cases: 0,
        });
        //console.log(day, month, keys[0]);
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
          //console.log(record.date_value);
          labels.push(record.date_value);
          data.push(record.total_cases);
        }
      });
      //console.log(flatData);
      total_infected = flatData[flatData.length - 1].total_cases;
      total_dead = flatData[flatData.length - 1].total_deaths;
    }
    //console.log(flatData[10]);
    //console.log(labels);
    //console.log(data);
    //console.log(this.state.text);
    return (
      <View>
        <Text>Chart Infected</Text>
        <ScrollView ref="_scrollView" horizontal={true}>
          <BarChart
            data={{
              labels: labels,
              datasets: [
                {
                  data: data,
                },
              ],
            }}
            width={6500}
            height={220}
            yAxisInterval={1}
            yLabelsOffset={0}
            chartConfig={chartConfig}
            bezier
            style={{
              backgroundColor: 'black',
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </ScrollView>
        <Text>
          Now: total cases infection = {total_infected}, total deaths ={' '}
          {total_dead}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter country"
          onChangeText={_text => this.setState({text: _text})}
          onEndEditing={() => this.changeCountry(this.state.text)}
          //onTextInput={() => this.changeCountry(this.state.text)}
        />
      </View>
    );
  }

  changeCountry(_text) {
    this.setState({
      url: 'https://api.thevirustracker.com/free-api?countryTimeline=' + _text,
    });
  }
}

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  decimalPlaces: 0.1,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 3,
  barPercentage: 1,
  useShadowColorFromDataset: false,
  style: {
    borderRadius: 16,
  },
};

const styles = StyleSheet.create({
  text: {
    fontSize: 32,
  },
  input: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#777',
    width: 300,
    height: 40,
    margin: 10,
  },
});

export default Chart;
