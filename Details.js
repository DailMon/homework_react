import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';

class Details extends Component {
  state = {
    flatData: [],
    alpha2code: '',
  };

  constructor(props) {
    super(props);
    console.log('Hello from constructor!');
  }

  componentDidMount() {
    console.log('Hello from componentDidMount!');
    //this.getData();
  }

  render() {
    console.log('Hello from render');

    const flatData = this.props.route.params._flatData;
    const alpha2code = this.props.route.params.alpha2code;

    if (flatData.length > 0) {
      if (this.state.alpha2code !== alpha2code) {
        if (flatData[0].date_value === '1/01/20') {
          flatData.reverse();
        }
        console.log(flatData);
        this.setState({
          flatData: flatData,
          alpha2code: alpha2code,
        });
      }
    } else {
      this.props.navigation.navigate('Chart');
    }

    return (
      <View style={styles.container}>
        <FlatList
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          data={this.state.flatData}
          renderItem={({item, index}) => (
            <Text>
              Date: {item.date_value}; Infected: {item.total_cases}; Death:{' '}
              {item.total_deaths};
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

export default Details;
