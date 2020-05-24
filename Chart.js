import React, {Component} from 'react';
import {View, Text, Button, StyleSheet, ScrollView} from 'react-native';
import {BarChart, LineChart} from 'react-native-chart-kit';

class Chart extends Component {
  url1 = 'https://api.thevirustracker.com/free-api?countryTimeline=';
  url2 = 'https://api.thevirustracker.com/free-api?countryTotal=';
  alpha2code = 'RU';
  _flag = true;
  country = 'Russia';

  state = {
    alpha2code: 'RU',
    text: 'RU',
    json: null,
    total_recovered: 0,
  };

  constructor(props) {
    super(props);
    console.log('Hello from constructor1!');
  }

  componentDidMount() {
    console.log('Hello from componentDidMount1!');
    this.getData(this.alpha2code, this.country);
  }

  componentDidUpdate = () => {
    console.log('Hello from componentDidUpdate1');
    if (this._flag) {
      setTimeout(() => this._scrollView.scrollToEnd(), 0);
      this._flag = false;
    }
  };

  async getData(alpha2code, country) {
    try {
      let response = await fetch(this.url1 + alpha2code);
      let json = await response.json();
      let response2 = await fetch(this.url2 + alpha2code);
      let json2 = await response2.json();
      this.setState({
        json: json.timelineitems[0],
        total_recovered: json2.countrydata[0].total_recovered,
        country: country,
        alpha2code: alpha2code,
      });
    } catch (error) {
      alert('Data do not exist for selected country yet');
    }
  }

  render() {
    console.log('Hello from render1');

    if (this.props.route.params !== undefined) {
      const alpha2code = this.props.route.params.alpha2code;
      const country = this.props.route.params.country;
      if (alpha2code !== this.state.alpha2code) {
        this.getData(alpha2code, country);
      }
    }

    let labels = [];
    let data = [];
    let data2 = [];
    let flatData = [];
    let total_infected = 0;
    let total_dead = 0;
    let infected_now = 0;

    if (this.state.json != null) {
      let keys = Object.keys(this.state.json);
      // add days from 01/01/20 if they not exist
      let month = 1;
      let day = 1;
      let total_days = [31, 29, 31, 30, 31, 30];
      let dayAsString = '01';
      while (keys[0] !== month.toString() + '/' + dayAsString + '/20') {
        flatData.push({
          date_value: month.toString() + '/' + dayAsString + '/20',
          total_cases: 0,
          total_deaths: 0,
        });
        labels.push(month.toString() + '/' + dayAsString + '/20');
        data.push(0);
        data2.push(0);
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
        let record = this.state.json[i];
        if (record !== 'ok') {
          record.date_value = i;
          flatData.push(record);
          labels.push(record.date_value);
          data.push(record.total_cases);
          data2.push(record.total_deaths);
        }
      });
      total_infected = flatData[flatData.length - 1].total_cases;
      total_dead = flatData[flatData.length - 1].total_deaths;
      infected_now = total_infected - total_dead - this.state.total_recovered;
    }

    let chart_width = 55 * labels.length;

    return (
      <View>
        <Text style={styles.text}> {this.state.country} </Text>
        <Button
          title={'Change country'}
          onPress={() => this.props.navigation.navigate('Country')}
        />
        <ScrollView
          ref={_scrollView => {
            this._scrollView = _scrollView;
          }}
          horizontal={true}>
          <BarChart
            data={{
              labels: labels,
              datasets: [{data: data2}, {data: data}],
            }}
            width={chart_width}
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
            yAxisLabel={''}
            yAxisSuffix={''}
          />
        </ScrollView>
        <Text>
          Now: total cases infection = {total_infected}, total deaths ={' '}
          {total_dead}
        </Text>
        <Text style={styles.text}>INFECTED NOW: {infected_now}</Text>
        {/*<TextInput*/}
        {/*  style={styles.input}*/}
        {/*  placeholder="Enter country"*/}
        {/*  onChangeText={_text => this.setState({text: _text})}*/}
        {/*  onEndEditing={() => this.changeCountry(this.state.text)}*/}
        {/*/>*/}
        <Button
          title={'Details'}
          onPress={() =>
            this.props.navigation.navigate('Details', {
              _flatData: flatData,
              alpha2code: this.alpha2code,
            })
          }
        />
      </View>
    );
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
    textAlign: 'center',
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
