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
        this.setState({
          flatData: flatData,
          alpha2code: alpha2code,
        });
      }
    } else {
      this.props.navigation.navigate('COVID TRACKER');
    }

    return (
      <View style={styles.container}>
        <FlatList
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          data={this.state.flatData}
          renderItem={({item, index}) => (
            <Text style={styles.text}>
              Date: {item.date_value}; Infected: {item.total_cases}; Death: {item.total_deaths};
            </Text>
          )}
          keyExtractor={i => i.date_value}
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
    height: 2,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
});

export default Details;
