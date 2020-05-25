import React, {Component} from 'react';
import {View, Text, Button, StyleSheet, ScrollView} from 'react-native';
import {BarChart} from 'react-native-chart-kit';

class Chart extends Component {
  url1 = 'https://api.thevirustracker.com/free-api?countryTimeline=';
  url2 = 'https://api.thevirustracker.com/free-api?countryTotal=';
  isStart = true;
  isChanged = false;

  state = {
    alpha2code: 'RU',
    country: 'Russia',
    json: null,
    total_recovered: 0,
  };

  constructor(props) {
    super(props);
    console.log('Hello from constructor1!');
  }

  componentDidMount() {
    console.log('Hello from componentDidMount1!');
    this.getData(this.state.alpha2code, this.state.country);
  }

  componentDidUpdate = () => {
    console.log('Hello from componentDidUpdate1');
    if (
      this.isStart &&
      this._scrollView !== null &&
      this._scrollView2 !== null
    ) {
      setTimeout(() => this._scrollView2.scrollToEnd(), 0);
      setTimeout(() => this._scrollView.scrollToEnd(), 0);
      this.isStart = false;
    }
  };

  async getData(alpha2code, country) {
    try {
      this.isStart = true;
      let response = await fetch(this.url1 + alpha2code);
      let json = await response.json();
      let response2 = await fetch(this.url2 + alpha2code);
      let json2 = await response2.json();
      if (Object.keys(json.timelineitems[0]).length < 2) {
        throw 'Error2';
      }
      this.isChanged = true;
      this.setState({
        json: json.timelineitems[0],
        total_recovered: json2.countrydata[0].total_recovered,
        country: country,
        alpha2code: alpha2code,
      });
    } catch (error) {
      alert('Sorry! Data do not exist for selected country yet.');
      this.isChanged = true;
      this.setState({
        alpha2code: alpha2code,
      });
    }
  }

  render() {
    console.log('Hello from render1');

    if (this.props.route.params !== undefined) {
      const alpha2code = this.props.route.params.alpha2code;
      const country = this.props.route.params.country;
      if (alpha2code !== this.state.alpha2code) {
        this.getData(alpha2code, country);
        console.log(this.isChanged);
      } else {
        this.isChanged = true;
      }
    }
    if (this.isChanged) {
      this.isChanged = false;
      let labels = [];
      let dataChartInfected = [];
      let dataChartDead = [];
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
          dataChartInfected.push(0);
          dataChartDead.push(0);
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
            dataChartInfected.push(record.total_cases);
            dataChartDead.push(record.total_deaths);
          }
        });
        total_infected = flatData[flatData.length - 1].total_cases;
        total_dead = flatData[flatData.length - 1].total_deaths;
        infected_now = total_infected - total_dead - this.state.total_recovered;
      }

      let chart_width = 55 * labels.length;
      return (
        <View>
          <ScrollView>
            <Button
              color={'orange'}
              title={'Change country'}
              onPress={() => this.props.navigation.navigate('Country')}
            />
            <Text style={styles.textH}> {this.state.country} </Text>
            <Text style={styles.text}>
              {' '}
              {total_infected} people were infected{' '}
            </Text>
            <Text style={styles.text}> {total_dead} people died </Text>
            <Text style={styles.textI}>
              {' '}
              INFECTED NOW: {infected_now} people{' '}
            </Text>
            <Button
              style={styles.textI}
              title={'Details'}
              onPress={() =>
                this.props.navigation.navigate('Details', {
                  _flatData: flatData,
                  alpha2code: this.alpha2code,
                })
              }
            />
            <Text style={styles.textC}> Chart of infected </Text>
            <ScrollView
              ref={_scrollView => {
                this._scrollView = _scrollView;
              }}
              horizontal={true}>
              <BarChart
                data={{
                  labels: labels,
                  datasets: [{data: dataChartInfected}],
                }}
                width={chart_width}
                height={170}
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
            <Text style={styles.textC}> Chart of dead </Text>
            <ScrollView
              ref={_scrollView => {
                this._scrollView2 = _scrollView;
              }}
              horizontal={true}>
              <BarChart
                data={{
                  labels: labels,
                  datasets: [{data: dataChartDead}],
                }}
                width={chart_width}
                height={170}
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
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.textL}> DATA LOADING </Text>
        </View>
      );
    }
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
  textH: {
    fontSize: 25,
    textAlign: 'center',
    color: 'black',
  },
  textC: {
    fontSize: 15,
    color: 'green',
  },
  textI: {
    fontSize: 20,
    color: 'red',
    textAlign: 'center',
  },
  text: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
  },
  textL: {
    fontSize: 30,
    color: 'blue',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Chart;
